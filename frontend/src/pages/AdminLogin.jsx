import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, verifySecurityAnswer, resetAdminPassword } from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, BarChart3, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

// ── Shared card wrapper ─────────────────────────────────────
// IMPORTANT: defined at module level — NOT inside AdminLogin.
// Defining components inside a parent causes React to unmount/remount
// on every parent re-render, which kills input focus.
const Card = ({ children, title, subtitle, icon: Icon, iconColor = '#6366f1' }) => (
  <div
    className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-6 animate-fade-in"
    style={{ background: '#111', border: '1px solid #1e1e1e', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}
  >
    {/* Brand */}
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#6366f1', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
        <BarChart3 className="w-4 h-4 text-white" />
      </div>
      <span className="font-bold text-white text-sm">DataFolio Admin</span>
    </div>

    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      <p className="text-xs text-[#555]">{subtitle}</p>
    </div>

    {children}
  </div>
);

// ── Tiny input component ─────────────────────────────────────
const Field = ({ label, type = 'text', value, onChange, placeholder, required, id }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          // Fix: "off" prevents browser/extension injection that causes "disconnected port" error
          autoComplete={isPassword ? 'new-password' : 'off'}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          spellCheck={false}
          className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
          style={{
            background: '#161616',
            border: '1px solid #2a2a2a',
            color: '#f5f5f5',
          }}
          onFocus={e  => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.12)'; }}
          onBlur={e   => { e.target.style.borderColor = '#2a2a2a'; e.target.style.boxShadow = 'none'; }}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Step enum ────────────────────────────────────────────────
const STEP = { LOGIN: 'login', QUESTION: 'question', RESET: 'reset', DONE: 'done' };

const AdminLogin = () => {
  const navigate = useNavigate();

  // Login state
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  // Forgot password flow
  const [step,        setStep]        = useState(STEP.LOGIN);
  const [answer,      setAnswer]      = useState('');
  const [resetToken,  setResetToken]  = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPwd,  setConfirmPwd]  = useState('');

  // ── Login ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      toast.success('Logged in successfully');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // ── Verify security answer ───────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return toast.error('Please enter an answer');
    setLoading(true);
    try {
      const { resetToken: token } = await verifySecurityAnswer(answer.trim());
      setResetToken(token);
      setStep(STEP.RESET);
      toast.success('Identity verified!');
    } catch {
      toast.error('Incorrect answer — try again');
    } finally {
      setLoading(false);
    }
  };

  // ── Reset password ───────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirmPwd) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await resetAdminPassword(email || process.env.ADMIN_EMAIL, newPassword, resetToken);
      setStep(STEP.DONE);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#080808' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
      />

      {/* ── STEP: Login ── */}
      {step === STEP.LOGIN && (
        <Card title="Admin Sign In" subtitle="Secure access to your portfolio dashboard" icon={Lock}>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Field
              id="admin-email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="harshit@gmail.com"
              required
            />
            <Field
              id="admin-password"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setStep(STEP.QUESTION); setAnswer(''); }}
                className="text-xs font-medium transition-colors"
                style={{ color: '#6366f1' }}
                onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                onMouseLeave={e => e.target.style.color = '#6366f1'}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all mt-1"
              style={{
                background: loading ? '#2a2a2a' : '#6366f1',
                boxShadow: loading ? 'none' : '0 0 20px rgba(99,102,241,0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#4f46e5'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#6366f1'; }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </Card>
      )}

      {/* ── STEP: Security Question ── */}
      {step === STEP.QUESTION && (
        <Card
          title="Identity Verification"
          subtitle="Answer your security question to reset your password"
          icon={ShieldCheck}
          iconColor="#06b6d4"
        >
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            {/* Question display */}
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555] mb-1">Security Question</p>
              <p className="text-[#e2e8f0] font-medium">Who do you admire the most?</p>
            </div>

            <Field
              id="security-answer"
              label="Your Answer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              required
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(STEP.LOGIN)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{ background: '#191919', border: '1px solid #2a2a2a', color: '#a0a0a0' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#a0a0a0'}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background: loading ? '#2a2a2a' : 'rgba(6,182,212,0.85)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Verifying…' : 'Verify Answer'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* ── STEP: Reset Password ── */}
      {step === STEP.RESET && (
        <Card
          title="Reset Password"
          subtitle="Create a new password for your admin account"
          icon={KeyRound}
          iconColor="#10b981"
        >
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <Field
              id="reset-email"
              label="Admin Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="harshit@gmail.com"
              required
            />
            <Field
              id="new-password"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
            <Field
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              placeholder="Repeat new password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all mt-1"
              style={{
                background: loading ? '#2a2a2a' : 'rgba(16,185,129,0.85)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(16,185,129,0.2)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </Card>
      )}

      {/* ── STEP: Done ── */}
      {step === STEP.DONE && (
        <Card
          title="Password Updated!"
          subtitle="Your admin password has been changed successfully."
          icon={ShieldCheck}
          iconColor="#10b981"
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <ShieldCheck className="w-8 h-8" style={{ color: '#10b981' }} />
            </div>
            <p className="text-sm text-[#a0a0a0] text-center">
              You can now sign in with your new password.
            </p>
            <button
              onClick={() => { setStep(STEP.LOGIN); setNewPassword(''); setConfirmPwd(''); setAnswer(''); setResetToken(''); }}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: '#6366f1', boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}
            >
              Back to Sign In
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminLogin;

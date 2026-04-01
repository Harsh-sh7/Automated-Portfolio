const nodemailer = require('nodemailer');

const sendApprovalEmail = async (project) => {
  try {
    // For production, use Resend or SendGrid config
    // Here using simple config for Nodemailer with standard mail 
    let transporter;
    if (process.env.RESEND_API_KEY) {
      transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.EMAIL_USER || 'test',
          pass: process.env.EMAIL_PASS || 'test'
        }
      });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const approveUrl = `${backendUrl}/api/projects/approve/${project._id}`;
    const rejectUrl = `${backendUrl}/api/projects/reject/${project._id}`;

    const mailOptions = {
      from: 'onboarding@resend.dev',
      to: 'harshakya56@gmail.com', 
      subject: `New Project Pending Approval: ${project.name}`,
      html: `
        <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #30363d;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0;">Portfolio Sync Pipeline</h1>
          </div>
          
          <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 24px;">
            <h2 style="color: #58a6ff; font-size: 20px; margin-top: 0; margin-bottom: 15px;">New Repository Detected</h2>
            <p style="font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              The automated webhook has detected a new project push: <strong style="color: #ffffff;">${project.name}</strong>. The AI has extracted the following details from its README:
            </p>
            
            <div style="background-color: #0d1117; padding: 15px; border-radius: 6px; border: 1px solid #30363d; margin-bottom: 25px;">
              <h3 style="color: #8b949e; font-size: 11px; text-transform: uppercase; margin-top: 0; margin-bottom: 8px; letter-spacing: 0.5px;">Description</h3>
              <p style="font-size: 14px; margin: 0 0 15px 0;">${project.description || 'No description provided.'}</p>
              
              <h3 style="color: #8b949e; font-size: 11px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Tech Stack</h3>
              <p style="font-size: 14px; margin: 0; color: #58a6ff;">${project.tech_stack && project.tech_stack.length > 0 ? project.tech_stack.join(', ') : 'Not detected'}</p>
            </div>

            <p style="font-size: 14px; margin-bottom: 20px; text-align: center;">Would you like to publish this project to your live portfolio?</p>
            
            <div style="text-align: center;">
              <a href="${approveUrl}" style="display: inline-block; background-color: #238636; color: #ffffff; text-decoration: none; padding: 10px 24px; font-size: 14px; font-weight: 600; border-radius: 6px; border: 1px solid rgba(240,246,252,0.1); margin-right: 15px;">Approve Project</a>
              
              <a href="${rejectUrl}" style="display: inline-block; background-color: #21262d; color: #f85149; text-decoration: none; padding: 10px 24px; font-size: 14px; font-weight: 500; border-radius: 6px; border: 1px solid #30363d; transition: 0.2s;">Discard</a>
            </div>
          </div>
          
          <p style="text-align: center; color: #8b949e; font-size: 12px; margin-top: 30px;">
            Sent automatically by your Developer Portfolio System via Resend.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email', error);
  }
};

module.exports = { sendApprovalEmail };

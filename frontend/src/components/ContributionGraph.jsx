import React from 'react';

const ContributionGraph = () => {
  // Mock contribution data for GitHub-style heatmap
  const weeks = Array.from({ length: 52 });
  const days = Array.from({ length: 7 });

  const getColor = () => {
    const val = Math.random();
    if (val > 0.8) return 'bg-[#39d353]';
    if (val > 0.6) return 'bg-[#26a641]';
    if (val > 0.4) return 'bg-[#006d32]';
    if (val > 0.2) return 'bg-[#0e4429]';
    return 'bg-[#161b22] border border-[#30363d]'; // Card match
  };

  return (
    <div className="mb-10 w-full overflow-x-auto pb-4">
      <h3 className="text-sm text-gray-300 font-semibold mb-3">1,432 contributions in the last year</h3>
      <div className="inline-flex gap-1 border border-github-border p-4 rounded-xl bg-github-card h-[9.5rem] items-end shadow-inner">
        {weeks.map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {days.map((_, j) => (
              <div
                key={j}
                className={`w-[11px] h-[11px] rounded-[2px] ${getColor()} hover:ring-1 hover:ring-gray-300 transition-all cursor-pointer`}
                title="Contributions"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributionGraph;

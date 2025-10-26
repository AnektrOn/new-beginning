import React from 'react';

const RadarChart = ({ data, size = 200 }) => {
  // Default data structure for master stats
  const defaultData = {
    'Cognitive & Theoretical': 0,
    'Creative & Reflective': 0,
    'Discipline & Ritual': 0,
    'Inner Awareness': 0,
    'Physical Mastery': 0,
    'Social & Influence': 0
  };

  const chartData = { ...defaultData, ...data };
  
  // Convert data to array for processing
  const dataArray = Object.entries(chartData).map(([name, value]) => ({
    name,
    value: Math.min(Math.max(value, 0), 100) // Clamp between 0-100
  }));

  // Calculate points for radar chart
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const angleStep = (2 * Math.PI) / dataArray.length;

  const points = dataArray.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const distance = (item.value / 100) * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    return { x, y, name: item.name, value: item.value };
  });

  // Create path for the filled area
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  // Create path for the grid lines
  const gridLines = [];
  for (let i = 0; i < 5; i++) {
    const gridRadius = (radius * (i + 1)) / 5;
    const gridPath = dataArray.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * gridRadius;
      const y = centerY + Math.sin(angle) * gridRadius;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
    gridLines.push(gridPath);
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-lg">
        {/* Grid lines */}
        {gridLines.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        {points.map((point, index) => (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={centerX + Math.cos(index * angleStep - Math.PI / 2) * radius}
            y2={centerY + Math.sin(index * angleStep - Math.PI / 2) * radius}
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="1"
          />
        ))}
        
        {/* Filled area */}
        <path
          d={pathData}
          fill="rgba(34, 197, 94, 0.3)"
          stroke="#22c55e"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#22c55e"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {points.map((point, index) => (
          <div key={index} className="flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span className="text-gray-600 font-medium">{point.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarChart;

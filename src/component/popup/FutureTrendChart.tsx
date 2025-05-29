import React, { useCallback, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  year: number;
  growth: number;
}

interface FutureTrendChartProps {
  data: ChartDataPoint[];
}

const FutureTrendChart: React.FC<FutureTrendChartProps> = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Color resolvers that respect dark mode
  const getTextColor = useCallback(() => {
    // Check if dark mode by looking at body class or data attribute
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
    return isDarkMode ? '#e2e8f0' : '#718096';
  }, []);

  const getGridColor = useCallback(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
    return isDarkMode ? '#2d3748' : '#e2e8f0';
  }, []);

  // Only render on client-side
  if (!mounted) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} opacity={0.2} />
        <XAxis 
          dataKey="year" 
          tick={{ fill: getTextColor() }}
        />
        <YAxis 
          tick={{ fill: getTextColor() }} 
          label={{ 
            value: 'Growth Factor', 
            angle: -90, 
            position: 'insideLeft',
            fill: getTextColor() 
          }} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--bg-primary-light, #1a202c)', 
            borderColor: 'var(--border, #2d3748)',
            color: 'var(--text-secondary, #e2e8f0)'
          }}
          labelStyle={{
            color: 'var(--text-secondary, #e2e8f0)'
          }}
        />
        <Legend 
          wrapperStyle={{
            color: getTextColor()
          }}
        />
        <Line
          type="monotone"
          dataKey="growth"
          name="Growth Factor"
          stroke="#3182ce"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FutureTrendChart;
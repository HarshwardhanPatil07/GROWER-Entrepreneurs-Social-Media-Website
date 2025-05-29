import React, { useCallback, useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  Line
} from 'recharts';

interface ChartDataPoint {
  year: number;
  growth: number;
  marketStatus?: string;
  riskLevel?: string;
}

interface FutureTrendChartProps {
  data: ChartDataPoint[];
  height?: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = (props) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length && payload[0] && payload[0].payload) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{`Year: ${label}`}</p>
        <p className="text-blue-600 dark:text-blue-400">{`Growth: ${payload[0]?.value}%`}</p>
        {dataPoint.marketStatus && (
          <p className="text-gray-700 dark:text-gray-300">{`Phase: ${dataPoint.marketStatus}`}</p>
        )}
        {dataPoint.riskLevel && (
          <p className="text-gray-700 dark:text-gray-300">{`Risk: ${dataPoint.riskLevel}`}</p>
        )}
      </div>
    );
  }
  return null;
};

const FutureTrendChart: React.FC<FutureTrendChartProps> = ({ data, height = 300 }) => {
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Ensure component only renders on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepare data with interpolated points for smoother curves
  useEffect(() => {
    if (data && data.length > 0) {
      const interpolatedData: ChartDataPoint[] = [];
      
      // First add all original data points
      data.forEach(point => {
        interpolatedData.push(point);
      });
      
      // Sort by year
      interpolatedData.sort((a, b) => a.year - b.year);
      
      setChartData(interpolatedData);
    }
  }, [data]);

  // Color resolvers that respect dark mode
  const getTextColor = useCallback(() => {
    // Check if dark mode by looking at body class or data attribute
    const isDarkMode = document.documentElement.classList.contains('dark') ?? false;
    return isDarkMode ? '#e2e8f0' : '#718096';
  }, []);

  const getGridColor = useCallback(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') ?? false;
    return isDarkMode ? '#2d3748' : '#e2e8f0';
  }, []);

  const getBgColor = useCallback(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') ?? false;
    return isDarkMode ? '#1a202c' : '#ffffff';
  }, []);

  // Only render on client-side
  if (!mounted || chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} opacity={0.2} />
        <XAxis 
          dataKey="year" 
          tick={{ fill: getTextColor() }}
        />
        <YAxis 
          tick={{ fill: getTextColor() }} 
          label={{ 
            value: 'Growth %', 
            angle: -90, 
            position: 'insideLeft',
            fill: getTextColor() 
          }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{
            color: getTextColor()
          }}
        />
        <ReferenceLine y={0} stroke={getGridColor()} />
        <Area
          type="monotone"
          dataKey="growth"
          name="Market Growth %"
          stroke="#3182ce"
          fillOpacity={1}
          fill="url(#colorGrowth)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default FutureTrendChart;
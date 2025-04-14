import React from 'react';
import { StressDataPoint } from '@/models/Stats';

type LineChartProps = {
  data: StressDataPoint[];
  title: string;
  width?: number;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  width = 700,
  height = 300
}) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const sortedData = [...data].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const stressLevels = sortedData.map(item => parseInt(item.stress_level));

  const dates = sortedData.map(item => {
    const date = new Date(item.created_at);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const chartData = stressLevels.join(',');

  const labelIndices = [];
  const stepSize = Math.max(1, Math.floor(dates.length / 10)); // Aim for about 10 labels

  for (let i = 0; i < dates.length; i += stepSize) {
    labelIndices.push(i);
  }
  if (!labelIndices.includes(dates.length - 1)) {
    labelIndices.push(dates.length - 1);
  }

  const labels = labelIndices.map(i => dates[i]).join('|');
  const chartAxisLabels = `0:|${labels}`;

  const chartUrl = `https://image-charts.com/chart?` +
    `cht=lc&` + // Line chart
    `chd=t:${chartData}&` + // Data
    `chs=${width}x${height}&` + // Size
    `chtt=${encodeURIComponent(title)}&` + // Title
    `chxt=x,y&` + // Show both axes
    `chxl=${chartAxisLabels}&` + // X-axis labels
    `chds=0,5&` + // Scale (stress level is 1-5)
    `chxr=1,0,5&` + // Y-axis range
    `chco=4285F4&` + // Line color (Google Blue)
    `chf=bg,s,FFFFFF&` + // Background color
    `chm=o,FF0000,0,-1,5`; // Add red dots for data points

  return (
    <div className="mt-4" data-testid="responses-trend">
      <img
        src={chartUrl}
        alt={title}
        width={width}
        height={height}
        className="border rounded shadow-sm"
      />
    </div>
  );
};

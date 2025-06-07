'use client';

import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { YearlyData } from '@/types';

// Chart.js コンポーネントの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CashflowChartProps {
  yearlyData: YearlyData[];
}

export default function CashflowChart({ yearlyData }: CashflowChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // ゼロラインプラグイン
  const zeroLinePlugin: Plugin<'line'> = {
    id: 'zeroLine',
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      const yScale = chart.scales.y;
      const xScale = chart.scales.x;
      
      if (yScale && xScale) {
        const zeroY = yScale.getPixelForValue(0);
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xScale.left, zeroY);
        ctx.lineTo(xScale.right, zeroY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#95a5a6';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  const labels = yearlyData.map((data) => data.year);
  const cumulativeCashflowData = yearlyData.map((data) => data.cumulativeCashflow);
  const npvData = yearlyData.map((data) => data.npv);

  const data = {
    labels,
    datasets: [
      {
        label: '累積キャッシュフロー',
        data: cumulativeCashflowData,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: '累積NPV',
        data: npvData,
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${(value / 10000).toFixed(1)}万円`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '年',
          font: {
            size: 14,
          },
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '金額（万円）',
          font: {
            size: 14,
          },
        },
        ticks: {
          callback: function (value) {
            return (Number(value) / 10000).toFixed(0);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // 投資回収ポイントの検出
  const paybackIndex = cumulativeCashflowData.findIndex((value) => value >= 0);
  const paybackYear = paybackIndex >= 0 ? yearlyData[paybackIndex].year : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">キャッシュフロー推移</h2>
      
      {paybackYear && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-semibold">投資回収達成：</span>
            {paybackYear}年目で累積キャッシュフローがプラスに転じます
          </p>
        </div>
      )}
      
      <div className="relative" style={{ height: '400px' }}>
        <Line
          ref={chartRef}
          data={data}
          options={options}
          plugins={[zeroLinePlugin]}
        />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="font-medium text-gray-700">累積キャッシュフロー</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            初期投資からの実際の収支累計
          </p>
        </div>
        
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span className="font-medium text-gray-700">累積NPV</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            割引率を考慮した現在価値
          </p>
        </div>
      </div>
    </div>
  );
} 
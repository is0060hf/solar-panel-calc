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
        ctx.strokeStyle = '#9CA3AF';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  const labels = yearlyData.map((data) => data.year);
  const cumulativeCashflowData = yearlyData.map((data) => data.cumulativeCashflow);
  const npvData = yearlyData.map((data) => data.npv);

  // 投資回収ポイントの検出
  const paybackIndex = cumulativeCashflowData.findIndex((value) => value >= 0);
  const paybackYear = paybackIndex >= 0 ? yearlyData[paybackIndex].year : null;

  const data = {
    labels,
    datasets: [
      {
        label: '累積キャッシュフロー',
        data: cumulativeCashflowData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3B82F6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
      {
        label: '累積NPV',
        data: npvData,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#8B5CF6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
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
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#374151',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
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
            weight: 'bold',
          },
          color: '#374151',
        },
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '金額（万円）',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          callback: function (value) {
            return (Number(value) / 10000).toFixed(0);
          },
          color: '#6B7280',
          font: {
            size: 12,
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

  // 投資回収達成年のアノテーション
  if (paybackYear && chartRef.current) {
    const chart = chartRef.current;
    const meta = chart.getDatasetMeta(0);
    if (meta && meta.data[paybackIndex]) {
      // カスタムアノテーションロジックをここに追加可能
    }
  }

  return (
    <div className="glass rounded-2xl shadow-xl p-8 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">キャッシュフロー推移</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          50年間の累積キャッシュフローとNPVの推移を表示
        </p>
      </div>
      
      {paybackYear && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                投資回収達成
              </p>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">
                {paybackYear}年目で黒字転換
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative bg-white dark:bg-gray-900 rounded-xl p-4" style={{ height: '400px' }}>
        <Line
          ref={chartRef}
          data={data}
          options={options}
          plugins={[zeroLinePlugin]}
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">累積キャッシュフロー</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            初期投資からの実際の収支累計。プラスになると投資回収完了
          </p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">累積NPV</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            割引率を考慮した現在価値。将来の価値を現在の価値に換算
          </p>
        </div>
      </div>
      
      {/* 追加の統計情報 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">最終年CF</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(cumulativeCashflowData[cumulativeCashflowData.length - 1] / 10000).toFixed(0)}万円
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">最終年NPV</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(npvData[npvData.length - 1] / 10000).toFixed(0)}万円
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">最大値</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(Math.max(...cumulativeCashflowData) / 10000).toFixed(0)}万円
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">最小値</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(Math.min(...cumulativeCashflowData) / 10000).toFixed(0)}万円
          </p>
        </div>
      </div>
    </div>
  );
} 
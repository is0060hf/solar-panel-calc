'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { YearlyData } from '@/types';

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

interface EnergyFlowChartProps {
  yearlyData: YearlyData[];
  enableFeedInTariff: boolean;
}

export default function EnergyFlowChart({ yearlyData, enableFeedInTariff }: EnergyFlowChartProps) {
  // 10年ごとのデータを抽出（表示を見やすくするため）
  const interval = yearlyData.length > 20 ? 10 : 5;
  const labels = yearlyData
    .filter((_, index) => index % interval === 0 || index === yearlyData.length - 1)
    .map(data => `${data.year}年`);
  
  const filteredData = yearlyData.filter((_, index) => 
    index % interval === 0 || index === yearlyData.length - 1
  );
  
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '発電量',
        data: filteredData.map(d => Math.round(d.generation)),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: '自家消費量',
        data: filteredData.map(d => Math.round(d.selfConsumed)),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: '売電量',
        data: filteredData.map(d => enableFeedInTariff ? Math.round(d.feedIn) : 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: '買電量',
        data: filteredData.map(d => Math.round(d.gridPurchase)),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'エネルギーフローの推移',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} kWh`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: '電力量 (kWh/年)'
        },
        ticks: {
          callback: (value) => {
            const numValue = typeof value === 'number' ? value : 0;
            return numValue.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };
  
  // 統計情報の計算
  const totalGeneration = yearlyData.reduce((sum, d) => sum + d.generation, 0);
  const totalSelfConsumed = yearlyData.reduce((sum, d) => sum + d.selfConsumed, 0);
  const totalFeedIn = enableFeedInTariff ? yearlyData.reduce((sum, d) => sum + d.feedIn, 0) : 0;
  const totalGridPurchase = yearlyData.reduce((sum, d) => sum + d.gridPurchase, 0);
  
  const selfConsumptionRatio = totalGeneration > 0 
    ? (totalSelfConsumed / totalGeneration * 100).toFixed(1)
    : '0.0';
  
  return (
    <div className="glass rounded-2xl shadow-xl p-6 animate-fadeIn">
      <h2 className="text-xl font-bold gradient-text mb-4">エネルギーフロー分析</h2>
      
      <div className="h-80 mb-6">
        <Line data={data} options={options} />
      </div>
      
      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総発電量</p>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
            {(totalGeneration / 1000).toFixed(0)} MWh
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {yearlyData.length}年間
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">自家消費率</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {selfConsumptionRatio}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            平均値
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総売電量</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {(totalFeedIn / 1000).toFixed(0)} MWh
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {yearlyData.length}年間
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">総買電量</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {(totalGridPurchase / 1000).toFixed(0)} MWh
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {yearlyData.length}年間
          </p>
        </div>
      </div>
    </div>
  );
} 
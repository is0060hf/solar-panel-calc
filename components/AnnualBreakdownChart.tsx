'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { YearlyData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnnualBreakdownChartProps {
  yearlyData: YearlyData[];
  selectedYear?: number;
}

export default function AnnualBreakdownChart({ yearlyData, selectedYear = 1 }: AnnualBreakdownChartProps) {
  const [currentYear, setCurrentYear] = React.useState(selectedYear);
  
  // 選択された年のデータを取得
  const yearData = yearlyData[currentYear - 1];
  
  if (!yearData) return null;
  
  // 収入項目
  const incomeData = [
    { label: '売電収入', value: yearData.feedInRevenue / 10000, color: '#10B981' },
    { label: '自家消費節約', value: yearData.savingsFromSelfConsumption / 10000, color: '#3B82F6' },
    { label: 'DR収益', value: yearData.drRevenue / 10000, color: '#8B5CF6' }
  ].filter(item => item.value > 0);
  
  // 支出項目
  const expenseData = [
    { label: '買電費用', value: yearData.gridPurchaseCost / 10000, color: '#EF4444' },
    { label: 'メンテナンス費', value: yearData.maintenanceCost / 10000, color: '#F59E0B' },
    { label: '保険料', value: yearData.insuranceCost / 10000, color: '#6366F1' },
    { label: '交換費用', value: yearData.replacementCost / 10000, color: '#EC4899' }
  ].filter(item => item.value > 0);
  
  const data: ChartData<'bar'> = {
    labels: [
      ...incomeData.map(item => item.label),
      ...expenseData.map(item => item.label)
    ],
    datasets: [{
      label: '金額（万円）',
      data: [
        ...incomeData.map(item => item.value),
        ...expenseData.map(item => -item.value)
      ],
      backgroundColor: [
        ...incomeData.map(item => item.color),
        ...expenseData.map(item => item.color)
      ],
      borderColor: [
        ...incomeData.map(item => item.color),
        ...expenseData.map(item => item.color)
      ],
      borderWidth: 1
    }]
  };
  
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${currentYear}年目の収支内訳`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Math.abs(context.parsed.y);
            const type = context.parsed.y > 0 ? '収入' : '支出';
            return `${type}: ${value.toFixed(1)}万円`;
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
          text: '金額（万円）'
        },
        ticks: {
          callback: (value) => {
            const numValue = typeof value === 'number' ? value : 0;
            return numValue > 0 ? `+${numValue}` : numValue.toString();
          }
        }
      }
    }
  };
  
  return (
    <div className="glass rounded-2xl shadow-xl p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold gradient-text">年間収支内訳</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentYear(Math.max(1, currentYear - 1))}
            disabled={currentYear <= 1}
            className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
            aria-label="前年"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
            {currentYear}年目
          </span>
          <button
            onClick={() => setCurrentYear(Math.min(yearlyData.length, currentYear + 1))}
            disabled={currentYear >= yearlyData.length}
            className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
            aria-label="翌年"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
      
      {/* 年間合計表示 */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">総収入</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            +{incomeData.reduce((sum, item) => sum + item.value, 0).toFixed(1)}万円
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">総支出</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            -{expenseData.reduce((sum, item) => sum + item.value, 0).toFixed(1)}万円
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">年間収支</p>
          <p className={`text-lg font-bold ${yearData.annualCashflow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {yearData.annualCashflow >= 0 ? '+' : ''}{(yearData.annualCashflow / 10000).toFixed(1)}万円
          </p>
        </div>
      </div>
    </div>
  );
} 
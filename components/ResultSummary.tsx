'use client';

import React from 'react';
import { SimulationResult } from '@/types';

interface ResultSummaryProps {
  result: SimulationResult | null;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">シミュレーション結果</h2>
        <p className="text-gray-500 text-center py-8">
          シミュレーションを実行すると結果が表示されます
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYears = (years: number): string => {
    return `${years.toFixed(1)}年`;
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const summaryItems = [
    {
      label: '初期投資額（補助金控除後）',
      value: formatCurrency(result.initialCost),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '💰',
    },
    {
      label: '投資回収期間',
      value: formatYears(result.paybackPeriod),
      color: result.paybackPeriod <= 15 ? 'text-green-600' : 'text-yellow-600',
      bgColor: result.paybackPeriod <= 15 ? 'bg-green-50' : 'bg-yellow-50',
      icon: '📅',
    },
    {
      label: '50年累積収支',
      value: formatCurrency(result.totalCashflow),
      color: result.totalCashflow >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: result.totalCashflow >= 0 ? 'bg-green-50' : 'bg-red-50',
      icon: '💹',
    },
    {
      label: '正味現在価値（NPV）',
      value: formatCurrency(result.npv),
      color: result.npv >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: result.npv >= 0 ? 'bg-green-50' : 'bg-red-50',
      icon: '📊',
    },
    {
      label: '内部収益率（IRR）',
      value: formatPercent(result.irr),
      color: result.irr >= 5 ? 'text-green-600' : 'text-yellow-600',
      bgColor: result.irr >= 5 ? 'bg-green-50' : 'bg-yellow-50',
      icon: '📈',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">シミュレーション結果</h2>
      
      <div className="space-y-4">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 ${item.bgColor} border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">投資判断の目安</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 投資回収期間が15年以内：良好な投資案件</li>
          <li>• NPVがプラス：経済的に有利な投資</li>
          <li>• IRRが5%以上：一般的な投資基準を満たす</li>
        </ul>
      </div>
    </div>
  );
} 
'use client';

import React from 'react';
import { SimulationResult } from '@/types';

interface ResultSummaryProps {
  result: SimulationResult | null;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  if (!result) {
    return (
      <div className="glass rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold gradient-text mb-6">シミュレーション結果</h2>
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            シミュレーションを実行すると結果が表示されます
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            左側のパラメータを設定して実行ボタンをクリックしてください
          </p>
        </div>
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
      label: '初期投資額',
      sublabel: '（補助金控除後）',
      value: formatCurrency(result.initialCost),
      isPositive: false,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-red-500 to-orange-500',
    },
    {
      label: '投資回収期間',
      sublabel: '（年数）',
      value: formatYears(result.paybackPeriod),
      isPositive: result.paybackPeriod <= 15,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: result.paybackPeriod <= 15 ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500',
    },
    {
      label: '50年累積収支',
      sublabel: '（総収益）',
      value: formatCurrency(result.totalCashflow),
      isPositive: result.totalCashflow >= 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: result.totalCashflow >= 0 ? 'from-blue-500 to-indigo-500' : 'from-red-500 to-pink-500',
    },
    {
      label: '正味現在価値',
      sublabel: '（NPV）',
      value: formatCurrency(result.npv),
      isPositive: result.npv >= 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      gradient: result.npv >= 0 ? 'from-purple-500 to-pink-500' : 'from-gray-500 to-gray-600',
    },
    {
      label: '内部収益率',
      sublabel: '（IRR）',
      value: formatPercent(result.irr),
      isPositive: result.irr >= 5,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: result.irr >= 5 ? 'from-teal-500 to-cyan-500' : 'from-amber-500 to-yellow-500',
    },
  ];

  // 総合評価の計算
  const getOverallRating = () => {
    let score = 0;
    if (result.paybackPeriod <= 15) score += 2;
    else if (result.paybackPeriod <= 20) score += 1;
    
    if (result.npv >= 0) score += 2;
    if (result.irr >= 5) score += 2;
    else if (result.irr >= 3) score += 1;
    
    if (score >= 5) return { rating: '優良', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900' };
    if (score >= 3) return { rating: '良好', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900' };
    if (score >= 1) return { rating: '検討', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900' };
    return { rating: '要再考', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900' };
  };

  const overallRating = getOverallRating();

  return (
    <div className="space-y-6">
      {/* メインサマリーカード */}
      <div className="glass rounded-2xl shadow-xl p-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">シミュレーション結果</h2>
          <div className={`px-4 py-2 rounded-full ${overallRating.bgColor}`}>
            <span className={`font-bold ${overallRating.color}`}>総合評価: {overallRating.rating}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryItems.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg card-hover"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg`}>
                  {item.icon}
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  {item.sublabel}
                </p>
                
                <p className={`text-2xl font-bold ${
                  item.isPositive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 投資判断ガイド */}
      <div className="glass rounded-2xl shadow-xl p-6 animate-fadeIn">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          投資判断の目安
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${result.paybackPeriod <= 15 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className="flex items-center mb-2">
              <svg className={`w-5 h-5 mr-2 ${result.paybackPeriod <= 15 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">投資回収期間</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              15年以内なら良好な投資案件
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${result.npv >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className="flex items-center mb-2">
              <svg className={`w-5 h-5 mr-2 ${result.npv >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">NPV</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              プラスなら経済的に有利
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${result.irr >= 5 ? 'bg-purple-50 dark:bg-purple-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <div className="flex items-center mb-2">
              <svg className={`w-5 h-5 mr-2 ${result.irr >= 5 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">IRR</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              5%以上で投資基準を満たす
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
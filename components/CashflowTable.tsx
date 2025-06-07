'use client';

import React, { useState } from 'react';
import { YearlyData } from '@/types';

interface CashflowTableProps {
  yearlyData: YearlyData[];
}

export default function CashflowTable({ yearlyData }: CashflowTableProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof YearlyData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(value));
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(value));
  };

  // ソート処理
  const handleSort = (column: keyof YearlyData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // データのソート
  const sortedData = [...yearlyData];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }

  // 表示するデータ（全件表示または最初の10件）
  const displayData = showAll ? sortedData : sortedData.slice(0, 10);

  // ソートアイコンの表示
  const SortIcon = ({ column }: { column: keyof YearlyData }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-3 h-3 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5-5 5 5H7zM7 14l5 5 5-5H7z" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-3 h-3 ml-1 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 14l5-5 5 5H7z" />
      </svg>
    ) : (
      <svg className="w-3 h-3 ml-1 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    );
  };

  return (
    <div className="glass rounded-2xl shadow-xl p-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">詳細キャッシュフロー表</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            年次ごとの詳細な収支データ
          </p>
        </div>
        {yearlyData.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium text-sm shadow-lg"
            aria-label={showAll ? '最初の10年のみ表示' : '全50年を表示'}
          >
            {showAll ? '最初の10年のみ表示' : '全50年を表示'}
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full" role="table" aria-label="キャッシュフロー詳細データ">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <th 
                scope="col"
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('year')}
              >
                <div className="flex items-center">
                  年
                  <SortIcon column="year" />
                </div>
              </th>
              <th 
                scope="col"
                className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('generation')}
              >
                <div className="flex items-center justify-end">
                  発電量<br/>(kWh)
                  <SortIcon column="generation" />
                </div>
              </th>
              <th 
                scope="col"
                className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('selfConsumed')}
              >
                <div className="flex items-center justify-end">
                  自家消費<br/>(kWh)
                  <SortIcon column="selfConsumed" />
                </div>
              </th>
              <th 
                scope="col"
                className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('feedIn')}
              >
                <div className="flex items-center justify-end">
                  売電量<br/>(kWh)
                  <SortIcon column="feedIn" />
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                売電収入<br/>(円)
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                節約額<br/>(円)
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                メンテ費<br/>(円)
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                交換費用<br/>(円)
              </th>
              <th 
                scope="col"
                className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('annualCashflow')}
              >
                <div className="flex items-center justify-end">
                  年間CF<br/>(円)
                  <SortIcon column="annualCashflow" />
                </div>
              </th>
              <th 
                scope="col"
                className="px-4 py-3 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('cumulativeCashflow')}
              >
                <div className="flex items-center justify-end">
                  累積CF<br/>(円)
                  <SortIcon column="cumulativeCashflow" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {displayData.map((data, index) => (
              <tr 
                key={data.year} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-inherit z-10">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center mr-2 text-xs font-bold">
                      {data.year}
                    </span>
                    年目
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 text-right">
                  {formatNumber(data.generation)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 text-right">
                  {formatNumber(data.selfConsumed)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 text-right">
                  {formatNumber(data.feedIn)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400 text-right font-medium">
                  +{formatCurrency(data.feedInRevenue)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 text-right font-medium">
                  +{formatCurrency(data.savingsFromSelfConsumption)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 text-right">
                  -{formatCurrency(data.maintenanceCost)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  {data.replacementCost > 0 ? (
                    <div>
                      <div className="text-orange-600 dark:text-orange-400 font-medium">
                        -{formatCurrency(data.replacementCost)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {data.replacementItem}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold">
                  <span className={`px-2 py-1 rounded-lg ${
                    data.annualCashflow >= 0 
                      ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
                      : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {formatCurrency(data.annualCashflow)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold">
                  <span className={`px-2 py-1 rounded-lg ${
                    data.cumulativeCashflow >= 0 
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30' 
                      : 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {formatCurrency(data.cumulativeCashflow)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!showAll && yearlyData.length > 10 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center"
          >
            残り{yearlyData.length - 10}年分を表示
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">凡例</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            売電収入・節約額：プラスの収益
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            メンテ費・交換費用：マイナスのコスト
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            CF（キャッシュフロー）：現金収支
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            交換時期：機器の交換が必要な年
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          ※ 金額は全て税込み表示です。交換費用は該当年のみ発生します。
        </p>
      </div>
    </div>
  );
} 
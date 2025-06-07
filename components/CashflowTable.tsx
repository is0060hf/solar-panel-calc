'use client';

import React, { useState } from 'react';
import { YearlyData } from '@/types';

interface CashflowTableProps {
  yearlyData: YearlyData[];
}

export default function CashflowTable({ yearlyData }: CashflowTableProps) {
  const [showAll, setShowAll] = useState(false);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(value));
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(value));
  };

  // 表示するデータ（全件表示または最初の10件）
  const displayData = showAll ? yearlyData : yearlyData.slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">詳細キャッシュフロー表</h2>
        {yearlyData.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAll ? '最初の10年のみ表示' : '全50年を表示'}
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                年
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                発電量<br/>(kWh)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                自家消費<br/>(kWh)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                売電量<br/>(kWh)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                買電量<br/>(kWh)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                電気料金<br/>(円/kWh)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                売電収入<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                自家消費<br/>節約額(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                買電費用<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                DR収益<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                メンテ費<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                保険料<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                交換費用<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                年間CF<br/>(円)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                累積CF<br/>(円)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((data) => (
              <tr key={data.year} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                  {data.year}年目
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatNumber(data.generation)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatNumber(data.selfConsumed)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatNumber(data.feedIn)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatNumber(data.gridPurchase)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {data.electricityPrice.toFixed(1)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(data.feedInRevenue)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(data.savingsFromSelfConsumption)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right text-red-600">
                  -{formatCurrency(data.gridPurchaseCost)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatCurrency(data.drRevenue)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right text-red-600">
                  -{formatCurrency(data.maintenanceCost)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right text-red-600">
                  -{formatCurrency(data.insuranceCost)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  {data.replacementCost > 0 ? (
                    <div>
                      <div className="text-red-600">-{formatCurrency(data.replacementCost)}</div>
                      <div className="text-xs text-gray-500">{data.replacementItem}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">0</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                  <span className={data.annualCashflow >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(data.annualCashflow)}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-bold">
                  <span className={data.cumulativeCashflow >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(data.cumulativeCashflow)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!showAll && yearlyData.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            残り{yearlyData.length - 10}年分を表示
          </button>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">凡例：</span>
          CF = キャッシュフロー、DR = デマンドレスポンス、メンテ費 = メンテナンス費用
        </p>
        <p className="text-xs text-gray-600 mt-1">
          <span className="font-semibold">注：</span>
          金額は全て税込み表示です。交換費用は該当年のみ発生します。
        </p>
      </div>
    </div>
  );
} 
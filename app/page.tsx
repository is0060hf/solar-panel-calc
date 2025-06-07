'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultSummary from '@/components/ResultSummary';
import CashflowChart from '@/components/CashflowChart';
import CashflowTable from '@/components/CashflowTable';
import { InputParameters, SimulationResult } from '@/types';
import { DEFAULT_PARAMETERS } from '@/utils/defaultParameters';
import { runSimulation } from '@/utils/calculations';

export default function Home() {
  const [parameters, setParameters] = useState<InputParameters>(DEFAULT_PARAMETERS);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleParameterChange = (key: keyof InputParameters, value: number | boolean) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSimulate = () => {
    const result = runSimulation(parameters);
    setSimulationResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">太陽光発電・蓄電池キャッシュフロー分析システム</h1>
          <p className="mt-2 text-blue-100">
            50年間の詳細なキャッシュフロー分析と投資回収シミュレーション
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：入力パネル */}
          <div className="lg:col-span-1">
            <InputForm
              parameters={parameters}
              onParameterChange={handleParameterChange}
              onSimulate={handleSimulate}
            />
          </div>

          {/* 右側：結果表示エリア */}
          <div className="lg:col-span-2 space-y-8">
            {/* 結果サマリー */}
            <ResultSummary result={simulationResult} />

            {/* グラフエリア */}
            {simulationResult && (
              <CashflowChart yearlyData={simulationResult.yearlyData} />
            )}
          </div>
        </div>

        {/* 詳細キャッシュフロー表 */}
        {simulationResult && (
          <div className="mt-8">
            <CashflowTable yearlyData={simulationResult.yearlyData} />
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 太陽光発電・蓄電池キャッシュフロー分析システム
          </p>
          <p className="text-xs text-gray-400 mt-2">
            ※ 本シミュレーションは参考値です。実際の結果を保証するものではありません。
          </p>
        </div>
      </footer>
    </div>
  );
}

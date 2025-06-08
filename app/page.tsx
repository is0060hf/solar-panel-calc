'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultSummary from '@/components/ResultSummary';
import CashflowChart from '@/components/CashflowChart';
import CashflowTable from '@/components/CashflowTable';

import AnnualBreakdownChart from '@/components/AnnualBreakdownChart';
import EnergyFlowChart from '@/components/EnergyFlowChart';
import { InputParameters, SimulationResult } from '@/types';
import { DEFAULT_PARAMETERS } from '@/utils/defaultParameters';
import { runSimulation } from '@/utils/calculations';

export default function Home() {
  const [parameters, setParameters] = useState<InputParameters>(DEFAULT_PARAMETERS);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleParameterChange = (key: keyof InputParameters, value: number | boolean) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSimulate = async () => {
    setIsCalculating(true);
    
    // Add slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = runSimulation(parameters);
    setSimulationResult(result);
    setIsCalculating(false);
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Skip to main content link for accessibility */}
      <a href="#main" className="skip-link">
        メインコンテンツへスキップ
      </a>

      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 glass shadow-lg animate-fadeIn" role="banner">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  太陽光発電・蓄電池シミュレーター
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  50年間のキャッシュフロー分析
                </p>
              </div>
            </div>
            <button
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="ヘルプ"
              title="ヘルプ"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main" className="container mx-auto px-4 py-8" role="main">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fadeIn" aria-label="ヒーローセクション">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">未来への投資</span>を
            <br className="md:hidden" />
            シミュレーション
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            太陽光発電と蓄電池の導入効果を、詳細なキャッシュフロー分析で可視化。
            <br />
            あなたの最適な投資計画をサポートします。
          </p>
        </section>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <aside className="lg:col-span-1" role="complementary" aria-label="入力フォーム">
            <div className="sticky top-24">
              <InputForm
                parameters={parameters}
                onParameterChange={handleParameterChange}
                onSimulate={handleSimulate}
              />
            </div>
          </aside>

          {/* Results Section */}
          <section 
            id="results" 
            className="lg:col-span-2 space-y-8"
            role="region"
            aria-label="シミュレーション結果"
          >
            {/* Loading State */}
            {isCalculating && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="spinner mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">計算中...</p>
                </div>
              </div>
            )}

            {/* Results */}
            {!isCalculating && (
              <>
                <ResultSummary result={simulationResult} />
                
                {simulationResult && (
                  <>
                    <div className="animate-fadeIn">
                      <CashflowChart yearlyData={simulationResult.yearlyData} />
                    </div>
                    <div className="animate-fadeIn">
                      <AnnualBreakdownChart yearlyData={simulationResult.yearlyData} />
                    </div>
                    <div className="animate-fadeIn">
                      <EnergyFlowChart yearlyData={simulationResult.yearlyData} enableFeedInTariff={parameters.enableFeedInTariff} />
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </div>

        {/* Detailed Table Section */}
        {simulationResult && !isCalculating && (
          <section 
            className="mt-12 animate-fadeIn"
            role="region"
            aria-label="詳細データテーブル"
          >
            <CashflowTable yearlyData={simulationResult.yearlyData} />
          </section>
        )}

        {/* Features Section */}
        <section className="mt-20 mb-12" aria-label="機能紹介">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            システムの特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="glass rounded-2xl p-6 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 high-contrast">詳細な分析</h3>
              <p className="text-gray-600 dark:text-gray-400">
                50年間の収支予測、NPV、IRR計算により、投資効果を多角的に分析
              </p>
            </article>

            <article className="glass rounded-2xl p-6 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 high-contrast">柔軟な設定</h3>
              <p className="text-gray-600 dark:text-gray-400">
                パネル容量、蓄電池、売電設定など、あなたの条件に合わせてカスタマイズ
              </p>
            </article>

            <article className="glass rounded-2xl p-6 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 high-contrast">リアルタイム計算</h3>
              <p className="text-gray-600 dark:text-gray-400">
                パラメータ変更時に即座に結果を反映。スムーズな操作体験を提供
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer 
        className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20"
        role="contentinfo"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">太陽光発電シミュレーター</h3>
              <p className="text-gray-400 text-sm">
                持続可能な未来への第一歩を、
                正確なシミュレーションでサポート
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">アクセシビリティ</h3>
              <p className="text-gray-400 text-sm">
                WCAG 2.2準拠<br />
                キーボード操作対応<br />
                スクリーンリーダー対応
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">免責事項</h3>
              <p className="text-gray-400 text-sm">
                本シミュレーションは参考値です。
                実際の結果を保証するものではありません。
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 太陽光発電・蓄電池キャッシュフロー分析システム
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

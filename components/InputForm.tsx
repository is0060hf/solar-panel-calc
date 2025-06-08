'use client';

import React from 'react';
import { InputParameters } from '@/types';
import { PARAMETER_CONFIG } from '@/utils/defaultParameters';
import { getUnitSuffix, getUnitDescription, formatValueWithUnit } from '@/utils/units';
import { calculateManualInitialCost } from '@/utils/calculations';

interface InputFormProps {
  parameters: InputParameters;
  onParameterChange: (key: keyof InputParameters, value: number | boolean) => void;
  onSimulate: () => void;
}

// ツールチップコンポーネント
const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="invisible group-hover:visible group-focus-within:visible absolute left-full ml-2 z-10 w-64 p-2 text-sm text-white bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
        <div className="absolute w-2 h-2 bg-gray-800 dark:bg-gray-900 transform rotate-45 -left-1 top-3"></div>
        {content}
      </div>
    </div>
  );
};

// 詳細説明付きラベルコンポーネント
const LabelWithTooltip: React.FC<{ 
  htmlFor: string; 
  label: string; 
  tooltip: string;
  className?: string;
}> = ({ htmlFor, label, tooltip, className = '' }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 ${className}`}
    >
      {label}
      <Tooltip content={tooltip}>
        <button 
          type="button"
          tabIndex={0}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label={`${label}の詳細情報`}
        >
          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </Tooltip>
    </label>
  );
};

export default function InputForm({ parameters, onParameterChange, onSimulate }: InputFormProps) {
  // 年間電力使用量を推定（一般家庭の平均値ベース）
  const estimatedAnnualConsumption = React.useMemo(() => {
    // 基準: 一般家庭の平均 4,500kWh/年
    const baseConsumption = 4500;
    
    // パネル容量が大きい家庭ほど電力使用量も多いと想定
    // 10kWまで: 基準値
    // 10kW超: 10kWごとに基準の20%増加
    const capacityMultiplier = 1 + Math.max(0, (parameters.solarCapacity - 10) / 10) * 0.2;
    
    return Math.round(baseConsumption * capacityMultiplier);
  }, [parameters.solarCapacity]);

  // 年間電力使用量が変更されたときに呼び出す
  React.useEffect(() => {
    if (parameters.useManualMonthlyConsumption) {
      // 月間使用電力量から年間使用量を計算
      const calculatedAnnualConsumption = parameters.monthlyConsumption * 12;
      if (parameters.annualConsumption !== calculatedAnnualConsumption) {
        onParameterChange('annualConsumption', calculatedAnnualConsumption);
      }
    } else {
      // 推定値を使用
      if (parameters.annualConsumption !== estimatedAnnualConsumption) {
        onParameterChange('annualConsumption', estimatedAnnualConsumption);
      }
    }
  }, [estimatedAnnualConsumption, parameters.annualConsumption, parameters.useManualMonthlyConsumption, parameters.monthlyConsumption, onParameterChange]);

  const renderSlider = (
    key: keyof InputParameters,
    config: typeof PARAMETER_CONFIG[keyof typeof PARAMETER_CONFIG]
  ) => {
    const value = parameters[key] as number;
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;
    const unit = getUnitSuffix(key);
    const description = getUnitDescription(key) || config.description;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <LabelWithTooltip
            htmlFor={key}
            label={config.label}
            tooltip={description}
          />
          <span className="text-lg font-bold gradient-text">
            {formatValueWithUnit(value, key)}
          </span>
        </div>
        <div className="relative">
          <input
            id={key}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(e) => onParameterChange(key, parseFloat(e.target.value))}
            className="slider-modern"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #8B5CF6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
            }}
            aria-valuemin={config.min}
            aria-valuemax={config.max}
            aria-valuenow={value}
            aria-label={config.label}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {config.description}
        </p>
      </div>
    );
  };

  const renderNumberInput = (
    key: keyof InputParameters,
    config: typeof PARAMETER_CONFIG[keyof typeof PARAMETER_CONFIG],
    unit: string
  ) => {
    const description = getUnitDescription(key) || config.description;
    
    return (
      <div className="space-y-2">
        <LabelWithTooltip
          htmlFor={key}
          label={config.label}
          tooltip={description}
        />
        <div className="relative">
          <input
            id={key}
            type="number"
            min={config.min}
            max={config.max}
            step={config.step}
            value={parameters[key] as number}
            onChange={(e) => onParameterChange(key, parseFloat(e.target.value))}
            className="input-modern pr-12"
            aria-label={config.label}
          />
          <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        </div>
      </div>
    );
  };

  // 年間発電量の推定値を計算
  const estimatedAnnualGeneration = React.useMemo(() => {
    // 日本の平均: 1,000kWh/kW/年
    return Math.round(parameters.solarCapacity * 1000);
  }, [parameters.solarCapacity]);

  return (
    <div className="glass rounded-2xl shadow-xl p-6 space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold gradient-text">シミュレーション設定</h2>
      
      {/* 初期投資額設定 */}
      <section aria-labelledby="initial-cost">
        <h3 id="initial-cost" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          初期投資額設定
          <Tooltip content="太陽光発電システムと蓄電池の導入にかかる初期費用を設定します。自動計算または手動設定が選択できます。">
            <button 
              type="button"
              tabIndex={0}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ml-2"
              aria-label="初期投資額設定の詳細情報"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </Tooltip>
        </h3>
        
        <div className="space-y-6 pl-11">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              id="useManualInitialCost"
              checked={parameters.useManualInitialCost}
              onChange={(e) => onParameterChange('useManualInitialCost', e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              初期投資額を手動で設定する
            </span>
          </label>
          
          {parameters.useManualInitialCost ? (
            <div className="animate-fadeIn space-y-6">
              {renderSlider('manualSolarCost', PARAMETER_CONFIG.manualSolarCost)}
              {renderSlider('manualBatteryCost', PARAMETER_CONFIG.manualBatteryCost)}
              {renderSlider('manualInstallationCost', PARAMETER_CONFIG.manualInstallationCost)}
              
              {/* 手動設定時の合計初期投資額を表示 */}
              <div className="glass p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    合計初期投資額
                  </span>
                  <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {Math.round(calculateManualInitialCost(
                      parameters.solarCapacity,
                      parameters.batteryCapacity,
                      parameters.manualSolarCost,
                      parameters.manualBatteryCost,
                      parameters.manualInstallationCost
                    ) / 100000) * 10}万円
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  太陽光: {parameters.solarCapacity}kW × {parameters.manualSolarCost}万円/kW、
                  蓄電池: {parameters.batteryCapacity}kWh × {parameters.manualBatteryCost}万円/kWh、
                  工事費: {parameters.manualInstallationCost}万円
                </p>
              </div>
            </div>
          ) : (
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  推定初期投資額
                </span>
                <span className="text-lg font-bold gradient-text">
                  {Math.round((parameters.solarCapacity * 26 + parameters.batteryCapacity * 20 + 88) / 10) * 10}万円
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                太陽光パネル: 26万円/kW、蓄電池: 20万円/kWh、工事費等: 88万円
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* システム構成 */}
      <section aria-labelledby="system-config">
        <h3 id="system-config" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </span>
          システム構成
        </h3>
        
        <div className="space-y-6 pl-11">
          {!parameters.useManualInitialCost && (
            <>
              {renderSlider('solarCapacity', PARAMETER_CONFIG.solarCapacity)}
              
              {/* 年間発電量の推定値を表示 */}
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    推定年間発電量
                  </span>
                  <span className="text-lg font-bold gradient-text">
                    {estimatedAnnualGeneration.toLocaleString()} kWh
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  日本の平均: 1,000kWh/kW/年
                </p>
              </div>
              
              {renderSlider('batteryCapacity', PARAMETER_CONFIG.batteryCapacity)}
            </>
          )}
          
          {parameters.useManualInitialCost && (
            <>
              {renderSlider('solarCapacity', PARAMETER_CONFIG.solarCapacity)}
              
              {/* 年間発電量の推定値を表示 */}
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    推定年間発電量
                  </span>
                  <span className="text-lg font-bold gradient-text">
                    {estimatedAnnualGeneration.toLocaleString()} kWh
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  日本の平均: 1,000kWh/kW/年
                </p>
              </div>
              
              {renderSlider('batteryCapacity', PARAMETER_CONFIG.batteryCapacity)}
              
              <div className="glass p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  初期投資額の手動設定により、費用単価のみが変更されます
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* 電力使用設定 */}
      <section aria-labelledby="power-usage">
        <h3 id="power-usage" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          電力使用設定
        </h3>
        
        <div className="space-y-6 pl-11">
          {/* 月間使用電力量の手動設定 */}
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              id="useManualMonthlyConsumption"
              checked={parameters.useManualMonthlyConsumption}
              onChange={(e) => onParameterChange('useManualMonthlyConsumption', e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              月間使用電力量から年間使用量を計算する
            </span>
          </label>
          
          {parameters.useManualMonthlyConsumption ? (
            <div className="animate-fadeIn space-y-6">
              {renderSlider('monthlyConsumption', PARAMETER_CONFIG.monthlyConsumption)}
              
              {/* 年間電力使用量の計算結果を表示 */}
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    計算された年間電力使用量
                  </span>
                  <span className="text-lg font-bold gradient-text">
                    {(parameters.monthlyConsumption * 12).toLocaleString()} kWh
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  月間使用量 × 12ヶ月で計算
                </p>
              </div>
            </div>
          ) : (
            /* 年間電力使用量の推定値を表示 */
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  推定年間電力使用量
                </span>
                <span className="text-lg font-bold gradient-text">
                  {estimatedAnnualConsumption.toLocaleString()} kWh
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                一般家庭の平均: 4,500kWh/年（パネル容量に応じて調整）
              </p>
            </div>
          )}
          
          {renderSlider('selfConsumptionRate', PARAMETER_CONFIG.selfConsumptionRate)}
        </div>
      </section>
      
      {/* 売電設定 */}
      <section aria-labelledby="feed-in-tariff">
        <h3 id="feed-in-tariff" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          売電設定
        </h3>
        
        <div className="space-y-6 pl-11">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              id="enableFeedInTariff"
              checked={parameters.enableFeedInTariff}
              onChange={(e) => onParameterChange('enableFeedInTariff', e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              売電する
            </span>
          </label>
          
          {parameters.enableFeedInTariff && (
            <div className="animate-fadeIn">
              {renderNumberInput('feedInTariffRate', PARAMETER_CONFIG.feedInTariffRate, '円/kWh')}
            </div>
          )}
        </div>
      </section>
      
      {/* 補助金設定 */}
      <section aria-labelledby="subsidy">
        <h3 id="subsidy" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </span>
          補助金設定
        </h3>
        
        <div className="space-y-6 pl-11">
          {renderNumberInput('subsidyNational', PARAMETER_CONFIG.subsidyNational, '万円')}
          {renderNumberInput('subsidyLocal', PARAMETER_CONFIG.subsidyLocal, '万円')}
        </div>
      </section>
      
      {/* 電気料金設定 */}
      <section aria-labelledby="electricity-price">
        <h3 id="electricity-price" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          電気料金設定
        </h3>
        
        <div className="space-y-6 pl-11">
          {renderNumberInput('electricityBasePrice', PARAMETER_CONFIG.electricityBasePrice, '円/kWh')}
          {renderNumberInput('electricityPriceIncreaseRate', PARAMETER_CONFIG.electricityPriceIncreaseRate, '%/年')}
        </div>
      </section>
      
      {/* その他設定 */}
      <section aria-labelledby="other-settings">
        <h3 id="other-settings" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          その他設定
        </h3>
        
        <div className="space-y-6 pl-11">
          {renderNumberInput('discountRate', PARAMETER_CONFIG.discountRate, '%')}
        </div>
      </section>
      
      {/* シミュレーション実行ボタン */}
      <button
        onClick={onSimulate}
        className="btn-primary w-full text-lg py-4 mt-8"
        aria-label="シミュレーションを実行"
      >
        <span className="relative z-10 flex items-center justify-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          シミュレーション実行
        </span>
      </button>
    </div>
  );
} 
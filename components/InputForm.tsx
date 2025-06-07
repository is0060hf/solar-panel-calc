'use client';

import React from 'react';
import { InputParameters } from '@/types';
import { PARAMETER_CONFIG } from '@/utils/defaultParameters';

interface InputFormProps {
  parameters: InputParameters;
  onParameterChange: (key: keyof InputParameters, value: number | boolean) => void;
  onSimulate: () => void;
}

export default function InputForm({ parameters, onParameterChange, onSimulate }: InputFormProps) {
  // パネル容量と使用率から年間電力使用量を推定
  const estimatedAnnualConsumption = React.useMemo(() => {
    // パネル容量(kW) × 使用率(%) × 24時間 × 365日
    const dailyUsage = parameters.solarCapacity * (parameters.selfConsumptionRate / 100) * 24;
    const annualUsage = dailyUsage * 365;
    return Math.round(annualUsage);
  }, [parameters.solarCapacity, parameters.selfConsumptionRate]);

  // 年間電力使用量が変更されたときに呼び出す
  React.useEffect(() => {
    if (parameters.annualConsumption !== estimatedAnnualConsumption) {
      onParameterChange('annualConsumption', estimatedAnnualConsumption);
    }
  }, [estimatedAnnualConsumption, parameters.annualConsumption, onParameterChange]);

  const renderSlider = (
    key: keyof InputParameters,
    config: typeof PARAMETER_CONFIG[keyof typeof PARAMETER_CONFIG]
  ) => {
    const value = parameters[key] as number;
    const percentage = ((value - config.min) / (config.max - config.min)) * 100;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label 
            htmlFor={key}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {config.label}
          </label>
          <span className="text-lg font-bold gradient-text">
            {value.toLocaleString()} {key.includes('Rate') ? '%' : key.includes('Capacity') ? 'kW' : 'kWh'}
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
    return (
      <div className="space-y-2">
        <label 
          htmlFor={key}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
        >
          {config.label}
          <div className="tooltip">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="tooltip-content">
              {config.description}
            </span>
          </div>
        </label>
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

  return (
    <div className="glass rounded-2xl shadow-xl p-6 space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold gradient-text">シミュレーション設定</h2>
      
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
          {renderSlider('solarCapacity', PARAMETER_CONFIG.solarCapacity)}
          {renderSlider('batteryCapacity', PARAMETER_CONFIG.batteryCapacity)}
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
          {renderSlider('selfConsumptionRate', PARAMETER_CONFIG.selfConsumptionRate)}
          
          {/* 年間電力使用量の推定値を表示 */}
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
              計算式: {parameters.solarCapacity}kW × {parameters.selfConsumptionRate}% × 24時間 × 365日
            </p>
          </div>
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
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
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">シミュレーション設定</h2>
      
      {/* システム構成 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">システム構成</h3>
        
        {/* 太陽光パネル容量 */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.solarCapacity.label}
            <span className="text-lg font-semibold text-blue-600">{parameters.solarCapacity} kW</span>
          </label>
          <input
            type="range"
            min={PARAMETER_CONFIG.solarCapacity.min}
            max={PARAMETER_CONFIG.solarCapacity.max}
            step={PARAMETER_CONFIG.solarCapacity.step}
            value={parameters.solarCapacity}
            onChange={(e) => onParameterChange('solarCapacity', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                ((parameters.solarCapacity - PARAMETER_CONFIG.solarCapacity.min) /
                  (PARAMETER_CONFIG.solarCapacity.max - PARAMETER_CONFIG.solarCapacity.min)) * 100
              }%, #E5E7EB ${
                ((parameters.solarCapacity - PARAMETER_CONFIG.solarCapacity.min) /
                  (PARAMETER_CONFIG.solarCapacity.max - PARAMETER_CONFIG.solarCapacity.min)) * 100
              }%, #E5E7EB 100%)`
            }}
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.solarCapacity.description}</p>
        </div>
        
        {/* 蓄電池容量 */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.batteryCapacity.label}
            <span className="text-lg font-semibold text-blue-600">{parameters.batteryCapacity} kWh</span>
          </label>
          <input
            type="range"
            min={PARAMETER_CONFIG.batteryCapacity.min}
            max={PARAMETER_CONFIG.batteryCapacity.max}
            step={PARAMETER_CONFIG.batteryCapacity.step}
            value={parameters.batteryCapacity}
            onChange={(e) => onParameterChange('batteryCapacity', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                ((parameters.batteryCapacity - PARAMETER_CONFIG.batteryCapacity.min) /
                  (PARAMETER_CONFIG.batteryCapacity.max - PARAMETER_CONFIG.batteryCapacity.min)) * 100
              }%, #E5E7EB ${
                ((parameters.batteryCapacity - PARAMETER_CONFIG.batteryCapacity.min) /
                  (PARAMETER_CONFIG.batteryCapacity.max - PARAMETER_CONFIG.batteryCapacity.min)) * 100
              }%, #E5E7EB 100%)`
            }}
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.batteryCapacity.description}</p>
        </div>
      </div>
      
      {/* 電力使用設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">電力使用設定</h3>
        
        {/* 年間電力使用量 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.annualConsumption.label}
          </label>
          <input
            type="number"
            min={PARAMETER_CONFIG.annualConsumption.min}
            max={PARAMETER_CONFIG.annualConsumption.max}
            step={PARAMETER_CONFIG.annualConsumption.step}
            value={parameters.annualConsumption}
            onChange={(e) => onParameterChange('annualConsumption', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.annualConsumption.description}</p>
        </div>
        
        {/* 自家消費率 */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.selfConsumptionRate.label}
            <span className="text-lg font-semibold text-blue-600">{parameters.selfConsumptionRate}%</span>
          </label>
          <input
            type="range"
            min={PARAMETER_CONFIG.selfConsumptionRate.min}
            max={PARAMETER_CONFIG.selfConsumptionRate.max}
            step={PARAMETER_CONFIG.selfConsumptionRate.step}
            value={parameters.selfConsumptionRate}
            onChange={(e) => onParameterChange('selfConsumptionRate', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                ((parameters.selfConsumptionRate - PARAMETER_CONFIG.selfConsumptionRate.min) /
                  (PARAMETER_CONFIG.selfConsumptionRate.max - PARAMETER_CONFIG.selfConsumptionRate.min)) * 100
              }%, #E5E7EB ${
                ((parameters.selfConsumptionRate - PARAMETER_CONFIG.selfConsumptionRate.min) /
                  (PARAMETER_CONFIG.selfConsumptionRate.max - PARAMETER_CONFIG.selfConsumptionRate.min)) * 100
              }%, #E5E7EB 100%)`
            }}
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.selfConsumptionRate.description}</p>
        </div>
      </div>
      
      {/* 売電設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">売電設定</h3>
        
        {/* 売電有無 */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableFeedInTariff"
            checked={parameters.enableFeedInTariff}
            onChange={(e) => onParameterChange('enableFeedInTariff', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableFeedInTariff" className="text-sm font-medium text-gray-700">
            売電する
          </label>
        </div>
        
        {/* 売電単価 */}
        {parameters.enableFeedInTariff && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {PARAMETER_CONFIG.feedInTariffRate.label}
            </label>
            <input
              type="number"
              min={PARAMETER_CONFIG.feedInTariffRate.min}
              max={PARAMETER_CONFIG.feedInTariffRate.max}
              step={PARAMETER_CONFIG.feedInTariffRate.step}
              value={parameters.feedInTariffRate}
              onChange={(e) => onParameterChange('feedInTariffRate', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">{PARAMETER_CONFIG.feedInTariffRate.description}</p>
          </div>
        )}
      </div>
      
      {/* 補助金設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">補助金設定</h3>
        
        {/* 国の補助金 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.subsidyNational.label}
          </label>
          <input
            type="number"
            min={PARAMETER_CONFIG.subsidyNational.min}
            max={PARAMETER_CONFIG.subsidyNational.max}
            step={PARAMETER_CONFIG.subsidyNational.step}
            value={parameters.subsidyNational}
            onChange={(e) => onParameterChange('subsidyNational', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.subsidyNational.description}</p>
        </div>
        
        {/* 自治体補助金 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.subsidyLocal.label}
          </label>
          <input
            type="number"
            min={PARAMETER_CONFIG.subsidyLocal.min}
            max={PARAMETER_CONFIG.subsidyLocal.max}
            step={PARAMETER_CONFIG.subsidyLocal.step}
            value={parameters.subsidyLocal}
            onChange={(e) => onParameterChange('subsidyLocal', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.subsidyLocal.description}</p>
        </div>
      </div>
      
      {/* 電気料金設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">電気料金設定</h3>
        
        {/* 現在の電気料金 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.electricityBasePrice.label}
          </label>
          <input
            type="number"
            min={PARAMETER_CONFIG.electricityBasePrice.min}
            max={PARAMETER_CONFIG.electricityBasePrice.max}
            step={PARAMETER_CONFIG.electricityBasePrice.step}
            value={parameters.electricityBasePrice}
            onChange={(e) => onParameterChange('electricityBasePrice', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.electricityBasePrice.description}</p>
        </div>
        
        {/* 電気料金上昇率 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.electricityPriceIncreaseRate.label}
          </label>
          <input
            type="number"
            min={PARAMETER_CONFIG.electricityPriceIncreaseRate.min}
            max={PARAMETER_CONFIG.electricityPriceIncreaseRate.max}
            step={PARAMETER_CONFIG.electricityPriceIncreaseRate.step}
            value={parameters.electricityPriceIncreaseRate}
            onChange={(e) => onParameterChange('electricityPriceIncreaseRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.electricityPriceIncreaseRate.description}</p>
        </div>
      </div>
      
      {/* その他設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">その他設定</h3>
        
        {/* 割引率 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {PARAMETER_CONFIG.discountRate.label}
          </label>
          <input
            type="number"
            min={PARAMETER_CONFIG.discountRate.min}
            max={PARAMETER_CONFIG.discountRate.max}
            step={PARAMETER_CONFIG.discountRate.step}
            value={parameters.discountRate}
            onChange={(e) => onParameterChange('discountRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">{PARAMETER_CONFIG.discountRate.description}</p>
        </div>
      </div>
      
      {/* シミュレーション実行ボタン */}
      <button
        onClick={onSimulate}
        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-green-600 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        シミュレーション実行
      </button>
    </div>
  );
} 
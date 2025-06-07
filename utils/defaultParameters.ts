import { InputParameters } from '@/types';

export const DEFAULT_PARAMETERS: InputParameters = {
  // システム構成
  solarCapacity: 12, // kW
  batteryCapacity: 20, // kWh
  
  // 電力使用設定
  annualConsumption: 8000, // kWh
  selfConsumptionRate: 100, // %
  
  // 売電設定
  enableFeedInTariff: false,
  feedInTariffRate: 16, // 円/kWh
  
  // 補助金設定
  subsidyNational: 160, // 万円
  subsidyLocal: 30, // 万円
  
  // 電気料金設定
  electricityBasePrice: 40, // 円/kWh
  electricityPriceIncreaseRate: 3, // %/年
  
  // その他設定
  discountRate: 3, // %
};

export const PARAMETER_CONFIG = {
  solarCapacity: {
    label: "太陽光パネル容量(kW)",
    min: 3,
    max: 50,
    step: 0.5,
    description: "設置する太陽光パネルの総容量"
  },
  batteryCapacity: {
    label: "蓄電池容量(kWh)",
    min: 0,
    max: 50,
    step: 1,
    description: "蓄電池の容量（0の場合は蓄電池なし）"
  },
  annualConsumption: {
    label: "年間電力使用量(kWh)",
    min: 1000,
    max: 20000,
    step: 100,
    description: "家庭の年間電力使用量"
  },
  selfConsumptionRate: {
    label: "自家消費率(%)",
    min: 0,
    max: 200,
    step: 5,
    description: "100%超は電力使用量が発電量を上回ることを意味します"
  },
  feedInTariffRate: {
    label: "売電単価(円/kWh)",
    min: 5,
    max: 50,
    step: 1,
    description: "FIT期間中の売電価格"
  },
  subsidyNational: {
    label: "国の補助金(万円)",
    min: 0,
    max: 500,
    step: 10,
    description: "国からの補助金額"
  },
  subsidyLocal: {
    label: "自治体補助金(万円)",
    min: 0,
    max: 100,
    step: 5,
    description: "地方自治体からの補助金額"
  },
  electricityBasePrice: {
    label: "現在の電気料金(円/kWh)",
    min: 20,
    max: 60,
    step: 1,
    description: "現在の電気料金単価"
  },
  electricityPriceIncreaseRate: {
    label: "電気料金上昇率(%/年)",
    min: 0,
    max: 10,
    step: 0.5,
    description: "年間の電気料金上昇率"
  },
  discountRate: {
    label: "割引率(%)",
    min: 0,
    max: 10,
    step: 0.5,
    description: "NPV計算に使用する割引率"
  }
}; 
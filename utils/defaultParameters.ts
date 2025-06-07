import { InputParameters } from '@/types';

export const DEFAULT_PARAMETERS: InputParameters = {
  // システム構成
  solarCapacity: 10, // kW
  batteryCapacity: 0, // kWh
  
  // 電力使用設定
  annualConsumption: 4500, // kWh
  selfConsumptionRate: 100, // %
  
  // 売電設定
  enableFeedInTariff: false,
  feedInTariffRate: 16, // 円/kWh
  
  // 補助金設定
  subsidyNational: 0, // 万円
  subsidyLocal: 0, // 万円
  
  // 電気料金設定
  electricityBasePrice: 30, // 円/kWh
  electricityPriceIncreaseRate: 2, // %/年
  
  // その他設定
  discountRate: 3, // %
};

export const PARAMETER_CONFIG = {
  solarCapacity: {
    label: '太陽光パネル容量',
    description: '設置する太陽光パネルの総容量',
    min: 3,
    max: 50,
    step: 0.5,
  },
  batteryCapacity: {
    label: '蓄電池容量',
    description: '蓄電池を設置する場合の容量',
    min: 0,
    max: 50,
    step: 0.5,
  },
  annualConsumption: {
    label: '年間電力使用量',
    description: 'パネル容量から自動計算されます',
    min: 1000,
    max: 20000,
    step: 100,
  },
  selfConsumptionRate: {
    label: '電力使用率',
    description: '発電した電力のうち自家消費する割合（残りは売電または蓄電）',
    min: 0,
    max: 200,
    step: 1,
  },
  feedInTariffRate: {
    label: '売電単価',
    description: 'FIT制度による売電価格（10年間適用）',
    min: 0,
    max: 50,
    step: 1,
  },
  subsidyNational: {
    label: '国の補助金',
    description: '国から支給される補助金額',
    min: 0,
    max: 200,
    step: 1,
  },
  subsidyLocal: {
    label: '自治体の補助金',
    description: '地方自治体から支給される補助金額',
    min: 0,
    max: 200,
    step: 1,
  },
  electricityBasePrice: {
    label: '電気料金単価',
    description: '現在の電気料金単価',
    min: 20,
    max: 60,
    step: 1,
  },
  electricityPriceIncreaseRate: {
    label: '電気料金上昇率',
    description: '年間の電気料金の上昇率',
    min: 0,
    max: 10,
    step: 0.1,
  },
  discountRate: {
    label: '割引率',
    description: 'NPV計算に使用する年間割引率',
    min: 0,
    max: 10,
    step: 0.1,
  },
}; 
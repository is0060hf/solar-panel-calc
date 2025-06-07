import { InputParameters } from '@/types';

export const DEFAULT_PARAMETERS: InputParameters = {
  // システム構成
  solarCapacity: 12, // kW
  batteryCapacity: 20, // kWh
  
  // 電力使用設定
  annualConsumption: 4500, // kWh
  selfConsumptionRate: 80, // %
  
  // 売電設定
  enableFeedInTariff: true,
  feedInTariffRate: 16, // 円/kWh
  
  // 補助金設定
  subsidyNational: 100,  // 100万円
  subsidyLocal: 50,      // 50万円
  
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
    description: 'パネル容量から自動推定されます',
    min: 1000,
    max: 20000,
    step: 100,
  },
  selfConsumptionRate: {
    label: '自家消費優先率',
    description: '発電した電力を自家消費に優先的に回す割合（0%=全量売電、100%=自家消費優先）',
    min: 0,
    max: 100,
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
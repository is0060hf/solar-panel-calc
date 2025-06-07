// 入力パラメータの型定義
export interface InputParameters {
  // システム構成
  solarCapacity: number; // kW
  batteryCapacity: number; // kWh
  
  // 電力使用設定
  annualConsumption: number; // kWh
  selfConsumptionRate: number; // %
  
  // 売電設定
  enableFeedInTariff: boolean;
  feedInTariffRate: number; // 円/kWh
  
  // 補助金設定
  subsidyNational: number; // 万円
  subsidyLocal: number; // 万円
  
  // 電気料金設定
  electricityBasePrice: number; // 円/kWh
  electricityPriceIncreaseRate: number; // %/年
  
  // その他設定
  discountRate: number; // %
}

// 年次データの型定義
export interface YearlyData {
  year: number;
  generation: number; // 発電量(kWh)
  selfConsumed: number; // 自家消費量(kWh)
  gridPurchase: number; // 買電量(kWh)
  feedIn: number; // 売電量(kWh)
  electricityPrice: number; // 電気料金単価(円/kWh)
  feedInRevenue: number; // 売電収入(円)
  savingsFromSelfConsumption: number; // 自家消費による節約額(円)
  gridPurchaseCost: number; // 買電費用(円)
  drRevenue: number; // DR収益(円)
  maintenanceCost: number; // メンテナンス費(円)
  insuranceCost: number; // 保険料(円)
  replacementCost: number; // 交換費用(円)
  replacementItem: string; // 交換項目
  annualCashflow: number; // 年間キャッシュフロー(円)
  cumulativeCashflow: number; // 累積キャッシュフロー(円)
  discountedCashflow: number; // 割引後キャッシュフロー(円)
  npv: number; // 正味現在価値(円)
}

// シミュレーション結果の型定義
export interface SimulationResult {
  yearlyData: YearlyData[];
  paybackPeriod: number; // 年
  totalCashflow: number; // 円
  npv: number; // 円
  irr: number; // %
  initialCost: number; // 円
} 
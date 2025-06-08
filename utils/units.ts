/**
 * 単位管理を一元化するユーティリティ
 */

export type UnitType = {
  suffix: string;
  description: string;
};

export const UNITS: Record<string, UnitType> = {
  // 容量・電力量
  solarCapacity: { suffix: 'kW', description: '太陽光パネルの発電容量' },
  batteryCapacity: { suffix: 'kWh', description: '蓄電池の容量' },
  monthlyConsumption: { suffix: 'kWh/月', description: '月間の電力使用量' },
  annualConsumption: { suffix: 'kWh', description: '年間の電力使用量' },
  
  // 費用
  manualSolarCost: { suffix: '万円/kW', description: '太陽光パネルのkWあたりの費用' },
  manualBatteryCost: { suffix: '万円/kWh', description: '蓄電池のkWhあたりの費用' },
  manualInstallationCost: { suffix: '万円', description: '設置工事にかかる費用' },
  subsidyNational: { suffix: '万円', description: '国からの補助金額' },
  subsidyLocal: { suffix: '万円', description: '地方自治体からの補助金額' },
  
  // 料金・レート
  electricityBasePrice: { suffix: '円/kWh', description: '電気料金の基本単価' },
  feedInTariffRate: { suffix: '円/kWh', description: '余剰電力の売電単価' },
  
  // パーセンテージ
  selfConsumptionRate: { suffix: '%', description: '発電量のうち自家消費する割合' },
  electricityPriceIncreaseRate: { suffix: '%/年', description: '電気料金の年間上昇率' },
  discountRate: { suffix: '%', description: 'NPV計算で使用する割引率' },
  
  // その他
  default: { suffix: '', description: '' }
};

/**
 * パラメータキーから単位の接尾辞を取得
 */
export function getUnitSuffix(key: string): string {
  // Rate で終わるキーはパーセンテージ
  if (key.includes('Rate')) {
    return '%';
  }
  
  return UNITS[key]?.suffix || UNITS.default.suffix;
}

/**
 * パラメータキーから説明文を取得
 */
export function getUnitDescription(key: string): string {
  return UNITS[key]?.description || UNITS.default.description;
}

/**
 * 値と単位を組み合わせて表示用文字列を生成
 */
export function formatValueWithUnit(value: number, key: string): string {
  const suffix = getUnitSuffix(key);
  return suffix ? `${value.toLocaleString()} ${suffix}` : value.toLocaleString();
}

/**
 * 金額を万円単位でフォーマット
 */
export function formatAmountInManYen(amount: number): string {
  return `${amount.toLocaleString()}万円`;
}

/**
 * kWh単位の電力量をフォーマット
 */
export function formatEnergyInKwh(energy: number): string {
  return `${energy.toLocaleString()} kWh`;
}

/**
 * パーセンテージをフォーマット
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  return `${value.toFixed(decimalPlaces)}%`;
} 
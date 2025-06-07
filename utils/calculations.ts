import { InputParameters, YearlyData, SimulationResult } from '@/types';

// 定数定義
const CONSTANTS = {
  solarCostPerKW: 260000, // 26万円/kW
  batteryCostPerKWh: 200000, // 20万円/kWh
  installationCost: 880000, // 工事費等固定費
  generationPerKW: 1000, // kWh/kW/年
  degradationRate: 0.005, // 年0.5%劣化
  batteryEfficiency: 0.9, // 蓄電池効率90%
  drRevenuePerUnit: 250, // DR収益 2,500円/10kWh/年
  maintenanceRateOfInitialCost: 0.01, // 初期費用の1%/年
  insuranceRateOfInitialCost: 0.005, // 初期費用の0.5%/年
  fitPeriod: 10, // FIT期間10年
  postFitRate: 0.5, // FIT後の売電価格比率
  simulationYears: 50, // シミュレーション期間
};

// 交換スケジュール
const REPLACEMENT_SCHEDULE = {
  smartMeter: { interval: 10, baseCost: 80000 },
  battery: { interval: 12, baseCostPerKWh: 160000 },
  inverter: { interval: 15, baseCostPerKW: 40000 },
  panels: { interval: 25, baseCostPerKW: 195000 }
};

// 初期コスト計算
export function calculateInitialCost(solarCapacity: number, batteryCapacity: number): number {
  return (
    solarCapacity * CONSTANTS.solarCostPerKW +
    batteryCapacity * CONSTANTS.batteryCostPerKWh +
    CONSTANTS.installationCost
  );
}

// 年間発電量計算
export function calculateAnnualGeneration(solarCapacity: number, year: number): number {
  return solarCapacity * CONSTANTS.generationPerKW * Math.pow(1 - CONSTANTS.degradationRate, year - 1);
}

// エネルギーフロー計算
export function calculateEnergyFlow(
  generation: number,
  consumption: number,
  selfConsumptionRate: number,
  batteryCapacity: number
): {
  selfConsumed: number;
  gridPurchase: number;
  surplus: number;
} {
  // 実際の年間消費量
  const actualConsumption = consumption;
  
  // 発電量のうち自家消費に回す割合
  const targetSelfConsumption = generation * (selfConsumptionRate / 100);
  
  // 蓄電池を考慮した実際の自家消費量
  // 蓄電池がある場合は、日中の余剰電力を夜間に使用できる
  let maxSelfConsumption = targetSelfConsumption;
  
  if (batteryCapacity > 0) {
    // 蓄電池の年間充放電可能量を考慮
    // 1日1サイクルとして、年間365サイクル × 効率90%
    const batteryAnnualCapacity = batteryCapacity * 365 * CONSTANTS.batteryEfficiency;
    maxSelfConsumption = Math.min(generation, targetSelfConsumption + batteryAnnualCapacity);
  }
  
  // 実際の自家消費量（消費量と自家消費可能量の小さい方）
  const selfConsumed = Math.min(maxSelfConsumption, actualConsumption);
  
  // 不足分は買電
  const gridPurchase = Math.max(0, actualConsumption - selfConsumed);
  
  // 余剰電力（売電可能量）
  const surplus = Math.max(0, generation - selfConsumed);
  
  return {
    selfConsumed,
    gridPurchase,
    surplus
  };
}

// 交換費用計算
export function getReplacementCost(
  item: string,
  year: number,
  solarCapacity: number,
  batteryCapacity: number
): { cost: number; item: string } {
  const priceReductionRate = 0.02; // 年2%の価格低下
  const reductionFactor = Math.pow(1 - priceReductionRate, year);
  let cost = 0;
  let replacementItem = '';
  
  // スマートメーター
  if (year % REPLACEMENT_SCHEDULE.smartMeter.interval === 0) {
    cost += REPLACEMENT_SCHEDULE.smartMeter.baseCost * reductionFactor;
    replacementItem = 'スマートメーター';
  }
  
  // 蓄電池
  if (batteryCapacity > 0 && year % REPLACEMENT_SCHEDULE.battery.interval === 0) {
    cost += batteryCapacity * REPLACEMENT_SCHEDULE.battery.baseCostPerKWh * reductionFactor;
    replacementItem += (replacementItem ? '、' : '') + '蓄電池';
  }
  
  // インバーター
  if (year % REPLACEMENT_SCHEDULE.inverter.interval === 0) {
    cost += solarCapacity * REPLACEMENT_SCHEDULE.inverter.baseCostPerKW * reductionFactor;
    replacementItem += (replacementItem ? '、' : '') + 'インバーター';
  }
  
  // パネル
  if (year % REPLACEMENT_SCHEDULE.panels.interval === 0 && year > 0) {
    cost += solarCapacity * REPLACEMENT_SCHEDULE.panels.baseCostPerKW * reductionFactor;
    replacementItem += (replacementItem ? '、' : '') + '太陽光パネル';
  }
  
  return { cost, item: replacementItem };
}

// DR収益計算
export function calculateDRRevenue(batteryCapacity: number): number {
  return batteryCapacity * CONSTANTS.drRevenuePerUnit;
}

// 投資回収期間計算
export function calculatePaybackPeriod(yearlyData: YearlyData[]): number {
  for (let i = 0; i < yearlyData.length; i++) {
    if (yearlyData[i].cumulativeCashflow >= 0) {
      // 線形補間で正確な回収期間を計算
      if (i === 0) return 1;
      const prevCF = yearlyData[i - 1].cumulativeCashflow;
      const currentCF = yearlyData[i].cumulativeCashflow;
      const yearFraction = -prevCF / (currentCF - prevCF);
      return i + yearFraction;
    }
  }
  return yearlyData.length; // 回収できない場合
}

// IRR計算（簡易版）
export function calculateIRR(cashflows: number[], initialCost: number): number {
  // Newton-Raphson法による近似
  let rate = 0.1; // 初期値10%
  const maxIterations = 100;
  const tolerance = 0.00001;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialCost;
    let dnpv = 0;
    
    for (let j = 0; j < cashflows.length; j++) {
      const discount = Math.pow(1 + rate, j + 1);
      npv += cashflows[j] / discount;
      dnpv -= (j + 1) * cashflows[j] / Math.pow(1 + rate, j + 2);
    }
    
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // %で返す
    }
    rate = newRate;
  }
  
  return rate * 100;
}

// メインシミュレーション関数
export function runSimulation(params: InputParameters): SimulationResult {
  const yearlyData: YearlyData[] = [];
  const initialCost = calculateInitialCost(params.solarCapacity, params.batteryCapacity);
  const netInitialCost = initialCost - (params.subsidyNational + params.subsidyLocal) * 10000;
  
  let cumulativeCashflow = -netInitialCost;
  let npv = -netInitialCost;
  const annualCashflows: number[] = [];
  
  for (let year = 1; year <= CONSTANTS.simulationYears; year++) {
    // 発電量計算
    const generation = calculateAnnualGeneration(params.solarCapacity, year);
    
    // エネルギーフロー計算
    const energyFlow = calculateEnergyFlow(
      generation,
      params.annualConsumption,
      params.selfConsumptionRate,
      params.batteryCapacity
    );
    
    // 電気料金計算
    const electricityPrice = params.electricityBasePrice * 
      Math.pow(1 + params.electricityPriceIncreaseRate / 100, year - 1);
    
    // 売電収入計算
    let feedInRevenue = 0;
    if (params.enableFeedInTariff && energyFlow.surplus > 0) {
      const feedInRate = year <= CONSTANTS.fitPeriod ? 
        params.feedInTariffRate : 
        params.feedInTariffRate * CONSTANTS.postFitRate;
      feedInRevenue = energyFlow.surplus * feedInRate;
    }
    
    // 自家消費による節約額
    const savingsFromSelfConsumption = energyFlow.selfConsumed * electricityPrice;
    
    // 買電費用
    const gridPurchaseCost = energyFlow.gridPurchase * electricityPrice;
    
    // DR収益
    const drRevenue = params.batteryCapacity > 0 ? calculateDRRevenue(params.batteryCapacity) : 0;
    
    // メンテナンス費・保険料
    const maintenanceCost = initialCost * CONSTANTS.maintenanceRateOfInitialCost;
    const insuranceCost = initialCost * CONSTANTS.insuranceRateOfInitialCost;
    
    // 交換費用
    const replacement = getReplacementCost(
      '',
      year,
      params.solarCapacity,
      params.batteryCapacity
    );
    
    // 年間キャッシュフロー計算
    const annualCashflow = 
      feedInRevenue + 
      savingsFromSelfConsumption + 
      drRevenue - 
      gridPurchaseCost -
      maintenanceCost - 
      insuranceCost - 
      replacement.cost;
    
    annualCashflows.push(annualCashflow);
    cumulativeCashflow += annualCashflow;
    
    // NPV計算
    const discountFactor = Math.pow(1 + params.discountRate / 100, year);
    const discountedCashflow = annualCashflow / discountFactor;
    npv += discountedCashflow;
    
    yearlyData.push({
      year,
      generation,
      selfConsumed: energyFlow.selfConsumed,
      gridPurchase: energyFlow.gridPurchase,
      feedIn: energyFlow.surplus,
      electricityPrice,
      feedInRevenue,
      savingsFromSelfConsumption,
      gridPurchaseCost,
      drRevenue,
      maintenanceCost,
      insuranceCost,
      replacementCost: replacement.cost,
      replacementItem: replacement.item,
      annualCashflow,
      cumulativeCashflow,
      discountedCashflow,
      npv
    });
  }
  
  const paybackPeriod = calculatePaybackPeriod(yearlyData);
  const irr = calculateIRR(annualCashflows, netInitialCost);
  
  return {
    yearlyData,
    paybackPeriod,
    totalCashflow: cumulativeCashflow,
    npv: yearlyData[yearlyData.length - 1].npv,
    irr,
    initialCost: netInitialCost
  };
} 
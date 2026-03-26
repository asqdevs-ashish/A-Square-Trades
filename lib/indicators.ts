import type { CandleData } from '@/types/trading';

export function calculateSMA(data: CandleData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  
  return result;
}

export function calculateEMA(data: CandleData[], period: number): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let prevEMA = sum / period;
  result.push({ time: data[period - 1].time, value: prevEMA });
  
  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    const ema = (data[i].close - prevEMA) * multiplier + prevEMA;
    result.push({ time: data[i].time, value: ema });
    prevEMA = ema;
  }
  
  return result;
}

export function calculateRSI(data: CandleData[], period: number = 14): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // First RSI value
  let rs = avgGain / (avgLoss || 0.001);
  let rsi = 100 - (100 / (1 + rs));
  result.push({ time: data[period].time, value: rsi });
  
  // Calculate subsequent RSI values using smoothing
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rs = avgGain / (avgLoss || 0.001);
    rsi = 100 - (100 / (1 + rs));
    result.push({ time: data[i + 1].time, value: rsi });
  }
  
  return result;
}

export function calculateMACD(
  data: CandleData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { time: number; macd: number; signal: number; histogram: number }[] {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);
  
  // Align the arrays
  const startIndex = slowPeriod - fastPeriod;
  const macdLine: { time: number; value: number }[] = [];
  
  for (let i = 0; i < slowEMA.length; i++) {
    const fastIndex = i + startIndex;
    if (fastIndex >= 0 && fastIndex < fastEMA.length) {
      macdLine.push({
        time: slowEMA[i].time,
        value: fastEMA[fastIndex].value - slowEMA[i].value,
      });
    }
  }
  
  // Calculate signal line (EMA of MACD)
  const signalMultiplier = 2 / (signalPeriod + 1);
  let signalSum = 0;
  for (let i = 0; i < signalPeriod && i < macdLine.length; i++) {
    signalSum += macdLine[i].value;
  }
  let prevSignal = signalSum / signalPeriod;
  
  const result: { time: number; macd: number; signal: number; histogram: number }[] = [];
  
  for (let i = signalPeriod - 1; i < macdLine.length; i++) {
    const signal = i === signalPeriod - 1
      ? prevSignal
      : (macdLine[i].value - prevSignal) * signalMultiplier + prevSignal;
    
    result.push({
      time: macdLine[i].time,
      macd: macdLine[i].value,
      signal,
      histogram: macdLine[i].value - signal,
    });
    
    prevSignal = signal;
  }
  
  return result;
}

export function calculateBollingerBands(
  data: CandleData[],
  period: number = 20,
  stdDev: number = 2
): { time: number; middle: number; upper: number; lower: number }[] {
  const sma = calculateSMA(data, period);
  const result: { time: number; middle: number; upper: number; lower: number }[] = [];
  
  for (let i = 0; i < sma.length; i++) {
    const dataIndex = i + period - 1;
    let sumSquares = 0;
    
    for (let j = 0; j < period; j++) {
      const diff = data[dataIndex - j].close - sma[i].value;
      sumSquares += diff * diff;
    }
    
    const standardDeviation = Math.sqrt(sumSquares / period);
    
    result.push({
      time: sma[i].time,
      middle: sma[i].value,
      upper: sma[i].value + standardDeviation * stdDev,
      lower: sma[i].value - standardDeviation * stdDev,
    });
  }
  
  return result;
}

export function calculateVWAP(data: CandleData[]): { time: number; value: number }[] {
  const result: { time: number; value: number }[] = [];
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  
  for (const candle of data) {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    const volume = candle.volume || 1;
    
    cumulativeTPV += typicalPrice * volume;
    cumulativeVolume += volume;
    
    result.push({
      time: candle.time,
      value: cumulativeTPV / cumulativeVolume,
    });
  }
  
  return result;
}

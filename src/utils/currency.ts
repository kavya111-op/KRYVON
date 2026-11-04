import { CurrencyCode } from '../types';

// Exchange rates normalized against INR (Base currency)
// 1 USD ~ 86.5 INR; 1 EUR ~ 93.5 INR
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 1 / 86.5,
  EUR: 1 / 93.5,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

export function convertFromINR(amountINR: number, targetCurrency: CurrencyCode): number {
  if (targetCurrency === 'INR') return amountINR;
  const converted = amountINR * EXCHANGE_RATES[targetCurrency];
  return Math.round(converted * 100) / 100;
}

export function convertToINR(amount: number, sourceCurrency: CurrencyCode): number {
  if (sourceCurrency === 'INR') return amount;
  return Math.round(amount / EXCHANGE_RATES[sourceCurrency]);
}

export function formatPrice(amountINR: number, currency: CurrencyCode = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const converted = convertFromINR(amountINR, currency);

  if (currency === 'INR') {
    return `${symbol}${converted.toLocaleString('en-IN')}`;
  }
  return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

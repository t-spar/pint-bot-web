import Fraction from 'fraction.js';

export function parseAmount(input: string): number {
  try {
    const value = new Fraction(input).valueOf();
    return isFinite(value) ? value : 0;
  } catch (e) {
    console.warn("Invalid amount:", input, e);
    return 0;
  }
}
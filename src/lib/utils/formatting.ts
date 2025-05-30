/**
 * Format a fraction string into a simplified, mixed number.
 *
 * Handles improper fractions, simplifies to lowest terms,
 * and gracefully skips invalid or non-fraction inputs.
 */
export function formatMixed(fraction: string): string {
  if (!fraction.includes("/")) return fraction;

  const [numStr, denStr] = fraction.split("/");
  const num = parseInt(numStr, 10);
  const den = parseInt(denStr, 10);

  if (isNaN(num) || isNaN(den) || den === 0) return fraction;

  // Simplify the fraction
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(num, den);
  const simplifiedNum = num / divisor;
  const simplifiedDen = den / divisor;

  const whole = Math.floor(simplifiedNum / simplifiedDen);
  const rem = simplifiedNum % simplifiedDen;

  if (rem === 0) return String(whole);
  if (whole === 0) return `${rem}/${simplifiedDen}`;
  return `${whole} ${rem}/${simplifiedDen}`;
}

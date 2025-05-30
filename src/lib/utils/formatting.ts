/**
 * Turn a string like "91/6" into "15 1/6",
 * "7/3" into "2 1/3", "4/2" into "2", "3/4" stays "3/4", and
 * plain numbers pass through unchanged.
 */
export function formatMixed(fraction: string): string {
  // if it’s not a fraction, just return it
  if (!fraction.includes("/")) return fraction;

  const [numStr, denStr] = fraction.split("/");
  const num = parseInt(numStr, 10);
  const den = parseInt(denStr, 10);

  if (isNaN(num) || isNaN(den) || den === 0) return fraction;

  const whole = Math.floor(num / den);
  const rem = num % den;

  if (rem === 0) {
    // exact division
    return String(whole);
  }
  if (whole === 0) {
    // proper fraction
    return `${rem}/${den}`;
  }
  // mixed number
  return `${whole} ${rem}/${den}`;
}

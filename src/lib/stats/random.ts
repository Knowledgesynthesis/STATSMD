/** Seedable PRNG (mulberry32) so simulations are reproducible. */
export type RNG = () => number;

export function createRng(seed = 1): RNG {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randomSeed = () => Math.floor(Math.random() * 2 ** 31);

/** Standard normal via Box–Muller. */
export function rnorm(rng: RNG, mu = 0, sd = 1): number {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const rnormArray = (rng: RNG, n: number, mu = 0, sd = 1) => Array.from({ length: n }, () => rnorm(rng, mu, sd));

/** Log-normal (right-skewed) with given log-scale parameters. */
export const rlnorm = (rng: RNG, mu = 0, sigma = 1) => Math.exp(rnorm(rng, mu, sigma));

export const rexp = (rng: RNG, rate = 1) => -Math.log(1 - rng()) / rate;

export function rbinom(rng: RNG, n: number, p: number): number {
  let k = 0;
  for (let i = 0; i < n; i++) if (rng() < p) k++;
  return k;
}

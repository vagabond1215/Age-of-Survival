export interface RNG {
  seed: number;
  next(): number;
  clone(): RNG;
}

export function createRng(seed: number): RNG {
  let current = seed >>> 0;
  return {
    get seed() {
      return current;
    },
    next() {
      current = (current * 1664525 + 1013904223) >>> 0;
      return current / 0xffffffff;
    },
    clone() {
      return createRng(current);
    }
  };
}

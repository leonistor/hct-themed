export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay?: number,
): (...args: A) => void;

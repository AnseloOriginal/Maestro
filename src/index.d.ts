export {};

declare global {
  interface Window {
    runtime: {
      init: () => Promise<0 | 1 | 2>;
    };
  }
}
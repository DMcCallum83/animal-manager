import "@testing-library/jest-dom";

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid-123",
  },
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

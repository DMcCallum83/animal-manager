import "@testing-library/jest-dom";

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "test-uuid-123",
  },
});

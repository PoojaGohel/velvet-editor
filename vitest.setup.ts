import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('dark') ? false : true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

// contenteditable APIs used by the editor
Object.defineProperty(document, 'execCommand', {
  value: () => true,
  writable: true,
});

Object.defineProperty(document, 'queryCommandState', {
  value: () => false,
  writable: true,
});

Object.defineProperty(document, 'queryCommandValue', {
  value: () => '',
  writable: true,
});

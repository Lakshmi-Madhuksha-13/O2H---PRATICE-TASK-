import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically clean up DOM nodes after each test case
afterEach(() => {
  cleanup();
});

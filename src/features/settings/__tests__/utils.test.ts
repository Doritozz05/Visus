import { describe, it, expect } from 'vitest';
import { scopeCss } from '../components/ThemeEditor/utils';

describe('scopeCss', () => {
  it('should scope simple CSS', () => {
    const css = 'body { color: red; }';
    const scoped = scopeCss(css, '.root');
    expect(scoped).toBe('.root body { color: red; }');
  });

  it('should reject CSS with < or > to prevent injection', () => {
    const css = 'body { color: red; } </style><script>alert(1)</script>';
    const scoped = scopeCss(css, '.root');
    expect(scoped).toBe('');
  });
});

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const buildDir = path.resolve('docs');
const indexPath = path.join(buildDir, 'index.html');

const ensureBuildIsFresh = () => {
  execSync('npm run build', { stdio: 'inherit' });
};

describe('production build output', () => {
  it('references bundled assets instead of source files', () => {
    ensureBuildIsFresh();

    expect(existsSync(indexPath)).toBe(true);
    const html = readFileSync(indexPath, 'utf8');

    const scriptMatch = html.match(/<script[^>]*src="([^"]+)"/);
    expect(scriptMatch?.[1]).toBeDefined();

    const scriptSrc = scriptMatch?.[1] ?? '';
    expect(scriptSrc.startsWith('./assets/')).toBe(true);
    expect(scriptSrc.includes('/src/')).toBe(false);

    const scriptPath = path.resolve(buildDir, scriptSrc.replace(/^\.\//, ''));
    expect(existsSync(scriptPath)).toBe(true);
  });

  it('ships the compiled stylesheet next to the bundle', () => {
    ensureBuildIsFresh();

    const html = readFileSync(indexPath, 'utf8');
    const cssMatch = html.match(/<link[^>]*href="([^"]+\.css)"/);
    expect(cssMatch?.[1]).toBeDefined();

    const cssHref = cssMatch?.[1] ?? '';
    expect(cssHref.startsWith('./assets/')).toBe(true);

    const cssPath = path.resolve(buildDir, cssHref.replace(/^\.\//, ''));
    expect(existsSync(cssPath)).toBe(true);
  });
});

import { defineConfig } from 'tsup';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8')) as { version: string };

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  tsconfig: 'tsconfig.lib.json',
  clean: true,
  external: [
    'react',
    'react-dom',
    'lucide-react',
    'emoji-picker-react',
  ],
  define: {
    __EDITOR_VERSION__: JSON.stringify(pkg.version),
  },
  minify: true,
  treeshake: true,
  sourcemap: true,
});

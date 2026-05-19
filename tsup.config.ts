import { defineConfig } from 'tsup';

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
    'clsx',
    'tailwind-merge'
  ],
  minify: true,
  treeshake: true,
  sourcemap: false,
});

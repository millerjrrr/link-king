import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: './public/js/index.mjs',
  output: {
    file: './public/js/bundle.js',
    format: 'es', // You can change the output format if needed
    sourcemap: true,
  },
  plugins: [
    nodeResolve(), // Resolve node_modules
    commonjs(), // Convert CommonJS modules to ES6
    json(),
    terser(), // Minify the output (optional)
  ],
  watch: {
    clearScreen: false, // Keep the console output from being cleared on every rebuild
  },
};

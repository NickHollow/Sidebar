import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';


const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/Sidebar.js',
		output: {
			format: 'cjs',
			file: pkg.module,
		},
		plugins: [							
			resolve({ jsnext: true, main: true, module: false, browser: false }),
			commonjs(),
			css({minified: false, dest: 'dist/scanex-sidebar.css'}),			
			babel(),
		]
	},
	{
		input: 'index.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'sidebarControl',
			file: pkg.browser,
		},
		plugins: [			
			resolve({ jsnext: true, main: true, module: false, browser: false }),
			commonjs(),
			css({minified: false, dest: 'public/scanex-sidebar.css'}),
			babel(),
			production && terser(),
		]
	}
];

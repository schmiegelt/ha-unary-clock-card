import  typescript  from 'rollup-plugin-typescript2';
import  nodeResolve  from '@rollup/plugin-node-resolve';
import  commonjs  from '@rollup/plugin-commonjs';
import  terser from '@rollup/plugin-terser';
import  serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';

const dev = process.env.ROLLUP_WATCH;

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  typescript(),
  commonjs(),
  nodeResolve(),
  copy({
    targets: [
      { src: 'src/index.html', dest: 'dist' },
    ]
  }),
  dev && serve(serveopts),
  !dev && terser(),
];

export default [
  {
    input: 'src/UnaryClock.ts',
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [...plugins],
  },
];
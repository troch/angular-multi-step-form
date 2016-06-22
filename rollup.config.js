import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    babelrc: false
};

const dest = {
    umd:  `dist/umd/angular-multi-step-form${ compress ? '.min' : '' }.js`,
    iife: `dist/browser/angular-multi-step-form${ compress ? '.min' : '' }.js`
}[format];

export default {
    entry: 'src/index.js',
    format,
    plugins: [ babel(babelOptions) ].concat(compress ? uglify() : []),
    moduleName: 'angularMultiStepForm',
    moduleId: 'angularMultiStepForm',
    dest,
    external: [ 'angular' ],
    globals: { 'angular': 'angular' }
};

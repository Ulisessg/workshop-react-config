const { join } = require('path');
const { DllPlugin } = require('webpack');
const production_dependencies = require('./package.json').dependencies;

module.exports = {
    mode: 'production',
    entry: {
        modules: Object.keys(production_dependencies),
    },
    output: {
        path: join(__dirname, 'dist', 'auto'),
        filename: '[name].dll.js',
        library: '[name]',
    },
    plugins: [
        new DllPlugin({
            path: join(__dirname, 'dist', '[name]-manifest.json'),
            name: '[name]',
            context: __dirname,
        }),
    ],
};

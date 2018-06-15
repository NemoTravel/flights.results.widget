const path = require('path');
const webpack = require('webpack');
const Extract = require('mini-css-extract-plugin');
const packageJSON = require('./package.json');
const moduleName = 'flights.results.widget';

// For DEV mode prepend "NODE_ENV=dev" before "webpack" command.
// terminal: NODE_ENV=dev webpack
/* global process */
const isDevMode = process.env.NODE_ENV === 'dev';

// Streaming compiled styles to the separate ".css" file.
const extractSass = new Extract({
    filename: `${moduleName}.min.css`
});

const config = {
    // Root folder for Webpack.
    context: __dirname,

    // Build mode.
	mode: isDevMode ? 'development' : 'production',

	performance: {
		hints: false
	},

	// Entry file.
    entry: './src/main.tsx',

    // Watch for changes in file.
    watch: isDevMode,

    watchOptions: {
        // Do not watch for changes in "node_modules".
        ignored: /node_modules/,

        // Webpack will wait for 300ms before building bundles.
        aggregateTimeout: 300
    },

    optimization: {
		minimize: !isDevMode,
		noEmitOnErrors: true
	},

	output: {
        // Folder to store generated files.
        path: path.resolve(__dirname, 'dist'),

        // Path for loading assets.
        publicPath: '/dist/',

        // Output file name.
        filename: `${moduleName}.min.js`,
        library: 'FlightsResultsWidget'
    },

    resolve: {
        // Where to look for modules.
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'dist')
        ],
        extensions: ['.ts', '.js', '.json', '.jsx', '.tsx', '.css', '.scss']
    },

    module: {
        // List of loaders ("handlers") for different types of files.
        rules: [
            // Handling ".tsx" and ".ts" files in "/src" folder.
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                include: [
                    path.resolve(__dirname, 'src')
                ],

                // Do not parse these folders.
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            },

            // Handling ".scss" files, converting them to ".css", appending vendor prefixes.
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'src/css')
                ],
                use: [
					Extract.loader,
					// Allows to import CSS through JavaScript.
					{
						loader: 'css-loader',
						options: {
							minimize: !isDevMode
						}
					},
					'resolve-url-loader', // Resolving relative URL in CSS code.
					'postcss-loader', // Using autoprefixe plugin.
					'sass-loader' // Compiles Sass to CSS.
                ],
            },

            // Handling SVG images.
            {
                test: /\.svg$/,
                loader: 'url-loader',
                include: [
                    path.resolve(__dirname, 'src/css/images')
                ],
                options: {
                    publicPath: '',
                    outputPath: '',
                    name: '/[name].[ext]'
                }
            }
        ]
    },

    plugins: [
        extractSass,
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en/)
    ]
};

if (!isDevMode) {
    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
}

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(isDevMode ? 'development' : 'production'),
            VERSION: JSON.stringify(packageJSON.version)
        }
    })
);

module.exports = config;

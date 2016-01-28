module.exports = {
    entry: "./src/spec.js",
    output: {
        path: __dirname + "/build",
        filename: "spec.js",
        libraryTarget: "commonjs2",
        publicPath: "/build"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};

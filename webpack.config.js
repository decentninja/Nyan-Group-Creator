module.exports = {
    entry: "./src/app.jsx",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js",
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

var path = require('path');

module.exports= {
    entry: path.resolve(__dirname, 'client/main.js'),
    output: {
        path: path.resolve(__dirname, 'public/js/build'),
        publicPath:'/js/build/',
        filename: 'bundle.js'
        /*,libraryTarget: 'var',
        library: 'ReactRenderers'*/
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.jsx?$/, loader: 'babel' }
        ]
    }

};
var path = require('path');
//var webpack = require('webpack')
//var ignore = new webpack.IgnorePlugin(/^(shortid|mongoose|react|request-promise|co|winston)$/)

module.exports= {
    entry: path.resolve(__dirname, 'client/main.js'),
    output: {
        path: path.resolve(__dirname, 'public/js/build'),
        publicPath:'/js/build/',
        filename: 'bundle.js'
        ,libraryTarget: 'var',
        library: 'ReactRenderers'
    },
    //plugins: [ignore],
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.jsx?$/, exclude: /node_modules/,loader: 'babel' }
            
        ]
    }

};
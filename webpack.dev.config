import path from 'path';
import webpack  from 'webpack';

module.exports= {
    entry:[
    'webpack-hot-middleware/client',
    path.resolve(__dirname, 'client/main.js')],
    output: {
        path: "/", //in memory build in dev environment
        publicPath:'/js/build/',
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
    loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
        { test: /\.jsx?$/, loader: 'babel' }
    ]
    },
    devtool: '#source-map',
    target: 'web'
};
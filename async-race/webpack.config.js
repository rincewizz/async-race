const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge');

const baseConfig = module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  optimization: {
    usedExports: true
  },
  entry: './index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    clean: true,
    // assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
        // {
        //   test: /\.(png|gif|jpe?g|svg)$/i,
        //   type: 'asset/resource',
        //   generator: {
        //     filename: 'assets/img/[hash][ext][query]'
        //   }
        // },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            process.env.NODE_ENV !== 'production'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.json/,
          type: 'asset/resource',
          generator: {
            filename: 'products/[name][ext]',
          },
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: './assets/img', to: 'assets/img' }] }), 
    new ESLintPlugin({
      extensions: ['.ts', '.js'],
      exclude: 'node_modules'
    }),
  ],
  };

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};

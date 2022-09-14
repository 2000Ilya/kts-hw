const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");
const publicPath = path.resolve(__dirname, "public");

const isProd = process.env.NODE_ENV === "production";

const getSettingsForStyles = (withModules = false) => {
  return [
    MiniCssExtractPlugin.loader,
    !withModules
      ? "css-loader"
      : {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: !isProd
                ? "[path][name]__[local]"
                : "[hash:base64]",
            },
          },
        },
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: ["autoprefixer"] } },
    },
    "sass-loader",
  ];
};

module.exports = {
  entry: path.join(srcPath, "index.tsx"),
  target: !isProd ? "web" : "browserslist",
  devtool: isProd ? "hidden-source-map" : "eval-source-map",
  output: {
    path: buildPath,
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(publicPath, "index.html"),
    }),
    !isProd && new ReactRefreshPlugin(),
    new MiniCssExtractPlugin({ filename: "[name]-[hash].css" }),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.s?css$/,
        exclude: /\.modules\.s?css$/,
        use: getSettingsForStyles(false),
      },
      {
        test: /\.modules\.s?css$/,
        use: getSettingsForStyles(true),
      },
      {
        test: /\.([jt])sx?$/,
        use: "babel-loader",
      },
      {
        test: /\.(png|svg|jpg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts"],
    alias: {
      components: path.join(srcPath, "components"),
      store: path.join(srcPath, "store"),
      utils: path.join(srcPath, "utils"),
    },
  },
  devServer: {
    historyApiFallback: true,
    host: "127.0.0.1",
    port: 9002,
    hot: true,
  },
  mode: "development",
};

let path = require("path");

module.exports = {
  output: "export",
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "src"),
      "~styles": path.join(__dirname, "src/styles"),
      "~src": path.join(__dirname, "src"),
      "~public": path.join(__dirname, "public"),
      "~types": path.join(__dirname, "types")
    };
    config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];
    config.resolve.modules = [path.resolve(__dirname, "src"), "node_modules"];
    config.module.rules.push(
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/images/[name].[contenthash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(svg)$/i,
        use: {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            icon: true,
            ext: "tsx"
          }
        }
      },
      {
        test: /\.(swf|otf|eot|ttf|woff|woff2)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: false,
              name: "_next/static/assets/[name].[contenthash].[ext]"
            }
          }
        ]
      }
    );
    return config;
  },
  trailingSlash: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    appDir: true
  }
};

const path = require('path');

module.exports = {
  webpack: (config: { resolve: { alias: any; }; }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src')
    };
    return config;
  }
};

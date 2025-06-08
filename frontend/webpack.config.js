const path = require('path');

module.exports = {
    resolve: {
        fallback: {
            "timers": require.resolve("timers-browserify"),
            "buffer": require.resolve("buffer/"),
        }
    },
    module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
};

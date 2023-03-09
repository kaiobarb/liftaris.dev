module.exports = {

  webpack: function (config) {

    config.module.rules.push({

      test: /\.md$/,

      use: 'raw-loader',

    })

    return config

  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
}
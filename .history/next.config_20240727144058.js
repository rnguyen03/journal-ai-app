const path = require('path')

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(node)$/,
      use: 'file-loader',
      include: [
        path.resolve(__dirname, 'node_modules/mongodb'),
        path.resolve(__dirname, 'node_modules/kerberos'),
        path.resolve(__dirname, 'node_modules/snappy'),
        path.resolve(__dirname, 'node_modules/socks'),
        path.resolve(__dirname, 'node_modules/aws4'),
        path.resolve(__dirname, 'node_modules/gcp-metadata'),
        path.resolve(__dirname, 'node_modules/@mongodb-js/zstd'),
        path.resolve(__dirname, 'node_modules/mongodb-client-encryption')
      ]
    })

    return config
  }
}

const path = require('path')
const fs = require('fs')
const { merge } = require('webpack-merge')

const appConfig = require('./config')

let localAppConfig = {}
if (fs.existsSync(path.resolve(__dirname, 'config.local.js'))) {
  localAppConfig = require('./config.local.js')
}

const mergedConfig = merge(appConfig, localAppConfig)

let server = mergedConfig.server[process.env.BUILD_ENV]
if (process.env.MOCK === 'weapp') {
  server = 'http://127.0.0.1:4000/api'
} else if (process.env.MOCK === 'h5') {
  server = '/api'
}

const ossOptions = {
  ...mergedConfig.oss[process.env.BUILD_ENV],
  path: mergedConfig.oss.path,
  prefix: mergedConfig.oss.prefix,
  formats: mergedConfig.oss.formats,
}

const config = {
  projectName: 'taroz',
  date: '2021-3-17',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  defineConstants: {
    CONFIG: JSON.stringify({
      SERVER: server,
      DEBUG: mergedConfig.debug,
    }),
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'global', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain, webpack) {
      chain.merge({
        module: {
          rule: {
            alioss: {
              test: /.js|.jsx|.css|.scss?/,
              use: [{
                loader: require.resolve('alioss-upload-loader'),
                options: ossOptions
              }]
            }
          }
        }
      })
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'global', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain, webpack) {
      chain.merge({
        module: {
          rule: {
            alioss: {
              test: /.js|.jsx|.css|.scss?/,
              use: [{
                loader: require.resolve('alioss-upload-loader'),
                options: ossOptions
              }]
            }
          }
        }
      })
    },
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}

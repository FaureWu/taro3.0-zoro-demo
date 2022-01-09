const express = require('express')
const mock = require('../server/routes/mock')

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      port: 3000,
      setup(app) {
        app.use(express.json())
        app.use('/api', mock)
      },
    },
  }
}

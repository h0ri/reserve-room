'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"https://1s0ipat9ga.execute-api.ap-northeast-1.amazonaws.com/dev"'
})

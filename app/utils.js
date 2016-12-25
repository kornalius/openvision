import 'systemjs'
import jsonquery from 'json-query'
import path from 'path'
import raf from 'raf'
import 'performance-now'
import 'pixi.js'
import 'web-audio-daw'
import is from 'is_js'

import { Mixin, mix } from 'mixwith'
window.Mixin = Mixin
window.mix = mix

const electron = require('electron')
const { remote, dialog } = electron
const { app, BrowserWindow } = remote

const fs = require('fs-promise')
const os = require('os')
const _vm = require('vm')
const child_process = require('child_process')
const dns = require('dns')
const http = require('http')
const https = require('https')
const net = require('net')
const querystring = require('querystring')
const stream = require('stream')
const tls = require('tls')
const tty = require('tty')
const url = require('url')
const zlib = require('zlib')

const _ = require('underscore-plus')
_.extend(_, require('lodash'))
window._ = _

_.templateSettings.interpolate = /#{([\s\S]+?)}/g

window.is = is

PIXI.Point.prototype.distance = function (target) {
  return Math.sqrt((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y))
}

PIXI.Point.prototype.toString = function () {
  return _.template('(#{x}, #{y})')(this)
}

PIXI.Rectangle.prototype.toString = function () {
  return _.template('(#{x}, #{y}, #{x + width}, #{y + height})(#{width}, #{height})')(this)
}

let userPath = path.join(app.getAppPath(), '/user')
if (!fs.existsSync(userPath)) {
  fs.makeTreeSync(userPath)
}

let IS_WIN = /^win/.test(process.platform)
let IS_OSX = process.platform === 'darwin'
let IS_LINUX = process.platform === 'linux'
let dirs = {
  build: __dirname,
  cwd: app.getAppPath(),
  home: app.getPath('home'),
  app: path.join(app.getPath('appData'), '/openvision'),
  user: userPath,
  tmp: app.getPath('temp'),
  root: app.getPath('exe'),
  node_modules: path.join(userPath, 'node_modules'),
  user_pkg: path.join(userPath, 'package.json'),
}

if (!fs.existsSync(dirs.app)) {
  fs.makeTreeSync(dirs.app)
}

let p = (...args) => path.join(__dirname, ...args)

let name = app.getName()
let version = app.getVersion()

let openFile = (...args) => {
  try {
    return dialog.showOpenDialog.apply(dialog, args)
  }
  catch (err) {
    console.error(err)
  }
  return null
}

let saveFile = (...args) => {
  try {
    return dialog.showSaveDialog.apply(dialog, args)
  }
  catch (err) {
    console.error(err)
  }
  return null
}

let messageBox = (...args) => {
  try {
    return dialog.showMessageBox.apply(dialog, args)
  }
  catch (err) {
    console.error(err)
  }
  return null
}

let map_getters = (source, target, defs) => {
  for (let k in defs) {
    let fn = defs[k]
    Object.defineProperty(source, k, {
      get: () => fn.call(target, source),
      enumerable: true,
      configurable: true,
    })
  }
}

let map_getters_return_this = (source, target, defs) => {
  for (let k in defs) {
    let fn = defs[k]
    Object.defineProperty(source, k, {
      get: () => {
        fn.call(target, source)
        return source
      },
      enumerable: true,
      configurable: true,
    })
  }
}

let delay = ms => {
  // setTimeout(() => {}, ms)
  let t = performance.now()
  let c = t
  while (c - t <= ms) {
    PIXI.ticker.shared.update(c)
    c = performance.now()
  }
}

let buffer_to_string = b => {
  let len = b.length
  let i = 0
  let s = ''
  while (i < len) {
    s += b[i++].toString(16)
  }
  return s
}

let string_to_buffer = str => {
  let len = str.length
  let i = 0
  let b = new Buffer(Math.trunc(str.length / 2))
  let x = 0
  while (i < len) {
    let hex = str.substr(i, 2)
    b[x++] = parseInt(hex, 16)
    i += 2
  }
  return b
}

let string_buffer = (str, len = 0) => {
  len = len || str.length
  var b = new Buffer(len)
  b.write(str, 0, str.length, 'ascii')
  return b
}

let normalizeMessages = (...message) => {
  let args = []
  for (let m of message) {
    if (_.isArray(m)) {
      args.push(m.join(', '))
    }
    else if (_.isString(m)) {
      args.push(m)
    }
  }
  return args
}

let error = (instance, ...message) => {
  let args = normalizeMessages(...message)
  console.error(...args)
  instance.errors++
  return null
}

let hex = (value, size = 32) => '$' + _.padStart(value.toString(16), Math.trunc(size / 4), '0')

let buffer_dump = (buffer, options = {}) => {
  let width = options.width || 16
  let caps = options.caps || 'upper'
  let indent = _.repeat(' ', options.indent || 0)

  let zero = (n, max) => {
    n = n.toString(16)
    if (caps === 'upper') { n = n.toUpperCase() }
    while (n.length < max) {
      n = '0' + n
    }
    return n
  }

  let len = Math.min(buffer.byteLength, options.length || buffer.byteLength)
  let rows = Math.ceil(len / width)
  let last = len % width || width
  let offsetLength = len.toString(16).length
  if (offsetLength < 6) { offsetLength = 6 }

  let arr = new Uint8Array(buffer)

  let str = indent + 'Offset'
  while (str.length < offsetLength) {
    str += ' '
  }

  str += '  '

  for (let i = 0; i < width; i++) {
    str += ' ' + zero(i, 2)
  }

  if (len) {
    str += '\n'
  }

  let b = 0

  for (let i = 0; i < rows; i++) {
    str += indent + zero(b, offsetLength) + '  '
    let lastBytes = i === rows - 1 ? last : width
    let lastSpaces = width - lastBytes

    for (let j = 0; j < lastBytes; j++) {
      str += ' ' + zero(arr[b], 2)
      b++
    }

    for (let j = 0; j < lastSpaces; j++) {
      str += '   '
    }

    b -= lastBytes
    str += '   '

    for (let j = 0; j < lastBytes; j++) {
      let v = arr[b]
      str += v > 31 && v < 127 || v > 159 ? String.fromCharCode(v) : '.'
      b++
    }

    str += '\n'
  }

  return str
}

let utoa = str => window.btoa(unescape(encodeURIComponent(str)))

let atou = str => decodeURIComponent(escape(window.atob(str)))

window.utoa = utoa
window.atou = atou


let instanceFunction = (target, name, fn) => {
  if (!target.hasOwnProperty(name)) {
    Object.defineProperty(target, name, {
      value: fn,
      writable: true,
    })
  }
}

let instanceFunctions = (target, source, names) => {
  for (let n of names) {
    if (_.isArray(n)) {
      instanceFunction(target, n[0], source[n[1]])
    }
    else {
      instanceFunction(target, n, source[n])
    }
  }
}

let electronApp = app

let q = (data, expr) => jsonquery(expr, { data, allowRegexp: true }).value

export {
  _,
  _vm,
  os,
  child_process,
  dns,
  http,
  https,
  net,
  querystring,
  stream,
  tls,
  tty,
  url,
  zlib,
  p,
  name,
  version,
  electron,
  electronApp,
  BrowserWindow,
  openFile,
  saveFile,
  messageBox,
  process,
  fs,
  path,
  IS_WIN,
  IS_OSX,
  IS_LINUX,
  dirs,
  raf,
  map_getters,
  map_getters_return_this,
  delay,
  buffer_to_string,
  string_to_buffer,
  string_buffer,
  error,
  hex,
  buffer_dump,
  utoa,
  atou,
  jsonquery,
  instanceFunction,
  instanceFunctions,
  q,
}

import 'systemjs'
import path from 'path'
import raf from 'raf'
import now from 'performance-now'
import 'pixi.js'
import 'web-audio-daw'

const electron = require('electron')
const { remote, screen, dialog } = electron
const { app, BrowserWindow } = remote

const fs = require('fs-promise')

const _ = require('underscore-plus')
_.extend(_, require('lodash'))
window._ = _

_.templateSettings.interpolate = /#{([\s\S]+?)}/g

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
  app: app.getPath('appData'),
  user: userPath,
  tmp: app.getPath('temp'),
  root: app.getPath('exe'),
  node_modules: path.join(userPath, 'node_modules'),
  user_pkg: path.join(userPath, 'package.json'),
}

System.config({
  map: {
    'plugin-babel': 'build/systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'build/systemjs-plugin-babel/systemjs-babel-browser.js',
    'app-plugins': 'build/plugins',
    'app-modes': 'build/modes',
    'user-plugins': path.join(dirs.user, '/plugins'),
    'user-modes': path.join(dirs.user, '/modes'),
  },
  transpiler: 'plugin-babel'
})

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

let mixin = (proto, ...mixins) => {
  let exceptions = ['constructor']
  mixins.forEach(mixin => {
    if (_.isString(mixin)) { // exception
      exceptions.push(mixin)
    }
    else if (_.isArray(mixin)) { // exceptions
      exceptions = exceptions.concat(mixin)
    }
    else {
      Object.getOwnPropertyNames(mixin).forEach(key => {
        if (!_.includes(exceptions, key)) {
          if (!Object.getOwnPropertyDescriptor(proto, key)) {
            let descriptor = Object.getOwnPropertyDescriptor(mixin, key)
            Object.defineProperty(proto, key, descriptor)
          }
        }
      })
    }
  })
}

let unmixin = (proto, ...mixins) => {
  let exceptions = ['constructor']
  mixins.forEach(mixin => {
    if (_.isString(mixin)) { // exception
      exceptions.push(mixin)
    }
    else if (_.isArray(mixin)) { // exceptions
      exceptions = exceptions.concat(mixin)
    }
    else {
      Object.getOwnPropertyNames(mixin).forEach(key => {
        if (!_.includes(exceptions, key) && _.has(proto, key)) {
          delete proto[key]
        }
      })
    }
  })
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
  debugger;
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

export {
  _,
  p,
  name,
  version,
  electron,
  dialog,
  openFile,
  saveFile,
  messageBox,
  remote,
  screen,
  BrowserWindow,
  app,
  fs,
  path,
  userPath,
  IS_WIN,
  IS_OSX,
  IS_LINUX,
  dirs,
  raf,
  now,
  mixin,
  unmixin,
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
  atou  ,
}

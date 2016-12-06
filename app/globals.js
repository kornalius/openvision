export var mixin = (proto, ...mixins) => {
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
        if (!_.contains(exceptions, key)) {
          let descriptor = Object.getOwnPropertyDescriptor(mixin, key)
          Object.defineProperty(proto, key, descriptor)
        }
      })
    }
  })
}

export var unmixin = (proto, ...mixins) => {
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
        if (!_.contains(exceptions, key) && _.has(proto, key)) {
          delete proto[key]
        }
      })
    }
  })
}

export var map_getters = (source, target, defs) => {
  for (let k in defs) {
    let fn = defs[k]
    Object.defineProperty(source, k, {
      get: () => fn.call(target, source),
      enumerable: true,
      configurable: true,
    })
  }
}

export var map_getters_return_this = (source, target, defs) => {
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

export var delay = ms => {
  // setTimeout(() => {}, ms)
  let t = performance.now()
  let c = t
  while (c - t <= ms) {
    PIXI.ticker.shared.update(c)
    c = performance.now()
  }
}

export var buffer_to_string = b => {
  let len = b.length
  let i = 0
  let s = ''
  while (i < len) {
    s += b[i++].toString(16)
  }
  return s
}

export var string_to_buffer = str => {
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

export var string_buffer = (str, len = 0) => {
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

export var error = (instance, ...message) => {
  let args = normalizeMessages(...message)
  console.error(...args)
  instance.errors++
  debugger;
  return null
}

export var hex = (value, size = 32) => '$' + _.padStart(value.toString(16), Math.trunc(size / 4), '0')

export var buffer_dump = (buffer, options = {}) => {
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

export var utoa = str => window.btoa(unescape(encodeURIComponent(str)))

export var atou = str => decodeURIComponent(escape(window.atob(str)))

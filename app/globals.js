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

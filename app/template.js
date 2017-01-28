
export var templates = {}

export function registerTemplate (name, fn) {
  templates[name] = fn
}

export function templatize (name, value, options = {}, children = []) {
  let o

  if (_.isPlainObject(value)) {
    options = value
    value = null
  }
  if (_.isArray(options)) {
    children = options
    options = {}
  }

  let t = templates[name]
  if (t) {
    o = t(value, options)
    for (let c of children) {
      o.addChild(c)
    }
  }

  return o
}

registerTemplate('text', (value, options) => new app.Text(value, options))

registerTemplate('window', (value, options) => app.Window(_.extend({}, { title: value }, options)))

registerTemplate('rect', (value, options) => app.Rectangle(options))

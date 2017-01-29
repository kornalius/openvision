
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

registerTemplate('container', (value, options) => new app.Container())

registerTemplate('sprite', (value, options) => {
  let s
  if (_.isString(value)) {
    s = new app.Sprite.fromImage(value)
  }
  else {
    s = new app.Sprite(value)
  }
  return s
})

registerTemplate('text', (value, options) => new app.Text(value, options))

registerTemplate('rect', (value, options) => app.Rectangle(options))

registerTemplate('oval', (value, options) => app.Oval(options))

registerTemplate('bar', (value, options) => app.Bar(_.extend({}, { text: value }, options)))

registerTemplate('textedit', (value, options) => app.TextEdit(_.extend({}, { text: value }, options)))

registerTemplate('window', (value, options) => app.Window(_.extend({}, { title: value }, options)))

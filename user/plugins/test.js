
export let C = class extends app.Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'test'
  }

  destroy () {
  }

  load (obj, options = {}) {
    return super.load(obj, options)
  }

  unload (obj, options = {}) {
    super.unload(obj, options)
  }

}

export let M = Mixin(superclass => class extends superclass {

  test () {
    console.log('test')
  }

})

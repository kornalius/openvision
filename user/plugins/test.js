
export class TestClass extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'test'
  }

  destroy () {
    super.destroy()
  }

  load (obj, options = {}) {
    obj._test = true
    super.load(obj, options)
  }

  unload (obj) {
    delete obj._test
    super.unload(obj)
  }

}

export let TestMixin = Mixin(superclass => class TestMixin extends superclass {

  test () {
    console.log('test')
  }

})

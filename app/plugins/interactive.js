
export class InteractiveClass extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'interactive'
    this._desc = 'Allow container to be interacted with the mouse or touch.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj.interactive = true
  }

  unload (obj) {
    obj.interactive = false
    super.unload(obj)
  }

}


export let InteractiveMixin = Mixin(superclass => class InteractiveMixin extends superclass {

})

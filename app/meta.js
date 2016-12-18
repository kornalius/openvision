
export let MetaMixin = Mixin(superclass => class MetaMixin extends superclass {

  get name () { return this._name }

  get private () { return this._private }

  get tags () { return this._tags }

  get desc () { return this._desc }

  get author () { return this._author }

  get version () { return this._version }

  get date () { return this._date }

  get interface () { return this._interface }

  get deps () { return this._deps }

})


export var extractMetaFromOptions = (instance, options) => {
  instance._name = _.get(options, 'name', '')
  instance._private = _.get(options, 'private', false)
  instance._desc = _.get(options, 'desc', '')
  instance._author = _.get(options, 'author', '')
  instance._version = _.get(options, 'version', '1.0.0')
  instance._date = _.get(options, 'date', new Date().toISOString().split('T')[0])
  instance._tags = _.get(options, 'tags', [])
  instance._interface = _.get(options, 'interface', {})
  instance._deps = _.get(options, 'deps', [])
}

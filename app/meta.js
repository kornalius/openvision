
export let MetaMixin = Mixin(superclass => class MetaMixin extends superclass {

  get name () { return this._name }
  set name (value) { this._name = value }

  get private () { return this._private }
  set private (value) { this._private = value }

  get tags () { return this._tags }
  set tags (value) { this._tags = value }

  get desc () { return this._desc }
  set desc (value) { this._desc = value }

  get author () { return this._author }
  set author (value) { this._author = value }

  get version () { return this._version }
  set version (value) { this._version = value }

  get dependencies () { return this._dependencies }
  set dependencies (value) { this._dependencies = value }

  get properties () { return this._properties }
  set properties (value) { this._properties = value }

  get listeners () { return this._listeners }
  set listeners (value) { this._listeners = value }

  get overrides () { return this._overrides }
  set overrides (value) { this._overrides = value }

  get nolink () { return this._nolink }
  set nolink (value) { this._nolink = value }

})


export var extractMetaFromOptions = (instance, options) => {
  instance._name = _.get(options, 'name', '')
  instance._private = _.get(options, 'private', false)
  instance._desc = _.get(options, 'desc', '')
  instance._author = _.get(options, 'author', '')
  instance._version = _.get(options, 'version', '1.0.0')
  instance._tags = _.get(options, 'tags', [])
  instance._dependencies = _.get(options, 'dependencies', [])
  instance._properties = _.get(options, 'properties', {})
  instance._listeners = _.get(options, 'listeners', {})
  instance._overrides = _.get(options, 'overrides', {})
  instance._nolink = _.get(options, 'nolink', false)
}

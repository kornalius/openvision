export var metaProperties = [
  'name',
  'private',
  'tags',
  'desc',
  'author',
  'version',
  'date',
]


export class Meta {

  get name () { return this._name }

  get private () { return this._private }

  get tags () { return this._tags }

  get desc () { return this._desc }

  get author () { return this._author }

  get version () { return this._version }

  get date () { return this._date }

}


export var extractMetaFromOptions = (instance, options) => {
  instance._name = _.get(instance, options, 'name', '')
  instance._private = _.get(instance, options, 'private', false)
  instance._desc = _.get(instance, options, 'desc', '')
  instance._author = _.get(instance, options, 'author', '')
  instance._version = _.get(instance, options, 'version', '1.0.0')
  instance._date = _.get(instance, options, 'date', new Date().toISOString().split('T')[0])
  instance._tags = _.concat([this.name], _.get(instance, options, 'tags', []))
}

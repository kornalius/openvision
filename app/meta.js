export var exceptions = [
  'name',
  'private',
  'tags',
  'desc',
  'author',
  'version',
  'date',
]


export class Meta {

  get name () { return '' }

  get private () { return false }

  get tags () { return [this.name] }

  get desc () { return '' }

  get author () { return '' }

  get version () { return '1.0.0' }

  get date () { return '' }

}

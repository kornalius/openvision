import { Base } from '../objects/base.js'
import { DB } from '../objects/db.js'
import { path as _path } from '../utils.js'


export const FS_DELIMITER = '/'


export class FileEntry extends Base {

  constructor (options = {}) {
    super(options)

    this._parent = _.get(options, 'parent')
    this._files = []
    this._name = _.get(options, 'name')
    this._attr = _.get(options, 'attr', 'rwx')
    this._created = _.get(options, 'created', 0)
    this._modified = _.get(options, 'modified', 0)
    this._size = _.get(options, 'size', 0)
  }

  get parent () { return this._parent }
  get name () { return this._name }
  get attr () { return this._attr }
  get created () { return this._created }
  get modified () { return this._modified }
  get size () { return this._size }

  get files () { return this._files }

  get readable () { return this._attr.indexOf('r') !== -1 }
  get writable () { return this._attr.indexOf('w') !== -1 }
  get executable () { return this._attr.indexOf('x') !== -1 }
  get folder () { return this._attr.indexOf('d') !== -1 }

  get isRoot () { return !this._parent }

  find (name) { return _.find(this.files, { name }) }

  get root () {
    let p = this
    while (p && p.parent) {
      p = p.parent
    }
    return p
  }

  get path () {
    let paths = []
    let p = this
    while (p && p.parent) {
      paths.shift(p.name)
      p = p.parent
    }
    return paths.join(FS_DELIMITER)
  }

  get basename () { return _path.basename(this._name) }
  get ext () { return _path.extname(this._name) }

  read () { return DB.get(this.name) }

  write (data) { return DB.put(this.name, data) }

}


export class FS extends Base {

  constructor (options = {}) {
    super(options)

    this._root = _.get(options, 'root', new FileEntry({ name: FS_DELIMITER, attr: 'rd' }))
    this._pwd = _.get(options, 'pwd', this._root)
  }

  get root () { return this._root }
  get pwd () { return this._pwd }

  find (path) {
    path = _path.normalize(path)
    let fe = null
    for (let p of path.split(FS_DELIMITER)) {
      fe = (fe || this.root).find(p)
      if (!fe) {
        break
      }
    }
    return fe
  }

  exists (path) { return this.find(path) !== null }

}

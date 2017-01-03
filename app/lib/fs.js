import { Base } from '../objects/base.js'
import { DB } from '../objects/db.js'
import { path as _path } from '../utils.js'
import { glob } from 'multimatch'
import { Encoder, e, d } from './encoder.js'


export const FS_DELIMITER = '/'


export var errors = {
  9: {
    name: 'EBADF',
    message: 'bad file descriptor',
  },
  10: {
    name: 'EBUSY',
    message: 'resource busy or locked',
  },
  18: {
    name: 'EINVAL',
    message: 'invalid argument',
  },
  27: {
    name: 'ENOTDIR',
    message: 'not a directory',
  },
  28: {
    name: 'EISDIR',
    message: 'illegal operation on a directory',
  },
  34: {
    name: 'ENOENT',
    message: 'no such file or directory',
  },
  47: {
    name: 'EEXIST',
    message: 'file already exists',
  },
  50: {
    name: 'EPERM',
    message: 'operation not permitted',
  },
  51: {
    name: 'ELOOP',
    message: 'too many symbolic links encountered',
  },
  53: {
    name: 'ENOTEMPTY',
    message: 'directory not empty',
  },
  55: {
    name: 'EIO',
    message: 'i/o error',
  },
}


for (let k in errors) {
  let errno = k
  let errName = errors[k].name
  let defaultMessage = errors[k].message

  let FSError = class FSError extends Error {
    constructor (path, msg) {
      super()
      this.name = errName
      this.code = errName
      this.errno = errno
      this.message = msg || defaultMessage
      this.path = path
      this.stack = (new Error(this.message)).stack
    }

    toString () {
      var pathInfo = this.path ? ', \'' + this.path + '\'' : ''
      return this.name + ': ' + this.message + pathInfo
    }
  }

  errors[errno] = FSError
  errors[errName] = FSError
}


export class FileEntry extends Base {

  constructor (fs, parent, options = {}) {
    super(options)

    this._fs = fs
    this._parent = parent
    this._files = []
    this._id = null

    this._name = _.get(options, 'name')
    this._attr = _.get(options, 'attr', 'rwx')
    this._created = _.get(options, 'created', 0)
    this._modified = _.get(options, 'modified', 0)
    this._size = _.get(options, 'size', 0)
  }

  get fs () { return this._fs }
  get parent () { return this._parent }

  get id () { return this._id }

  get name () { return this._name }
  get attr () { return this._attr }
  get created () { return this._created }
  get modified () { return this._modified }
  get size () { return this._size }

  get files () { return this._files }
  get folders () { _.map(this._files, f => f.folder) }

  get readable () { return this._attr.indexOf('r') !== -1 }
  get writable () { return this._attr.indexOf('w') !== -1 }
  get executable () { return this._attr.indexOf('x') !== -1 }
  get folder () { return this._attr.indexOf('d') !== -1 }
  get file () { return !this.folder }

  get isRoot () { return !this._parent }

  get extname () { return _path.extname(this._name) }

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

  find (name) {
    return new Promise((resolve, reject) => {
      let f = _.find(this.files, { name })
      return f ? resolve(f) : reject(new errors.ENOENT(this.path))
    })
  }

  create (name, data, attr = 'rwx') {
    return new Promise((resolve, reject) => {
      return this.fs.exists(name).then(() => {
        return reject(new errors.EEXIST(this.path))
      }).catch(() => {
        let f = new FileEntry(this.fs, this, { name, attr })
        this._files.push(f)
        if (data) {
          return f.write(data).then(f.touch).then(resolve)
        }
        return f.touch().then(resolve)
      })
    })
  }

  mkdir (name, attr = 'rw') {
    return this.create(name, null, attr + 'd')
  }

  touch () {
    this._modified = Date.now()
    if (!this._created) {
      this._created = this._modified
    }
    return this.fs.save()
  }

  rm () {
    return new Promise((resolve, reject) => {
      if (this.file) {
        return DB.remove(this.id).then(() => {
          _.remove(this.parent.files, f => f.name === this.name)
          return this.fs.save().then(resolve)
        })
      }
      else if (this.folder) {
        if (this.files.length) {
          return reject(new errors.ENOTEMPTY(this.path))
        }
        else {
          _.remove(this.parent.files, f => f.name === this.name)
        }
        return this.fs.save().then(resolve)
      }
      else {
        return reject(new errors.EPERM(this.path))
      }
    })
  }

  read () {
    return DB.get(this.db, this.id)
  }

  write (data) {
    return DB.put(this.db, this.id, data).then(() => {
      this._size = data.length
      return this.touch()
    })
  }

  match (patterns = ['*']) { return glob([this._name], patterns) }

  ls (patterns = ['*'], deep = false) {
    return new Promise((resolve, reject) => {
      let files = []
      for (let f of this.files) {
        if (f.match(patterns)) {
          files.push(f)
        }
        if (deep && f.folder) {
          files.concat(f.ls(patterns, true))
        }
      }
      return resolve(files)
    })
  }

  rename (name) {
    return this.exists(name).catch(() => {
      this._name = name
      return this.touch()
    })
  }

  copy (dest) {

  }

  move (dest) {

  }

}


export class FS extends Base {

  static paths (path) {
    path = FS.normalize(path)
    return path.split(FS_DELIMITER)
  }

  static realPath (path) {
    return _path.sep !== FS_DELIMITER ? path.replace(FS_DELIMITER, _path.sep) : path
  }

  static fakePath (path) {
    return _path.sep !== FS_DELIMITER ? path.replace(_path.sep, FS_DELIMITER) : path
  }

  static normalize (path) {
    return FS.fakePath(FS.normalize(FS.realPath(path)))
  }

  static parse (path) { return _path.parse(FS.realPath(path)) }

  static resolve () { return _path.resolve(...arguments) }

  static join () { return _path.join(...arguments) }

  static isAbsolute (path) { return _path.isAbsolute(FS.realPath(path)) }

  static dirname (path) { return FS.fakePath(_path.dirname(FS.realPath(path))) }

  static basename (path) { return _path.basename(FS.realPath(path)) }

  static extname (path) { return _path.extname(FS.realPath(path)) }

  constructor (options = {}) {
    super(options)

    this._root = _.get(options, 'root', new FileEntry(this, null, { name: FS_DELIMITER, attr: 'rd' }))
  }

  get root () { return this._root }

  assignParents (obj, parent = null) {
    obj._fs = this
    obj._parent = parent
    for (let c of obj._files) {
      this.assignParents(c, obj)
    }
  }

  load () {
    return DB.get(this.db, this.id).then(doc => {
      this._root = this.assignParents(Encoder.decode(doc))
    })
  }

  save () {
    return DB.put(this.db, this.id, Encoder.encode(this._root))
  }

  find (path) {
    return new Promise((resolve, reject) => {
      let fe = null
      for (let p of this.paths(path)) {
        fe = (fe || this.root).find(p)
        if (!fe) {
          break
        }
      }
      return fe ? resolve(fe) : reject(new errors.ENOENT(path))
    })
  }

  ensurePath (path, attr = 'rwx') {
    return new Promise((resolve, reject) => {
      let paths = this.paths(path)
      let f = this.root
      let len = paths.length
      for (let i = 0; i < len; i++) {
        let p = paths[i]
        let nf = f.find(p)
        if (!nf) {
          if (i === len - 1) {
            nf = f.create(p, null, attr)
          }
          else {
            nf = f.mkdir(p)
          }
        }
        f = nf
      }
      return resolve(f)
    })
  }

  create (path, data, attr) {
    return this.find(path).catch(() => {
      return this.find(FS.dirname(path)).then(d => d.create(FS.basename(path), data, attr))
    })
  }

  mkdir (path, attr) {
    return this.create(path, null, (attr || '') + 'd')
  }

  rm (path) {
    return this.find(path).then(f => f.rm())
  }

  ls (path, glob) {
    return this.find(path).then(f => {
      return f.folder ? f.files : Promise.reject(new errors.ENOTDIR(path))
    })
  }

  read (path) {
    return this.find(path).then(f => f.read())
  }

  write (path, data) {
    return this.find(path).then(f => f.write(data))
  }

  attr (path, value) {
    return this.find(path).then(f => {
      if (value) {
        f.attr = value
        this.save()
      }
      return f.attr
    })
  }

  size (path) {
    return this.find(path).then(f => f.size)
  }

  isFile (path) {
    return this.find(path).then(f => f.file)
  }

  isFolder (path) {
    return this.find(path).then(f => f.folder)
  }

  isReadable (path) {
    return this.find(path).then(f => f.readable)
  }

  isWritable (path) {
    return this.find(path).then(f => f.writable)
  }

  isExecutable (path) {
    return this.find(path).then(f => f.executable)
  }

  created (path) {
    return this.find(path).then(f => f.created)
  }

  modified (path) {
    return this.find(path).then(f => f.modified)
  }

  copy (path, newpath) {
    return this.find(path).then(f => {
    })
  }

  move (path, newpath) {
    return this.find(path).then(f => {
    })
  }

}


export class Shell extends Base {

  constructor (fs, options = {}) {
    super(options)

    this._fs = fs
    this._cwd = _.get(options, 'cwd', this._root)
  }

  get fs () { return this._fs }

  get cwd () { return this._cwd }

  resolve (path) { return FS.resolve(this.cwd, path) }

  cd (path) {
    path = this.resolve(path)
    return this.fs.isFolder(path).then(() => { this._cwd = path })
  }

  ls (pattern) {
    return this.fs.ls(this.cwd, pattern)
  }

  copy (path, newpath) {
    return this.fs.copy(this.resolve(path), this.resolve(newpath))
  }

  move (path, newpath) {
    return this.fs.move(this.resolve(path), this.resolve(newpath))
  }

  mkdir (path) {
    return this.fs.create(this.resolve(path))
  }

  rm (path) {
    return this.fs.rm(this.resolve(path))
  }

}


Encoder.register('FileEntry', {

  encode: obj => {
    let doc = {
      _files: new Array(obj._files.length),
    }
    e('_type', obj, doc)
    e('_id', obj, doc)
    e('_name', obj, doc)
    e('_attr', obj, doc)
    e('_created', obj, doc)
    e('_modified', obj, doc)
    e('_size', obj, doc)
    for (let i = 0; i < obj._files.length; i++) {
      doc._files[i] = Encoder.encode(obj._files[i])
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new FileEntry()
    d('_type', doc, obj)
    d('_id', doc, obj)
    d('_name', doc, obj)
    d('_attr', doc, obj)
    d('_created', doc, obj)
    d('_modified', doc, obj)
    d('_size', doc, obj)
    obj._files = new Array(doc._files.length)
    for (let i = 0; i < doc._files.length; i++) {
      obj._files[i] = Encoder.decode(doc._files[i])
    }
    return obj
  },
})

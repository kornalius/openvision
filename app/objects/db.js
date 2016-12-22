import PouchDB from 'pouchdb-browser'
// import PouchDBMemory from 'pouchdb-adapter-memory'
import RelationalPouchDB from 'relational-pouch'
import TransformPouchDB from 'transform-pouch'

// PouchDB.plugin(PouchDBMemory)
PouchDB.plugin(RelationalPouchDB)
PouchDB.plugin(TransformPouchDB)


export const db_options = { adapter: 'idb', storage: 'persistent', auto_compaction: true }

export var mainDB = new PouchDB(_.extend({ name: 'main' }, db_options))
export var tempDB = new PouchDB(_.extend({ name: 'temp' }, db_options))

mainDB.destroy().then(() => {
  mainDB = new PouchDB(_.extend({ name: 'main' }, db_options))
})

tempDB.destroy().then(() => {
  tempDB = new PouchDB(_.extend({ name: 'temp' }, db_options))
})


export let DBMixin = Mixin(superclass => class DBMixin extends superclass {

  constructor () {
    super(...arguments)
    this._db = null
    this._doc = {}
  }

  get db () { return this._db || mainDB }
  set db (value) {
    if (this.db !== mainDB) {
      this._db.close().then(() => {
        this._db = new PouchDB(_.extend({ name: value }, db_options))
      })
    }
    else {
      this._db = new PouchDB(_.extend({ name: value }, db_options))
    }
  }

  get doc () { return this._doc }

  get id () { return this._doc._id }

  get rev () { return this._doc._rev }

  _get (name) {
    return this.db.get(name || this.id).then(doc => {
      this._doc = doc
      return doc
    })
  }

  _put (name) {
    return this._get(name).then(() => {
      return this.db.put(this.serialize())
    }).catch(err => {
      if (err.status === 404) {
        this._doc._id = name || this.id
        this.db.put(this.serialize())
      }
    })
  }

  load (name) {
    return this._get(name).then(this.deserialize)
  }

  save (name) {
    return this._put(name)
  }

  delete (name) {
    return this._get(name).then(doc => {
      this.db.remove(doc).then(() => { this._doc = {} })
    })
  }

  deserialize (doc) {
  }

  serialize () {
    return {
      _id: this.id,
      _rev: this.rev,
      $class: this.constructor.name,
    }
  }

})

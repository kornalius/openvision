import PouchDB from 'pouchdb-browser'
// import PouchDBMemory from 'pouchdb-adapter-memory'
import RelationalPouchDB from 'relational-pouch'
import TransformPouchDB from 'transform-pouch'
import { Encoder } from '../lib/encoder.js'


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


export let DB = class {

  static get (db, id) {
    if (_.isString(db)) {
      id = db
      db = mainDB
    }
    return db.get(id)
  }

  static put (db, id, doc) {
    if (_.isString(db)) {
      id = db
      db = mainDB
    }
    return DB.get(db, id).then(res => {
      return db.put(_.extend({ _id: id, _rev: res.rev }, doc))
    }).catch(err => {
      if (err.status === 404) {
        return db.put(_.extend({ _id: id }, doc))
      }
      else {
        return Promise.reject(err)
      }
    })
  }

  static delete (db, id) {
    if (_.isString(db)) {
      id = db
      db = mainDB
    }
    return DB.get(db, id).then(db.remove)
  }

  static load (db, id) {
    if (_.isString(db)) {
      id = db
      db = mainDB
    }
    return DB.get(db, id)
  }

  static save (db, id, doc) {
    if (_.isString(db)) {
      id = db
      db = mainDB
    }
    return DB.put(db, id, doc)
  }

}


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

  get db_doc () { return this._doc }

  get db_id () { return this._doc._id }

  get db_rev () { return this._doc._rev }

  load (name) {
    return DB.load(this.db, name || this.db_id).then(doc => Encoder.encode(doc, this))
  }

  save (name) {
    return DB.save(this.db, name || this.db_id, Encoder.decode(this)).then(doc => {
      this._doc._id = doc.db_id
      this._doc._rev = doc.rev
      return doc
    })
  }

  delete (name) {
    return DB.delete(this.db, name || this.db_id).then(() => { this._doc = {} })
  }

  db_test () {
    this.save('test').then(doc => {
      console.log(doc)
      app.DB.load('test').then(obj => {
        console.log(obj)
        obj.x = 30
        obj.y = 100
        app.stage.addChild(obj)
        obj.update()
      })
    })
  }

})

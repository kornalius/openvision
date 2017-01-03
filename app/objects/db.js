import PouchDB from 'pouchdb-browser'
// import PouchDBMemory from 'pouchdb-adapter-memory'
import RelationalPouchDB from 'relational-pouch'
import TransformPouchDB from 'transform-pouch'
import { Encoder } from '../lib/encoder.js'


// PouchDB.plugin(PouchDBMemory)
PouchDB.plugin(RelationalPouchDB)
PouchDB.plugin(TransformPouchDB)


export const db_options = { adapter: 'idb', storage: 'persistent', auto_compaction: true }


export let DB = class {

  static open (name) { return new PouchDB(_.extend({ name }, db_options)) }

  static close (db) { return db ? db.close() : Promise.revolve() }

  static destroy (db) { return db.destroy().then(() => DB.open(db.name)) }

  static get (db, id) { return db.get(id) }

  static put (db, id, doc) {
    return db.get(id)
      .then(res => db.put(_.extend({ _id: id, _rev: res.rev }, doc)))
      .catch(err => err.status === 404 ? db.put(_.extend({ _id: id }, doc)) : Promise.reject(err))
  }

  static delete (db, id) { return DB.get(db, id).then(db.remove) }

  static load (db, id) { return DB.get(db, id) }

  static save (db, id, doc) { return DB.put(db, id, doc) }

}


export var sysDB = DB.open('sys')
export var tmpDB = DB.open('tmp')
export var usrDB = null


DB.destroy(sysDB).then(db => { sysDB = db })
DB.destroy(tmpDB).then(db => { tmpDB = db })


export let DBMixin = Mixin(superclass => class DBMixin extends superclass {

  constructor () {
    super(...arguments)
    this._db = null
    this._db_id = null
  }

  get db () { return this._db || sysDB }

  set db (value) {
    if (this.db !== sysDB && this.db !== tmpDB && this.db !== usrDB) {
      DB.close(this.db).then(() => {
        this._db = DB.open(value)
      })
    }
    else {
      this._db = DB.open(value)
    }
  }

  get db_id () { return this._db_id }
  set db_id (value) { this._db_id = value }

  load (name) {
    return DB.load(this.db, name || this.db_id).then(doc => Encoder.encode(doc, this))
  }

  save (name) {
    return DB.save(this.db, name || this.db_id, Encoder.decode(this))
  }

  delete (name) {
    return DB.delete(this.db, name || this.db_id)
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

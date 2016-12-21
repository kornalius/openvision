import PouchDB from 'pouchdb-browser'
// import PouchDBMemory from 'pouchdb-adapter-memory'
import RelationalPouchDB from 'relational-pouch'
import TransformPouchDB from 'transform-pouch'

// PouchDB.plugin(PouchDBMemory)
PouchDB.plugin(RelationalPouchDB)
PouchDB.plugin(TransformPouchDB)

export let stageDB = new PouchDB({ name: 'stage', adapter: 'idb', storage: 'persistent' })
stageDB.destroy().then(() => {
  stageDB = new PouchDB({ name: 'stage', adapter: 'idb', storage: 'persistent' })
})


export let DBMixin = Mixin(superclass => class DBMixin extends superclass {

  constructor () {
    super(...arguments)
    this._db = stageDB
    this._db.post({}).then(res => { this._id = res.id })
  }

  toObject () {
    return { _id: this._id }
  }

})

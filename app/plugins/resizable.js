import { Plugin } from '../plugin.js'

export class Resizable extends Plugin {

  get name () { return 'resizable' }
  get desc () { return 'Allow container to be resized with the mouse.' }
  get author () { return 'Alain Deschenes' }
  get version () { return '1.0.0' }
  get date () { return '12/04/2016' }

  load (obj, options) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

}

import { p, name, version, electron, openFile, saveFile, messageBox, BrowserWindow, electronApp, fs, path, IS_WIN, IS_OSX, IS_LINUX, dirs, raf, now, process, _vm, os, child_process, dns, http, https, net, querystring, stream, tls, tty, url, zlib, jsonquery, q } from './utils.js'

import './style/app.css'
// import t from './html/app.html'

// let el = document.createElement('div')
// el.innerHTML = t
// document.body.appendChild(el)

import './protos/index.js'

import { Base } from './objects/base.js'
import { plugins, Plugin, loadPlugins, unloadPlugins } from './plugin.js'
import { updates } from './updates.js'
import { commands } from './command.js'
import { shortcuts, keyboard } from './shortcut.js'
import { Screen } from './screen.js'
import { vm } from './vm.js'
import { Container, Graphics, Sprite, Text, Rectangle } from './objects/objects.js'
import { DB } from './objects/db.js'


window.Plugin = Plugin
window.q = q


export const _STOPPED = 0
export const _RUNNING = 1
export const _PAUSED = 2


var littleEndian


export class App extends Base {

  constructor (options) {
    super()

    this._status = 0

    // Check for littleEndian
    let b = new ArrayBuffer(4)
    let a = new Uint32Array(b)
    let c = new Uint8Array(b)
    a[0] = 0xdeadbeef
    littleEndian = c[0] === 0xef

    this._defaults = _.get(options, 'defaults', {
      width: 640,
      height: 480,
      scale: 3,
      dblClickDelay: 250,
      dblClickDistance: 8,
    })

    this._width = _.get(options, 'width', this._defaults.width)
    this._height = _.get(options, 'height', this._defaults.height)
    this._scale = _.get(options, 'scale', this._defaults.scale)

    this._dblClickDelay = _.get(options, 'dblClickDelay', this._defaults.dblClickDelay)
    this._dblClickDistance = _.get(options, 'dblClickDistance', this._defaults.dblClickDistance)

    this.screen = new Screen(this, this._width, this._height, this._scale)

    let that = this
    PIXI.ticker.shared.add(time => {
      if (that.status === _RUNNING) {
        that.tick(time)

        let flip = false

        for (let q of updates.queue) {
          q.object.__addedToUpdates = false
          if (q.flip) {
            flip = true
          }
          if (q.cb) {
            q.cb.call(q.object, ...q.args)
          }
        }

        updates.clear()

        if (flip) {
          that.screen.renderer.render(that.screen.stage)
        }
      }
    })

    this.async(this.start, 100)
  }

  destroy () {
    this.screen.destroy()
    super.destroy()
  }

  get DB () { return DB }
  get Base () { return Base }
  get Container () { return Container }
  get Graphics () { return Graphics }
  get Sprite () { return Sprite }
  get Text () { return Text }
  get Rectangle () { return Rectangle }

  get plugins () { return plugins }
  get Plugin () { return Plugin }
  get commands () { return commands }
  get shortcuts () { return shortcuts }
  get keyboard () { return keyboard }
  get vm () { return vm }

  get p () { return p }
  get name () { return name }
  get version () { return version }
  get app () { return electronApp }
  get BrowserWindow () { return BrowserWindow }
  get electron () { return electron }
  get openFile () { return openFile }
  get saveFile () { return saveFile }
  get messageBox () { return messageBox }
  get fs () { return fs }
  get path () { return path }
  get IS_WIN () { return IS_WIN }
  get IS_OSX () { return IS_OSX }
  get IS_LINUX () { return IS_LINUX }
  get dirs () { return dirs }
  get raf () { return raf }
  get now () { return now }
  get process () { return process }
  get _vm () { return _vm }
  get os () { return os }
  get child_process () { return child_process }
  get dns () { return dns }
  get http () { return http }
  get https () { return https }
  get net () { return net }
  get querystring () { return querystring }
  get stream () { return stream }
  get tls () { return tls }
  get tty () { return tty }
  get url () { return url }
  get zlib () { return zlib }
  get jsonquery () { return jsonquery }

  get littleEndian () { return littleEndian }

  get stage () { return this.screen.stage }

  get children () { return this.stage.children }

  get defaults () { return this._defaults }

  get currentOver () { return this._screen.currentOver }

  get status () { return this._status }
  set status (value) {
    if (this._status !== value) {
      this._status = value
    }
  }

  get dblClickDelay () { return this._dblClickDelay }
  set dblClickDelay (value) {
    if (this._dblClickDelay !== value) {
      this._dblClickDelay = value
    }
  }

  get dblClickDistance () { return this._dblClickDistance }
  set dblClickDistance (value) {
    if (this._dblClickDistance !== value) {
      this._dblClickDistance = value
    }
  }

  start () {
    this.status = _RUNNING
    loadPlugins().then(() => {
      this.test()
    })
    return this
  }

  stop () {
    unloadPlugins().then(() => {
      this.status = _STOPPED
    })
    return this
  }

  pause () {
    this.status = _PAUSED
    return this
  }

  resume () {
    this.status = _RUNNING
    return this
  }

  tick (time) {
    this.screen.tick(time)
    for (let c of this.screen.stage.children) {
      if (_.isFunction(c.tick)) {
        c.tick(time)
      }
    }
    super.tick(time)
  }

  mouseEvent (e) {
    let local = e.data.getLocalPosition(this.stage)
    let dist = e.data.getLocalPosition(e.target)
    return {
      time: performance.now(),
      button: e.data.originalEvent.button,
      leftButton: e.data.originalEvent.button === 0,
      middleButton: e.data.originalEvent.button === 1,
      rightButton: e.data.originalEvent.button === 2,
      sx: local.x,
      sy: local.y,
      gx: e.data.global.x,
      gy: e.data.global.y,
      x: dist.x,
      y: dist.y,
      target: e.target,
      over: e.target._over,
    }
  }

  test () {
  }

}

export let app = new App()
window.app = app

import * as utils from './utils.js'

import './style/app.css'
// import t from './html/app.html'

// let el = document.createElement('div')
// el.innerHTML = t
// document.body.appendChild(el)

import './protos/index.js'

import { Base, Container, Graphics, Sprite, Text, Shape, Rectangle, Oval } from './objects/objects.js'
import { DB, sysDB, usrDB, tmpDB } from './objects/db.js'
import { plugins, Plugin, loadPlugins, unloadPlugins } from './plugin.js'
import { updates } from './lib/updates.js'
import { commands } from './command.js'
import { shortcuts, keyboard } from './shortcut.js'
import { Screen } from './screen.js'
import { vm } from './vm.js'
import { FS, shell } from './lib/fs.js'
import { Patches, Patch, PATCH_INSERT, PATCH_DELETE } from './lib/patch.js'
import { Theme, Themes } from './lib/theme.js'
import { Settings, sysSettings, usrSettings } from './lib/settings.js'
import { Checkpoint, Change, Changes } from './lib/change.js'
import { Range, Ranges, RANGE_NORMAL, RANGE_RECT } from './lib/range.js'


window.Plugin = Plugin
window.q = utils.q


export const APP_STOPPED = 0
export const APP_RUNNING = 1
export const APP_PAUSED = 2


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
    this.loadTexture = this.screen.loadTexture.bind(this.screen)

    let that = this
    PIXI.ticker.shared.add(time => {
      if (that.status === APP_RUNNING) {
        that.tick(time)

        let flip = false

        for (let q of updates.queue) {
          q.object._addedToUpdates = false
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

  get Settings () { return Settings }
  get sysSettings () { return sysSettings }
  get usrSettings () { return usrSettings }

  get Base () { return Base }
  get Container () { return Container }
  get Graphics () { return Graphics }
  get Sprite () { return Sprite }
  get Text () { return Text }
  get Shape () { return Shape }
  get Rectangle () { return Rectangle }
  get Oval () { return Oval }

  get DB () { return DB }
  get sysDB () { return sysDB }
  get usrDB () { return usrDB }
  get tmpDB () { return tmpDB }

  get Checkpoint () { return Checkpoint }
  get Change () { return Change }
  get Changes () { return Changes }

  get Patches () { return Patches }
  get Patch () { return Patch }
  get PATCH_INSERT () { return PATCH_INSERT }
  get PATCH_DELETE () { return PATCH_DELETE }

  get Range () { return Range }
  get Ranges () { return Ranges }
  get RANGE_NORMAL () { return RANGE_NORMAL }
  get RANGE_RECT () { return RANGE_RECT }

  get Theme () { return Theme }
  get Themes () { return Themes }

  get FS () { return FS }
  get shell () { return shell }

  get plugins () { return plugins }
  get Plugin () { return Plugin }
  get commands () { return commands }
  get shortcuts () { return shortcuts }
  get keyboard () { return keyboard }
  get vm () { return vm }

  get p () { return utils.p }
  get name () { return utils.name }
  get version () { return utils.version }
  get app () { return utils.electronApp }
  get BrowserWindow () { return utils.BrowserWindow }
  get electron () { return utils.electron }
  get openFile () { return utils.openFile }
  get saveFile () { return utils.saveFile }
  get messageBox () { return utils.messageBox }
  get fs () { return utils.fs }
  get path () { return utils.path }
  get IS_WIN () { return utils.IS_WIN }
  get IS_OSX () { return utils.IS_OSX }
  get IS_LINUX () { return utils.IS_LINUX }
  get dirs () { return utils.dirs }
  get raf () { return utils.raf }
  get now () { return utils.now }
  get process () { return utils.process }
  get _vm () { return utils._vm }
  get os () { return utils.os }
  get child_process () { return utils.child_process }
  get dns () { return utils.dns }
  get http () { return utils.http }
  get https () { return utils.https }
  get net () { return utils.net }
  get querystring () { return utils.querystring }
  get stream () { return utils.stream }
  get tls () { return utils.tls }
  get tty () { return utils.tty }
  get url () { return utils.url }
  get zlib () { return utils.zlib }
  get jsonquery () { return utils.jsonquery }

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

  get isRunning () { return this.status === APP_RUNNING }

  get isStoppped () { return this.status === APP_STOPPED }

  get isPaused () { return this.status === APP_PAUSED }

  start () {
    this.status = APP_RUNNING
    loadPlugins().then(() => {
      this.async(this.test, 100)
    })
    return this
  }

  stop () {
    unloadPlugins().then(() => {
      this.status = APP_STOPPED
    })
    return this
  }

  pause () {
    this.status = APP_PAUSED
    return this
  }

  resume () {
    this.status = APP_RUNNING
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
    let t = new Sprite(this.loadTexture('test.png'))
    this.stage.addChild(t)

    let text = new Text('This is a pixi text\nHere is another line\nAnd another!', { font: '20px "Glass TTY VT220"', fill: 0xFFFFFF })
    this.stage.addChild(text)
    text.moveTo(50, 50)

    let text2 = new Text('Cool another box of text', { font: '20px "Glass TTY VT220"', fill: 0xffcc66 })
    this.stage.addChild(text2)
    text2.moveTo(50, 120)

    this.screen.refresh()

    text.plug(['textedit', 'caret'])
    text2.plug(['textedit'])
  }

}

export let app = new App()
window.app = app

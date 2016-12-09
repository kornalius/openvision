import { p, name, version, electron, openFile, saveFile, messageBox, BrowserWindow, app, fs, path, IS_WIN, IS_OSX, IS_LINUX, dirs, raf, now, process } from './utils.js'

import './style/main.css'
// import t from './html/main.html'

// let el = document.createElement('div')
// el.innerHTML = t
// document.body.appendChild(el)

import { Base } from './objects/base.js'
import { plugins, Plugin, loadPlugins, unloadPlugins } from './plugin.js'
import { modes, Mode, loadModes, unloadModes } from './mode.js'
import { updates } from './updates.js'
import { commands } from './command.js'
import { shortcuts, keyboard } from './shortcut.js'
import { Screen } from './screen.js'

window.Plugin = Plugin

export const _STOPPED = 0
export const _RUNNING = 1
export const _PAUSED = 2

export var currentOver = null


export class Main extends Base {

  constructor (options) {
    super()

    this._status = 0

    this.plugins = plugins
    this.modes = modes
    this.Plugin = Plugin
    this.Mode = Mode
    this.commands = commands
    this.shortcuts = shortcuts
    this.keyboard = keyboard

    this.p = p
    this.name = name
    this.version = version
    this.app = app
    this.BrowserWindow = BrowserWindow
    this.electron = electron
    this.openFile = openFile
    this.saveFile = saveFile
    this.messageBox = messageBox
    this.fs = fs
    this.path = path
    this.IS_WIN = IS_WIN
    this.IS_OSX = IS_OSX
    this.IS_LINUX = IS_LINUX
    this.dirs = dirs
    this.raf = raf
    this.now = now
    this.process = process

    // Check for littleEndian
    let b = new ArrayBuffer(4)
    let a = new Uint32Array(b)
    let c = new Uint8Array(b)
    a[0] = 0xdeadbeef
    this.littleEndian = c[0] === 0xef

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

        let render = false

        for (let q of updates.queue) {
          q.object.__addedToUpdates = false
          if (q.render) {
            render = true
          }
          if (q.cb) {
            q.cb(q.object, ...q.args)
          }
        }

        updates.clear()

        if (render) {
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

  get stage () { return this.screen.stage }

  get children () { return this.stage.children }

  get defaults () { return this._defaults }

  get currentOver () { return currentOver }
  set currentOver (value) {
    if (currentOver !== value) {
      currentOver = value
    }
  }

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
      loadModes().then(() => {
        this.test()
      })
    })
    return this
  }

  stop () {
    unloadPlugins().then(() => {
      unloadModes().then(() => {
        this.status = _STOPPED
      })
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

  test () {
  }

}

export let main = new Main()
window.app = main

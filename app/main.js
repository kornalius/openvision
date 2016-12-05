import './utils.js'
import './globals.js'

import { loadPlugins, unloadPlugins } from './plugin.js'
import { loadModes, unloadModes } from './mode.js'
import { Command } from './command.js'
import { Shortcut } from './shortcut.js'

import './style/main.css'
// import t from './html/main.html'

// let el = document.createElement('div')
// el.innerHTML = t
// document.body.appendChild(el)

import { Base } from './objects/base.js'
import { updates } from './updates.js'

import Screen from './screen.js'
import Keyboard from './keyboard.js'
import Mouse from './mouse.js'

export const _STOPPED = 0
export const _RUNNING = 1
export const _PAUSED = 2

export class Main extends Base {

  constructor (options) {
    super()

    this._status = 0
    this._currentOver = null

    // Check for littleEndian
    let b = new ArrayBuffer(4)
    let a = new Uint32Array(b)
    let c = new Uint8Array(b)
    a[0] = 0xdeadbeef
    this.LE = c[0] === 0xef

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
    this.keyboard = new Keyboard(this)
    this.mouse = new Mouse(this)

    window.addEventListener('resize', this.resize.bind(this))

    let that = this
    PIXI.ticker.shared.add(time => {
      if (that.status === _RUNNING) {
        that.tick(time)

        let render = false

        for (let q of updates.queue) {
          q.obj.__addedToUpdates = false
          if (q.render) {
            render = true
          }
          if (q.cb) {
            q.cb(q.obj, ...q.args)
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
    this.keyboard.destroy()
    this.mouse.destroy()
    super.destroy()
  }

  get defaults () { return this._defaults }

  get currentOver () { return this._currentOver }
  set currentOver (value) {
    if (this._currentOver !== value) {
      this._currentOver = value
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

  key (shortcut, commands) {
    return new Shortcut(shortcut, commands)
  }

  resize () {
    this.screen.emit('resize')
    this.keyboard.emit('resize')
    this.mouse.emit('resize')
    return this
  }

  start () {
    this.status = _RUNNING
    loadPlugins(() => {
      loadModes(() => {
        this.test()
      })
    })
    return this
  }

  stop () {
    unloadPlugins()
    unloadModes()
    this.status = _STOPPED
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
    this.keyboard.tick(time)
    this.mouse.tick(time)
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

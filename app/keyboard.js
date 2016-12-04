import { Base } from './objects/base.js'

export default class Keyboard extends Base {

  constructor (main) {
    super()

    this._main = main

    this._mods = 0
    this._joystick = 0
    this._keys = {}

    window.addEventListener('keydown', this.onKeydown.bind(this))
    window.addEventListener('keyup', this.onKeyup.bind(this))
  }

  get mods () { return this._mods }
  get joystick () { return this._joystick }
  get keys () { return this._keys }

  get shift () { return this._mods & 0x01 }
  get ctrl () { return this._mods & 0x02 }
  get alt () { return this._mods & 0x04 }
  get meta () { return this._mods & 0x08 }
  get numpad () { return this._mods & 0x10 }
  get btn0 () { return this._joystick & 0x10 }
  get btn1 () { return this._joystick & 0x20 }
  get btn2 () { return this._joystick & 0x40 }
  get btn3 () { return this._joystick & 0x80 }
  get btn4 () { return this._joystick & 0x100 }
  get up () { return this._joystick & 0x01 }
  get down () { return this._joystick & 0x02 }
  get right () { return this._joystick & 0x04 }
  get left () { return this._joystick & 0x08 }

  eventDetails (e) {
    return {
      key: e.key,
      keyCode: e.keyCode,
      keys: this._keys,
      mods: this._mods,
      joystick: this._joystick,
      shift: this.shift,
      ctrl: this.ctrl,
      alt: this.alt,
      meta: this.meta,
      numpad: this.numpad,
      btn0: this.btn0,
      btn1: this.btn1,
      btn2: this.btn2,
      btn3: this.btn3,
      btn4: this.btn4,
      up: this.up,
      down: this.down,
      right: this.right,
      left: this.left,
    }
  }

  onKeydown (e) {
    let numpad = e.location === 3
    if (numpad) {
      this._mods |= 0x10
    }
    else {
      this._mods &= ~0x10
    }
    this._keys[e.keyCode] = 1

    switch (e.key) {
      case 'Shift':
        this._mods |= 0x01
        break

      case 'Control':
        this._mods |= 0x02
        break

      case 'Alt':
        this._mods |= 0x04
        break

      case 'Meta':
        this._mods |= 0x08
        break

      case 'ArrowUp':
        this._joystick |= 0x01
        break

      case '8':
        if (numpad) {
          this._joystick |= 0x01
        }
        break

      case 'ArrowDown':
        this._joystick |= 0x02
        break

      case '2':
        if (numpad) {
          this._joystick |= 0x02
        }
        break

      case 'ArrowLeft':
        this._joystick |= 0x04
        break

      case '4':
        if (numpad) {
          this._joystick |= 0x04
        }
        break

      case 'ArrowRight':
        this._joystick |= 0x08
        break

      case '6': // numpad 6
        if (numpad) {
          this._joystick |= 0x08
        }
        break

      case 'z': // button 0
        this._joystick |= 0x10
        break

      case 'x': // button 1
        this._joystick |= 0x20
        break

      case 'c': // button 2
        this._joystick |= 0x40
        break

      case ' ': // button 3
        this._joystick |= 0x80
        break

      case 'Enter': // button 4
        this._joystick |= 0x100
        break
    }

    this.emit('key.down', this.eventDetails(e))

    e.stopPropagation()
  }

  onKeyup (e) {
    let numpad = e.location === 3
    if (numpad) {
      this._mods |= 0x10
    }
    else {
      this._mods &= ~0x10
    }
    this._keys[e.keyCode] = 0

    switch (e.key) {
      case 'Shift':
        this._mods &= ~0x01
        break

      case 'Control':
        this._mods &= ~0x02
        break

      case 'Alt':
        this._mods &= ~0x04
        break

      case 'Meta':
        this._mods &= ~0x08
        break

      case 'ArrowUp':
        this._joystick &= ~0x01
        break

      case '8':
        if (numpad) {
          this._joystick &= ~0x01
        }
        break

      case 'ArrowDown':
        this._joystick &= ~0x02
        break

      case '2':
        if (numpad) {
          this._joystick &= ~0x02
        }
        break

      case 'ArrowLeft':
        this._joystick &= ~0x04
        break

      case '4':
        if (numpad) {
          this._joystick &= ~0x04
        }
        break

      case 'ArrowRight':
        this._joystick &= ~0x08
        break

      case '6': // numpad 6
        if (numpad) {
          this._joystick &= ~0x08
        }
        break

      case 'z': // button 0
        this._joystick &= ~0x10
        break

      case 'x': // button 1
        this._joystick &= ~0x20
        break

      case 'c': // button 2
        this._joystick &= ~0x40
        break

      case ' ': // button 3
        this._joystick &= ~0x80
        break

      case 'Enter': // button 4
        this._joystick &= ~0x100
        break
    }

    this.emit('key.up', this.eventDetails(e))

    e.stopPropagation()
  }

}

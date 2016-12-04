import { Display } from './display.js'
import { mixin } from '../globals.js'

class Container extends PIXI.Container {

}

mixin(Container.prototype, Display.prototype)

export { Container }

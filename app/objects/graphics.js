import { Container } from './container.js'
import { mixin } from '../globals.js'

class Graphics extends PIXI.Graphics {

}

mixin(Graphics.prototype, Container.prototype)

export { Graphics }

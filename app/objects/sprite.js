import { Container } from './container.js'
import { mixin } from '../globals.js'

class Sprite extends PIXI.Sprite {

}

mixin(Sprite.prototype, Container.prototype)

export { Sprite }

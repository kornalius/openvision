import { Sprite } from './sprite.js'
import { mixin } from '../globals.js'

class Text extends PIXI.Text {

}

mixin(Text.prototype, Sprite.prototype)

export { Text }

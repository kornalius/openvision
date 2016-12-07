import { SpriteMixin } from './sprite.js'
import { mix, Mixin } from 'mixwith'


export let TextMixin = Mixin(superclass => class extends superclass {

})


export class Text extends mix(PIXI.Text).with(TextMixin, SpriteMixin) {}

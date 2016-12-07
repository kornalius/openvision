import { ContainerMixin } from './container.js'
import { mix, Mixin } from 'mixwith'


export let SpriteMixin = Mixin(superclass => class extends superclass {

})


export class Sprite extends mix(PIXI.Sprite).with(SpriteMixin, ContainerMixin) {}

import { ContainerMixin } from './container.js'
import { mix, Mixin } from 'mixwith'


export let GraphicsMixin = Mixin(superclass => class extends superclass {

})


export class Graphics extends mix(PIXI.Graphics).with(GraphicsMixin, ContainerMixin) {}

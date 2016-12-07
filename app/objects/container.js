import { DisplayMixin } from './display.js'
import { mix, Mixin } from 'mixwith'


export let ContainerMixin = Mixin(superclass => class extends superclass {

})


export class Container extends mix(PIXI.Container).with(ContainerMixin, DisplayMixin) {}

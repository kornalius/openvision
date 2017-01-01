import { BaseMixin } from '../base.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { DBMixin } from '../db.js'
import { Encoder, e, d } from '../../lib/encoder.js'


export let GraphicsMixin = Mixin(superclass => class GraphicsMixin extends superclass {

})


export class Graphics extends mix(PIXI.Graphics).with(GraphicsMixin, DBMixin, DisplayMixin, ContainerMixin, BaseMixin, PluginMixin, CommandMixin, ShortcutMixin) {}


Encoder.register('Graphics', {
  inherit: 'Container',

  encode: obj => {
    let doc = {
      graphicsData: new Array(obj.graphicsData.length)
    }
    for (let i = 0; i < obj.graphicsData.length; i++) {
      doc[i] = e(obj.graphicsData[i], obj, doc)
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Graphics()
    for (let g of doc.graphicsData) {
      obj.graphicsData.push(d(g, doc, obj))
    }
    obj.currentPath = _.last(obj.graphicsData)
    obj.updateLocalBounds()
    return obj
  },
})


Encoder.register('GraphicsData', {

  encode: obj => {
    let doc = {}
    doc.lineWidth = e('lineWidth', obj, doc)
    doc.lineColor = e('lineColor', obj, doc)
    doc.lineAlpha = e('lineAlpha', obj, doc)
    doc.fillColor = e('fillColor', obj, doc)
    doc.fillAlpha = e('fillAlpha', obj, doc)
    doc.fill = e('fill', obj, doc)
    doc.type = e('type', obj, doc)

    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new PIXI.GraphicsData()
    obj.lineWidth = d('lineWidth', doc, obj)
    obj.lineColor = d('lineColor', doc, obj)
    obj.lineAlpha = d('lineAlpha', doc, obj)
    obj.fillColor = d('fillColor', doc, obj)
    obj.fillAlpha = d('fillAlpha', doc, obj)
    obj.fill = d('fill', doc, obj)
    obj.type = d('type', doc, obj)
    obj._lineTint = obj.lineColor
    obj._fillTint = obj.fillColor
    return obj
  },
})

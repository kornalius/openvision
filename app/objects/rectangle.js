import { Graphics } from './graphics.js'


export class Rectangle extends Graphics {

  constructor (width, height, color = 0xFFFFFF, alpha = 255) {
    super()
    this.beginFill(color, alpha)
    this.drawRect(0, 0, width - 1, height - 1)
    this.endFill()
  }

}

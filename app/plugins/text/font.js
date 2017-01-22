
export default class Font extends Plugin {

  constructor () {
    super()
    this.name = 'font'
    this.desc = 'Container has font styling.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      size: { value: 20, options: 'font.size' },
      name: { value: 'Glass TTY VT220', options: 'font.name' },
      color: { value: 0xFFFFFF, options: 'font.color' },
      align: { value: 'left', options: 'font.align' },
      stroke: { value: null, options: 'font.stroke' },
      strokeThickness: { value: 0, options: 'font.strokeThickness' },
      wordWrap: { value: false, options: 'font.wordWrap' },
      wordWrapWidth: { value: 100, options: 'font.wordWrapWidth' },
      letterSpacing: { value: 0, options: 'font.letterSpacing' },
      breakWords: { value: false, options: 'font.breakWords' },
      lineHeight: { value: 0, options: 'font.lineHeight' },
      dropShadow: { value: false, options: 'font.dropShadow' },
      dropShadowColor: { value: 0x000000, options: 'font.dropShadowColor' },
      dropShadowAngle: { value: Math.PI / 4, options: 'font.dropShadowAngle' },
      dropShadowDistance: { value: 5, options: 'font.dropShadowDistance' },
      dropShadowBlur: { value: 0, options: 'font.dropShadowBlur' },
      padding: { value: 0, options: 'font.padding' },
      textBaseline: { value: 'alphabetic', options: 'font.textBaseline' },
      lineJoin: { value: 'miter', options: 'font.lineJoin' },
      miterLimit: { value: 10, options: 'font.miterLimit' },
    }
  }

  get fontObject () {
    return {
      font: this.size + 'px "' + this.name + '"',
      fill: this.color,
      align: this.align,
      stroke: this.stroke,
      strokeThickness: this.strokeThickness,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      letterSpacing: this.letterSpacing,
      breakWords: this.breakWords,
      lineHeight: this.lineHeight,
      dropShadow: this.dropShadow,
      dropShadowColor: this.dropShadowColor,
      dropShadowAngle: this.dropShadowAngle,
      dropShadowDistance: this.dropShadowDistance,
      dropShadowBlur: this.dropShadowBlur,
      padding: this.padding,
      textBaseline: this.textBaseline,
      lineJoin: this.lineJoin,
      miterLimit: this.miterLimit,
    }
  }

}

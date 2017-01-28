
export default class Font extends Plugin {

  constructor () {
    super()
    this.name = 'font'
    this.desc = 'Container has font styling.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      size: { value: 20, options: 'size' },
      name: { value: 'Glass TTY VT220', options: 'name' },
      style: { value: 'normal', options: 'style' },
      variant: { value: 'normal', options: 'variant' },
      weight: { value: 'normal', options: 'weight' },
      color: { value: 0xFFFFFF, options: 'color' },
      align: { value: 'left', options: 'align' },
      stroke: { value: null, options: 'stroke' },
      strokeThickness: { value: 0, options: 'strokeThickness' },
      wordWrap: { value: false, options: 'wordWrap' },
      wordWrapWidth: { value: 100, options: 'wordWrapWidth' },
      letterSpacing: { value: 0, options: 'letterSpacing' },
      breakWords: { value: false, options: 'breakWords' },
      lineHeight: { value: 0, options: 'lineHeight' },
      dropShadow: { value: false, options: 'dropShadow' },
      dropShadowColor: { value: 0x000000, options: 'dropShadowColor' },
      dropShadowAngle: { value: Math.PI / 4, options: 'dropShadowAngle' },
      dropShadowDistance: { value: 5, options: 'dropShadowDistance' },
      dropShadowBlur: { value: 0, options: 'dropShadowBlur' },
      padding: { value: 0, options: 'padding' },
      textBaseline: { value: 'alphabetic', options: 'textBaseline' },
      lineJoin: { value: 'miter', options: 'lineJoin' },
      miterLimit: { value: 10, options: 'miterLimit' },
    }
  }

  get fontObject () {
    return new PIXI.TextStyle({
      fontFamily: this.name,
      fontSize: this.size,
      fontStyle: this.style,
      fontWeight: this.weight,
      fontVariant: this.variant,
      fill: this.color,
      align: this.align,
      stroke: this.stroke,
      strokeThickness: this.strokeThickness,
      breakWords: this.breakWords,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      letterSpacing: this.letterSpacing,
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
    })
  }

}

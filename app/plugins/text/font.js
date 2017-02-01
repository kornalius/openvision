
export default class Font extends Plugin {

  constructor () {
    super()
    this.name = 'font'
    this.desc = 'Container has font styling.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      size: { value: 20 },
      name: { value: 'Glass TTY VT220' },
      style: { value: 'normal' },
      variant: { value: 'normal' },
      weight: { value: 'normal' },
      color: { value: 0xFFFFFF },
      align: { value: 'left' },
      stroke: { value: null },
      strokeThickness: { value: 0 },
      wordWrap: { value: false },
      wordWrapWidth: { value: 100 },
      letterSpacing: { value: 0 },
      breakWords: { value: false },
      lineHeight: { value: 0 },
      dropShadow: { value: false },
      dropShadowColor: { value: 0x000000 },
      dropShadowAngle: { value: Math.PI / 4 },
      dropShadowDistance: { value: 5 },
      dropShadowBlur: { value: 0 },
      padding: { value: 0 },
      textBaseline: { value: 'alphabetic' },
      lineJoin: { value: 'miter' },
      miterLimit: { value: 10 },
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

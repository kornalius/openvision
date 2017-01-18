
export default class Font extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'font'
    this._desc = 'Container has font styling.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/18/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._font = {
        size: _.get(options, 'font.size', 20),
        name: _.get(options, 'font.name', 'Glass TTY VT220'),
        color: _.get(options, 'font.color', 0xFFFFFF),
        align: _.get(options, 'font.align', 'left'),
        stroke: _.get(options, 'font.stroke', null),
        strokeThickness: _.get(options, 'font.strokeThickness', 0),
        wordWrap: _.get(options, 'font.wordWrap', false),
        wordWrapWidth: _.get(options, 'font.wordWrapWidth', 100),
        letterSpacing: _.get(options, 'font.letterSpacing', 0),
        breakWords: _.get(options, 'font.breakWords', false),
        lineHeight: _.get(options, 'font.lineHeight', 0),
        dropShadow: _.get(options, 'font.dropShadow', false),
        dropShadowColor: _.get(options, 'font.dropShadowColor', 0x000000),
        dropShadowAngle: _.get(options, 'font.dropShadowAngle', Math.PI / 4),
        dropShadowDistance: _.get(options, 'font.dropShadowDistance', 5),
        dropShadowBlur: _.get(options, 'font.dropShadowBlur', 0),
        padding: _.get(options, 'font.padding', 0),
        textBaseline: _.get(options, 'font.textBaseline', 'alphabetic'),
        lineJoin: _.get(options, 'font.lineJoin', 'miter'),
        miterLimit: _.get(options, 'font.miterLimit', 10),
      }
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._font
    }
  }

  get fontSize () { return this._font.size }
  set fontSize (value) {
    this._font.size = value
  }

  get fontName () { return this._font.name }
  set fontName (value) {
    this._font.name = value
  }

  get fontColor () { return this._font.color }
  set fontColor (value) {
    this._font.color = value
  }

  get fontAlign () { return this._font.align }
  set fontAlign (value) {
    this._font.align = value
  }

  get fontStroke () { return this._font.stroke }
  set fontStroke (value) {
    this._font.stroke = value
  }

  get fontStrokeThickness () { return this._font.strokeThickness }
  set fontStrokeThickness (value) {
    this._font.strokeThickness = value
  }

  get fontWordWrap () { return this._font.wordWrap }
  set fontWordWrap (value) {
    this._font.wordWrap = value
  }

  get fontWordWrapWidth () { return this._font.wordWrapWidth }
  set fontWordWrapWidth (value) {
    this._font.wordWrapWidth = value
  }

  get fontLetterSpacing () { return this._font.letterSpacing }
  set fontLetterSpacing (value) {
    this._font.letterSpacing = value
  }

  get fontBreakWords () { return this._font.breakWords }
  set fontBreakWords (value) {
    this._font.breakWords = value
  }

  get fontLineHeight () { return this._font.lineHeight }
  set fontLineHeight (value) {
    this._font.lineHeight = value
  }

  get fontDropShadow () { return this._font.dropShadow }
  set fontDropShadow (value) {
    this._font.dropShadow = value
  }

  get fontDropShadowColor () { return this._font.dropShadowColor }
  set fontDropShadowColor (value) {
    this._font.dropShadowColor = value
  }

  get fontDropShadowAngle () { return this._font.dropShadowAngle }
  set fontDropShadowAngle (value) {
    this._font.dropShadowAngle = value
  }

  get fontDropShadowDistance () { return this._font.dropShadowDistance }
  set fontDropShadowDistance (value) {
    this._font.dropShadowDistance = value
  }

  get fontDropShadowBlur () { return this._font.dropShadowBlur }
  set fontDropShadowBlur (value) {
    this._font.dropShadowBlur = value
  }

  get fontPadding () { return this._font.padding }
  set fontPadding (value) {
    this._font.padding = value
  }

  get fontTextBaseline () { return this._font.textBaseline }
  set fontTextBaseline (value) {
    this._font.textBaseline = value
  }

  get fontLineJoin () { return this._font.lineJoin }
  set fontLineJoin (value) {
    this._font.lineJoin = value
  }

  get fontMiterLimit () { return this._font.miterLimit }
  set fontMiterLimit (value) {
    this._font.miterLimit = value
  }

  get fontObject () {
    return {
      font: this.fontSize + 'px "' + this.fontName + '"',
      fill: this.fontColor,
      align: this.fontAlign,
      stroke: this.fontStroke,
      strokeThickness: this.fontStrokeThickness,
      wordWrap: this.fontWordWrap,
      wordWrapWidth: this.fontWordWrapWidth,
      letterSpacing: this.fontLetterSpacing,
      breakWords: this.fontBreakWords,
      lineHeight: this.fontLineHeight,
      dropShadow: this.fontDropShadow,
      dropShadowColor: this.fontDropShadowColor,
      dropShadowAngle: this.fontDropShadowAngle,
      dropShadowDistance: this.fontDropShadowDistance,
      dropShadowBlur: this.fontDropShadowBlur,
      padding: this.fontPadding,
      textBaseline: this.fontTextBaseline,
      lineJoin: this.fontLineJoin,
      miterLimit: this.fontMiterLimit,
    }
  }

}

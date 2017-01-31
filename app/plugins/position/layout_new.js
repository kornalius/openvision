
export default class Layout extends Plugin {

  constructor () {
    super()
    this.name = 'layout'
    this.desc = 'Allow automating layouting children of a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = []
    this.properties = {
      autoArrange: { value: true, options: true }, // h, v
      autoSize: { value: '', options: true }, // w, h
      wrapControls: { value: false, options: true },
      align: { value: '', options: true }, // t, l, r, b, c, m
    }
  }

  attach ($, options) {
    this._lines = []
    this.layout()
  }

  layout () {
    let $ = this.$
    let parent = $.parent
    let layout = $.layout

    // type
    //   TControlRect = record
    //     control: TControl;
    //     boundsRect: TRect;
    //     lineBreak: Boolean;
    //   }

    let aktX, aktY, newX, newY, maxY, newMaxX = 0
    let controlMaxX, controlMaxY = 0
    let tmpWidth, tmpHeight = 0
    let oldHeight, oldWidth = 0
    let offsetX, offsetY = 0
    let numControlsPerLine = 0
    let controlRects = []
    let lineOffsets = []
    let lineCount, len = 0
    let controlSize = 0

    if (layout.) {
      $._arrangeWidth = 0
      $._arrangeHeight = 0
      $._arranging = true

      oldHeight = $.height
      oldWidth = $.width
      tmpHeight = $.height
      tmpWidth = $.width
      aktY = layout.BorderTop
      aktX = layout.BorderLeft
      maxY = -1

      controlMaxX = layout.autoSize in ['w', 'wh'] ? tmpWidth - 2 * layout.BorderLeft : -1
      controlMaxY = layout.autoSize in ['h', 'wh'] ? tmpHeight - 2 * layout.BorderTop : -1

      let children = _.sortBy(_.filter($.children, c => !c.isMask && c.visible), 'layout.order')

      controlRects = new Array(children.length)

      for (let c of children) {
        if (c instanceof app.Container) {
          c.rearrange()
        }
        controlSize = { cx: c.width, cy: c.height }
        if (controlSize.cx + 2 * layout.BorderLeft > tmpWidth) {
          tmpWidth = controlSize.cx + 2 * layout.BorderLeft
        }
      }

      if (tmpWidth > layout.MaxWidth && layout.MaxWidth > 0) {
        tmpWidth = layout.MaxWidth
      }

      numControlsPerLine = 0
      lineCount = 0
      for (let c of $.children) {
        lastOrder = c.order
        controlRects[i].control = null
        controlRects[i].lineBreak = false
        controlSize = { cx: c.width, cy: c.height }
        newMaxX = aktX + controlSize.cx + layout.DistanceHorizontal + layout.BorderLeft

        if ((layout.MaxControlsPerLine > 0 && numControlsPerLine >= layout.MaxControlsPerLine) ||
            ((newMaxX > tmpWidth && !(layout.autoSize in ['w', 'wh']) ||
            (newMaxX > layout.MaxWidth && layout.MaxWidth > 0))) &&
            aktX > layout.BorderLeft && layout.WrapControls) {
          aktX = layout.BorderLeft
          aktY = aktY + maxY + layout.DistanceVertical
          maxY = -1
          newX = aktX
          newY = aktY
          numControlsPerLine = 1
          controlRects[i].lineBreak = true
          lineCount++
        }
        else {
          newX = aktX
          newY = aktY
          numControlsPerLine++
        }
        aktX = aktX + controlSize.cx
        if (aktX > controlMaxX) {
          controlMaxX = aktX
        }
        aktX = aktX + layout.DistanceHorizontal
        controlRects[i].control = c
        controlRects[i].boundsRect = { x: newX, y: newY, width: newX + controlSize.cx, height: newY + controlSize.cy }
        if (c.height > maxY) {
          maxY = controlSize.cy
        }
        controlMaxY = aktY + maxY
      }
      if (controlRects.length > 0 && !_.last(controlRects).lineBreak) {
        lineCount++
      }

      // Vertical/Horizontal alignment
      offsetX = 0
      offsetY = 0
      if (!(layout.autoSize in ['wh', 'h'])) {
        switch (layout.VerticalAlignment) {
          case 'm':
            offsetY = (this.$.innerHeight - controlMaxY) / 2
            break
          case 'b':
            offsetY = this.$.innerHeight - controlMaxY
            break
        }
      }

      if (!(layout.autoSize in ['wh', 'w'])) {
        switch (layout.HorizontalAlignment) {
          case 'c':
            offsetX = (this.$.innerWidth - controlMaxX) / 2
            break
          case 'r':
            offsetX = this.$.innerWidth - controlMaxX
            break
        }
      }

      // Calculate the horizontal line alignment
      if (layout.HorizontalAlignLines) {
        lineOffsets = new Array(lineCount)
        len = controlRects.length
        i = 0
        lineCount = 0
        while (i < len) {
          // Skip unused slots
          while (i < len && controlRects[i].control === null) {
            i++
          }
          if (i < len) {
            lineOffsets[lineCount] = controlRects[i].boundsRect.x
            // Find last control in the line
            while (i + 1 < len && !controlRects[i + 1].lineBreak) {
              i++
            }
            lineOffsets[lineCount] = (controlMaxX - (controlRects[i].boundsRect.x + controlRects[i].boundsRect.width - lineOffsets[lineCount])) / 2
            lineCount++
          }
          i++
        }
      }

      // Apply the new BoundRects to the controls
      lineCount = 0
      for (let i = 0; i < controlRects.length; i++) {
        if (controlRects[i].control !== null) {
          OffsetRect(controlRects[i].boundsRect, offsetX, offsetY)
          if (layout.HorizontalAlignLines) {
            if (controlRects[i].lineBreak) {
              lineCount++
            }
            OffsetRect(controlRects[i].boundsRect, lineOffsets[lineCount], 0)
          }
          SetControlBounds(controlRects[i].control, controlRects[i].boundsRect)
        }
      }

      // Adjust panel bounds
      if (layout.autoSize in ['w', 'wh']) {
        if (controlMaxX >= 0) {
          if (layout.MaxWidth > 0 && controlMaxX >= layout.MaxWidth) {
            tmpWidth = layout.MaxWidth
          }
          else {
            tmpWidth = controlMaxX + layout.BorderLeft
          }
        }
        else {
          tmpWidth = 0
        }
      }

      if (layout.autoSize in ['h', 'wh']) {
        if (controlMaxY >= 0) {
          tmpHeight = controlMaxY + layout.BorderTop
        }
        else {
          tmpHeight = 0
        }
      }

      if (this.width !== tmpWidth) {
        this.width = tmpWidth
      }

      if (this.height !== tmpHeight) {
        this.height = tmpHeight
      }

      $._arrangeWidth = controlMaxX + 2 * layout.BorderLeft
      $._arrangeHeight = controlMaxY + 2 * layout.BorderTop

      if (oldWidth !== tmpWidth || oldHeight !== this.height) {
        this.UpdateWindow(Handle)
      }

      $._arranging = false
    }
  }

}

PIXI.Point.prototype.distance = function (target) {
  return Math.sqrt((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y))
}

PIXI.Point.prototype.toString = function () {
  return _.template('(#{x}, #{y})')(this)
}

PIXI.Rectangle.prototype.toString = function () {
  return _.template('(#{x}, #{y}, #{x + width}, #{y + height})(#{width}, #{height})')(this)
}

PIXI.interaction.InteractionManager.prototype.processInteractive = function processInteractive (point, displayObject, func, hitTest, interactive) {
  if (!displayObject || !displayObject.visible) {
    return false
  }

  interactive = displayObject.interactive || interactive

  let hit = false
  let interactiveParent = interactive

  // if the displayobject has a hitArea, then it does not need to hitTest children.
  if (displayObject.hitArea) {
    interactiveParent = false
  }

  // it has a mask! Then lets hit test that before continuing..
  if (hitTest && displayObject._mask) {
    if (!displayObject._mask.containsPoint(point)) {
      hitTest = false
    }
  }

  // it has a filterArea! Same as mask but easier, its a rectangle
  if (hitTest && displayObject.filterArea) {
    if (!displayObject.filterArea.contains(point.x, point.y)) {
      hitTest = false
    }
  }

  // ** FREE TIP **! If an object is not interactive or has no buttons in it
  // (such as a game scene!) set interactiveChildren to false for that displayObject.
  // This will allow pixi to completely ignore and bypass checking the displayObjects children.
  if (displayObject.interactiveChildren && displayObject.children) {
    let children = displayObject.children

    for (let i = children.length - 1; i >= 0; i--) {
      let child = children[i]

      // time to get recursive.. if this function will return if something is hit..
      if (this.processInteractive(point, child, func, hitTest, interactiveParent)) {
        // its a good idea to check if a child has lost its parent.
        // this means it has been removed whilst looping so its best
        if (!child.parent) {
          continue
        }

        hit = true

        // we no longer need to hit test any more objects in this container as we we
        // now know the parent has been hit
        interactiveParent = false

        // If the child is interactive , that means that the object hit was actually
        // interactive and not just the child of an interactive object.
        // This means we no longer need to hit test anything else. We still need to run
        // through all objects, but we don't need to perform any hit tests.

        hitTest = false

        // we can break now as we have hit an object.
      }
    }
  }

  // no point running this if the item is not interactive or does not have an interactive parent.
  if (interactive) {
    // if we are hit testing (as in we have no hit any objects yet)
    // We also don't need to worry about hit testing if once of the displayObjects children
    // has already been hit!
    if (hitTest && !hit) {
      if (displayObject.hitArea) {
        displayObject.worldTransform.applyInverse(point, this._tempPoint)
        hit = displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)
      }
      else if (displayObject.containsPoint) {
        hit = displayObject.containsPoint(point)
      }
    }

    if (displayObject.interactive && !this.eventData.stopped) {
      if (hit && !this.eventData.target) {
        this.eventData.target = displayObject
        this.mouse.target = displayObject
        this.pointer.target = displayObject
      }

      func(displayObject, hit)
    }
  }

  return hit
}

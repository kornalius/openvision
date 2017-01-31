export function maxX (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'x') }
export function minX (group) { return _.minBy(_.filter(group, c => !c.isMask), 'x') }

export function maxY (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'y') }
export function minY (group) { return _.minBy(_.filter(group, c => !c.isMask), 'y') }

export function maxZ (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'z') }
export function minZ (group) { return _.minBy(_.filter(group, c => !c.isMask), 'z') }

export function maxWidth (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'width') }
export function minWidth (group) { return _.minBy(_.filter(group, c => !c.isMask), 'width') }

export function maxHeight (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'height') }
export function minHeight (group) { return _.minBy(_.filter(group, c => !c.isMask), 'height') }

export function maxRight (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'right') }
export function minRight (group) { return _.minBy(_.filter(group, c => !c.isMask), 'right') }

export function maxBottom (group) { return _.maxBy(_.filter(group, c => !c.isMask), 'bottom') }
export function minBottom (group) { return _.minBy(_.filter(group, c => !c.isMask), 'bottom') }

export function boundingRect (group) {
  let x = minX(group)
  let y = minY(group)
  let right = maxRight(group)
  let bottom = maxBottom(group)
  let width = right - x
  let height = bottom - y
  return { x, y, width, height, right, bottom }
}

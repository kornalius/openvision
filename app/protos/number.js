import { instanceFunctions } from '../utils.js'
import math from 'mathjs'
import is from 'is_js'


instanceFunctions(Number.prototype, Math, [
  'radToDeg',
  'degToRad',
  'sign',
  'roundCeil',
  'loop',
  'add',
  'sub',
  'mul',
  'div',
])


instanceFunctions(Number.prototype, is, [
  ['isEven', 'even'],
  ['isOdd', 'odd'],
  ['isPositive', 'positive'],
  ['isNegative', 'negative'],
  ['isDecimal', 'decimal'],
  ['isInteger', 'integer'],
  ['isNaN', 'nan'],
  ['isFinite', 'finite'],
  ['isInfinite', 'infinite'],
])


instanceFunctions(Number.prototype, math, [
  'cbrt',
  'cube',
  'nthRoot',
])

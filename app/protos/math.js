import math from 'mathjs'
import { instanceFunction, instanceFunctions } from '../utils.js'


instanceFunction(Math, 'round', function (value, places, increment) {
  increment = increment || 1e-20
  let factor = 10 / (10 * (increment || 10))
  return Number((Math.ceil(factor * Number(value)) / factor).toFixed(places))
})

instanceFunction(Math, 'sign', function (value) {
  if (value > 0) {
    return 1
  }
  else if (value < 0) {
    return -1
  }
  else {
    return 0
  }
})

instanceFunction(Math, 'roundCeil', function (value, places) {
  let powed = Math.pow(10, places)
  return Math.ceil(value * powed) / powed
})

instanceFunction(Math, 'wrap', function (value, min, max) {
  if (min > max) {
    let ref = [max, min]
    min = ref[0]
    max = ref[1]
  }
  if (value < min) {
    return min
  }
  else if (value > max) {
    return max
  }
  else {
    return value
  }
})

instanceFunction(Math, 'loop', function (value, min, max) {
  if (min === max) {
    return min
  }
  else {
    if (min > max) {
      let ref = [max, min]
      min = ref[0]
      max = ref[1]
    }
    let vol = max - min
    let val = value - max
    while (val < 0) {
      val += vol
    }
    return val % vol + min
  }
})

instanceFunction(Math, 'add', function () {
  let num = 0
  for (let v of arguments) {
    num += v
  }
  return num
})

instanceFunction(Math, 'sub', function () {
  let num = 0
  let first = true
  for (let v of arguments) {
    if (first) {
      num = v
    }
    else {
      num -= v
    }
  }
  return num
})

instanceFunction(Math, 'mul', function () {
  let num = 1
  for (let v of arguments) {
    num *= v
  }
  return num
})

instanceFunction(Math, 'div', function () {
  let num = 0
  let first = true
  for (let v of arguments) {
    if (first) {
      num = v
    }
    else {
      num /= v
    }
  }
  return num
})

instanceFunction(Math, 'radToDeg', function (value) { return value * 57.29577951308232 })

instanceFunction(Math, 'degToRad', function (value) { return value * 0.017453292519943295 })

instanceFunction(Math, 'clockwise', function (from, to, range) {
  while (to > from) {
    to -= range
  }
  while (to < from) {
    to += range
  }
  return to - from
})

instanceFunction(Math, 'nearer', function (from, to, range) {
  let c = Math.clockwise(from, to, range)
  return c >= range * 0.5 ? c - range : c
})

instanceFunction(Math, 'avg', function () { return Math.add.apply(Math, arguments) / arguments.length })

instanceFunction(Math, 'between', function (from, to, ratio) { return from + (to - from) * ratio })

let oldMathRandom = Math.random

instanceFunction(Math, 'random', function () {
  let nums = arguments
  if (nums.length === 0) {
    return oldMathRandom()
  }
  else if (nums.length === 1) {
    return oldMathRandom() * nums[0]
  }
  else {
    return oldMathRandom() * (nums[1] - nums[0]) + nums[0]
  }
})

instanceFunctions(Math, math, [
  'E',
  'i',
  'Infinity',
  'LN2',
  'LN10',
  'LOG2E',
  'LOG10E',
  'phi',
  'pi',
  'SQRT1_2',
  'SQRT2',
  'lsolve',
  'lup',
  'lusolve',
  'slu',
  'usolve',
  'cbrt',
  'cube',
  'dotDivide',
  'dotMultiply',
  'dotPow',
  'fix',
  'gcd',
  'hypot',
  'lcm',
  'mod',
  'norm',
  'nthRoot',
  'unaryMinus',
  'unaryPlus',
  'xgcd',
  'bitAnd',
  'bitNot',
  'bitOr',
  'bitXor',
  'leftShift',
  'rightArithShift',
  'rightLogShift',
  'bellNumbers',
  'catalan',
  'composition',
  'stirlingS2',
  'mean',
  'median',
  'mode',
  'prod',
  'std',
  'combinations',
  'factorial',
  'gamma',
  'multinomial',
  'permutations',
  'distance',
  'intersect',
  'and',
  'or',
  'xor',
  'not',
  'unit',
  'to',
])

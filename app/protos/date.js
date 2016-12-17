import dm from 'date-math'
import is from 'is_js'
import { instanceFunctions } from '../utils.js'


instanceFunctions(Date, dm, [
  'hour',
  'minute',
  'second',
  'day',
  'week',
  'month',
  'year',
])

instanceFunctions(Date, is, [
  ['isToday', 'today'],
  ['isYesterday', 'yesterday'],
  ['isTomorrow', 'tomorrow'],
  ['isPast', 'past'],
  ['isFuture', 'future'],
  ['isDay', 'day'],
  ['isYear', 'year'],
  ['isMonth', 'month'],
  ['isLeapYear', 'leapYear'],
  ['isWeekend', 'weekend'],
  ['isWeekday', 'weekday'],
  ['isInRange', 'inDateRange'],
  ['isLastWeek', 'inLastWeek'],
  ['isLastMonth', 'inLastMonth'],
  ['isLastYear', 'inLastYear'],
  ['isNextWeek', 'inNextWeek'],
  ['isNextMonth', 'inNextMonth'],
  ['isNextYear', 'inNextYear'],
  ['isQuarter', 'quarterOfYear'],
  ['isDLST', 'dayLightSavingTime'],
])

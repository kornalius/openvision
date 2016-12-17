import Scanner from 'str-scan'
import { parse } from 'levn'
import { format } from 'string-kit'
import us from 'underscore.string'
import is from 'is_js'
import { instanceFunctions } from '../utils.js'


String.prototype.parse = parse

String.prototype.format = format

String.prototype.scan = function () { return new Scanner(this) }

let oldReplace = String.prototype.replace
String.prototype.replace = function (find, replace, ignorecase) {
  return oldReplace.call(this, find, replace, (ignorecase ? 'i' : ''))
}

instanceFunctions(String, us.exports(), [
  'chop',
  'classify',
  'clean',
  'count',
  'lastIndexOf',
  'levenshtein',
  'replaceAll',
  'sprintf',
  'surround',
  'swapCase',
  'uncamelcase',
  'uncapitalize',
  'undasherize',
  'unsurround',
  'upper',
  'lower',
])

instanceFunctions(String, is, [
  ['is.space', 'space'],
  ['is.url', 'url'],
  ['is.email', 'email'],
  ['is.creditCard', 'creditCard'],
  ['is.alphaNum', 'alphaNumeric'],
  ['is.time', 'timeString'],
  ['is.date', 'dateString'],
  ['is.zipCode', 'usZipCode'],
  ['is.postalCode', 'caPostalCode'],
  ['is.ukPostCode', 'ukPostCode'],
  ['is.phone', 'nanpPhone'],
  ['is.euPhone', 'eppPhone'],
  ['is.sSN', 'socialSecurityNumber'],
  ['is.char', 'char'],
  ['is.affirmative', 'affirmative'],
  ['is.hex', 'hexadecimal'],
  ['is.hexColor', 'hexColor'],
  ['is.ip', 'ip'],
  ['is.ipv4', 'ipv4'],
  ['is.ipv6', 'ipv6'],
  ['is.upper', 'upperCase'],
  ['is.lower', 'lowerCase'],
  ['is.capitalized])', 'capitalized'],
])

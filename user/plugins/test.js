
export default class extends Plugin {

  constructor () {
    super()
    this.name = 'test'
  }

  attach ($, options = {}) {
    $._test = true
  }

  detach ($) {
    delete $._test
  }

  test () {
    console.log('test')
  }

}

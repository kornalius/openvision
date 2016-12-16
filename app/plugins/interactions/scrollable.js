
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'scrollable'
    this._desc = 'Allow container to be scrolled around.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/13/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj._scrollable = {
      x: _.get(options, 'horizontal', true),
      y: _.get(options, 'vertical', true),
    }
    this._onScrollBounded = this.onScroll.bind(obj)
    obj.on('scroll', this._onScrollBounded)
  }

  unload (obj) {
    obj.off('scroll', this._onScrollBounded)
    delete obj._scrollable
    super.unload(obj)
  }

  get scrollable () { return this._scrollable }

  onScroll (detail) {
    // console.log(detail)
  }

}

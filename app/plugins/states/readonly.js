
export default class Readonly extends Plugin {

  constructor () {
    super()
    this.name = 'readonly'
    this.desc = 'Allow container to be in a readonly state.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      readonly: { value: true, update: true },
    }
  }

}


export default class Titlebar extends Plugin {

  constructor () {
    super()
    this.name = 'titlebar'
    this.desc = 'Container is a window\'s title bar.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['bar']
    this.properties = {
      title: { value: 'Untitled', options: 'title' },
    }
  }

}

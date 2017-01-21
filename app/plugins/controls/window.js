
export default class Window extends Plugin {

  constructor () {
    super()
    this.name = 'window'
    this.desc = 'Allow a container to act as a window.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control', 'titlebar']
    this.properties = {
      title: { value: 'Untitled', options: 'title' },
    }
  }

}

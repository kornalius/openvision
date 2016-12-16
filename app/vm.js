
export let VM = class {

  exec (code) {
    return System.module(code)
  }

  _test () {
    let code = '\n\
      import "app-plugins/states"\n\
      export const getMessage = () => "Hello World"; console.log(getMessage())\n\
    '
    return System.module(code)
  }

}

export let vm = new VM()

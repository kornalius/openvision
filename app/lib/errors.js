
export let defineErrors = errors => {
  let e = {}

  for (let k in errors) {
    let errno = k
    let errName = errors[k].name
    let defaultMessage = errors[k].message

    let CustomError = class CustomError extends Error {

      constructor (options, msg) {
        super()

        this.name = errName
        this.code = errName
        this.errno = errno
        this.message = msg || defaultMessage
        this.options = options
        this.stack = (new Error(this.message)).stack
      }

      toString () {
        return this.name + ': ' + this.message + ' ' + JSON.stringify(this.options)
      }

    }

    e[errno] = e[errName] = CustomError
  }

  return e
}

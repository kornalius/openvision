
export var currentContext = null

export var contextsStack = []


export class ContextsMixin {

  setContext (name) {
    this.unsetContext()
    currentContext = name
    return this
  }

  pushContext (name) {
    contextsStack.push(currentContext)
    currentContext = name
    return this
  }

  popContext (name) {
    if (contextsStack.length > 0) {
      currentContext = contextsStack.pop()
    }
    return this
  }

  unsetContext () {
    contextsStack = []
    currentContext = null
    return this
  }

  isContext (name) {
    return currentContext === name
  }

  hasContext (name) {
    return this.isContext(name) || _.contains(contextsStack, name)
  }

}

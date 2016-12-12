
export var currentContext = null


export var contextsStack = []


export let ContextsMixin = Mixin(superclass => class ContextsMixin extends superclass {

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
    return this.isContext(name) || _.includes(contextsStack, name)
  }

})

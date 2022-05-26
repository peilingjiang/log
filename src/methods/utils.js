export const getTimestamp = () => {
  return {
    now: performance.now(),
    date: new Date(),
  }
}

export const getGroupIds = logs => {
  return Object.keys(logs)
}

/* -------------------------------------------------------------------------- */

export const assertExistence = a => {
  return a !== undefined && a !== null
}

export const assertNumber = a => {
  return typeof a === 'number' && !isNaN(a)
}

export const assertArray = a => {
  return assertExistence(a) && Array.isArray(a)
}

export const assertString = a => {
  return typeof a === 'string' || a instanceof String
}

export const assertClass = (a, nameOfObjectClass) => {
  return a instanceof nameOfObjectClass
}

export const assertObject = (a, shape = null) => {
  if (!assertExistence(a) || typeof a !== 'object') return false

  if (assertArray(shape))
    for (const key of shape) if (!assertExistence(a[key])) return false

  return true
}

export const assertArguments = argsAndAssertions => {
  for (const argAndAssertion of argsAndAssertions) {
    const { value, assertion, shape } = argAndAssertion
    if (!assertion(value, shape)) throw `[ERROR assertArguments ${value}]`
  }
}

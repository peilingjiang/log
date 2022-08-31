export const proceedDeeper = instance => {
  const type = instance.type

  /* -------------------------------------------------------------------------- */
  if (type.includes('JSX')) {
    switch (type) {
      case 'JSXElement':
        return [...instance.children, ...instance.openingElement.attributes]

      case 'JSXAttribute':
        return instance.value

      case 'JSXExpressionContainer':
        return instance.expression
    }

    return
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Declaration')) {
    switch (type) {
      case 'ImportDeclaration':
        return instance.specifiers
      case 'ClassDeclaration':
        return instance.body
      case 'FunctionDeclaration':
        return instance.body
      case 'VariableDeclaration':
        return instance.declarations
      default:
        return instance.declaration
    }
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Declarator')) {
    return instance.init.body
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Method')) {
    switch (type) {
      case 'MethodDefinition':
        return instance.value
      case 'ClassMethod':
        return instance.body.body
    }
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Statement')) {
    switch (type) {
      case 'ExpressionStatement':
        return instance.expression
      case 'ReturnStatement':
        return instance.argument
      case 'BlockStatement':
        return instance.body
    }
    return instance.body
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Expression')) {
    switch (type) {
      case 'CallExpression':
        return [...instance.arguments, instance.callee]
      case 'MemberExpression':
        return [instance.object, instance.property]
      case 'ArrowFunctionExpression':
        return instance.body
    }

    return instance.body
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Body')) {
    return instance.body
  }

  /* -------------------------------------------------------------------------- */
  if (type.includes('Identifier')) {
    return
  }

  // !
  window.console.error(
    '[HyperLog Dev] unsupported ast instance',
    instance,
    'unrecognized instance type',
    type
  )
  return
}

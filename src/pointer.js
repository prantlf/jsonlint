function escapePointerToken (token) {
  return token
    .toString()
    .replace(/~/g, '~0')
    .replace(/\//g, '~1')
}

// biome-ignore lint/correctness/noUnusedVariables: concatenated with other files
function pathToPointer (tokens) {
  if (tokens.length === 0) {
    return ''
  }
  return `/${tokens
    .map(escapePointerToken)
    .join('/')}`
}

function unescapePointerToken (token) {
  return token
    .replace(/~1/g, '/')
    .replace(/~0/g, '~')
}

// biome-ignore lint/correctness/noUnusedVariables: concatenated with other files
function pointerToPath (pointer) {
  if (pointer === '') {
    return []
  }
  if (pointer[0] !== '/') {
    throw new Error('Missing initial "/" in the reference')
  }
  return pointer
    .substr(1)
    .split('/')
    .map(unescapePointerToken)
}

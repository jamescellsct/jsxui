import { transform } from '@babel/standalone'

import plugin from './babel-plugin-jsx-tree'

export function getTree(codeString) {
  return new Promise((resolve) =>
    transform(codeString, {
      plugins: [[plugin, { onTreeReady: resolve }]],
    })
  )
}

export function renderTree(tree, depth = 0, collection = []) {
  collection.push({ depth, ...tree })
  tree.children.forEach((element) => renderTree(element, depth + 1, collection))
  return collection
}

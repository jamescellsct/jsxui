import jsx from '@babel/plugin-syntax-jsx'

export default () => {
  return {
    inherits: jsx,
    visitor: {
      Program: {
        enter() {
          this.tree = []
        },
        exit(_, state) {
          state.opts.onTreeReady(this.tree[0])
        },
      },
      JSXElement: {
        enter(path) {
          this.tree.push({
            name: path.node.openingElement.name.name,
            start: path.node.start,
            end: path.node.end,
            children: [],
          })
        },
        exit() {
          if (this.tree.length > 1) {
            const child = this.tree.pop()
            const parent = this.tree[this.tree.length - 1]
            parent.children.push(child)
          }
        },
      },
    },
  }
}

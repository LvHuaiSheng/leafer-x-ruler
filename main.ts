import { App, Rect } from 'leafer-ui'

import { Ruler } from './src' // 引入插件代码
// import { EditorEvent } from '@leafer-in/editor'


const app = new App({
  view: window,
  ground: { type: 'draw' },
  tree: {},
  // editor: {},
  sky: { type: 'draw' }
})
const ruler = new Ruler(app)
// 添加自定义主题
ruler.addTheme('custom1', {
  backgroundColor: '#6cb0ab',
  textColor: '#a45454',
  borderColor: '#6f4593',
  highlightColor: 'rgba(22,93,255,0.75)'
})
// 配合编辑器插件使用：在选中元素后立即渲染辅助线位置跟随
// app.editor.on(EditorEvent.SELECT, (arg: EditorEvent) => {
//   ruler.forceRender()
// })

for (let i = 0; i < 5; i++) {
  const randomNumber = Math.random() * (300 - 50) + 50
  const rect = new Rect({
    x: randomNumber,
    y: randomNumber,
    width: randomNumber,
    height: randomNumber,
    fill: getRandomColor(),
    editable: true
  })

  app.tree.add(rect)
}

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

console.log(Ruler)

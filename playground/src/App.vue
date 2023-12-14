<script setup lang='ts'>

import { App, Rect } from 'leafer-ui'
import '@leafer-in/editor'
import { Ruler } from '../../src'
import { onMounted } from 'vue'
import { EditorEvent } from '@leafer-in/editor'

let ruler

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

onMounted(() => {
  const app = new App({
    view: 'canvasRef',
    ground: { type: 'draw' },
    tree: {},
    editor: {},
    sky: { type: 'draw' }
  })
  ruler = new Ruler(app)
  // 添加自定义主题
  ruler.addTheme('custom1', {
    backgroundColor: '#6cb0ab',
    textColor: '#a45454',
    borderColor: '#6f4593',
    highlightColor: 'rgba(22,93,255,0.75)'
  })
  // 配合编辑器插件使用：在选中元素后立即渲染辅助线位置跟随
  app.editor.on(EditorEvent.SELECT, (arg: EditorEvent) => {
    ruler.forceRender()
  })
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

})

/**
 * 设置辅助线主题
 * @param theme
 */
const changeTheme = (theme) => {
  ruler.changeTheme(theme)
}
const changeEnabled = () => {
  ruler.enabled = !ruler.enabled
}
</script>

<template>
  <div class='content'>
    <div class='btn-box'>
      <button @click='changeEnabled()' class='btn'>启用/禁用</button>
      <button @click="changeTheme('light')" class='btn'>明亮主题</button>
      <button @click="changeTheme('dark')" class='btn'>暗黑主题</button>
      <div>
        <button @click="changeTheme('custom1')" class='btn'>自定义主题1</button>
      </div>
    </div>
    <div ref='canvasRef' id='canvasRef'></div>
  </div>
</template>

<style scoped>
.content {
    width: 100%;
    height: 100vh;
}

.btn-box {
    height: 30px;
    display: flex;
    align-items: center; /* 纵向居中 */
    justify-content: center; /* 横向居中 */
}

.btn-box > :nth-child(n+2) {
    margin-left: 10px;
}

#canvasRef {
    width: 100%;
    height: calc(100% - 30px);
}
</style>

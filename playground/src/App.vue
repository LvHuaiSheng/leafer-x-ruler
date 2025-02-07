<script setup lang='ts'>

import { App, Rect, Text, Canvas, Line, RenderEvent, Box, ResizeEvent, PropertyEvent } from 'leafer-ui'
import '@leafer-in/editor'
import { Ruler } from '../../src'
import { computed, onMounted, onUnmounted, ref } from 'vue'

let app
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

let timer = null
onMounted(() => {
  app = new App({
    view: 'canvasRef',
    ground: { type: 'draw' },
    tree: {},
    editor: {},
    sky: { type: 'draw', usePartRender: false }
  })
  ruler = new Ruler(app, {
    unit: 'px',
    ruleSize:25,
    conversionFactors: {
      // 自定义单位cs
      cs: {
        px: 2,
        gaps: [5000, 2500, 1000, 500, 200, 100, 50, 20, 10],
        defaultGap: 1000
      }
    }
  })
  // 添加自定义主题
  ruler.addTheme('custom1', {
    backgroundColor: '#6cb0ab',
    textColor: '#a45454',
    borderColor: '#6f4593',
    highlightColor: 'rgba(22,93,255,0.75)'
  })

  for (let i = 0; i < 5; i++) {
    let randomNumber = Math.random() * (300 - 50) + 50
    randomNumber = Number(randomNumber.toFixed(2))
    const rect = new Box({
      x: randomNumber,
      y: randomNumber,
      width: randomNumber,
      height: randomNumber,
      fill: getRandomColor(),
      editable: true
    })
    const text = new Text({
      text: `W:${randomNumber}，H:${randomNumber}`,
      fill:'#fff'
    })
    rect.add(text)
    rect.on(PropertyEvent.CHANGE, function(e: PropertyEvent) {
      if (e.attrName === 'width' || e.attrName === 'height') {
        text.text = `W:${e.target.width}，H:${e.target.height}`
      }
    })
    app.tree.add(rect)
  }
})
onUnmounted(() => {
  clearInterval(timer)
})

/**
 * 设置辅助线主题
 * @param theme
 */
const changeTheme = (theme) => {
  ruler.changeTheme(theme)
}
const changeUnit = (unit) => {
  ruler.changeUnit(unit)
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
        <button @click="changeTheme('custom1')" class='btn'>自定义主题示例</button>
      </div>
      <div>
        单位：
        <select @change='changeUnit($event.target.value)' class='unit-box'>
          <option value='px'>像素(px)</option>
          <option value='in'>英寸(in)</option>
          <option value='cm'>厘米(cm)</option>
          <option value='mm'>毫米(mm)</option>
          <option value='pt'>点(pt)</option>
          <option value='pc'>派卡(pc)</option>
          <option value='cs'>自定义单位(cs)</option>
        </select>
      </div>
      <div>
        <span></span>
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

.unit-box {
    height: 25px;
}
</style>

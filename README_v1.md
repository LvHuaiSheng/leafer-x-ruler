# leafer-x-ruler

标尺线插件

#### 1.x与2.x版本区别

> 2.x合并了config和options配置项，增加了不同单位转换

## show

![cover](https://github.com/LvHuaiSheng/leafer-x-ruler/blob/master/playground/src/assets/cover.png?raw=true)

## 运行

```sh
npm run start # 开始运行项目

npm run build # 打包插件代码，同时会创建types

npm run test # 自动化测试
```

## usage

### install

```shell
npm i leafer-x-ruler  
```

### use

```js
import { App } from 'leafer-ui'
import { Ruler } from 'leafer-x-ruler'

const app = new App({
  view: window,
  tree: {},
  editor: {},
})
const ruler = new Ruler(app)

// 添加自定义主题  
ruler.addTheme('custom1', {
  backgroundColor: '#6cb0ab',
  textColor: '#a45454',
  borderColor: '#6f4593',
  highlightColor: 'rgba(22,93,255,0.75)'
})

// 切换主题  
ruler.changeTheme('custom1')

// 启用、禁用  
ruler.enabled = false
```
### QA
```js
// 如果使用侧边栏的伸缩时标尺宽高并未同步更新，或许是因为画布的大小并未改变无法触发resize事件；如果想改变画布的大小并使标尺同步，需要自行监听窗口大小变化，并触发leafer-ui的resize事件，以下是在vue3中使用的示例： 
<template>
  <div ref="divRef"></div>
</template>
<script lang="ts" setup>
  import {useResizeObserver} from "@vueuse/core";

  const divRef = ref()

  onMounted(() => {
  useResizeObserver(divRef, (entries) => {
    const [entry] = entries
    const { width, height } = entry.contentRect
    // 这步是为了触发leafer-ui的resize事件，标尺在监听到resize事件后会重新渲染
    leafer.app.resize({ width, height })
  })
})
</script>
```

## 内置属性

<table>
<thead>
  <th>属性</th>
  <th>说明</th>
  <th>操作方式</th>
  <th>类型</th>
  <th>示例值</th>
  <th>默认</th>
</thead>
<tr>
  <td>enabled</td>
  <td>启用、禁用</td>
  <td>get / set</td>
  <td>boolean</td>
  <td>true</td>
  <td>true</td>
</tr>
<tr>
  <td>theme</td>
  <td>使用主题名称</td>
  <td>get / set</td>
  <td>string</td>
  <td>dark</td>
  <td>light</td>
</tr>
<tr>
  <td>rulerLeafer</td>
  <td>标尺线层Leafer</td>
  <td>get</td>
  <td>Leafer</td>
  <td>-</td>
  <td>-</td>
</tr>
<tr>
  <td>config</td>
  <td>标尺设置</td>
  <td>set</td>
  <td><a href='#RulerConfig'>RulerConfig</a></td>
  <td>-</td>
  <td>-</td>
</tr>
<tr>
  <td>options</td>
  <td>属性配置</td>
  <td>set</td>
  <td><a href='#RulerOptions'>RulerOptions</a></td>
  <td>-</td>
  <td>-</td>
</tr>
</table>

## 内置方法
<table>
<thead>
  <th>方法</th>
  <th>说明</th>
  <th>参数类型</th>
  <th>示例值</th>
</thead>
<tr>
  <td>changeEnabled</td>
  <td>启用、禁用</td>
  <td>(boolean)</td>
  <td>true</td>
</tr>
<tr>
  <td>addTheme</td>
  <td>添加自定义主题</td>
  <td>(string,<a href='#themeoption'>ThemeOption</a>)</td>
  <td>-</td>
</tr>
<tr>
  <td>removeTheme</td>
  <td>移除自定义主题</td>
  <td>(string)</td>
  <td>-</td>
</tr>
<tr>
  <td>changeTheme</td>
  <td>切换主题</td>
  <td>(string)</td>
  <td>-</td>
</tr>
<tr>
  <td>forceRender</td>
  <td>强制渲染</td>
  <td></td>
  <td>-</td>
</tr>
</table>

#### RulerConfig

```ts
type RulerConfig = {
  /**
   * 是否启用标尺线
   */
  enabled: boolean
  /**
   * 标尺线主题，默认light，可选（light：明亮，dark：暗黑）
   */
  theme: string
}
```
#### RulerOptions

```ts
type RulerOptions = {
  ruleSize?: number; // 标尺宽高
  fontSize?: number; // 字体大小
  themes?: Map<string, ThemeOption>; // 主题，默认存在明亮（light）、暗黑（dark）主题，可覆盖
}
```

#### ThemeOption

```ts
type ThemeOption = {
  backgroundColor: string, // 背景色
  textColor: string, // 文字颜色
  borderColor: string, // 边框颜色
  highlightColor: string // 高亮颜色
}
```

# leafer-x-ruler

标尺线插件

## show

![cover](https://github.com/LvHuaiSheng/leafer-x-ruler/blob/master/playground/src/assets/cover2.png?raw=true)


### 1.X版本文档请查看：[V1.x文档](./README_v1.md)

#### 如何从1.x升级到2.x

> 1. 只需将1.x中自定义的config和options配置项合并即可，如无自定义配置项 那么可直接升级，参考下方配置
> 2. 2.x版本优化了`themes`初始化配置项，将Map对象改为普通对象，初始化速度更快，自定义主题更便捷
```js

// -- 1.x版本 --
const config={
  enabled: true,
}
const options={
  ruleSize: 20,
}
const ruler = new Ruler(app,config,options)

// -- 2.x版本，只需将config和options合并即可 --
const config={
  enabled: true,
  ruleSize: 20,
}
const ruler = new Ruler(app,config)

```

### use
#### 基本使用
```js
import { App } from 'leafer-ui'
import { Ruler } from 'leafer-x-ruler'

const app = new App({
  view: window,
  tree: {},
  editor: {},
})

// 实例化标尺插件
const ruler = new Ruler(app)

// 启用、禁用  
ruler.enabled = false
```
#### 自定义配置示例
```js
import { App } from 'leafer-ui'
import { Ruler } from 'leafer-x-ruler'

const app = new App({
  view: window,
  tree: {},
  editor: {},
})

// 实例化标尺插件，传入自定义配置
const ruler = new Ruler(app,{
  // 使用自定义的单位
  unit:'cs',
  // 添加自定义单位
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

// 切换主题  
ruler.changeTheme('custom1')

// 切换字体
ruler.changeUnit('px')

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
  <td>addUnit</td>
  <td>添加自定义单位</td>
  <td>(string,<a href='#conversionfactor'>ConversionFactor</a>)</td>
  <td>-</td>
</tr>
<tr>
  <td>removeUnit</td>
  <td>移除自定义单位</td>
  <td>(string)</td>
  <td>-</td>
</tr>
<tr>
  <td>changeUnit</td>
  <td>切换单位</td>
  <td>(string)</td>
  <td>cm</td>
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
  enabled?: boolean
  /**
   * 标尺线主题，默认light，可选（light：明亮，dark：暗黑）
   */
  theme?: string,
  /**
   * 单位 默认px，内置了px、cm、in、pt、pc、mm
   */
  unit?: string,
  /**
   * 标尺宽高
   */
  ruleSize?: number; 
  /**
   * 字体大小
   */
  fontSize?: number;
  /**
   * 主题，默认存在明亮、暗黑主图
   */
  themes?: {[key: string]: ThemeOption}
  /**
   * 定义单位转换因子 (每单位对应的像素数)，（可从源码内查看预设定义）
   */
  conversionFactors?: {[key: string]: ConversionFactor}; 
}
```

#### ThemeOption

```ts
type ThemeOption = {
  /**
   * 背景色
   */
  backgroundColor: string,
  /**
   * 文字颜色
   */
  textColor: string,
  /**
   * 边框颜色
   */
  borderColor: string,
  /**
   * 高亮颜色
   */
  highlightColor: string
}
```

#### ConversionFactor

```ts
export interface ConversionFactor {
  /**
   * 自定义单位对应的像素数，比如英寸单位：1英寸对应96px，那这里就是96
   */
  px: number

  /**
   * 缩放倍率，对应缩放比例：[0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
   */
  gaps: number[]

  /**
   * 默认缩放倍率（如果没有匹配到缩放比例对应的倍率，则使用默认值defaultGap）
   */
  defaultGap: number
}
```


## 运行源码

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

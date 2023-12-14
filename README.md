# leafer-x-ruler

标尺线插件

## show

![show转存失败，建议直接上传图片文件](<转存失败，建议直接上传图片文件 show.png>)

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
console.log(pdf.outline);  
```

## 内置属性

<table>
<thead>
  <th>属性</th>
  <th>说明</th>
  <th>操作方式</th>
  <th>类型</th>
  <th>示例值</th>
</thead>
<tr>
  <td>enabled</td>
  <td>启用、禁用</td>
  <td>get / set</td>
  <td>boolean</td>
  <td>true</td>
</tr>
<tr>
  <td>theme</td>
  <td>使用主题名称</td>
  <td>get / set</td>
  <td>string</td>
  <td>light</td>
</tr>
<tr>
  <td>rulerLeafer</td>
  <td>标尺线层Leafer</td>
  <td>get</td>
  <td>Leafer</td>
  <td>-</td>
</tr>
<tr>
  <td>config</td>
  <td>标尺设置</td>
  <td>set</td>
  <td>object</td>
  <td>-</td>
</tr>
<tr>
  <td>options</td>
  <td>属性配置</td>
  <td>set</td>
  <td>object</td>
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
  <td>(string,object)</td>
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

# 插件开发模版

[Typescript](https://ts.nodejs.cn/) + [Rollup.js](https://www.rollupjs.com/) + [Vite](https://cn.vitejs.dev/guide/) + [Vitest](https://cn.vitest.dev/guide/) [点此下载模版](https://github.com/leaferjs/LeaferX/archive/refs/heads/main.zip)

```sh
git clone https://github.com/leaferjs/LeaferX
```

## 目录结构

```sh
main.ts # 开发插件时用的调试demo入口，可以引入 leafer-ui 进行开发调试插件
src # 插件代码主目录, 只能引入 @leafer-ui/core、@leafer-ui/interface

package.json  # 根据需要修改插件名、入口文件等信息，支持web与node环境
tsconfig.json # typescript 配置文件
rollup.config.js # 需修改导出的全局变量名，rollup 打包脚本配置文件

.gitignore # 提交git时忽略哪些文件和目录
.eslintrc.js # 代码语法检查配置
.prettierrc # 代码格式化配置

__tests__ # 单元测试目录

README.md # 插件介绍，需修改为你自己的内容
LICENSE # 授权文件，修改为你自己的姓名

# 自动创建
dev # 开发目录，放置以 main.ts 作为入口的 demo 打包代码
dist # 打包目录，放置以 src/index.ts 作为入口的打包代码
types # 放置插件的 d.ts 类型描述文件
```

## 运行

```sh
npm run start # 开始运行项目

npm run build # 打包插件代码，同时会创建types

npm run test # 自动化测试
```

## 代码风格

使用 @typescript-eslint， 单引号优先、句尾无分号，可以给编辑器设置保存时自动格式化。

建议大家保持一致的代码风格，这样互相 review 代码，提 PR 比较方便。

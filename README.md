
# fis3 纯前端方案配置

*纯*前端的意思是编译后的产出可以本地直接打开预览效果，不需要 server 环境。

本质上就是所有的静态资源都用相对路径引用。

## 适合场景

- 小型项目
- server 端环境模糊或不可控（方便在不同的 server 端环境部署）
- 需要发送给无法搭建 server 环境的人预览效果

## 支持

- `commonjs` 模块化方案
- 不需要人工维护模块的加载
- less
- es6 + React
- 使用非 `Single File Components` 进行 Vue 组件开发

## 未完美解决问题

引用图片相关


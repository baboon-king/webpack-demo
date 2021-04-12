# 问题记录

## webpack-dev-server 可以启动并编译, 修改文件内容后 浏览器却无法自动刷新

### 复现步骤

1. 克隆代码

```PowerShell
```

2. 进入问题代码所在目录

```PowerShell
cd /webpack-demo/
```

3. 安装依赖 并 启动热更新

```PowerShell
  npm i

  npm run dev
```

4. 修改资源文件
   浏览器没有刷新 (问题点)

### 解决方案

- 原因：webpack5 需要补充 `target: 'web'` 配置

```JavaScript
module.exports = {
  mode: 'none',
  entry: './src/main.js',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  target: 'web', // **
}
```

## 使用 动态导入后，打包结果没有对 动态导入的资源 进行分包

### 复现步骤

1. 代码中使用了动态导入

[src/main.js](webpack-demo/src/main.js)

```JavaScript
import(
  /* webpackChunkName:'editor' */
  './editor/editor'
).then(({ default: createEditor }) => {
  const editor = createEditor()
  document.body.append(editor)
})
```

1. 安装依赖后执行 打包命令

```PowerShell
npm run build:default:none
```

[webpack.config.js](webpack-demo/webpack.config.js)

1. 预期结果

`dist` 目录下有以下 2 个文件

```PowerShell
main-xxxxxx.bundle.js
editor-xxxxxx.bundle.js
```

4. 实际结果

只有 `main-xxxxxx.bundle.js`

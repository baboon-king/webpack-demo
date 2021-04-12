import createHeading from './heading/heading.js'
// import createEditor from './editor/editor.js'
import footerHtml from './footer/footer.html'
import './assets/main.css'
import logo from './assets/logo.png'


const img = new Image()
img.src = logo
img.width = '80'
document.body.append(img)


const heading = createHeading()
document.body.append(heading)
import(
  /* webpackChunkName:'editor' */
  './editor/editor'
).then(({ default: createEditor }) => {
  const editor = createEditor()
  document.body.append(editor)
})

document.write(footerHtml)

console.log(API_BASE_URL)



fetch('/api/users')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const heading = createHeading()
    const title = `这是代理了 github users 接口后 返回的数据：`
    heading.textContent = title + JSON.stringify(data)
    heading.classList = []
    document.body.append(heading)
  })

// ===============下面处理 HMR 逻辑=====================

if (module.hot) {
  // console.log(createEditor)
  let lastEditor = editor
  module.hot.accept('./editor/editor.js', () => {
    // console.log('editor 模块更新了,需要这里手动处理热替换逻辑')
    // console.log(createEditor)
    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })

  // 图片热替换逻辑
  module.hot.accept('./assets/logo.png', () => {
    // 文件名会根据文件内容变化,所以直接设置即可
    img.src = logo
    console.log(logo)
  })
}
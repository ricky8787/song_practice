import Kuroshiro from 'kuroshiro'
// Initialize kuroshiro with an instance of analyzer (You could check the [apidoc](#initanalyzer) for more information):
// For this example, you should npm install and import the kuromoji analyzer first
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
// Instantiate

import fs from 'fs/promises'
import path from 'path'

// 获取当前工作目录
const currentDirectory = process.cwd()

// 生成相对路径
const inputFilePath = path.join(
  currentDirectory,
  'subtitles',
  'レオ-THE FIRST TAKE.vtt'
)
const outputFilePath = path.join(
  currentDirectory,
  'subtitles',
  'outputtrans.vtt'
)

// 读取 VTT 文件
const readVTTFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    // console.log('File content as string:', typeof data)
    return data
  } catch (error) {
    console.error('Error reading file:', error)
    throw error
  }
}

const kuroshiro = new Kuroshiro.default()
// Initialize
// Here uses async/await, you could also use Promise
await kuroshiro.init(new KuromojiAnalyzer())
// Convert what you want

const result = await kuroshiro.convert(
  '感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！',
  { mode: 'furigana', to: 'hiragana' }
)

console.log(result)

const processVTTFile = async (inputFilePath, outputFilePath) => {
  try {
    const vttContent = await readVTTFile(inputFilePath)
    // console.log(vttContent)
    const cleanedContent = await kuroshiro.convert(vttContent, {
      mode: 'furigana',
      to: 'hiragana',
    })
    console.log('cleand:' + cleanedContent)
    await fs.writeFile(outputFilePath, cleanedContent, 'utf-8')
    console.log('文件处理完成！')
  } catch (error) {
    console.error('处理文件时出错：', error)
  }
}

processVTTFile(inputFilePath, outputFilePath)

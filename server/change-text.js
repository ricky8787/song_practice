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
const outputFilePath = path.join(currentDirectory, 'subtitles', 'output.txt')

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

const removeTimestamps = (vttContent) => {
  const lines = vttContent.split('\n')
  const result = []
  let inSubtitle = false

  lines.forEach((line) => {
    // 正则表达式匹配时间戳

    const timestampRegex =
      /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/

    // if (timestampRegex.test(line.trim())) {
    //   console.log('有符合line' + line)
    // } else {
    //   console.log('沒有符合line' + line)
    // }

    if (timestampRegex.test(line.trim())) {
      // 如果是时间戳行，标记为不在字幕中
      inSubtitle = false
    } else if (line.trim() === '') {
      // 处理空行，只在字幕中时添加空行分隔符
      if (inSubtitle) {
        result.push('')
        inSubtitle = true
      }
    } else {
      // 处理字幕行
      if (line.trim() !== '') {
        inSubtitle = true
      }
    }
    if (inSubtitle) {
      result.push(line.trim())
    }
  })
  console.log(result)
  return result.join('\n').trim()
}

// 主函数
const processVTTFile = async (inputFilePath, outputFilePath) => {
  try {
    const vttContent = await readVTTFile(inputFilePath)
    // console.log(vttContent)
    const cleanedContent = await removeTimestamps(vttContent)
    console.log('cleand:' + cleanedContent)
    await fs.writeFile(outputFilePath, cleanedContent, 'utf-8')
    console.log('文件处理完成！')
  } catch (error) {
    console.error('处理文件时出错：', error)
  }
}

const testContent = `
  00:03:56.990 --> 00:04:05.181
  新しい誰かにまた名前つけて
  
  00:04:22.003 --> 00:04:23.033
  ありがとうございます
`

const cleanedContent = removeTimestamps(testContent)
console.log('Cleaned content:', cleanedContent)
// // 处理文件
processVTTFile(inputFilePath, outputFilePath)

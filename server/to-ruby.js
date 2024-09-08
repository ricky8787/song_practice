import fs from 'fs/promises'
import path from 'path'

// 获取当前工作目录
const currentDirectory = process.cwd()

// 生成相对路径
const inputFilePath = path.join(
  currentDirectory,
  'subtitles',
  'transformes.txt'
)
const outputFilePath = path.join(
  currentDirectory,
  'subtitles',
  'outputtrans.txt'
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

function convertVTTTextToRuby(vttText) {
  // 正则表达式匹配日文汉字加上括号中的假名，如 中（なか）
  const regex = /([一-龥]+)（([ぁ-ん]+)）/g

  // 替换匹配到的部分为 ruby 标签
  const convertedText = vttText.replace(regex, (match, kanji, kana) => {
    return `<ruby>${kanji}<rt>${kana}</rt></ruby>`
  })

  return convertedText
}

// 示例 VTT 文本
const vttText = `
00:00:39.131 --> 00:00:41.603
ショーケースの中（なか）過（す）ごしていた
00:00:41.603 --> 00:00:43.925
誰（だれ）もかれもが過（す）ぎ去（さ）っていた
00:00:43.925 --> 00:00:46.531
怖（こわ）かったんだ　あの日（ひ）君（きみ）に
00:00:46.531 --> 00:00:49.100
連（つ）れられるまでは
`

// 将 VTT 文本转换为包含 ruby 标签的格式
const convertedVTT = convertVTTTextToRuby(vttText)

// 输出结果
console.log(convertedVTT)



// // 主函数
// const processVTTFile = async (inputFilePath, outputFilePath) => {
//   try {
//     const vttContent = await readVTTFile(inputFilePath)
//     // console.log(vttContent)
//     const cleanedContent = await convertToRuby(vttContent)
//     console.log('cleand:' + cleanedContent)
//     await fs.writeFile(outputFilePath, cleanedContent, 'utf-8')
//     console.log('文件处理完成！')
//   } catch (error) {
//     console.error('处理文件时出错：', error)
//   }
// }
// processVTTFile(inputFilePath, outputFilePath)

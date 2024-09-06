const convertToRuby = (text) => {
  // 正则表达式匹配汉字和括号内的假名
  const regex = /([^\（]+?)\（([^\）]+?)\）/g
  let result = ''
  let lastIndex = 0

  // 替换匹配的部分
  text.replace(regex, (match, kanji, furigana, offset) => {
    result += text.slice(lastIndex, offset) // 添加上一个部分
    result += `<ruby>${kanji}<rt>${furigana}</rt></ruby>` // 添加替换后的部分
    lastIndex = offset + match.length
    return match // 保持原样
  })

  result += text.slice(lastIndex) // 添加最后部分
  return result
}

// 示例文本
const inputText = 'ショーケースの中（なか）過（す）ごしていた'

// 转换并输出结果
const outputText = convertToRuby(inputText)
console.log(outputText)

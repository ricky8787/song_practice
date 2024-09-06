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
const outputFilePath = path.join(currentDirectory, 'output.txt')

// 读取 VTT 文件
const readVTTFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    console.log('File content as string:', typeof data)
    return data
  } catch (error) {
    console.error('Error reading file:', error)
    throw error
  }
}

const removeTimestamps = (vttContent) => {
  const lines = vttContent.split('\n')
  let inSubtitle = false
  const result = []

  lines.forEach((line, index) => {
    console.log(`Line ${index}: ${line}`) // Debug output

    const timestampRegex =
      /^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/

    if (timestampRegex.test(line)) {
      // console.log(`Matched timestamp: ${line}`) // Debug output
      inSubtitle = true
    } else if (line.trim() === '') {
      if (inSubtitle) {
        inSubtitle = false
        result.push('')
      }
    } else if (inSubtitle) {
      result.push(line)
    }
  })

  console.log('Processed Content:', result.join('\n')) // Debug output
  return result.join('\n').trim()
}

// 主函数
const processVTTFile = async (inputFilePath, outputFilePath) => {
  try {
    const vttContent = await readVTTFile(inputFilePath)
    // console.log(vttContent)
    const cleanedContent = removeTimestamps(vttContent)
    console.log('cleand:' + cleanedContent)
    await fs.writeFile(outputFilePath, cleanedContent, 'utf-8')
    console.log('文件处理完成！')
  } catch (error) {
    console.error('处理文件时出错：', error)
  }
}
const vttContent = await readVTTFile(inputFilePath)
console.log(vttContent)
console.log('File content as string:', typeof vttContent)
const cleanedContent = removeTimestamps(`WEBVTT

00:00:17.576 --> 00:00:19.655
<ruby>聴<rt>き</rt>いてください「レオ」</ruby>

00:00:39.131 --> 00:00:41.603
ショーケースの中過ごしていた

00:00:41.603 --> 00:00:43.925
誰もかれもが過ぎ去っていた

00:00:43.925 --> 00:00:46.531
怖かったんだ　あの日君に

00:00:46.531 --> 00:00:49.100
連れられるまでは

00:00:49.100 --> 00:00:51.710
僕と同じの小さな手

00:00:51.710 --> 00:00:54.543
転げまわり　くすぐりあう僕ら

00:00:54.543 --> 00:00:59.411
こんなに君の事好きになってた

00:00:59.411 --> 00:01:06.429
どんなときでも傍に居て

00:01:06.429 --> 00:01:12.174
君が言うなら　ああ

00:01:12.174 --> 00:01:17.088
名前はレオ　名前呼んでよ

00:01:17.088 --> 00:01:22.347
君がつけてくれた名前だから

00:01:22.347 --> 00:01:27.491
嬉しい時も悲しい時も

00:01:27.491 --> 00:01:33.856
傍に居ると決めた大事な人

00:01:43.628 --> 00:01:45.951
君が大きくなるほどに

00:01:46.048 --> 00:01:48.561
僕との時間は減るが道理

00:01:48.561 --> 00:01:51.039
遠くに君の友達同士

00:01:51.039 --> 00:01:53.692
仕方がないよなぁ

00:01:53.692 --> 00:01:56.301
最近つけるその香水

00:01:56.301 --> 00:01:59.142
鼻の利く僕にとっては辛いや

00:01:59.142 --> 00:02:04.280
今日も帰りは遅くなるんだろうか

00:02:04.280 --> 00:02:10.982
君が居ない部屋　夢を見る

00:02:10.982 --> 00:02:16.853
あの日のこと　また

00:02:16.853 --> 00:02:21.501
名前はレオ　名前呼んでよ

00:02:21.501 --> 00:02:26.897
君がつけてくれた名前だから

00:02:26.897 --> 00:02:31.916
寂しいけれど　悲しいけれど

00:02:31.916 --> 00:02:40.028
傍に居ると決めた大事な人

00:02:48.315 --> 00:02:53.605
君が誰かと暮らすことを

00:02:53.605 --> 00:02:58.734
伝えに帰ってきた夜に

00:02:58.734 --> 00:03:03.270
撫でてくれたね　きっとお別れだね

00:03:03.270 --> 00:03:10.550
最後にさ　会えたから　ねぇ幸せだよ

00:03:21.328 --> 00:03:26.199
名前はレオ　名前呼んでよ

00:03:26.199 --> 00:03:31.337
君がつけてくれた名前だから

00:03:31.337 --> 00:03:36.504
もう泣かないでよ　名前呼んでよ

00:03:36.504 --> 00:03:42.014
あの日より大きな手で撫でてくれた

00:03:42.014 --> 00:03:46.696
名前はレオ　名前呼んでよ

00:03:46.696 --> 00:03:51.892
君がくれた名前で良かったよ

00:03:51.892 --> 00:03:56.990
忘れないでよ　それでいいんだよ

00:03:56.990 --> 00:04:05.181
新しい誰かにまた名前つけて

00:04:22.003 --> 00:04:23.033
ありがとうございます`)
console.log('cleand:' + cleanedContent)

// // 处理文件
// processVTTFile(inputFilePath, outputFilePath)

import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/youtube'
import * as vtt from 'videojs-vtt.js'
import { htmlToText } from 'html-to-text' // 需要安装 `html-to-text`

import { MdOutlineReplay } from 'react-icons/md'

export default function Index() {
  const playerRef = useRef(null) // 创建一个 ref 来访问 player 实例
  const [subtitles, setSubtitles] = useState({ chinese: [], japanese: [] })
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitle, setCurrentSubtitle] = useState({
    chinese: '',
    japanese: '',
  })
  const [currentIndex, setCurrentIndex] = useState(null)
  const [isLoop, setIsLoop] = useState(false)

  // 顯示 html 內容
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }
  // 加载字幕
  const fetchSubtitles = async () => {
    try {
      const [chineseResponse, japaneseResponse] = await Promise.all([
        fetch('/subtitles/レオ-THE FIRST TAKE-Chinese.vtt'),
        fetch('/subtitles/レオ-THE FIRST TAKE.vtt'),
      ])

      const chineseVttText = await chineseResponse.text()
      const japaneseVttText = await japaneseResponse.text()

      const parseVTT = (vttText) => {
        return new Promise((resolve) => {
          const cues = []
          const parser = new vtt.WebVTT.Parser(
            window,
            vtt.WebVTT.StringDecoder()
          )
          parser.oncue = (cue) => {
            // const cleanedText = htmlToText(cue.text, { wordwrap: false })
            // const cleanedText = stripHtmlTags(cue.text)
            cues.push(new VTTCue(cue.startTime, cue.endTime, cue.text))
          }
          parser.parse(vttText)
          parser.flush()
          resolve(cues)
        })
      }

      const [chineseSubtitles, japaneseSubtitles] = await Promise.all([
        parseVTT(chineseVttText),
        parseVTT(japaneseVttText),
      ])

      setSubtitles({ chinese: chineseSubtitles, japanese: japaneseSubtitles })
    } catch (error) {
      console.error('Failed to load subtitles:', error)
    }
  }

  // 跳至上一句
  const handleSkipToPrevious = () => {
    const previousSubtitle = subtitles.chinese
      .filter((subtitle) => subtitle.endTime < currentTime)
      .reduce((nearest, subtitle) => {
        if (
          !nearest ||
          Math.abs(subtitle.endTime - currentTime) <
            Math.abs(nearest.endTime - currentTime)
        ) {
          return subtitle
        }
        return nearest
      }, null)

    if (previousSubtitle) {
      playerRef.current.seekTo(previousSubtitle.startTime)
    }
  }

  // 跳至下一句
  const handleSkipToNext = () => {
    const nextSubtitle = subtitles.chinese
      .filter((subtitle) => subtitle.startTime > currentTime)
      .reduce((nearest, subtitle) => {
        if (
          !nearest ||
          Math.abs(subtitle.startTime - currentTime) <
            Math.abs(nearest.startTime - currentTime)
        ) {
          return subtitle
        }
        return nearest
      }, null)

    if (nextSubtitle) {
      playerRef.current.seekTo(nextSubtitle.startTime)
    }
  }

  const handleToggleLoop = () => {
    setIsLoop(!isLoop)
  }

  useEffect(() => {
    fetchSubtitles()
  }, [])

  // 更新字幕
  useEffect(() => {
    const earlyPlaybackTime = 0.8

    const getCurrentSubtitle = (subtitles) => {
      const currentSubtitleIndex = subtitles.findIndex(
        (subtitle) =>
          currentTime >= subtitle.startTime - earlyPlaybackTime &&
          currentTime <= subtitle.endTime - earlyPlaybackTime
      )

      if (currentSubtitleIndex !== -1) {
        const current = subtitles[currentSubtitleIndex]
        const next = subtitles[currentSubtitleIndex + 1]
        const shouldShowNext = next && next.startTime - current.endTime <= 3

        return [current ? current.text : '', shouldShowNext ? next.text : '']
      }

      return ['', '']
    }

    setCurrentSubtitle({
      chinese: getCurrentSubtitle(subtitles.chinese),
      japanese: getCurrentSubtitle(subtitles.japanese),
    })
  }, [currentTime, subtitles])

  return (
    <>
      <div>
        <ReactPlayer
          ref={playerRef}
          url="https://www.youtube.com/watch?v=cpuT1AWuRx8"
          controls
          width="640px"
          height="360px"
          playing={true}
          loop={isLoop}
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        />
      </div>

      <div
        style={{ position: 'relative', marginTop: '10px', textAlign: 'center' }}
      >
        <div style={{ marginBottom: '5px' }}>
          <strong>中文字幕:</strong>
          <div
            dangerouslySetInnerHTML={{ __html: currentSubtitle.chinese[0] }}
          />
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>中文下一句:</strong>
          <div
            dangerouslySetInnerHTML={{ __html: currentSubtitle.chinese[1] }}
          />
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>日文字幕:</strong>
          <div
            dangerouslySetInnerHTML={{ __html: currentSubtitle.japanese[0] }}
          />
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>日文下一句:</strong>
          <div
            dangerouslySetInnerHTML={{ __html: currentSubtitle.japanese[1] }}
          />
        </div>
        <div>
          <button
            onClick={handleSkipToPrevious}
            style={{ marginRight: '10px' }}
          >
            上一句
          </button>
          <button onClick={handleSkipToNext} style={{ marginRight: '10px' }}>
            下一句
          </button>
          <button onClick={handleToggleLoop}>
            <MdOutlineReplay style={{ color: isLoop ? 'red' : '' }} />
          </button>
        </div>
      </div>
    </>
  )
}

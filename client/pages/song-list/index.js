import { useEffect, useRef, useState, useMemo } from 'react'
import ReactPlayer from 'react-player/youtube'
import * as vtt from 'videojs-vtt.js'
import { htmlToText } from 'html-to-text' // 需要安装 `html-to-text`

import { MdOutlineReplay } from 'react-icons/md'

export default function Index() {
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [subtitles, setSubtitles] = useState({ chinese: [], japanese: [] })
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitle, setCurrentSubtitle] = useState({
    chinese: '',
    japanese: '',
  })
  const [isLoop, setIsLoop] = useState(false)
  const [showHiragana, setShowHiragana] = useState(true)
  

  // 加载字幕
  const fetchSubtitles = async () => {
    try {
      const [chineseResponse, japaneseResponse] = await Promise.all([
        fetch('/subtitles/レオ-THE FIRST TAKE-Chinese.vtt'),
        fetch('/subtitles/reo-new.vtt'), // 这个包含 <rt> 标签
      ])

      const chineseVttText = await chineseResponse.text()
      const japaneseVttText = await japaneseResponse.text()

      const parseVTT = (vttText, removeRt) => {
        return new Promise((resolve) => {
          const cues = []
          const parser = new vtt.WebVTT.Parser(
            window,
            vtt.WebVTT.StringDecoder()
          )
          parser.oncue = (cue) => {
            let text = cue.text
            if (removeRt) {
              text = text.replace(/<rt[^>]*>[^<]*<\/rt>/gi, '') // 移除 <rt> 标签
            }
            cues.push(new VTTCue(cue.startTime, cue.endTime, text))
          }
          parser.parse(vttText)
          parser.flush()
          resolve(cues)
        })
      }

      const [
        chineseSubtitles,
        japaneseSubtitlesWithRt,
        japaneseSubtitlesWithoutRt,
      ] = await Promise.all([
        parseVTT(chineseVttText, false),
        parseVTT(japaneseVttText, false),
        parseVTT(japaneseVttText, true),
      ])

      setSubtitles({
        chinese: chineseSubtitles,
        japanese: {
          withRt: japaneseSubtitlesWithRt,
          withoutRt: japaneseSubtitlesWithoutRt,
        },
      })
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
      playerRef.current.getInternalPlayer().playVideo()
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
      playerRef.current.getInternalPlayer().playVideo()
    }
  }

  // 處理 rt
  const processHtmlContent = (htmlContent, showRt) => {
    if (showRt) {
      return htmlContent // 如果需要顯示 <rt> 標籤，返回原始 HTML
    }
    // 如果不需要顯示 <rt> 標籤，則使用正則表達式移除 <rt> 標籤及其內容
    return htmlContent.replace(/<rt[^>]*>[^<]*<\/rt>/gi, '')
  }
  //處理要不要循環播放
  const handleToggleLoop = () => {
    setIsLoop(!isLoop)
  }
  //處理要不要顯示振假名
  const handleToggleHiragana = () => {
    setShowHiragana(!showHiragana)
  }

  const handleTogglePlayPause = () => {
    setIsPlaying(!isPlaying) // 切换播放状态
  }

  useEffect(() => {
    fetchSubtitles()
  }, [showHiragana])

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

    // 判断是否有有效的字幕数据
    const hasSubtitles =
      subtitles.chinese.length > 0 &&
      (subtitles.japanese.withRt.length > 0 ||
        subtitles.japanese.withoutRt.length > 0)

    if (hasSubtitles) {
      const selectedJapaneseSubtitles = showHiragana
        ? subtitles.japanese.withRt
        : subtitles.japanese.withoutRt

      setCurrentSubtitle({
        chinese: getCurrentSubtitle(subtitles.chinese),
        japanese: getCurrentSubtitle(selectedJapaneseSubtitles),
      })
    }
  }, [currentTime, subtitles, showHiragana])

  const renderAllSubtitles = (subtitles, currentTime) => {
    if (!subtitles || subtitles.length === 0) return null
    const earlyPlaybackTime = 1
    return subtitles.map((subtitle, index) => {
      // 判断当前字幕是否是当前播放的字幕
      const isActive =
        currentTime >= subtitle.startTime - earlyPlaybackTime &&
        currentTime <= subtitle.endTime - earlyPlaybackTime

      return (
        <div
          key={index}
          style={{
            padding: '10px',
            color: isActive ? 'blue' : '', // 高亮当前字幕
            fontSize: isActive ? '24px' : '18px', // 当前字幕加大
            transition: 'all 0.3s ease', // 添加平滑过渡效果
          }}
          dangerouslySetInnerHTML={{ __html: subtitle.text }}
        />
      )
    })
  }

  const allSubtitles = useMemo(() => {
    // 确保 subtitles 和 showHiragana 存在
    if (subtitles && subtitles.japanese) {
      return renderAllSubtitles(
        showHiragana ? subtitles.japanese.withRt : subtitles.japanese.withoutRt,
        currentTime
      )
    }
    return [] // 如果没有有效的字幕数据，返回空数组
  }, [subtitles, showHiragana, currentTime])

  return (
    <>
      <div className="wrapper">
        <div className="left-wrapper">
          <div>
            <ReactPlayer
              ref={playerRef}
              url="https://www.youtube.com/watch?v=cpuT1AWuRx8"
              controls={false}
              width="640px"
              height="360px"
              playing={isPlaying}
              loop={isLoop}
              onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            />
          </div>
          <div
            style={{
              position: 'relative',
              marginTop: '10px',
              textAlign: 'center',
            }}
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
                dangerouslySetInnerHTML={{
                  __html: currentSubtitle.japanese[0],
                }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>日文下一句:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: currentSubtitle.japanese[1],
                }}
              />
            </div>
            <div>
              <button
                onClick={handleSkipToPrevious}
                style={{ marginRight: '10px' }}
              >
                上一句
              </button>
              <button
                onClick={handleSkipToNext}
                style={{ marginRight: '10px' }}
              >
                下一句
              </button>
              <button onClick={handleToggleLoop}>
                <MdOutlineReplay style={{ color: isLoop ? 'red' : '' }} />
              </button>
              <button
                onClick={handleToggleHiragana}
                style={{ color: showHiragana ? 'red' : '' }}
              >
                a
              </button>
              <button onClick={handleTogglePlayPause}>播放/暫停</button>
            </div>
          </div>
          <div>
            <h3>全部日文字幕:</h3>
            <div>
              <div>{allSubtitles}</div>
            </div>
          </div>
        </div>
        <div className="right-wrapper">
          <div>字幕滾動區</div>
        </div>
      </div>
      <style jsx>
        {`
          .wrapper {
            display: flex;
          }
        `}
      </style>
    </>
  )
}

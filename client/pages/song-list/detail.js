import { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player/youtube'
import * as vtt from 'videojs-vtt.js'
import { MdOutlineReplay } from 'react-icons/md'
import Subtitle from '@/components/subtitle/all-subtitles'

export default function Detail() {
  const playerRef = useRef(null)
  const subtitleRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [subtitles, setSubtitles] = useState({
    chinese: [],
    japanese: {
      withRt: [],
      withoutRt: [],
    },
  })
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0)
  const [isLoop, setIsLoop] = useState(false)
  const [showHiragana, setShowHiragana] = useState(true)
  const [lastValidSubtitle, setLastValidSubtitle] = useState({
    chinese: '',
    japanese: '',
  })

  // 加载字幕
  const fetchSubtitles = async () => {
    try {
      const [chineseResponse, japaneseResponse] = await Promise.all([
        fetch('/subtitles/レオ-THE FIRST TAKE-Chinese.vtt'),
        fetch('/subtitles/レオ-THE FIRST TAKE.vtt'), // 这个包含 <rt> 标签
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

  // 滚动字幕到顶部并显示前后几句
  const scrollSubtitleToTop = (activeSubtitleIndex) => {
    if (subtitleRef.current) {
      const subtitleContainer = subtitleRef.current
      const activeSubtitle = subtitleContainer.children[activeSubtitleIndex]
      const offsetTop = activeSubtitle.offsetTop
      subtitleContainer.scrollTop = offsetTop // 滚动到顶端
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

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      console.log(router.query.id)
    }

    // 以下為省略eslint檢查一行
    // eslint-disable-next-line
  }, [router.isReady])

  useEffect(() => {
    fetchSubtitles()
  }, [showHiragana])

  // 更新当前播放的字幕索引
  useEffect(() => {
    const earlyPlaybackTime = 0.8

    const getCurrentSubtitleIndex = (subtitles) => {
      return subtitles.findIndex(
        (subtitle) =>
          currentTime >= subtitle.startTime - earlyPlaybackTime &&
          currentTime <= subtitle.endTime - earlyPlaybackTime
      )
    }

    if (subtitles.chinese.length > 0) {
      const currentIndex = getCurrentSubtitleIndex(subtitles.chinese)

      if (currentIndex !== -1) {
        // 有效的字幕索引
        setCurrentSubtitleIndex(currentIndex)
        setLastValidSubtitle({
          chinese: subtitles.chinese[currentIndex]?.text,
          japanese: subtitles.japanese.withRt[currentIndex]?.text || '',
        })
      } else {
        // 没有新的字幕时，保持上一次有效字幕
        scrollSubtitleToTop(currentSubtitleIndex)
      }
    }
  }, [currentTime, subtitles])

  // 渲染当前播放字幕及前后几句
  const renderScrollSubtitles = (subtitles, currentSubtitleIndex) => {
    if (!subtitles || subtitles.length === 0) return null

    const earlyPlaybackTime = 1
    const rangeStart = Math.max(currentSubtitleIndex - 2, 0) // 前2句
    const rangeEnd = Math.min(currentSubtitleIndex + 3, subtitles.length) // 后3句

    return subtitles.slice(rangeStart, rangeEnd).map((subtitle, index) => {
      const isActive =
        currentTime >= subtitle.startTime - earlyPlaybackTime &&
        currentTime <= subtitle.endTime - earlyPlaybackTime

      return (
        <div
          key={rangeStart + index}
          style={{
            padding: '10px',
            color: isActive ? 'blue' : '', // 高亮当前字幕
            fontSize: isActive ? '24px' : '18px', // 当前字幕加大
            transition: 'all 0.3s ease',
          }}
          dangerouslySetInnerHTML={{ __html: subtitle.text }}
        />
      )
    })
  }

  // 控制播放器从指定 startTime 播放或暂停
  const handlePlayFromSubtitle = (startTime) => {
    if (playerRef.current) {
      if (startTime !== null) {
        playerRef.current.seekTo(startTime) // 跳转到 startTime 并播放
        playerRef.current.getInternalPlayer().playVideo() // 开始播放
      } else {
        playerRef.current.getInternalPlayer().pauseVideo() // 暂停播放
      }
    }
  }

  const allSubtitles = useMemo(() => {
    if (subtitles && subtitles.japanese) {
      return (
        showHiragana ? subtitles.japanese.withRt : subtitles.japanese.withoutRt
      ).map((subtitle, index) => (
        <Subtitle
          key={index}
          subtitle={subtitle}
          currentTime={currentTime}
          handlePlayFromSubtitle={handlePlayFromSubtitle}
        />
      ))
    }
    return [] // 如果没有有效的字幕数据，返回空数组
  }, [subtitles, showHiragana, currentTime])

  const scrollSubtitles = useMemo(() => {
    if (subtitles && subtitles.japanese) {
      return renderScrollSubtitles(
        showHiragana ? subtitles.japanese.withRt : subtitles.japanese.withoutRt,
        currentSubtitleIndex
      )
    }
    return []
  }, [subtitles, showHiragana, currentSubtitleIndex])

  return (
    <>
      <div className="wrapper">
        <div className="left-wrapper">
          <div>
            <ReactPlayer
              ref={playerRef}
              url="https://www.youtube.com/watch?v=cpuT1AWuRx8"
              controls
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
                dangerouslySetInnerHTML={{
                  __html:
                    subtitles.chinese.length > 0
                      ? subtitles.chinese[currentSubtitleIndex]?.text
                      : '' || '',
                }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>中文下一句:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    subtitles.chinese.length > 0
                      ? subtitles.chinese[currentSubtitleIndex + 1]?.text
                      : '' || '',
                }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>日文字幕:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    subtitles.japanese.withRt &&
                    subtitles.japanese.withRt.length > 0
                      ? subtitles.japanese.withRt[currentSubtitleIndex]?.text
                      : '' || '',
                }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>日文下一句:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    subtitles.japanese.withRt &&
                    subtitles.japanese.withRt.length > 0
                      ? subtitles.japanese.withRt[currentSubtitleIndex + 1]
                          ?.text
                      : '' || '',
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
              <button onClick={handleTogglePlayPause}>播放/暂停</button>
            </div>
          </div>
          <div>
            <h3>全部日文字幕:</h3>
            <div>{allSubtitles}</div>
          </div>
        </div>
        <div className="right-wrapper">
          <div>字幕滾動區</div>
          <div>{scrollSubtitles}</div>
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

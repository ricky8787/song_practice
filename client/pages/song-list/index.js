import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/youtube'
import * as vtt from 'videojs-vtt.js'

export default function Index() {
  const playerRef = useRef(null) // 创建一个 ref 来访问 player 实例
  const [subtitles, setSubtitles] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSubtitle, setCurrentSubtitle] = useState('')

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        // const response = await fetch(
        //   'https://bitdash-a.akamaihd.net/content/sintel/subtitles/subtitles_en.vtt'
        // )
        // const vttText = await response.text()
        const response = await fetch('/subtitles/reo_the_first_take.vtt')
        const vttText = await response.text()
        // 创建一个 WebVTT 解析器
        const parser = new vtt.WebVTT.Parser(window, vtt.WebVTT.StringDecoder())

        const cues = []
        parser.oncue = (cue) => {
          // 将每个字幕条目转换为 VTTCue 对象
          const vttCue = new VTTCue(cue.startTime, cue.endTime, cue.text)
          cues.push(vttCue)
          console.log(
            `Parsed Cue: Start ${cue.startTime}, End ${cue.endTime}, Text: ${cue.text}`
          )
        }
        parser.parse(vttText)
        parser.flush()
        console.log(cues)
        setSubtitles(cues)
      } catch (error) {
        console.error('Failed to load subtitles:', error)
      }
    }

    fetchSubtitles()
  }, [])

  useEffect(() => {
    // 根據當前時間更新字幕
    const cue = subtitles.find(
      (subtitle) =>
        currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    )
    setCurrentSubtitle(cue ? cue.text : '')
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
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        />
      </div>

      <div>
        {currentSubtitle && (
          <div
          // style={{
          //   position: 'absolute',
          //   bottom: '50px',
          //   width: '100%',
          //   textAlign: 'center',
          //   color: 'white',
          //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
          //   padding: '10px',
          //   fontSize: '18px',
          // }}
          >
            字幕: {currentSubtitle}
          </div>
        )}
      </div>
    </>
  )
}

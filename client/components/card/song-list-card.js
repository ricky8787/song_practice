import React from 'react'
import { useRouter } from 'next/router'
import styles from './song-list-card.module.css'

export default function SongListCard({ video }) {
  const { id, title, img_path, duration, subtitle_zh, subtitle_jp, url } = video
  const router = useRouter()

  const goDetail = (e) => {
    // 阻止事件冒泡到父级
    e.stopPropagation()
    router.push(`/song-list/detail?id=${id}`)
  }

  //轉換時間
  const parseDuration = (duration) => {
    const regex = /PT(\d+M)?(\d+S)?/
    const matches = duration.match(regex)

    const minutes = matches[1] ? parseInt(matches[1]) : 0
    const seconds = matches[2] ? parseInt(matches[2]) : 0

    return `${minutes}分${seconds}秒`
  }

  const formattedDuration = parseDuration(duration)

  return (
    <>
      <div className={styles.cardWrapper} onClick={goDetail}>
        <img className={styles.songImg} src={img_path} />
        <div className={styles.contentWrapper}>
          <div>{title}</div>
          <span>{formattedDuration}</span>
        </div>
      </div>
    </>
  )
}

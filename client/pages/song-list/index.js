import { useState, useEffect } from 'react'
import SongListCard from '@/components/card/song-list-card'

export default function Index() {
  const [videos, setVideos] = useState([])

  const getVideos = async () => {
    const url = 'http://localhost:3005/api/videos/'

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'success' && Array.isArray(data.data.videos)) {
        setVideos(data.data.videos)
      }
    } catch (error) {
      // 错误处理
      console.error('Error fetching songs:', error)
    }
  }

  // 網頁渲染 didMount
  useEffect(() => {
    getVideos()
  }, [])

  return (
    <>
      <h1>歌曲列表</h1>
      {videos.map((video, i) => {
        return <SongListCard key={i} video={video} />
      })}
    </>
  )
}

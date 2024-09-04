import { useState, useEffect } from 'react'

// 引入 service 的 fetch function
import { getVideos } from '@/services/youtube-videos'

export default function Index() {
  const [videoID, setVideoID] = useState('')
  const [videoURL, setVideoURL] = useState('')
  const [videoData, setVideoData] = useState(null)
  const [title, setTitle] = useState('')
  const [videoImgPath, setVideoImgPath] = useState('')
  const [VideoDur, setVideoDur] = useState('')

  // 取得輸入進去 input 的 YouTube 網址的 vid
  const getQueryParamV = (url) => {
    try {
      // 檢查 URL 是否有效
      const urlObj = new URL(url)

      // 使用 URLSearchParams 來解析查詢參數
      const params = new URLSearchParams(urlObj.search)

      // 更新 videoID 狀態
      const id = params.get('v')
      if (id) {
        setVideoID(id)
      } else {
        console.warn('Query parameter v not found in the URL.')
      }
    } catch (error) {
      console.error('Error parsing URL:', error)
    }
  }

  // 當 input 的值改變時更新 videoURL 和 videoID
  const handleInputChange = (e) => {
    const url = e.target.value
    setVideoURL(url)
    getQueryParamV(url)
  }

  // 使用 Youtube Data API 查詢影片的標題、圖片、時長等資訊
  const fetchVideoData = async (videoId) => {
    try {
      const data = await getVideos(videoId)
      console.log(data)
      // 在這裡處理獲取的視頻數據
      //   setVideoData(data)

      const item = data.items[0] // 假設只關注第一個 item

      // 提取所需的字段
      const title = item.snippet.title
      setTitle(title)
      const defaultThumbnailUrl = item.snippet.thumbnails.standard.url
      setVideoImgPath(defaultThumbnailUrl)
      const duration = item.contentDetails.duration
      setVideoDur(duration)
    } catch (error) {
      console.error('Error:', error)
      // 在這裡處理錯誤
    }
  }

  useEffect(() => {}, [])
  return (
    <>
      <h1>請輸入 Youtube 的網址</h1>
      <div className="box">
        <label>
          {' '}
          網址:
          <input
            type="text"
            value={videoURL}
            onChange={handleInputChange}
            placeholder="請輸入 Youtube 網址"
          />
        </label>
        <button onClick={() => fetchVideoData(videoID)}>尋找影片</button>
      </div>
      <div>影片的ID:{videoID}</div>
      <hr />
      <img src={videoImgPath} alt="" />
      <div>標題:{title}</div>
      <div>影片長度:{VideoDur}</div>
    </>
  )
}

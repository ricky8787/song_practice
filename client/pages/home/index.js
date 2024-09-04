import { useState, useEffect } from 'react'

export default function Index() {
  const [videos, setVideos] = useState(null)

  const getVideos = () => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    const url = 'https://www.googleapis.com/youtube/v3'
  }
  return (
    <>
      <h1>home</h1>
      <div className="box">
        <img width={100} height={100} src={'/images/cat/c1.webp'} alt="" />
        <div>Title</div>
        <div>瀏覽數</div>
      </div>
    </>
  )
}

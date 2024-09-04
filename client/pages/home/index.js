import { useState, useEffect } from 'react'

export default function Index() {
  const [videos, setVideos] = useState(null)

  // useEffect(() => {}, [])
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

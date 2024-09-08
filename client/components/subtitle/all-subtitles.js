import { useState } from 'react'

export default function Subtitle({
  subtitle,
  currentTime,
  handlePlayFromSubtitle,
}) {
  const [isHovered, setIsHovered] = useState(false)

  // 判断当前字幕是否是当前播放的字幕
  const earlyPlaybackTime = 1
  const isActive =
    currentTime >= subtitle.startTime - earlyPlaybackTime &&
    currentTime <= subtitle.endTime - earlyPlaybackTime

  return (
    <div
      style={{
        padding: '10px',
        color: isActive ? 'blue' : '', // 高亮当前字幕
        fontSize: isActive ? '24px' : '18px', // 当前字幕加大
        position: 'relative', // 确保按钮的相对位置
        transition: 'all 0.3s ease', // 添加平滑过渡效果
      }}
      onMouseEnter={() => setIsHovered(true)} // 鼠标进入时显示按钮
      onMouseLeave={() => setIsHovered(false)} // 鼠标移开时隐藏按钮
    >
      {/* 显示字幕文本 */}
      <div dangerouslySetInnerHTML={{ __html: subtitle.text }} />

      {/* 鼠标悬停时显示播放和暂停按钮 */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: '10px',
          }}
        >
          {/* 播放按钮 */}
          <button
            onClick={() => handlePlayFromSubtitle(subtitle.startTime)}
            style={{ cursor: 'pointer' }}
          >
            播放
          </button>

          {/* 暂停按钮 */}
          <button
            onClick={() => handlePlayFromSubtitle(null)} // 暂停功能
            style={{ cursor: 'pointer' }}
          >
            暂停
          </button>
        </div>
      )}
    </div>
  )
}

import axiosInstance from './axios-instance'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useState } from 'react'

export const getVideos = async (id) => {
  const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const apiURL = `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet,contentDetails&fields=items(id,snippet,contentDetails)&key=${key}`

  try {
    // 發送 GET 請求
    const response = await fetch(apiURL)

    // 檢查請求是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 從響應中提取 JSON 數據
    const data = await response.json()

    // 返回數據
    return data
  } catch (error) {
    // 處理錯誤
    console.error('Error fetching video data:', error)
    throw error // 重新拋出錯誤，以便調用者可以進行進一步處理
  }
}

export const getVideoInfo = async (id = 0) => {
  return await axiosInstance.get(`/videos/${id}`)
}

export const postVideoInfo = async (video = {}) => {
  return await axiosInstance.post('/videos', video)
}

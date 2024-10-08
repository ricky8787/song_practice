// import MyNavbar from './my-navbar-nouse'
import MyNavbarBS5 from './my-navbar'
import MyFooter from './my-footer'
import Head from 'next/head'
import NextBreadCrumb from '@/components/common/next-breadcrumb'
import { useLoader } from '@/hooks/use-loader'
import SidebarMenu from '@/components/sidebar-menu/sidebar-menu'

export default function DefaultLayout({ title = 'Rensyuu', children }) {
  const { loader } = useLoader()

  return (
    <>
      <main className="main">
        <SidebarMenu />
        <div className="container-wrapper">
          {/* <NextBreadCrumb isHomeIcon isChevron bgClass="" /> */}
          {children}
        </div>
        {/* 全域的載入動畫指示器 */}
        {loader()}
      </main>
      {/* <MyFooter /> */}
    </>
  )
}

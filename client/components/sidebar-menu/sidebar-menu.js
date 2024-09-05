import { useState } from 'react'
import { MdOutlineFavorite } from 'react-icons/md'
import { IoMenu } from 'react-icons/io5'

export default function SidebarMenu() {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }
  return (
    <>
      <div className="header">
        <button
          className={open ? 'open open-button' : 'open-button'}
          onClick={toggleOpen}
        >
          <a
            className={open ? 'main-nav-toggle active-menu' : 'main-nav-toggle'}
            href="#main-nav"
          >
            <i>Menu</i>
          </a>
        </button>
      </div>

      {/* Navbar */}
      <nav id="navbar" className={open ? 'open' : ''}>
        <ul className="navbar-items flexbox-col">
          <li className="navbar-logo flexbox-left">
            <div className="navbar-item-inner logo-flexbox">
              <svg
                viewBox="0 0 24 24"
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        '.cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:1.91px;}',
                    }}
                  />
                </defs>
                <path
                  className="cls-1"
                  d="M8.18,17.73a1,1,0,1,1,1,.95,1,1,0,0,1-1-.95"
                />
                <circle className="cls-1" cx="14.86" cy="16.77" r="0.95" />
                <polyline
                  className="cls-1"
                  points="15.82 16.77 15.82 11.04 10.09 12 10.09 17.73"
                />
                <polygon
                  className="cls-1"
                  points="20.59 6.27 20.59 22.5 3.41 22.5 3.41 1.5 15.82 1.5 20.59 6.27"
                />
                <polygon
                  className="cls-1"
                  points="20.59 6.27 20.59 7.23 14.86 7.23 14.86 1.5 15.82 1.5 20.59 6.27"
                />
              </svg>

              <span className="link-text">Song Practice</span>
            </div>
          </li>
          <li className="navbar-item flexbox-left">
            <a className="navbar-item-inner flexbox-left">
              <div className="navbar-item-inner-icon-wrapper flexbox">
                <MdOutlineFavorite className="icon" />
              </div>
              <span className="link-text">Search</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}

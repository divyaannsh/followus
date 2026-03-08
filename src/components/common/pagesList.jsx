import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import MainLogo from "../../../public/img/mainLogo.png"
import { Link2, Palette, BarChart3, Settings, LogOut, ExternalLink, Sun, Moon } from "lucide-react"
import { logoutSuccess } from "@/redux/slices/authSlice"
import { toggleTheme } from "@/redux/slices/themeSlice"

export default function PagesList() {
  const router = useRouter()
  const username = useSelector((state) => state.auth.user)
  const themeMode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const isDark = themeMode === 'dark'

  const pagesList = [
    { name: "Links", link: "/admin", icon: Link2 },
    { name: "Appearance", link: "/appearance", icon: Palette },
    { name: "Analytics", link: "/analytics", icon: BarChart3 },
    { name: "Settings", link: "/settings", icon: Settings },
  ]

  const handleLogout = () => {
    dispatch(logoutSuccess())
    // Clear redux-persist storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:root")
      sessionStorage.clear()
    }
    router.push("/login")
  }

  const sidebarBg = isDark
    ? 'linear-gradient(180deg, #1e1b4b 0%, #0f0c29 100%)'
    : 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)'
  const navActiveClass = 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md shadow-indigo-200'
  const navInactiveClass = isDark
    ? 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white font-medium'
    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
  const borderClass = isDark ? 'border-indigo-900' : 'border-gray-200'

  return (
    <aside className={`w-64 border-r p-5 flex flex-col justify-between min-h-screen ${borderClass}`}
      style={{ background: sidebarBg }}>
      {/* Top: Logo */}
      <div>
        <div className="mb-8 px-2">
          <Link href="/" className="hidden md:block">
            <Image src={MainLogo} alt="logo" width={44} height={44} className="cursor-pointer" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {pagesList.map((item) => {
            const isActive = router.pathname === item.link
            const IconComponent = item.icon
            return (
              <Link href={item.link} key={item.name}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${isActive ? navActiveClass : navInactiveClass}`}
                >
                  <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm">{item.name}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* View Public Profile link */}
        {username && (
          <a
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all text-sm font-medium w-full"
          >
            <ExternalLink size={16} />
            View my profile
          </a>
        )}
      </div>

      {/* Bottom: User info + Theme toggle + Logout */}
      <div className="space-y-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium border ${isDark
              ? 'text-indigo-300 border-indigo-700 hover:bg-indigo-900/50'
              : 'text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User pill */}
        {username && (
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border ${isDark ? 'bg-indigo-900/40 border-indigo-800' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className={`text-sm font-semibold truncate ${isDark ? 'text-indigo-100' : 'text-gray-800'}`}>@{username}</p>
              <p className={`text-xs ${isDark ? 'text-indigo-400' : 'text-gray-400'}`}>Personal</p>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm font-medium border border-transparent hover:border-red-100"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  )
}
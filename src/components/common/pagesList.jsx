import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import MainLogo from "../../../public/img/mainLogo.png"
import { Link2, Palette, BarChart3, Settings, LogOut, ExternalLink } from "lucide-react"
import { logoutSuccess } from "@/redux/slices/authSlice"

export default function PagesList() {
  const router = useRouter()
  const username = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

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

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between min-h-screen"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)' }}>
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
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md shadow-indigo-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
                    }`}
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

      {/* Bottom: User info + Logout */}
      <div className="space-y-3">
        {/* User pill */}
        {username && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">@{username}</p>
              <p className="text-xs text-gray-400">Personal</p>
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
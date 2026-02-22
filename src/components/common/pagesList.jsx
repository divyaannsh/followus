import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import MainLogo from "../../../public/img/mainLogo.png"
import { Link2, Palette, BarChart3, Settings, LogOut, ChevronLeft } from "lucide-react"

export default function PagesList() {
  const router = useRouter()
  const username = useSelector((state) => state.auth.user)

  const pagesList = [
    { name: "Links", link: "/admin", icon: Link2 },
    { name: "Appearance", link: "/appearance", icon: Palette },
    { name: "Analytics", link: "/analytics", icon: BarChart3 },
    { name: "Settings", link: "/settings", icon: Settings },
  ]

  const handleBack = () => {
    window.history.back()
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
      </div>

      {/* Bottom: User info + Back */}
      <div className="space-y-3">
        {/* User pill */}
        {username && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">@{username}</p>
              <p className="text-xs text-gray-400">Personal</p>
            </div>
          </div>
        )}

        <button
          onClick={handleBack}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 text-sm font-medium"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>
    </aside>
  )
}
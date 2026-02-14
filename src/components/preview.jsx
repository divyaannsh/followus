"use client"

import { useState, useEffect } from "react"

export default function PreviewPage() {
  const [links, setLinks] = useState([])
  const [profile, setProfile] = useState({
    name: "Robin Khan",
    bio: "Welcome to my links!",
    avatar: "https://thumbs.dreamstime.com/z/vector-illustration-avatar-dummy-sign-collection-avatar-image-stock-symbol-web-vector-design-avatar-dummy-137160097.jpg",
  });

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const response = await fetch("/api/links")
    const data = await response.json()
    setLinks(data)
  }
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[40px] bg-white shadow-xl">
        <div className="relative h-[667px] w-full overflow-y-auto p-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-center text-gray-600">{profile.bio}</p>
          </div>

          <div className="mt-8 space-y-4">
            {links.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-gray-100 p-4 text-center font-medium transition-colors hover:bg-gray-200"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


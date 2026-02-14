import { useState, useEffect } from "react"
import Image from "next/image"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PagesList from "@/components/common/pagesList"

export default function Appearance() {
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [formData, setFormData] = useState({
    profileImage: null,
  })
  const username = useSelector((state) => state.auth.user)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/auth/signup?username=${username}`)
      const profileData = response.data[0]
      setFormData({
        profileImage: profileData.profileImage || null,
        _id: profileData._id || null,
      })
      setAvatarPreview(profileData.profileImage || null)
    } catch (error) {
      toast.error("Error fetching profile")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, profileImage: file })
      setAvatarPreview(URL.createObjectURL(file))
    }
  }
  
  const handleUpdateProfileImage = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append("_id", formData._id)
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage)
      }

      const response = await axios.put(`/api/auth/signup`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Profile image updated successfully")
    } catch (error) {
      toast.error("Failed to update profile image")
      console.error("Error updating profile image:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <PagesList />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
          <h1 className="text-2xl font-bold mb-4  text-gray-800 dark:bg-gray-900 dark:text-gray-100">Update Profile Image</h1>
          <form onSubmit={handleUpdateProfileImage} className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Profile" layout="fill" objectFit="cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {username?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Update Profile Image
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
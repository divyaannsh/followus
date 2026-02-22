import { useState, useEffect } from "react"
import Image from "next/image"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import PagesList from "@/components/common/pagesList"
import { Upload, Camera, User, Type, Save } from "lucide-react"

export default function Appearance() {
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    profileImage: null,
    bio: "",
    _id: null,
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
        bio: profileData.Bio || "",
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

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, profileImage: file })
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append("_id", formData._id)
      if (formData.profileImage && typeof formData.profileImage !== "string") {
        data.append("profileImage", formData.profileImage)
      }
      data.append("Bio", formData.bio)

      await axios.put(`/api/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Profile updated successfully!")
      fetchProfile()
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Error updating profile:", error)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
      <PagesList />

      <div className="flex-1 flex flex-col items-center py-10 px-6">
        {/* Page Header */}
        <div className="w-full max-w-2xl mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
          <p className="text-gray-500 mt-1">Customize your profile photo and bio</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="w-full max-w-2xl space-y-6">
          {/* Avatar Upload Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Camera size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-800">Profile Photo</h2>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-indigo-100">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatarInput"
                  className="absolute bottom-1 right-1 w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                >
                  <Camera size={18} className="text-white" />
                </label>
              </div>

              {/* Drop Zone */}
              <label
                htmlFor="avatarInput"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl py-8 px-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 ${isDragging
                    ? "border-indigo-400 bg-indigo-50 scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${isDragging ? "bg-indigo-100" : "bg-gray-100"
                  }`}>
                  <Upload size={24} className={isDragging ? "text-indigo-500" : "text-gray-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ? "Drop your image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Bio Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Type size={20} className="text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
            </div>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell the world about yourself..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-2 text-right">{formData.bio?.length || 0} / 150</p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Save size={20} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
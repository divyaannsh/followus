"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Copy, Edit, Share2, Trash2, Plus, ArrowRight, Download } from "lucide-react"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import axiosInstance from "utils/axiosInstance"
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DialogModal from "@/components/common/dialogModal"
import Link from "next/link"
import PagesList from "@/components/common/pagesList"
import { Alert, Button, Input, CircularProgress } from "@mui/material"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export default function AdminPage() {
  const router = useRouter()
  const [links, setLinks] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [templates, setTemplates] = useState([]);
  const [buttonUrls, setButtonUrls] = useState({});
  const [openSocial, setOpenSocial] = useState(null);
  const [formData2, setFormData2] = useState({ url: "" });
  const [savedLinks, setSavedLinks] = useState({}); // To store updated links
  const [socialUrls, setSocialUrls] = useState([]);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    profileName: "",
    profileImage: null,
    bio: "",
    avatar: null,
  })


  const username = useSelector((state) => state.auth.user)
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [userProfile, setUserProfile] = useState();
  const [open, setOpen] = useState(false);
  const [isOpenFiled, setIsOpenFiled] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProfileUrl(`${window.location.origin}/${username}`)
    }
    fetchLinks()
    fetchProfile()
  }, [username])

  console.log("userProfile", userProfile);

  const socialPlatforms = userProfile
    ? [
      { id: "youtube", url: userProfile.youtube, icon: faYoutube, color: "text-red-600" },
      { id: "whatsapp", url: userProfile.whatsAppLink ? `https://wa.me/${userProfile.whatsAppLink}` : null, icon: faWhatsapp, color: "text-green-500" },
      { id: "Twitlink", url: userProfile.Twitlink, icon: faTwitter, color: "text-blue-400" },
      { id: "Fblink", url: userProfile.Fblink, icon: faFacebook, color: "text-blue-600" },
      { id: "Instalink", url: userProfile.Instalink, icon: faInstagram, color: "text-pink-500" },
    ]
    : [];


  const handleInputChange = (id, value) => {
    setButtonUrls((prev) => ({ ...prev, [id]: value }));
  };


  const fetchLinks = async () => {
    try {
      const response = await axios.get(`/api/user/socialLinks?username=${username}`)
      setLinks(response.data)
    } catch (error) {
      toast.error("Error fetching links")
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/auth/signup?username=${username}`)
      const profileData = response.data[0]
      setUserProfile(profileData)
      setFormData({
        ...formData,
        profileName: profileData.profileName || "",
        bio: profileData.Bio || "",
        profileImage: profileData.profileImage || null,
        _id: profileData._id || ""
      })
      setAvatarPreview(profileData.profileImage || null)
    } catch (error) {
      toast.error("Error fetching profile")
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, avatar: file })
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleAddLinks = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/user/socialLinks", {
        url: formData.url,
        title: formData.title,
        username: username,
        isVisible: "false"
      })
      setLinks([...links, response.data])
      toast.success("Link added successfully")
      setShowAddForm(false)
      setFormData({ ...formData, url: "", title: "" })
      fetchLinks()
    } catch (error) {
      toast.error("Failed to add link")
    }
  }

  const handleEditLink = async (e, isUrlUpdate) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("_id", formData._id);

      if (isUrlUpdate) {
        if (formData2.url.trim()) {
          data.append("socialUrls", formData2.url);
        }
      } else {
        // Updating bio & profile image
        data.append("Bio", formData.bio);
        if (formData.avatar) {
          data.append("profileImage", formData.avatar);
        }
      }

      const response = await axiosInstance.put(`/api/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully");
      fetchProfile(); // Refresh profile data

      if (isUrlUpdate) {
        setSocialUrls((prevUrls) => [...prevUrls, formData2.url]); // Append new URL to state
        setFormData2({ url: "" }); // Reset input field
      } else {
        setIsOpenFiled(false); // Hide input after update
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };


  console.log("savedLinks", savedLinks);

  const handleEditLink2 = async (e) => {
    e.preventDefault();
    if (!formData2.url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      const data = new FormData();
      data.append("_id", formData._id);
      data.append(openSocial, formData2.url);

      await axios.put(`/api/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully");
      fetchProfile();

      // Save link & close input field
      setSavedLinks({ ...savedLinks, [openSocial]: formData2.url, });
      setOpenSocial(null);
      setFormData2({ url: "" });
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await axios.delete(`/api/user/socialLinks?id=${id}`)
      setLinks(links.filter((link) => link.id !== id))
      toast.success("Link deleted successfully")
      fetchLinks()
    } catch (error) {
      toast.error("Failed to delete link")
    }
    // 
  }

  const handleToggleLinkVisibility = async (id, isVisible) => {
    try {
      await axios.put(`/api/user/socialLinks?id=${id}`, { isVisible: !isVisible })
      setLinks(links.map((link) => (link._id === id ? { ...link, isVisible: !isVisible } : link)))
      toast.success("Link visibility updated")
    } catch (error) {
      toast.error("Failed to update link visibility")
    }
  }


  const handleProfileAvatorPage = () => {
    router.push("/appearance")
  }

  const handleEditClick = (link) => {
    // setEditingLink(link);
    // setUrl(link.url);
    // setTitle(link.title);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success("Profile URL copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: formData.profileName,
          text: `Check out ${formData.profileName}'s profile`,
          url: profileUrl,
        })
      } else {
        throw new Error("Share not supported")
      }
    } catch (error) {
      toast.error("Sharing not supported in this browser")
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/user/template/chooseTemplate?username=${username}`);
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (userProfile) {
      const initialLinks = {
        youtube: userProfile.youtube || "",
        whatsapp: userProfile.whatsAppLink ? `https://wa.me/${userProfile.whatsAppLink}` : "",
        Twitlink: userProfile.Twitlink || "",
        Fblink: userProfile.Fblink || "",
        Instalink: userProfile.Instalink || "",
      };
      setSavedLinks(initialLinks);
    }
  }, [userProfile]);


  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
        <CircularProgress size={60} color="primary" />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Go to Template Page, select a template, and come back here</h2>
          <p className="text-lg text-gray-600 mb-6">You need to select a template to access this page.</p>
          <div className="flex justify-center gap-6">
            <Link href="/template" className="bg-gray-600 hover:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md transition-all">
              Go
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">

      <PagesList />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Analytics Header */}
          <div className="bg-black text-white p-4 rounded-md mb-6">
            <h1 className="text-lg font-medium">Admin</h1>
          </div>

          {/* User Profile */}
          <div className="bg-white rounded-md p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 bg-black rounded-full flex items-center justify-center text-white overflow-hidden">
                <Image
                  src={avatarPreview || "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover cursor-pointer"
                  onClick={handleProfileAvatorPage}
                />
                {/* <span >{formData.profileName.charAt(0)}</span> */}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium  text-gray-800 dark:bg-gray-900 dark:text-gray-100">{userProfile?.username || "Loading...."}</h2>
                  {/* <Edit onClick={handleEditClick} /> */}
                </div>
                <p className="text-sm text-gray-600 inline-flex items-center gap-1">
                  <Edit onClick={() => setIsOpenFiled(true)} />
                  {isOpenFiled ? (
                    <form onSubmit={(e) => handleEditLink(e)} className="inline-flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="border border-gray-300 rounded-md p-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button type="submit" className="text-blue-600 hover:underline">
                        Save
                      </button>
                    </form>
                  ) : (
                    userProfile?.Bio || "Please Write in Bio..."
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Add Button */}
          <div className="mb-4">
            <button
              className="w-full bg-red-700 text-white py-2 rounded-md flex items-center justify-center"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={18} className="mr-1" /> Add
            </button>
          </div>
          <div className="flex gap-3 mb-2">
            {socialPlatforms.map((platform) => (
              <div key={platform.id} className="relative">
                <button
                  onClick={() => setOpenSocial(openSocial === platform.id ? null : platform.id)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${openSocial === platform.id ? "bg-gray-800 text-white" : "bg-white border-gray-400  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                    }`}
                >

                  <FontAwesomeIcon icon={platform.icon} className="w-6 h-6" />
                </button>
                {/* Input field opens below selected button */}
                {openSocial && (
                  <div className="fixed inset-0 flex items-center justify-center ">

                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold">
                          Edit {socialPlatforms.find((p) => p.id === openSocial)?.name} Link
                        </h3>
                        <button onClick={() => setOpenSocial(null)}>
                          <FontAwesomeIcon icon={faTimes} className="text-gray-600 w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleEditLink2} className="mt-4 space-y-3">
                        <div className="flex items-center border p-2 rounded-md">
                          <FontAwesomeIcon
                            icon={socialPlatforms.find((p) => p.id === openSocial)?.icon}
                            className="text-gray-700 w-5 h-5"
                          />
                          <input
                            type="text"
                            value={formData2.url}
                            onChange={(e) => setFormData2({ url: e.target.value })}
                            className="flex-1 ml-2 p-2 border border-gray-300 rounded-md focus:border-blue-300 focus:ring-blue-200"
                            placeholder="Enter URL"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow p-6 space-y-4 mb-4">
              <form onSubmit={handleAddLinks} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    URL
                  </label>
                  <input
                    id="url"
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add form of social-media */}


          {/* Collection and Archive */}
          {/* <div className="flex justify-between mb-6">
            <button className="bg-gray-200 text-black py-2 px-4 rounded-md text-sm mt-2">Add Collection</button>
            <button className="text-black text-sm flex items-center">
              View Archive <ArrowRight size={16} className="ml-1" />
            </button>
          </div> */}

          {/* Social Platforms */}
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="bg-white rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium  text-gray-800 dark:bg-gray-900 dark:text-gray-100">{link.title}</h3>
                    {/* <button onClick={() => handleEditClick(link)}>
                      <Edit size={14} />
                    </button> */}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <button>
                      <Download size={16} />
                    </button> */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={link.isVisible}
                        onChange={() => handleToggleLinkVisibility(link._id, link.isVisible)}
                      />
                      <div className="w-10 h-6 bg-gray-200 peer-checked:bg-gray-600 rounded-full peer">
                        <div
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ${link.isVisible ? "translate-x-4" : ""}`}
                        ></div>
                      </div>
                    </label>
                    <button className="text-gray-600 hover:text-red-600" onClick={() => handleDeleteLink(link._id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">URL</p>
                <div className="bg-gray-200 h-12 rounded-md mb-2 p-3 text-gray-800 dark:bg-gray-900 dark:text-gray-100">{link.url}</div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500">30 Days</span>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </main>


      <div className="flex flex-col items-center mt-10">
        {/* Profile URL and QR Code Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`}
                alt="Profile QR Code"
                className="w-32 h-32"
              />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-xl mb-3 border border-green-100">
                <span className="text-sm font-medium text-green-700 truncate mr-2">
                  {profileUrl}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                  title="Copy link"
                >
                  <Copy size={18} />
                </button>
              </div>

              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`);
                    const blob = await response.json().then(() => { throw new Error("Expected image, got json") }).catch(async () => {
                      const res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`);
                      return res.blob();
                    });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `followus-qr-${username}.png`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    toast.success("QR Code downloaded!");
                  } catch (error) {
                    toast.error("Failed to download QR code");
                  }
                }}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                <Download size={18} /> Download QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <aside className="w-96 p-6 flex items-center justify-center">
          <div
            className="relative w-80 h-[700px] border-[12px] border-black rounded-[50px] overflow-hidden bg-white shadow-2xl"
            style={{ background: templates?.[0]?.bgcolor || '#f3f4f6' }}
          >
            {/* Notch for the mobile mockup */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-8 bg-black rounded-b-xl"></div>

            <div className="p-6 flex flex-col items-center pt-16">
              {/* Profile Avatar */}
              <div className="h-20 w-20 rounded-full overflow-hidden mb-3 border-2 border-gray-300">
                <Image
                  src={avatarPreview || "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>

              <h3 className="font-bold text-gray-100">{userProfile?.username || "Robin Khan"}</h3>
              <p className="text-sm text-gray-100 mb-5">@{userProfile?.Bio}</p>

              {/* Social Buttons */}
              <div className="mt-5">
                <div className="flex space-x-3 my-3">
                  {Object.keys(savedLinks).map((key) => (
                    savedLinks[key] && (
                      <a
                        key={key}
                        href={savedLinks[key].startsWith('http') ? savedLinks[key] : `https://${savedLinks[key]}`} // Open link in a new tab
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-400 transition bg-white  text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                      >
                        <FontAwesomeIcon icon={socialPlatforms.find((p) => p.id === key)?.icon} size="lg" />
                      </a>
                    )
                  ))}
                </div>
                {/* Display Selected URLs */}
              </div>

              {/* Links */}
              {links?.filter(link => link.isVisible).map((link) => (
                <a
                  key={link.id}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 border border-gray-100 text-base mb-3 text-center block hover:bg-gray-400 transition py-2 rounded-full"
                  style={{
                    background: templates?.[0]?.bgcolor || '#f3f4f6',
                    color: templates?.[0]?.color || '#000'
                  }}
                >
                  {link?.title}
                </a>
              ))}

            </div>
          </div>
        </aside>
      </div>
      <DialogModal open={open} setOpen={setOpen} />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Copy, Edit, Trash2, Plus, ArrowRight, Download, X, ExternalLink, QrCode, GripVertical, Pin, Play, Music, Clock, Scissors, Link2 } from "lucide-react"
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
import { CircularProgress } from "@mui/material"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Favicon helper
function getFavicon(url) {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

// Sortable Link Item
function SortableLinkItem({ link, onToggle, onDelete, onPin }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link._id });
  const favicon = link.type === 'link' || !link.type ? getFavicon(link.url) : null;
  const [faviconError, setFaviconError] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  // Schedule status badge
  const now = new Date();
  const scheduled = link.scheduledAt ? new Date(link.scheduledAt) : null;
  const expires = link.expiresAt ? new Date(link.expiresAt) : null;
  const isNotYetActive = scheduled && scheduled > now;
  const isExpired = expires && expires < now;

  const TYPE_ICON = { youtube: <Play size={14} className="text-red-500" />, spotify: <Music size={14} className="text-green-500" /> };
  const ANIM_COLORS = { bounce: 'bg-blue-50 text-blue-600', pulse: 'bg-purple-50 text-purple-600', shake: 'bg-orange-50 text-orange-600', glow: 'bg-yellow-50 text-yellow-600' };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-200 group flex flex-col gap-2 ${link.isPinned ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-100 hover:shadow-md'}`}>
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button {...attributes} {...listeners} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 touch-none">
          <GripVertical size={18} />
        </button>

        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shrink-0 border border-gray-100">
          {link.type === 'youtube' ? (
            <Play size={16} className="text-red-500 fill-red-500" />
          ) : link.type === 'spotify' ? (
            <Music size={16} className="text-green-500" />
          ) : favicon && !faviconError ? (
            <img src={favicon} alt="" width={18} height={18} onError={() => setFaviconError(true)} className="rounded-sm" />
          ) : (
            <ExternalLink size={16} className="text-indigo-500" />
          )}
        </div>

        {/* Title + URL */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {link.isPinned && <span className="text-yellow-500 shrink-0">📌</span>}
            <h3 className="font-semibold text-gray-900 truncate text-sm">{link.title}</h3>
          </div>
          <p className="text-xs text-gray-400 truncate">{link.url}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Pin toggle */}
          <button
            onClick={() => onPin(link._id, link.isPinned)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${link.isPinned ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
            title={link.isPinned ? 'Unpin' : 'Pin to top'}
          >
            <Pin size={15} />
          </button>
          {/* Go to Link */}
          <a
            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
            title="Go to link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={15} />
          </a>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={link.isVisible} onChange={() => onToggle(link._id, link.isVisible)} />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-indigo-500 rounded-full transition-colors duration-200">
              <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-all duration-200 ${link.isVisible ? "translate-x-5" : ""}`} />
            </div>
          </label>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100" onClick={() => onDelete(link._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Badges row */}
      {(link.animation && link.animation !== 'none') || isNotYetActive || isExpired || link.type !== 'link' ? (
        <div className="flex flex-wrap gap-1.5 ml-9 pb-1">
          {link.type && link.type !== 'link' && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${link.type === 'youtube' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {link.type === 'youtube' ? '▶ YouTube' : '🎵 Spotify'}
            </span>
          )}
          {link.animation && link.animation !== 'none' && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ANIM_COLORS[link.animation] || 'bg-gray-100 text-gray-500'}`}>
              ✨ {link.animation}
            </span>
          )}
          {isNotYetActive && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
              <Clock size={9} /> Scheduled {new Date(link.scheduledAt).toLocaleDateString()}
            </span>
          )}
          {isExpired && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
              ⌛ Expired
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter()
  const [links, setLinks] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [templates, setTemplates] = useState([]);
  const [buttonUrls, setButtonUrls] = useState({});
  const [openSocial, setOpenSocial] = useState(null);
  const [formData2, setFormData2] = useState({ url: "" });
  const [savedLinks, setSavedLinks] = useState({});
  const [socialUrls, setSocialUrls] = useState([]);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    profileName: "",
    profileImage: null,
    bio: "",
    avatar: null,
    linkType: "link",
    animation: "none",
    scheduledAt: "",
    expiresAt: "",
  })

  const username = useSelector((state) => state.auth.user)
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [userProfile, setUserProfile] = useState();
  const [open, setOpen] = useState(false);
  const [isOpenFiled, setIsOpenFiled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shortLinks, setShortLinks] = useState([]);
  const [shortUrlInput, setShortUrlInput] = useState("");
  const [shortSlugInput, setShortSlugInput] = useState("");
  const [shortLoading, setShortLoading] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l._id === active.id);
    const newIndex = links.findIndex((l) => l._id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    setLinks(reordered);
    try {
      await axios.post('/api/user/socialLinks/reorder', {
        username,
        orderedIds: reordered.map((l) => l._id),
      });
    } catch {
      toast.error('Failed to save link order');
    }
  };

  useEffect(() => {
    if (!username) return // wait for Redux to hydrate
    if (typeof window !== "undefined") {
      setProfileUrl(`${window.location.origin}/${username}`)
    }
    fetchLinks()
    fetchShortLinks()
    fetchProfile()
  }, [username])

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
    if (!username) return
    try {
      // Use ?admin=1 so scheduled/expired links still appear in admin dashboard
      const response = await axios.get(`/api/user/socialLinks?username=${username}&admin=1`)
      setLinks(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("fetchLinks error:", error)
    }
  };

  const fetchShortLinks = async () => {
    if (!username) return;
    try {
      const response = await axios.get(`/api/user/shortlinks?username=${username}`);
      setShortLinks(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to load short links");
    }
  };

  const handleCreateShortLink = async (e) => {
    e.preventDefault();
    if (!shortUrlInput.trim()) {
      toast.error("Enter a URL to shorten");
      return;
    }
    setShortLoading(true);
    try {
      await axios.post("/api/user/shortlinks", {
        username,
        originalUrl: shortUrlInput.trim(),
        customSlug: shortSlugInput.trim() || undefined,
      });
      toast.success("Short link created");
      setShortUrlInput("");
      setShortSlugInput("");
      fetchShortLinks();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create short link");
    } finally {
      setShortLoading(false);
    }
  };

  const handleDeleteShortLink = async (id) => {
    try {
      await axios.delete(`/api/user/shortlinks?id=${id}`);
      toast.success("Short link deleted");
      fetchShortLinks();
    } catch {
      toast.error("Failed to delete short link");
    }
  };

  const handlePinLink = async (id, currentlyPinned) => {
    try {
      await axios.patch('/api/user/socialLinks/pin', { id, isPinned: !currentlyPinned });
      setLinks(links.map((l) => l._id === id ? { ...l, isPinned: !currentlyPinned } : l));
      toast.success(currentlyPinned ? 'Link unpinned' : 'Link pinned to top!');
    } catch {
      toast.error('Failed to update pin');
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
      await axios.post("/api/user/socialLinks", {
        url: formData.url,
        title: formData.title,
        username: username,
        isVisible: false,
        type: formData.linkType || 'link',
        animation: formData.animation || 'none',
        scheduledAt: formData.scheduledAt || null,
        expiresAt: formData.expiresAt || null,
      })
      toast.success("Link added successfully")
      setShowAddForm(false)
      setFormData({ ...formData, url: '', title: '', linkType: 'link', animation: 'none', scheduledAt: '', expiresAt: '' })
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
        data.append("Bio", formData.bio);
        if (formData.avatar) {
          data.append("profileImage", formData.avatar);
        }
      }

      await axiosInstance.put(`/api/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully");
      fetchProfile();

      if (isUrlUpdate) {
        setSocialUrls((prevUrls) => [...prevUrls, formData2.url]);
        setFormData2({ url: "" });
      } else {
        setIsOpenFiled(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

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

      setSavedLinks({ ...savedLinks, [openSocial]: formData2.url });
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
      setLoading(false);
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
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <CircularProgress size={48} sx={{ color: '#6366f1' }} />
          <p className="text-gray-500 font-medium text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center w-[90%] max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <QrCode size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Select a Template First</h2>
          <p className="text-gray-500 mb-8">Choose a template to get started with your profile page.</p>
          <Link href="/template" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Browse Templates <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
      <PagesList />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl mb-6 shadow-lg shadow-indigo-200">
            <p className="text-indigo-100 text-sm font-medium">Dashboard</p>
            <h1 className="text-2xl font-bold mt-1">Welcome back, {userProfile?.username || "User"} 👋</h1>
          </div>

          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md cursor-pointer hover:shadow-lg transition-shadow shrink-0" onClick={handleProfileAvatorPage}>
                <Image
                  src={avatarPreview || "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">{userProfile?.username || "Loading..."}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => setIsOpenFiled(true)} className="text-gray-400 hover:text-indigo-500 transition-colors">
                    <Edit size={14} />
                  </button>
                  {isOpenFiled ? (
                    <form onSubmit={(e) => handleEditLink(e)} className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-all"
                        placeholder="Write your bio..."
                      />
                      <button type="submit" className="text-sm font-semibold text-indigo-500 hover:text-indigo-700">Save</button>
                      <button type="button" onClick={() => setIsOpenFiled(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-500 truncate">{userProfile?.Bio || "Add a bio..."}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add Link Button */}
          <button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all mb-4 hover:scale-[1.01] active:scale-[0.99]"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={20} /> Add New Link
          </button>

          {/* Social Platform Buttons */}
          <div className="flex gap-3 mb-4">
            {socialPlatforms.map((platform) => (
              <div key={platform.id} className="relative">
                <button
                  onClick={() => setOpenSocial(openSocial === platform.id ? null : platform.id)}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${openSocial === platform.id
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent text-white shadow-md shadow-indigo-200"
                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:shadow-md"
                    }`}
                >
                  <FontAwesomeIcon icon={platform.icon} className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Social Link Edit Modal */}
          {openSocial && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit Social Link
                  </h3>
                  <button onClick={() => setOpenSocial(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleEditLink2} className="space-y-4">
                  <div className="flex items-center border-2 border-gray-200 p-3 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <FontAwesomeIcon
                      icon={socialPlatforms.find((p) => p.id === openSocial)?.icon}
                      className="text-gray-400 w-5 h-5"
                    />
                    <input
                      type="text"
                      value={formData2.url}
                      onChange={(e) => setFormData2({ url: e.target.value })}
                      className="flex-1 ml-3 focus:outline-none text-gray-700 placeholder-gray-400"
                      placeholder="Paste your URL here"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md active:scale-[0.99]"
                  >
                    Save Link
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 mb-4">
              <form onSubmit={handleAddLinks} className="space-y-4">

                {/* Type selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'link', label: '🔗 Link' },
                      { value: 'youtube', label: '▶ YouTube' },
                      { value: 'spotify', label: '🎵 Spotify' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, linkType: opt.value })}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${formData.linkType === opt.value ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={formData.linkType === 'youtube' ? 'My YouTube Video' : formData.linkType === 'spotify' ? 'My Spotify Track' : 'My Website'}
                    className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-gray-700 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.linkType === 'youtube' ? 'YouTube URL' : formData.linkType === 'spotify' ? 'Spotify URL' : 'URL'}
                  </label>
                  <input
                    id="url"
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder={formData.linkType === 'youtube' ? 'https://youtube.com/watch?v=...' : formData.linkType === 'spotify' ? 'https://open.spotify.com/track/...' : 'https://example.com'}
                    className="w-full rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Animation picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Animation</label>
                  <div className="flex flex-wrap gap-2">
                    {['none', 'bounce', 'pulse', 'shake', 'glow'].map((anim) => (
                      <button
                        key={anim}
                        type="button"
                        onClick={() => setFormData({ ...formData, animation: anim })}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border-2 transition-all capitalize ${formData.animation === anim ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                      >
                        {anim === 'none' ? '— None' : anim === 'bounce' ? '⬆ Bounce' : anim === 'pulse' ? '💫 Pulse' : anim === 'shake' ? '〰 Shake' : '✨ Glow'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scheduling (optional) */}
                <details className="group">
                  <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-indigo-600 list-none flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Schedule (optional)</span>
                    <span className="text-xs text-gray-400 ml-auto group-open:hidden">▸ expand</span>
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Show from</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledAt}
                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                        className="w-full rounded-xl border-2 border-gray-200 p-2.5 text-sm focus:border-indigo-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Hide after</label>
                      <input
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                        className="w-full rounded-xl border-2 border-gray-200 p-2.5 text-sm focus:border-indigo-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </details>

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 px-6 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-100 text-gray-600 py-2.5 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Link Shortener */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 mb-4">
            <div className="flex items-center gap-2">
              <Scissors size={18} className="text-indigo-500" />
              <h3 className="font-semibold text-gray-900">Link Shortener</h3>
            </div>
            <form onSubmit={handleCreateShortLink} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="url"
                value={shortUrlInput}
                onChange={(e) => setShortUrlInput(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="md:col-span-2 rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-sm"
              />
              <input
                type="text"
                value={shortSlugInput}
                onChange={(e) => setShortSlugInput(e.target.value)}
                placeholder="custom-slug (optional)"
                className="rounded-xl border-2 border-gray-200 p-3 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-sm"
              />
              <button
                type="submit"
                disabled={shortLoading}
                className="md:col-span-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 px-5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-60"
              >
                {shortLoading ? "Creating..." : "Create Short Link"}
              </button>
            </form>

            <div className="space-y-2">
              {shortLinks.length === 0 ? (
                <p className="text-sm text-gray-400">No short links yet.</p>
              ) : (
                shortLinks.map((item) => {
                  const shortUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/s/${item.slug}`;
                  return (
                    <div key={item._id} className="border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                      <Link2 size={14} className="text-indigo-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">/s/{item.slug}</p>
                        <p className="text-xs text-gray-400 truncate">{item.originalUrl}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(shortUrl)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-50"
                        title="Copy short URL"
                      >
                        <Copy size={14} />
                      </button>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-50"
                        title="Open short URL"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => handleDeleteShortLink(item._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
                        title="Delete short URL"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Links List */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map((l) => l._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {links.map((link) => (
                  <SortableLinkItem
                    key={link._id}
                    link={link}
                    onToggle={handleToggleLinkVisibility}
                    onDelete={handleDeleteLink}
                    onPin={handlePinLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </main>

      {/* Right Panel - QR + Preview */}
      <div className="w-[380px] p-6 flex flex-col items-center gap-6 border-l border-gray-200 bg-white/50 backdrop-blur-sm overflow-y-auto">
        {/* QR Code Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full">
          <div className="flex items-center gap-2 mb-4">
            <QrCode size={20} className="text-indigo-500" />
            <h3 className="font-semibold text-gray-900">Share Profile</h3>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 flex items-center justify-center mb-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`}
              alt="Profile QR Code"
              className="w-28 h-28"
            />
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2.5 rounded-xl mb-3 border border-indigo-100">
            <span className="text-xs font-medium text-indigo-600 truncate flex-1">{profileUrl}</span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-500 shrink-0"
              title="Copy link"
            >
              <Copy size={16} />
            </button>
          </div>

          <button
            onClick={async () => {
              try {
                const res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`);
                const blob = await res.blob();
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
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-[0.98] text-sm"
          >
            <Download size={16} /> Download QR Code
          </button>
        </div>

        {/* Mobile Preview */}
        <div className="w-full flex justify-center">
          <div
            className="relative w-[280px] h-[580px] border-[10px] border-gray-900 rounded-[44px] overflow-hidden shadow-2xl"
            style={{ background: templates?.[0]?.bgcolor || '#f3f4f6' }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
            {/* Speaker grill */}
            <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full z-20"></div>

            <div className="p-5 flex flex-col items-center pt-12 h-full overflow-y-auto">
              {/* Profile Avatar */}
              <div className="h-16 w-16 rounded-full overflow-hidden mb-2 border-2 border-white/30 shadow-lg shrink-0">
                <Image
                  src={avatarPreview || "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg"}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="font-bold text-sm" style={{ color: templates?.[0]?.color || '#fff' }}>{userProfile?.username || "Username"}</h3>
              <p className="text-xs mb-4 opacity-70" style={{ color: templates?.[0]?.color || '#fff' }}>@{userProfile?.Bio}</p>

              {/* Social Buttons */}
              <div className="flex space-x-2 my-2">
                {Object.keys(savedLinks).map((key) => (
                  savedLinks[key] && (
                    <a
                      key={key}
                      href={savedLinks[key].startsWith('http') ? savedLinks[key] : `https://${savedLinks[key]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition bg-white/5 text-white"
                    >
                      <FontAwesomeIcon icon={socialPlatforms.find((p) => p.id === key)?.icon} className="w-3.5 h-3.5" />
                    </a>
                  )
                ))}
              </div>

              {/* Links */}
              <div className="w-full mt-2 space-y-2">
                {links?.filter(link => link.isVisible).map((link) => (
                  <a
                    key={link.id}
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 border border-white/10 text-xs text-center block hover:bg-white/10 transition rounded-full"
                    style={{
                      color: templates?.[0]?.color || '#000'
                    }}
                  >
                    {link?.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogModal open={open} setOpen={setOpen} />
    </div>
  )
}

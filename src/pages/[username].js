"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { faInstagram, faFacebook, faYoutube, faXTwitter, faWhatsapp, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PreviewPage() {
  const [links, setLinks] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const router = useRouter();
  const { username } = router.query;


  const handleLinkClick = async (linkId) => {
    try {
      await axios.patch(`/api/user/socialLinks?id=${linkId}&type=click`);
    } catch (error) {
      console.error("Error updating link click count:", error);
    }
  };

  const handleView = async (linkId) => {
    try {
      await axios.patch(`/api/user/socialLinks?id=${linkId}&type=view`);
    } catch (error) {
      console.error("Error updating link view count:", error);
    }
  };

  useEffect(() => {
    if (links.length > 0) {
      links.forEach((link) => {
        handleView(link._id);
      });
    }
  }, [links]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/user/template/chooseTemplate?username=${username}`);
        const result = await response.json();

        if (result.success && result.data) {
          setSelectedTemplate(result.data[0]);
        } else {
          console.error("Error:", result.message);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    if (username) fetchTemplates();
  }, [username]);



  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          const response = await axios.get(`/api/auth/signup?username=${username}`);
          const profileData = Array.isArray(response.data) ? response.data[0] : response.data;
          setUserProfile(profileData);
        } catch (error) {
          // console.error("Error fetching profile:", error.response?.data || error.message);
        }
      }
    };
    fetchProfile();
  }, [username]);


  // List of social links with icons
  const socialLinks = userProfile
    ? [
      { id: "youtube", url: userProfile.youtube, icon: faYoutube, color: "text-red-600" },
      { id: "whatsapp", url: userProfile.whatsAppLink ? `https://wa.me/${userProfile.whatsAppLink}` : null, icon: faWhatsapp, color: "text-green-500" },
      { id: "twitter", url: userProfile.Twitlink, icon: faTwitter, color: "text-blue-400" },
      { id: "facebook", url: userProfile.Fblink, icon: faFacebook, color: "text-blue-600" },
      { id: "instagram", url: userProfile.Instalink, icon: faInstagram, color: "text-pink-500" },
    ]
    : [];



  useEffect(() => {
    const fetchLinks = async () => {
      if (username) {
        try {
          const response = await axios.get(`/api/user/socialLinks?username=${username}`);
          setLinks(response.data);
        } catch (error) {
        }
      }
    };
    fetchLinks();
  }, [username]);


  return (
    <div className="w-full h-screen flex justify-center items-center p-0">
      {selectedTemplate && (
        <Card
          className="relative w-full h-full overflow-hidden border-0 transition-all cursor-pointer"
          sx={{
            background: selectedTemplate.bgcolor,
            textAlign: "center",
            padding: "20px",
          }}
        >
          <Box className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={userProfile?.profileImage || ""}
                alt={userProfile?.profileImage}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <Typography variant="h5" className="text-white font-bold">
              {userProfile?.username}
            </Typography>
            <Typography className="text-gray-200">
              {userProfile?.Bio || selectedTemplate.bio}
            </Typography>
          </Box>


          <div className="flex items-center justify-center gap-4 p-4">
            {socialLinks.map(
              (button) =>
                button.url && (
                  <a key={button.id} href={button.url.startsWith("http") ? button.url : `https://${button.url}`} target="_blank" rel="noopener noreferrer">
                    <button className={`bg-white text-black py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300`}>
                      <FontAwesomeIcon icon={button.icon} className={`w-6 h-6 ${button.color}`} />
                    </button>
                  </a>
                )
            )}
          </div>

          <Box className="mt-6 space-y-2 w-full md:w-1/2 mx-auto">
            {links?.filter(link => link?.isVisible).map((link) => (
              <a
                key={link.id}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                onClick={() => handleLinkClick(link?._id)}
                className="w-full py-2 border border-gray-300 text-base mb-3 text-center block hover:bg-gray-400 transition py-4 rounded-full"
                style={{ bgcolor: selectedTemplate?.bgcolor || '#f3f4f6',
                  color: selectedTemplate?.color || '#000'

                 }}
              >
                {link.title}
              </a>
            ))}

          </Box>
        </Card>
      )}
    </div>
  );
}
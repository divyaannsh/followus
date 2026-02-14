import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, Button, ButtonGroup, Card, Grid, Typography, IconButton, CircularProgress } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import Header from "./home/header";
import TempInsta from "../../public/img/temp_insta.png";
import Tempfb from "../../public/img/temp_fb.png";
import Tempyt from "../../public/img/temp_yt.png";
import { useSelector } from "react-redux";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { toast, ToastContainer } from "react-toastify";
import SpecialTemplates from "./specialTemplate";

const Template = () => {
  const [templates, setTemplates] = useState([]);
  const router = useRouter();
  const username = useSelector((state) => state.auth.user);
  const [selectedType, setSelectedType] = useState("All");
  const [storeTemplates, setStoreTemplates] = useState([]);
  const [loading, setLoading] = useState(true)

  const typesOfTemplates = [
    { id: "1", name: "All" },
    { id: "2", name: "Fashion" },
    { id: "3", name: "Health and Fitness" },
    { id: "4", name: "Influencer and Creator" },
    { id: "5", name: "Marketing" },
    { id: "6", name: "Small Business" },
    { id: "7", name: "Music" },
    { id: "8", name: "Social Media" },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectType = (selectedType) => {
    setSelectedType(selectedType.name);
    if (selectedType.name === "All") {
      setTemplates(storeTemplates);
    } else {
      const filterTemplates = storeTemplates.filter((template) => template.type === selectedType.name);
      setTemplates(filterTemplates);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("/api/user/template/templates");
      const selectedTemplateRes = await axios.get(`/api/user/template/chooseTemplate?username=${username}`);

      const selectedTemplateId = selectedTemplateRes.data?.templateId;

      const updatedTemplates = response.data.data.map((template) => ({
        ...template,
        isSelected: template._id === selectedTemplateId,
      }));

      setStoreTemplates(response.data.data);
      setTemplates(updatedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const handleSelectTemplate = async (selectedTemplate) => {
    if (selectedTemplate.isSelected) return;
    if (!username) {
      toast.error("Please login to select a template");
      return;
    }

    try {
      const response = await axios.post("/api/user/template/chooseTemplate", {
        username,
        templateId: selectedTemplate._id,
        profileName: selectedTemplate.profileName,
        bio: selectedTemplate.bio,
        image: selectedTemplate.image,
        linksData: selectedTemplate.linksData,
        bgcolor: selectedTemplate.bgcolor,
      });

      if (response.status === 200) {
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) => ({
            ...template,
            isSelected: template._id === selectedTemplate._id,
          }))
        );
        router.push("/admin");
      } else {
        console.error("Failed to select template:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating template selection:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
        <CircularProgress size={60} color="primary" />
      </div>
    );
  }

  return (
    <>
      <Box sx={{ width: "100%", mt: 10 }}>
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
        <Header />
        {/* Hero Section */}
        <Box sx={{ py: 8, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography
                variant="h2"
                sx={{
                  color: "#1e293b",
                  fontWeight: 900,
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: { xs: "32px", md: "56px" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  maxWidth: "800px",
                }}
              >
                A Followus template to <br /> suit every brand and <br /> creator
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  textAlign: "center",
                  maxWidth: "600px",
                  fontSize: { xs: "16px", md: "18px" },
                  fontWeight: 400,
                  mt: 2,
                  px: 2,
                }}
              >
                Different Link Apps, integrations, and visual styles can help you create a Followus.link that looks and feels like you and your brand. Explore our library of custom templates to grow and connect with your audience even more easily!
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Filter Section */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 4, px: 2 }}>
          {typesOfTemplates?.map((label) => (
            <Button
              key={label.id}
              onClick={() => handleSelectType(label)}
              sx={{
                backgroundColor: selectedType === label.name ? "#1e293b" : "#f1f5f9",
                color: selectedType === label.name ? "#fff" : "#475569",
                borderRadius: "9999px",
                padding: "8px 20px",
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                border: "1px solid transparent",
                "&:hover": {
                  backgroundColor: selectedType === label.name ? "#334155" : "#e2e8f0",
                  boxShadow: "none",
                },
              }}
            >
              {label.name}
            </Button>
          ))}
        </Box>

        {/* Templates Section */}
        <Box className="p-6 bg-white">
          {/* <Typography variant="h4" className="text-center text-gray-800 font-bold mb-8">
            Choose a Template
          </Typography> */}
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {templates?.map((itm) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={itm._id} display="flex" flexDirection="column" alignItems="center">

                {/* Mobile Phone Mockup Container */}
                <Box
                  onClick={() => handleSelectTemplate(itm)}
                  sx={{
                    width: "280px",
                    height: "560px", // Approximate mobile aspect ratio
                    backgroundColor: itm?.bgcolor || "#fff",
                    borderRadius: "40px",
                    border: itm.isSelected ? "4px solid #3b82f6" : "8px solid #1e293b", // Phone Bezel
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                    },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Notch/island representation - optional */}
                  {/* <Box sx={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: "80px", height: "20px", bg: "black", borderRadius: "10px", zIndex: 10 }} /> */}

                  <Box className="flex flex-col items-center pt-10 px-4 space-y-3 flex-grow overflow-y-auto no-scrollbar" sx={{ pb: 4 }}>
                    <Image
                      src={itm.image}
                      alt={itm.profileName}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-white/20 object-cover"
                      style={{ width: "80px", height: "80px" }}
                    />
                    <Typography variant="h6" className="text-white font-bold text-center leading-tight">
                      {itm.profileName}
                    </Typography>
                    <Typography className="text-white/80 text-xs text-center px-2 line-clamp-3">
                      {itm.bio}
                    </Typography>

                    <Box className="w-full space-y-2 mt-4">
                      {itm.linksData.slice(0, 4).map((link) => ( // Show only first few links to fit
                        <Box key={link.id} className="w-full rounded-full bg-white/90 py-2.5 px-3 text-center shadow-sm">
                          <Typography className="text-gray-800 text-xs font-medium truncate">
                            {link.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Social Icons */}
                    <Box className="flex justify-center gap-3 mt-auto pt-4">
                      <InstagramIcon sx={{ color: "white", fontSize: 20 }} />
                      <FacebookIcon sx={{ color: "white", fontSize: 20 }} />
                      <WhatsAppIcon sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                  </Box>
                </Box>

                {/* Template Name Below Card */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    color: "#334155",
                    textAlign: "center"
                  }}
                >
                  {itm.profileName}
                </Typography>

              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Template;

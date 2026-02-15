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

import { toast } from "react-toastify";
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

  useEffect(() => {
    if (templates.length > 0 && templates.some(t => t.displayColor === "#fff")) {
      const colors = [
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
        "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
        "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
        "linear-gradient(135deg, #434343 0%, #000000 100%)",
        "linear-gradient(135deg, #0cebeb 0%, #20e3b2 50%, #29ffc6 100%)"
      ];
      const updatedTemplates = templates.map((t, idx) => ({
        ...t,
        displayColor: t.bgcolor || colors[idx % colors.length]
      }));
      setTemplates(updatedTemplates);
    }
  }, [templates.length]);

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
      const selectedTemplateRes = username ? await axios.get(`/api/user/template/chooseTemplate?username=${username}`) : { data: null };

      const selectedTemplateId = selectedTemplateRes.data?.templateId;

      // Initial template setup without gradients, gradients will be applied by the useEffect
      const initialTemplates = response.data.data.map((template) => ({
        ...template,
        isSelected: template._id === selectedTemplateId,
        displayColor: template.bgcolor || "#fff" // Default to white or existing bgcolor
      }));

      setTemplates(initialTemplates); // Set templates, then useEffect will apply gradients
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const handleSelectTemplate = async (selectedTemplate) => {
    // If user is not logged in, we can still "open" it or show a preview
    // For now, let's allow the interaction to happen, but warn only on actual DB update
    if (!username) {
      // Logic for "opening" without selecting
      // We could set a 'preview' state here if we had a modal
      // But let's just show the toast if they are definitely trying to 'apply' it
      toast.info("Opening preview... Login to apply this template to your profile.");
      return;
    }

    if (selectedTemplate.isSelected) return;

    try {
      const response = await axios.post("/api/user/template/chooseTemplate", {
        username,
        templateId: selectedTemplate._id,
        profileName: selectedTemplate.profileName,
        bio: selectedTemplate.bio,
        image: selectedTemplate.image,
        linksData: selectedTemplate.linksData,
        bgcolor: selectedTemplate.displayColor,
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
      <Box sx={{ width: "100%", mt: 10, backgroundColor: "#fff" }}>
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
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, py: 4, px: 2, backgroundColor: "#fff" }}>
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
                    height: "560px",
                    background: itm?.displayColor || "#fff",
                    borderRadius: "45px",
                    border: itm.isSelected ? "6px solid #3b82f6" : "10px solid #111827", // Deeper bezel
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-10px) scale(1.02)",
                      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                    },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Speaker Grill Mockup */}
                  <Box sx={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "6px",
                    backgroundColor: "#111827",
                    borderRadius: "3px",
                    opacity: 0.3,
                    zIndex: 2
                  }} />

                  {/* Decorative Graphics */}
                  <Box sx={{
                    position: "absolute",
                    top: "-10%",
                    right: "-10%",
                    width: "150px",
                    height: "150px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "50%",
                    filter: "blur(30px)",
                    zIndex: 0
                  }} />
                  <Box sx={{
                    position: "absolute",
                    bottom: "20%",
                    left: "-10%",
                    width: "120px",
                    height: "120px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    filter: "blur(20px)",
                    zIndex: 0
                  }} />

                  <Box className="flex flex-col items-center pt-14 px-5 space-y-4 flex-grow overflow-y-auto no-scrollbar" sx={{ pb: 6, position: "relative", zIndex: 1 }}>
                    <Box sx={{
                      width: "90px",
                      height: "90px",
                      minWidth: "90px",
                      minHeight: "90px",
                      flexShrink: 0,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid rgba(255,255,255,0.4)",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}>
                      <Image
                        src={itm.image}
                        alt={itm.profileName}
                        width={100}
                        height={100}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "white",
                        fontWeight: 800,
                        textAlign: "center",
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }}
                    >
                      {itm.profileName}
                    </Typography>
                    <Typography sx={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "13px",
                      textAlign: "center",
                      lineHeight: 1.5,
                      fontWeight: 500
                    }}>
                      {itm.bio}
                    </Typography>

                    <Box className="w-full space-y-3 mt-6">
                      {itm.linksData.slice(0, 5).map((link) => (
                        <Box
                          key={link.id}
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            display: "block",
                            textDecoration: "none",
                            borderRadius: "12px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            py: 1.5,
                            px: 2,
                            textAlign: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            transition: "all 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                              backgroundColor: "#fff"
                            }
                          }}
                        >
                          <Typography sx={{ color: "#111827", fontSize: "14px", fontWeight: 700 }}>
                            {link.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Social Icons Container */}
                    <Box className="flex justify-center gap-5 mt-auto pt-6 pb-2" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ backgroundColor: "rgba(255,255,255,0.2)", p: 1, borderRadius: "50%", display: "flex", cursor: "pointer" }}>
                        <InstagramIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <Box sx={{ backgroundColor: "rgba(255,255,255,0.2)", p: 1, borderRadius: "50%", display: "flex", cursor: "pointer" }}>
                        <FacebookIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
                      <Box sx={{ backgroundColor: "rgba(255,255,255,0.2)", p: 1, borderRadius: "50%", display: "flex", cursor: "pointer" }}>
                        <WhatsAppIcon sx={{ color: "white", fontSize: 24 }} />
                      </Box>
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

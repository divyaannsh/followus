import { Box, Button, Card, CardContent, Grid, Typography, keyframes } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BrushIcon from "@mui/icons-material/Brush";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

// Define Keyframes for Infinite Scrolling Effect
const marquee = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
`;

const HomeCardsPage = () => {
  const router = useRouter()
  const isAuthenticated = useSelector((state) => state.auth.authToken);


  const handleRidrect = () => {
    if (isAuthenticated) {
      router.push("./admin")
    }
  }
  const cardData = [
    {
      icon: <StorefrontIcon fontSize="large" />,
      title: "Shop",
      description:
        "Turn your link-in-bio into a storefront and start selling with ease.",
    },
    {
      icon: <BrushIcon fontSize="large" />,
      title: "Appearance",
      description:
        "Customize your page to match your brand and stand out.",
    },
    {
      icon: <BarChartIcon fontSize="large" />,
      title: "Analytics",
      description:
        "Track clicks, revenue, and engagement to optimize performance.",
    }
    // {
    //   icon: <DescriptionIcon fontSize="large" />,
    //   title: "Resume Creation",
    //   description:
    //     "Easily generate a professional resume from your social links and showcase your experience in a structured format.",
    // },
  ];

  return (
    <Box sx={{ bgcolor: "#181818", minHeight: "100vh", py: 5, px: { xs: 2, sm: 3, md: 5 } }}>
      {/* Header Text */}
      <Typography
        variant="h4"
        color="white"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
          textAlign: "center",
          mb: 3,
        }}
      >
        The smart, simple, and <br />powerful link-in-bio tool.
      </Typography>

      {/* CTA Button */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="outlined"
          onClick={handleRidrect}
          sx={{
            color: "white",
            fontWeight: "bold",
            border: "1px solid #E8E8E8",
            px: 3,
            py: 1,
          }}
        >
          Followus.link
        </Button>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={3} justifyContent="center">
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                bgcolor: "#292929",
                color: "white",
                textAlign: "center",
                p: 3,
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ fontSize: "3rem", mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" fontWeight="bold">
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 2, opacity: 0.8, lineHeight: 1.6 }}
                >
                  {card.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    bgcolor: "#444",
                    color: "white",
                    borderRadius: "50px",
                    px: 3,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#555" },
                  }}
                >
                  Discover
                  <Box component="span" sx={{ ml: "auto", fontSize: "1.2rem" }}>
                    <ArrowForwardIcon
                      sx={{
                        display: "block",
                        borderRadius: "50%",
                        background: "#D9D9D9",
                        color: "#000000",
                        width: "40px",
                        height: "40px",
                      }}
                    />
                  </Box>
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Infinite Scrolling Text */}
      <Box sx={{ overflow: "hidden", mt: 5, whiteSpace: "nowrap", width: "100%" }}>
        <Typography
          variant="h2"
          color="white"
          fontWeight="bold"
          sx={{
            display: "inline-block",
            animation: `${marquee} 40s linear infinite`,
            fontFamily: "Arial GEO",
            fontSize: { xs: "3rem", sm: "5rem", md: "8rem" },
            whiteSpace: "nowrap",
          }}
        >
          One Stop Link For All your Social Links and Connections. followus.link One Stop Link For All your Social Links and Connections.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeCardsPage;

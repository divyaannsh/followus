import { Box, Button, Grid, Typography } from "@mui/material";
import newGif from "../../../public/img/newGif.gif";
import Image from "next/image";

const CustomizeBanner = () => {
    return (
        <Box sx={{ bgcolor: "#E3E3E3", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 6, md: 8 } }}>
            <Grid container spacing={2} alignItems="center">
                {/* Image Section */}
                <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                    <Image
                        src={newGif}
                        alt="hero"
                        className="Homegif-image"

                    />
                </Grid>

                {/* Content Section */}
                <Grid item xs={12} sm={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: { xs: "center", sm: "left" } }}>
                    <Typography
                        variant="h3"
                        color="#010101"
                        fontFamily="Arial"
                        fontWeight="700"
                        lineHeight="1.2"
                        sx={{
                            fontSize: { xs: "27px", sm: "38px", md: "45px", lg: "55px" },
                            mt: { xs: 1, sm: 2 }
                        }}
                    >
                        Create and customize your followus.link in minutes
                    </Typography>
                    {/* <Typography sx={{marginTop:"20px",border:"2px solid"}} sx={{
                            fontSize: { xs: "37px", sm: "48px", md: "45px", lg: "55px" },
                            mt: { xs: 1, sm: 2 }
                        }}>

                    </Typography> */}
                    <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" }, mt: 2 }}>
                        Build your personalized Followus in minutes!
                        Seamlessly connect your TikTok, Instagram, Twitter, website, store, videos, music, podcasts, events, and more — all in one link-in-bio landing page optimized to drive conversions.
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            background: "#010101",
                            mt: 3,
                            width: { xs: "100%", sm: "250px", md: "300px" },
                            fontSize: { xs: "14px", sm: "16px" },
                            py: 1.5,
                            capitilize: "small",
                            textTransform: "none"
                        }}
                    >
                        Get started for free
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CustomizeBanner;

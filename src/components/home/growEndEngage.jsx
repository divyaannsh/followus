import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";

const GrowEndEngageMent = ({ data, reverse }) => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        bgcolor={data.bgColor}
        direction={{ xs: "column-reverse", md: reverse ? "row-reverse" : "row" }}
      >
        {/* Text Content */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: "center", md: "left" }, px: { xs: 2, sm: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontFamily: "Arial",
                color: data.color,
                mb: { xs: 1, sm: 2 },
              }}
            >
              {data.content1}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontFamily: "Arial",
                color: data.color,
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "14px", sm: "16px" },
              }}
            >
              {data.content2}
            </Typography>
            <Box display="flex" justifyContent={{ xs: "center", md: "start" }}>
              <Button
                variant="contained"
                sx={{
                  background: data.btnColor,
                  mb: "15px",
                  color: data.color,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "14px", sm: "16px" },
                }}
              >
                Get started for free
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Image
              src={data.image}
              alt="Engage Frame"
              style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GrowEndEngageMent;

import { useState } from "react";
import { Container, Paper, Card, CardContent, Typography, TextField, Button, Stack, Grid } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Header from "@/components/home/header";
import Footer from "@/components/common/footer";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ my: 18 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Support
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" mb={5}>
            Have questions? Need help? Reach out to us!
          </Typography>

          {/* Grid Layout for Contact Details & Form */}
          <Grid container spacing={4}>
            {/* Left Side: Contact Information */}
            <Grid item xs={12} md={5}>
              <Card elevation={4} sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Contact Information
                </Typography>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PhoneIcon color="#000" />
                    <Typography variant="body1" fontWeight="bold">+1 234 567 890</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <EmailIcon color="#000" />
                    <Typography variant="body1" fontWeight="bold">support@followus.com</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LocationOnIcon color="#000" />
                    <Typography variant="body1" fontWeight="bold">Noida</Typography>
                  </Stack>
                </Stack>
              </Card>
            </Grid>

            {/* Right Side: Support Form */}
            <Grid item xs={12} md={7}>
              <Card elevation={4} sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                  Get in Touch
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      label="Message"
                      variant="outlined"
                      multiline
                      rows={4}
                      fullWidth
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }} fullWidth>
                      Submit
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

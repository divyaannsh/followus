import { Box, Grid, Typography } from "@mui/material";
import Cards1 from '../../assets/img/a2.png';

const AnalysePage = () => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} display="flex" justifyContent="center" alignItems="center" bgcolor={"#112138"} color={"#fff"}>
                    <div>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                textAlign: { xs: 'center', sm: 'left' },
                                mb: 2,
                                px: 4,
                            }}
                        >
                            
                            Analyze your audience and keep your followers engaged
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                                textAlign: { xs: 'center', sm: 'left' },
                                color: '#FFF',
                                fontWeight: '400',
                                fontFamily: 'Arial',
                                px: 4

                            }}
                        >
                            Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert.
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} >
                    <img
                        src={Cards1}
                        alt="Card 1"
                       
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalysePage;
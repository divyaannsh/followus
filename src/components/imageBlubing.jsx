import { Box, Button, Grid, Grid2, Typography } from "@mui/material"
import Image from "next/image"
import Images from "../../public/img/insta-2.png"

const ImageBileBing = () => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography>
                        <span>Create your followus.link</span> in minutes
                    </Typography>
                    <Typography>
                        Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert.
                    </Typography>
                    <Button variant="contained" color="#000">
                        Get started for free
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className="row right-to-left">
                        <Image src={Images} className="blink" />
                        <Image src={Images} className="blink" />
                        <Image src={Images} className="blink" />
                    </div>
                    <div className="row left-to-right">
                        <Image src={Images} className="blink" />
                        <Image src={Images} className="blink" />
                    </div>
                </Grid>


            </Grid>
        </Box>
    )
}

export default ImageBileBing
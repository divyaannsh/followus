import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeBanner from "@/components/home/header";
import CustomizeBanner from "@/components/home/customizeBanner";
import GrowEndEngageMent from "@/components/home/growEndEngage";
import HomeCardsPage from "@/components/home/HomeCards";
import InfluencerCards from "@/components/influncersCards";
import FaqsData from "@/components/faqsData";
import Footer from "@/components/common/footer";
import Cards1 from '../../public/img/newCards1.png';
import EngageFrame from '../../public/img/engageFrame.png';
import SellFrame from '../../public/img/sellFrame.png';
import schedule from "../../public/img/sceduleFrame.png"
import ClaimSociotree from "@/components/home/claimSociatree";



export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   } else {
  //     router.push("/"); // Redirect authenticated users directly to home
  //   }
  //   setLoading(false);
  // }, [router]);

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  const Data = [
    { id: "1", bgColor: "#112138", btnColor: "#010101", color: "#FFFFFF", image: Cards1, content1: "Analyze your audience and keep your followers engaged", content2: "Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert." },
    { id: "2", bgColor: "#E3E3E3", btnColor: "#FFFFFF", color: "#010101", image: EngageFrame, content1: "Grow, own and engage your audience by unifying them in one place.", content2: "Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events, and more. It all comes together in a link in bio landing page designed to convert." },
    { id: "3", bgColor: "#222222", btnColor: "#010101", color: "#FFFFFF", image: SellFrame, content1: "Sell products and collect payments. It’s monetization made simple.", content2: "Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert." },
    { id: "4", bgColor: "#F67940", btnColor: "#FFFFFF", color: "#010101", image: schedule, content1: "Manage, update and schedule content with our quick, easy editor.", content2: "Connect your TikTok, Instagram, Twitter, website, store, videos, music, podcast, events and more. It all comes together in a link in bio landing page designed to convert." },
  ];

  return (
    <>
      <HomeBanner />
      <ClaimSociotree />

      <CustomizeBanner />
      {Data.map((item, index) => (
        <GrowEndEngageMent key={item.id} data={item} reverse={index % 2 !== 0} />
      ))}
      <HomeCardsPage />
      <InfluencerCards />
      <FaqsData />
      <Footer />
    </>
  );
}

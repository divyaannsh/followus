// import ClaimSociaTree from "../../components/home/claimSociatree";
// import CustomizeBanner from "../../components/home/customizeBanner";
// import GrowEndEngageMent from "../../components/home/growEndEngage";
// import ClaimSociotree from "../../components/home/claimSociatree";
import HomeBanner from "../../components/home/header"
import EngageFrame from "../../../public/img/engageFrame.png";
import "./homeScreen.css";  // Import CSS
import Cards1 from '../../../public/img/newCards1.png';
import SellFrame from "../../../public/img/sellFrame.png"
import schedule from "../../../public/img/sceduleFrame.png"
import CustomizeBanner from "@/components/home/customizeBanner";
import GrowEndEngageMent from "@/components/home/growEndEngage";
import HomeCardsPage from "@/components/home/HomeCards";
import ImageBileBing from "@/components/imageBlubing";
import InfluncerCards from "@/components/influncersCards";
import FaqsData from "@/components/faqsData";
import Footer from "@/components/common/footer";
import Header from "../../components/home/header";
import ClaimSociotree from "@/components/home/claimSociatree";



const HomeScreen = ({ isAuthenticated }) => {

  const Data = [
    { id: "1", bgColor: "#112138", btnColor: "#010101", color: "#FFFFFF", image: Cards1, content1: "Analyze your audience and keep your followers engaged", content2: "Know your audience and keep them hooked! Track your engagement, watch your revenue grow, and find out what clicks with your followers. Make real-time tweaks to keep them coming back for more." },
    { id: "2", bgColor: "#E3E3E3", btnColor: "#FFFFFF", color: "#010101", image: EngageFrame, content1: "Grow, own and engage your audience by unifying them in one place.", content2: "Build, connect, and captivate your audience all in one spot.Bring everything together—social media, content, and more—into a single, powerful hub that keeps your followers engaged." },
    { id: "3", bgColor: "#222222", btnColor: "#010101", color: "#FFFFFF", image: SellFrame, content1: "Sell products and collect payments. It’s monetization made simple.", content2: "Sell your products and accept payments effortlessly—monetization made easy. Simplify the process of earning with seamless transactions. Start making money without the ongoing hassle." },
    { id: "4", bgColor: "#F67940", btnColor: "#FFFFFF", color: "#010101", image: schedule, content1: "Manage, update and schedule content with our quick, easy editor.", content2: "Create, update, and schedule content with our intuitive editor.Stay in control of your links with a hassle-free editor. Make updates anytime, anywhere—quick and easy!" },
  ]

  return (

    <>
      <Header isAuthenticated={isAuthenticated} />
      <ClaimSociotree />
      <CustomizeBanner />
      {/* <AnalysePage /> */}
      {/* <GrowEndEngageMent /> */}
      {Data.map((item, index) => (
        <GrowEndEngageMent key={item.id} data={item} reverse={index % 2 !== 0} />
      ))}
      <HomeCardsPage />
      {/* <ImageBileBing/> */}
      <InfluncerCards />
      <FaqsData />
      <Footer />
    </>

  )
}

export default HomeScreen
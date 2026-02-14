import Image from "next/image";
import R1 from "../../public/img/R1.png";
import R2 from "../../public/img/R2.png";
import R3 from "../../public/img/R3.png";
import R4 from "../../public/img/R4.png";

const InfluencerCards = () => {
    const CardsData = [
        { id: "1", image: R1, name: "Influencer 1" },
        { id: "2", image: R2, name: "Influencer 2" },
        { id: "3", image: R3, name: "Influencer 3" },
        { id: "4", image: R4, name: "Influencer 4" },
    ];

    return (
        <div className="bg-black text-white text-center py-10">
            {/* Trustpilot Rating */}
            <p className="text-green-400 font-semibold">Excellent ⭐⭐⭐⭐⭐ Trustpilot</p>
            <h2 className="text-2xl font-bold mt-2">The link in bio trusted by 30M+ influencers</h2>

            {/* Cards Container */}
            <div className="flex flex-wrap justify-center items-center mt-8 gap-6">
                {CardsData.map((card, index) => (
                    
                    <div
                        key={card.id}
                        className={`relative w-40 h-56 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 ${
                            index % 2 === 0 ? "rotate-3" : "-rotate-3"
                        } sm:scale-90 md:scale-100 [perspective:1000px]`}
                    >
                        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
                            {/* Front Side */}
                            <div className="absolute w-full h-full">
                                <Image
                                    src={card.image}
                                    alt={card.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            {/* Back Side */}
                            <div className="absolute w-full h-full bg-gray-800 flex flex-col items-center justify-center rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <h2 className="text-lg font-bold">{card.name}</h2>
                                <p className="text-sm">Trusted influencer</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfluencerCards;

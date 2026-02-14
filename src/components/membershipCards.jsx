import Link from "next/link";
import { useRouter } from "next/router";
import Header from "./home/header";
import { useState } from "react";

const tiers = [
  {
    name: "Premium",
    id: "tier-premium",
    href: "/checkout",
    priceMonthly: "$24",
    priceAnnually: "$240",
    description: "The VIP support plan for businesses ready to monetize and sell on a larger scale.",
    buttonText: "Get Premium",
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/checkout",
    priceMonthly: "$9",
    priceAnnually: "$90",
    description: "Grow, learn about and own your following forever with a branded Followus.link.",
    buttonText: "Get Pro",
    recommended: true,
  },
  {
    name: "Starter",
    id: "tier-starter",
    href: "/checkout",
    priceMonthly: "$5",
    priceAnnually: "$50",
    description: "More customization and control for creators ready to drive more traffic to and through their Followus.link.",
    buttonText: "Get Starter",
    mostPopular: false,
  },
  {
    name: "Free",
    id: "tier-free",
    href: "/checkout",
    priceMonthly: "$0",
    priceAnnually: "$0",
    description: "Unlimited links and a customizable Followus.link to connect your community to everything you are.",
    buttonText: "Join for free",
    mostPopular: false,
  },
];

const MembershipCards = () => {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState("Monthly");

  const handleCheckout = (tier) => {
    router.push(`/checkout?name=${tier.name}&price=${billingPeriod === "Monthly" ? tier.priceMonthly : tier.priceAnnually}`);
  };


  return (
    <>
      <Header />
      <div className="bg-gray-100 py-16 mt-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Choose the ideal plan for perfect connects.</h1>
        </div>
        <div className="flex justify-center mb-8 space-x-4">
          <span className="text-gray-700 font-medium">Save with annual plans</span>
          <div className="flex items-center bg-gray-200 p-1 rounded-full">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${billingPeriod === "Monthly" ? "bg-gray-900 text-white" : "text-gray-700"}`}
              onClick={() => setBillingPeriod("Monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${billingPeriod === "Annually" ? "bg-gray-900 text-white" : "text-gray-700"}`}
              onClick={() => setBillingPeriod("Annually")}
            >
              Annually
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 shadow-md bg-white flex flex-col justify-between ${tier.recommended ? "ring-2 ring-gray-900" : "ring-1 ring-gray-200"}`}
              >
                <div>
                  <div className="bg-black text-white p-4 rounded-t-3xl flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    {tier.recommended && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Recommended</span>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="mt-2 text-3xl font-bold">
                      {billingPeriod === "Monthly" ? tier.priceMonthly : tier.priceAnnually}
                      <span className="text-sm"> USD/{billingPeriod.toLowerCase()}</span>
                    </p>
                    <p className="mt-4 text-sm text-gray-600">{tier.description}</p>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleCheckout(tier)}
                    className={`mt-4 w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm border ${tier.recommended ? "bg-black text-white" : "bg-white text-black border-gray-900 hover:bg-gray-100"}`}
                  >
                    {tier.buttonText}
                  </button>
                  {tier.recommended && (
                    <p className="mt-2 text-xs text-gray-500 text-center">Pro users get more visitors</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipCards;

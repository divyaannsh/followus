import { useState } from "react"
import CheckoutLayout from "../../components/CheckoutLayout"
import CartSummary from "../../components/CartSummary"
import ShippingForm from "../../components/ShippingForm"
import PaymentForm from "../../components/PaymentForm"
import Confirmation from "../../components/Confirmation"
import { useSearchParams } from "next/navigation"

// Mock cart data


export default function Checkout() {

  const searchParams = useSearchParams();
  const search = searchParams.get("name");
  const priceData = searchParams.get("price");
  const [data, setData] = useState([search, priceData]);
  const [step, setStep] = useState(0)

  const nextStep = () => setStep(step + 1)


  const cart = [
    {
      id: 1,
      name: search,
      href: "#",
      price: 32.0,
      color: "Sienna",
      size: "Large",
      imageSrc: "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
      imageAlt: "Front of men's Basic Tee in sienna.",
    },
    // Add more items as needed
  ]

  return (
    <CheckoutLayout currentStep={step}>
      {step === 0 && <CartSummary cart={cart} onProceed={nextStep} data={data} />}
      {step === 1 && <ShippingForm onProceed={nextStep} data={data} />}
      {step === 2 && <PaymentForm onProceed={nextStep} data={data} />}
      {step === 3 && <Confirmation />}
    </CheckoutLayout>
  )
}


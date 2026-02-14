import { useEffect } from "react"
import Script from "next/script"
import Image from "next/image";
import SociapaLogo from "../../public/SociapaLogo.png"

export default function PaymentForm({ onProceed, amount,data }) {
    console.log("data",data);
    
    const razorpayKey = "rzp_test_iEhRalhOoa9F5P"; // Your Razorpay Test API Key

    useEffect(() => {
        if (window.Razorpay) {
            initializeRazorpay()
        }
    }, [])

    const initializeRazorpay = () => {
        const amountInPaise = parseFloat(data[1].replace('₹', '').trim()) * 100;

        const options = {
            key: razorpayKey, // Razorpay Test API Key
            amount: amountInPaise, // Amount in currency subunits (100 paise = 1 INR)
            currency: "INR",
            name: "Sociapa Venture Limited",
            description: "Test Transaction",
            image: "https://sociapadash.s3.ap-south-1.amazonaws.com/sheets/logoSociapa.png",
            handler: (response) => {
                alert(response.razorpay_payment_id)
                onProceed() // Move to the next step after successful payment
            },
            prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "919999999999", // Test contact number
                // Use a test UPI ID
                upi: "test@upi",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        }
        const rzp1 = new window.Razorpay(options)
        rzp1.open()
    }

    return (
        <div>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => {
                    if (window.Razorpay) {
                        initializeRazorpay()
                    }
                }}
            />
            <h2 className="text-lg font-medium text-gray-900">Payment method</h2>
            <p className="mt-2 text-sm text-gray-600">Click the button below to open the Razorpay payment gateway.</p>
            <button
                type="button"
                onClick={initializeRazorpay}
                className="mt-4 w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
                Pay with Razorpay
            </button>
        </div>
    )
}

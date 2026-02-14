const steps = ["Cart", "contact", "Payment", "Confirmation"]

export default function CheckoutLayout({ children, currentStep }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step} className={stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""}>
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      stepIdx < currentStep
                        ? "bg-indigo-600"
                        : stepIdx === currentStep
                          ? "border-2 border-indigo-600"
                          : "border-2 border-gray-300"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        stepIdx < currentStep
                          ? "text-white"
                          : stepIdx === currentStep
                            ? "text-indigo-600"
                            : "text-gray-500"
                      }`}
                    >
                      {stepIdx + 1}
                    </span>
                  </div>
                  <p
                    className={`ml-4 text-sm font-medium ${
                      stepIdx <= currentStep ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <main className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">{children}</div>
      </main>
    </div>
  )
}


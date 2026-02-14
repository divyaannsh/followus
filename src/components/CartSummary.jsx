export default function CartSummary({ cart, onProceed,data }) {
  
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
    return (
      <div>
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <ul role="list" className="divide-y divide-gray-200">
            {cart.map((product) => (
              <li key={product.id} className="flex py-6 px-4 sm:px-6">
                {/* <div className="flex-shrink-0">
                  <img src={product.imageSrc || "/placeholder.svg"} alt={product.imageAlt} className="w-20 rounded-md" />
                </div> */}
                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm">
                        <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                          {data[0]}
                        </a>
                      </h4>
                      {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                      <p className="mt-1 text-sm text-gray-500">{product.size}</p> */}
                    </div>
                    <div className="ml-4 flex-shrink-0 flow-root">
                      <button
                        type="button"
                        className="-m-2.5 bg-white p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 pt-2 flex items-end justify-between">
                    <p className="mt-1 text-sm font-medium text-gray-900">{data[1]}</p>
                    <div className="ml-4">
                      <label htmlFor={`quantity-${product.id}`} className="sr-only">
                        Quantity
                      </label>
                      <select
                        id={`quantity-${product.id}`}
                        name={`quantity-${product.id}`}
                        className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                      </select>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
  {/* Subtotal */}
  <div className="flex items-center justify-between">
    <dt className="text-sm">Subtotal</dt>
    <dd className="text-sm font-medium text-gray-900">{data[1]}</dd>
  </div>

  {/* Taxes */}
  {/* <div className="flex items-center justify-between">
    <dt className="text-sm">Taxes</dt>
    <dd className="text-sm font-medium text-gray-900">{data[1]}</dd>
  </div> */}

  {/* Total */}
  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
    <dt className="text-base font-medium">Total</dt>
    <dd className="text-base font-medium text-gray-900">{data[1]}</dd>
  </div>
</dl>

          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <button
              type="button"
              className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              onClick={onProceed}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  
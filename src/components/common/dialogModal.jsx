"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DialogModal({ open, setOpen }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-150 h-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Try Now Subscription
            </DialogTitle>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Subscribe now to get access to exclusive features and content. Don't miss out on this opportunity!
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <Link href="/pricing">
            <button
              onClick={() => setOpen(false)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
            >
              Subscribe
            </button>
            </Link>
            <button
              // onClick={() => setOpen(false)}
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

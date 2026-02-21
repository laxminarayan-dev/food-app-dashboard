"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import RenderFields from "../Shared/RenderFields";
import { orderFields as fields } from "@/lib/fields";
import { ordersInitialData as initialData } from "@/lib/initialData";
const OrderHeader = ({ onAddData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  // generate method
  const generateOrderId = (prefix = "ORD") => {
    const timestamp = Date.now().toString(36).toUpperCase(); // e.g. "LTS3D0"
    const random = Math.floor(Math.random() * 36 ** 2)
      .toString(36)
      .toUpperCase(); // e.g. "A9"

    // Take last 3 from timestamp and 2 from random (or adjust as needed)
    const id = (timestamp.slice(-3) + random).slice(0, 5).padStart(5, "0");
    return prefix + id;
  };

  // input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["amount", "quantity"].includes(name)
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  // add item
  const handleSubmit = (e) => {
    e.preventDefault();
    const orderId = generateOrderId();
    const objBody = { ...formData, orderId };
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objBody),
    }).then((res) => {
      if (res.status == 200) {
        alert("Order Entry Added Successfully");
        setIsModalOpen(false);
        setFormData(initialData);
        onAddData();
      } else {
        alert("Order Entry Added Failed");
      }
    });
  };

  return (
    <>
      <div>
        <h1 className="text-3xl my-2 text-gray-800 font-bold">Order Details</h1>
        <p className="text-gray-600 text-sm mb-4">Manage your Orders here.</p>
      </div>
      <div className="max-w-[38rem] flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Order Entries</h1>
        {/* <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-white text-sm px-3 py-2 rounded-full border border-gray-200 shadow-xs cursor-pointer flex justify-center items-center gap-1 hover:bg-gray-50"
        >
          <Plus size={16} /> Add Order Entry
        </button> */}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  📝 Add Order Entry
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill the fields below
                </p>
              </div>
              <X
                onClick={() => setIsModalOpen(false)}
                className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer"
              />
            </div>

            {/* Form Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <form className="space-y-4">
                {fields.map((field, index) => (
                  <RenderFields
                    key={index}
                    field={field}
                    handleInputChange={handleInputChange}
                    formData={formData}
                  />
                ))}
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                form="form-id"
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHeader;

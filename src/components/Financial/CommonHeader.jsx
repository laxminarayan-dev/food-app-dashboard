"use client";
import RenderFields from "../Shared/RenderFields";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const CommonHeader = ({ forWho, fields }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to capitalize strings for display
  const capitalize = (str) =>
    str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  // Configuration object for different form types

  // Dynamically create initial state for the form
  const createInitialState = () => {
    const initialState = {};
    fields.forEach((field) => {
      initialState[field.name] = field.default || "";
    });
    return initialState;
  };

  const [formData, setFormData] = useState(createInitialState());

  // Reset form data when the modal is opened
  const openModal = () => {
    setFormData(createInitialState());
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call or state management logic here
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{capitalize(forWho)}</h1>
        <button
          onClick={openModal}
          className="bg-white text-sm px-3 py-2 rounded-full border border-gray-200 shadow-xs cursor-pointer flex justify-center items-center gap-1 hover:bg-gray-50"
        >
          <Plus size={16} /> Add {capitalize(forWho)}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 p-4 flex justify-center items-center z-[1000]">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-slate-900 text-xl font-semibold">
                  Add New {capitalize(forWho)}
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  Enter {forWho.toLowerCase()} details
                </p>
              </div>
              <X
                onClick={() => setIsModalOpen(false)}
                className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {fields.map((field, index) => (
                <RenderFields
                  key={index}
                  field={field}
                  handleInputChange={handleInputChange}
                  formData={formData}
                />
              ))}

              <div className="border-t border-gray-200 pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-2 rounded-lg text-slate-900 text-sm font-medium bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Add {capitalize(forWho)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommonHeader;

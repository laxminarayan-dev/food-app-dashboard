"use client";
import { Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import RenderFields from "../Shared/RenderFields";
const ActionButtons = ({ id, fields, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [formData, setFormData] = useState(data);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div className="flex flex-row justify-start items-center gap-2 px-4">
        <button
          aria-label="updateEntry"
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setProductId(id);
          }}
        >
          <Pencil className="inline-block w-4 h-4 text-blue-500 cursor-pointer mr-2" />
        </button>
        <button
          aria-label="deleteEntry"
          type="button"
        >
          <Trash className="inline-block w-4 h-4 text-red-500 cursor-pointer" />
        </button>
      </div>
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
                  Edit Product (id:{id})
                </h3>
                <p className="text-slate-600 text-xs mt-1">Edit details</p>
              </div>
              <X
                onClick={() => setIsModalOpen(false)}
                className="w-5 h-5 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>

            <form className="mt-6 space-y-4">
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;

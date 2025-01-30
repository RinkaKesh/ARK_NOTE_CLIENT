import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../fun";
import { IoMdClose } from "react-icons/io";
const AddNote = ({ id, onSuccess, onClose }) => {
  const textareaRef = useRef(null);
  const initialState = { title: "", description: "", startDate: "", endDate: "",status:"" };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const specificNote = async () => {
    if (!id) return;
    try {
      const response = await axios({
        method: "GET",
        url: `https://ar-note-server.vercel.app/notes/${id}`,
        headers: { Authorization: getToken() },
      });
      if (response.status === 200) {
        const { startDate, endDate, ...restData } = response.data.data;
        const formatDate = (date) => date ? new Date(date).toISOString().split("T")[0] : "";
        setFormData({
          ...restData,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    specificNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date must be later than start date.");
      return;
    }
  
    const url = id
      ? `https://ar-note-server.vercel.app/notes/edit/${id}`
      : `https://ar-note-server.vercel.app/notes/create`;
    const method = id ? "PATCH" : "POST";
    try {
      const response = await axios({
        method,
        data: formData,
        url,
        headers: { Authorization: getToken() },
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message);
        onSuccess();
        onClose();
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [formData.description]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{id ? "Edit Note" : "Add Note"}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition duration-200"
        >
          <IoMdClose size={24} className="text-gray-600" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter Title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Description</label>
          <textarea
            ref={textareaRef}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none"
            placeholder="Enter Description"
            style={{ maxHeight: "240px", overflowY: "auto" }}
          ></textarea>
        </div>
        <div className="mb-4 w-full flex gap-1.5">
          <div className="mb-4 flex flex-1 flex-col">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter Start Date"
            />
          </div>
          <div className="mb-4 flex flex-1 flex-col">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter End Date"
            />
          </div>
          {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter Status"
          />
        </div> */}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
          >
            {id ? "Edit Note" : "Add Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNote;

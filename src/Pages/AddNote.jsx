import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../fun";

const AddNote = ({ id, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });

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
        setFormData(response.data.data);
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

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{id ? "Edit Note" : "Add Note"}</h2>
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter Description"
          ></textarea>
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

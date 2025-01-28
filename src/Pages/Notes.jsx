import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, isAuth } from "../fun";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../Components/Modal";
import AddNote from "./AddNote";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  const getNotes = async () => {
    if (!isAuth()) return;
    try {
      const response = await axios({
        method: "GET",
        url: "https://ar-note-server.vercel.app/notes",
        headers: { Authorization: getToken() },
      });
      setNotes(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleAdd = () => {
    setCurrentNoteId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setCurrentNoteId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `https://ar-note-server.vercel.app/notes/delete/${id}`,
        headers: { Authorization: getToken() },
      });
      if (response.status === 204) {
        toast.success("Note deleted successfully");
        getNotes();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="px-10 py-4 min-h-[calc(100vh-88px)]">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="mb-4 px-4 py-2  bg-amber-500 text-white font-semibold rounded-md shadow hover:bg-amber-300 transition duration-300"
        >
          Add Note +
        </button>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {notes.map((note) => (
            <div
              key={note._id}
              className="p-4 shadow rounded-md hover:shadow-lg transition duration-300"   style={{
                background: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
              }}
            >
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-gray-800">{note.title}</p>
                <div className="flex flex-col justify-center gap-5">
                  <div
                    onClick={() => handleEdit(note._id)}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    <CiEdit size={40} />
                  </div>
                  <div
                    onClick={() => handleDelete(note._id)}
                    className="cursor-pointer text-red-500 rounded-md hover:text-red-700 transition duration-300"
                  >
                    <MdDelete size={40} />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{note.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No notes yet! Create Note</p>
      )}

      {/* Modal for Add/Edit Note */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddNote id={currentNoteId} onSuccess={getNotes} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Notes;

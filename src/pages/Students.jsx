import React, { useState, useEffect } from "react";
import useStudents from "../hooks/useStudents";
import useAccommodations from "../hooks/useAccommodations";
import {
  addStudent,
  updateStudent,
  deleteStudent,
  addAccommodationToStudent,
  removeAccommodationFromStudent,
} from "../db/students";
import StudentCard from "../components/StudentCard";
import Modal from "../components/Modal";
import { useRefresh } from "../context/RefreshContext";

export default function Students({ selectedStudentFromDashboard }) {
  const students = useStudents();
  const accommodations = useAccommodations();
  const { triggerRefresh } = useRefresh();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedAccIds, setSelectedAccIds] = useState([]);

  // Open modal with optional student
  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setName(student.name);
      setGrade(student.grade);
      setSelectedAccIds(student.accommodationIds || []);
    } else if (selectedStudentFromDashboard) {
      setEditingStudent(selectedStudentFromDashboard);
      setName(selectedStudentFromDashboard.name);
      setGrade(selectedStudentFromDashboard.grade);
      setSelectedAccIds(selectedStudentFromDashboard.accommodationIds || []);
    } else {
      setEditingStudent(null);
      setName("");
      setGrade("");
      setSelectedAccIds([]);
    }
    setIsModalOpen(true);
  };

  // Save new or edited student
  const handleSave = async () => {
    if (!name) return alert("Student name required");

    if (editingStudent) {
      await updateStudent({
        ...editingStudent,
        name,
        grade,
        accommodationIds: selectedAccIds,
      });
    } else {
      await addStudent({
        id: Date.now().toString(),
        name,
        grade,
        accommodationIds: selectedAccIds,
      });
    }
    setIsModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    await deleteStudent(id);
    triggerRefresh();
  };

  // Toggle accommodation assignment
  const toggleAcc = async (accId) => {
    if (!editingStudent) return;

    if (selectedAccIds.includes(accId)) {
      await removeAccommodationFromStudent(editingStudent.id, accId);
      setSelectedAccIds((prev) => prev.filter((id) => id !== accId));
    } else {
      await addAccommodationToStudent(editingStudent.id, accId);
      setSelectedAccIds((prev) => [...prev, accId]);
    }

    triggerRefresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => openModal()}
        >
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <p>No students yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div key={student.id} className="relative">
              <StudentCard
                student={{
                  ...student,
                  accommodations: accommodations.filter((acc) =>
                    student.accommodationIds?.includes(acc.id)
                  ),
                }}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  className="text-yellow-600 hover:text-yellow-800"
                  onClick={() => openModal(student)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">
          {editingStudent ? "Edit Student" : "Add Student"}
        </h2>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Grade"
          className="border p-2 w-full mb-2 rounded"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <div className="mb-4">
          <p className="font-medium mb-2">Accommodations:</p>
          <div className="flex flex-wrap gap-2">
            {accommodations.map((acc) => (
              <button
                key={acc.id}
                className={`px-2 py-1 border rounded ${
                  selectedAccIds.includes(acc.id)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => toggleAcc(acc.id)}
              >
                {acc.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            {editingStudent ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

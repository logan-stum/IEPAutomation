import React, { useState, useContext } from 'react';
import useAccommodations from '../hooks/useAccommodations';
import { addAccommodation, updateAccommodation, deleteAccommodation } from '../db/accommodations';
import Modal from '../components/Modal';
import { DBContext } from '../context/DBContext';
import { useRefresh } from "../context/RefreshContext";

export default function ManageAccommodations() {
  const accommodations = useAccommodations();
  const { refreshKey, triggerRefresh } = useRefresh();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [name, setName] = useState('');

  const openModal = (acc = null) => {
    if (acc) {
      setEditingAcc(acc);
      setName(acc.name);
    } else {
      setEditingAcc(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name) return;
    if (editingAcc) {
      await updateAccommodation({ ...editingAcc, name });
    } else {
      await addAccommodation({ id: Date.now().toString(), name });
    }
    setIsModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this accommodation?')) return;
    await deleteAccommodation(id);
    triggerRefresh();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Accommodations</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => openModal()}>
          Add Accommodation
        </button>
      </div>

      {accommodations.length === 0 ? (
        <p>No accommodations yet.</p>
      ) : (
        <ul className="space-y-2">
          {accommodations.map(acc => (
            <li key={acc.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
              <span>{acc.name}</span>
              <div className="flex gap-2">
                <button className="text-yellow-600 hover:text-yellow-800" onClick={() => openModal(acc)}>Edit</button>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(acc.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{editingAcc ? 'Edit Accommodation' : 'Add Accommodation'}</h2>
        <input type="text" className="border p-2 w-full mb-4 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded border" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>
            {editingAcc ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

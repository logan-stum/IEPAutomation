// src/db/students.js
import { getDb } from './index';
import { addLog } from './logs';

export async function getAllStudents() {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readonly');
    const store = tx.objectStore('students');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addStudent(student) {
  const now = Date.now();
  const id = `student-${now}`; // create a unique ID
  const payload = {
    id, // assign the id here
    ...student,
    createdOn: now,
    modifiedOn: now,
    isActive: true,
  };

  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readwrite');
    const store = tx.objectStore('students');

    const req = store.add(payload);

    req.onsuccess = async () => {
      try {
        // Now id exists and can be referenced
        await addLog({
          id: `log-${Date.now()}`,
          type: 'student:add',
          studentId: payload.id,
          message: `Added student ${payload.name}`,
          timestamp: Date.now()
        });
      } catch (e) {
        console.warn('audit log failed', e);
      }

      resolve(payload); // return full student object including id
    };

    req.onerror = () => reject(req.error);
  });
}


export async function updateStudent(student) {
  const payload = { ...student, modifiedOn: Date.now() };
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readwrite');
    const store = tx.objectStore('students');
    const req = store.put(payload);
    req.onsuccess = async () => {
      try {
        await addLog({
          id: `log-${Date.now().toString()}`,
          type: 'student:update',
          studentId: payload.id,
          message: `Updated student ${payload.name}`,
          timestamp: Date.now()
        });
      } catch (e) { console.warn(e); }
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteStudent(id) {
  const db = await getDb();
  // read the student for message
  const student = await new Promise((resolve) => {
    const tx = db.transaction('students', 'readonly');
    const s = tx.objectStore('students').get(id);
    s.onsuccess = () => resolve(s.result);
    s.onerror = () => resolve(null);
  });

  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readwrite');
    const store = tx.objectStore('students');
    const req = store.delete(id);
    req.onsuccess = async () => {
      try {
        await addLog({
          id: `log-${Date.now().toString()}`,
          type: 'student:delete',
          studentId: id,
          message: `Deleted student ${student?.name || id}`,
          timestamp: Date.now()
        });
      } catch (e) { console.warn(e); }
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

// src/db/students.js

// Add an accommodation to a student
export async function addAccommodationToStudent(studentId, acc) {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("students", "readwrite");
    const store = tx.objectStore("students");
    const req = store.get(studentId);

    req.onsuccess = async () => {
      const student = req.result;
      if (!student) return reject("Student not found");

      student.accommodations = student.accommodations || [];
      // Only add if it doesn't already exist
      if (!student.accommodations.find((a) => a.id === acc.id)) {
        student.accommodations.push(acc);
      }

      const updateReq = store.put(student);
      updateReq.onsuccess = () => resolve(student);
      updateReq.onerror = () => reject(updateReq.error);
    };

    req.onerror = () => reject(req.error);
  });
}

// src/db/students.js

export async function removeAccommodationFromStudent(studentId, accId) {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('students', 'readwrite');
    const store = tx.objectStore('students');
    const req = store.get(studentId);
    req.onsuccess = async () => {
      const student = req.result;
      if (!student) return reject("Student not found");
      student.accommodations = (student.accommodations || []).filter(a => a.id !== accId);
      const updateReq = store.put(student);
      updateReq.onsuccess = () => resolve(student);
      updateReq.onerror = () => reject(updateReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}

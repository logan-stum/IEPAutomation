import React from 'react';
import { useParams } from 'react-router-dom';
import useStudents from '../hooks/useStudents';
import AccommodationBadge from '../components/AccommodationBadge';
import QuickLogButton from '../components/QuickLogButton';

export default function StudentDetail() {
  const { id } = useParams();
  const students = useStudents();
  const student = students.find((s) => s.id === id);

  if (!student) return <p>Student not found.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{student.name}</h1>
      <div className="flex gap-2 mb-4">
        {student.accommodations?.map((a) => (
          <AccommodationBadge key={a.id} accommodation={a} />
        ))}
      </div>
      <QuickLogButton student={student} />
    </div>
  );
}

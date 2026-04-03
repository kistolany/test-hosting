import { useState } from "react";

function StudentTable({
  students,
  highlightStudentId,
  onSaveInline,
  onDeleteRequest
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", gender: "Male" });

  const startEdit = (student) => {
    setEditingId(student.id);
    setDraft({ name: student.name, gender: student.gender });
  };

  const saveEdit = () => {
    if (!draft.name.trim()) return;
    onSaveInline(editingId, draft);
    setEditingId(null);
  };

  return (
    <section className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">DOB</th>
            <th className="px-4 py-3">Major</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3">Shift</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const isEditing = editingId === student.id;
              const isHighlighted = highlightStudentId === student.id;

              return (
                <tr
                  id={`student-row-${student.id}`}
                  key={student.id}
                  className={`border-t border-slate-200 transition ${
                    isHighlighted ? "bg-emerald-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={draft.name}
                        onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={draft.gender}
                        onChange={(event) => setDraft((prev) => ({ ...prev, gender: event.target.value }))}
                        className="rounded-md border border-slate-300 px-2 py-1"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      student.gender
                    )}
                  </td>
                  <td className="px-4 py-3">{student.dob}</td>
                  <td className="px-4 py-3">{student.major}</td>
                  <td className="px-4 py-3">{student.year}</td>
                  <td className="px-4 py-3">{student.shift}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="rounded-md bg-cyan-600 px-3 py-1 text-xs font-medium text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-xs"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(student)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(student)}
                            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}

export default StudentTable;

import { useState } from "react";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
      {/* Adjust min-w-[980px] to control when horizontal scroll starts in Class Detail. */}
      <table className="mx-auto w-full min-w-[980px] text-left text-[clamp(11px,0.85vw,14px)]">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Student ID</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Name</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Gender</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">DOB</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Major</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Year</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Shift</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
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
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.id}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">
                    {isEditing ? (
                      <input
                        value={draft.name}
                        onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-[inherit]"
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">
                    {isEditing ? (
                      <select
                        value={draft.gender}
                        onChange={(event) => setDraft((prev) => ({ ...prev, gender: event.target.value }))}
                        className="rounded-md border border-slate-300 px-2 py-1 text-[inherit]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      student.gender
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.dob}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.major}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.year}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.shift}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="rounded-md p-1.5 text-cyan-600 transition hover:bg-cyan-50"
                            aria-label="Save student"
                          >
                            <CheckOutlined />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100"
                            aria-label="Cancel editing"
                          >
                            <CloseOutlined />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(student)}
                            className="rounded-md p-1.5 text-blue-600 transition hover:bg-blue-50"
                            aria-label="Edit student"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(student)}
                            className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50"
                            aria-label="Delete student"
                          >
                            <DeleteOutlined />
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

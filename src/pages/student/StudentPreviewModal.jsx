import React, { useEffect, useMemo, useState } from "react";

/**
 * StudentPreviewModal - Tailwind CSS styled modal for student preview
 * Props:
 *   open: boolean
 *   onClose: function
 *   student: object
 */
export default function StudentPreviewModal({ open, onClose, student }) {
  const [imageError, setImageError] = useState(false);

  const studentImage = useMemo(() => {
    return (
      student?.image ||
      student?.photo ||
      student?.profileImage ||
      student?.avatar ||
      student?.photoUrl ||
      ""
    );
  }, [student]);

  const studentInitials = useMemo(() => {
    const fullName = student?.name || student?.nameKhmer || "";
    if (!fullName) return "ST";
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part[0]);
    return letters.join("").toUpperCase();
  }, [student]);

  useEffect(() => {
    setImageError(false);
  }, [studentImage, open]);

  if (!open || !student) return null;

  return (
    <div className="student-preview-overlay" onClick={onClose}>
      <div
        className="student-preview-popup"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Student preview popup"
      >
        <button
          className="student-preview-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="student-preview-head">
          <img
            src="/asset/image/logo.png"
            alt="School logo"
            className="student-preview-logo"
          />
          <div className="student-preview-head-text">
            <h2>Student Preview</h2>
            <p>Student profile summary</p>
          </div>
        </div>

        <div className="student-preview-body">
          <div className="student-preview-photo-wrap">
            {studentImage && !imageError ? (
              <img
                src={studentImage}
                alt={student.name || student.nameKhmer || "Student"}
                className="student-preview-photo"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="student-preview-photo-fallback" aria-label="No student image">
                {studentInitials}
              </div>
            )}
            <div className="student-preview-id">ID: {student.ID || student.id || "-"}</div>
          </div>

          <div className="student-preview-grid">
            <div>
              <span>Khmer Name:</span> {student.nameKhmer || "-"}
            </div>
            <div>
              <span>English Name:</span> {student.name || "-"}
            </div>
            <div>
              <span>Gender:</span> {student.gender === "M" ? "Male" : student.gender === "F" ? "Female" : "-"}
            </div>
            <div>
              <span>Date of Birth:</span> {student.dob || student.DOB || "-"}
            </div>
            <div>
              <span>Student Type:</span> {student.studentType || student.StudentType || "-"}
            </div>
            <div>
              <span>Email:</span> {student.email || student.Email || "-"}
            </div>
            <div>
              <span>Phone:</span> {student.phone || student.Phone || "-"}
            </div>
            <div>
              <span>ID Card:</span> {student.idCard || student.IdCard || "-"}
            </div>
            <div>
              <span>Register Date:</span> {student.registerDate || student.registrationDate || student.RegDate || student.regDate || student.RegisterDate || "-"}
            </div>
          </div>
        </div>

        <div className="student-preview-actions">
          <button type="button" className="student-preview-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

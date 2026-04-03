import { useNavigate } from "react-router-dom";
import { ClassCard } from "../components/Cards";

function ClassList({ classes }) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-white px-4 py-8 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Student Management</h1>
        <p className="mt-2 text-slate-600">Select a class to manage students and class information.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onView={() => navigate(`/class/${classItem.id}`)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ClassList;

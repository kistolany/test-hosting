import { useNavigate, useOutletContext } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { ClassCard } from "../components/Cards";

function ClassList({ classes }) {
  const navigate = useNavigate();
  const { isDark } = useOutletContext();
  const { t, lang } = useLanguage();
  const brandBlue = isDark ? "#93c5fd" : "#1d4ed8";
  const brandBlueSoft = isDark ? "#bfdbfe" : "#3b82f6";

  return (
    <main className="min-h-screen bg-transparent px-[30px] py-8">
      <section className="w-full">
        <div className="text-center">
          <h1
            className={`text-3xl ${
              lang === "km"
                ? "khmer-moul-light font-normal tracking-normal leading-[1.5]"
                : "font-black tracking-tight"
            }`}
            style={{ color: brandBlue }}
          >
            {t("classManagementPage.title")}
          </h1>
          <p
            className={`mt-2 ${lang === "km" ? "khmer-moul-light leading-[1.55]" : ""}`}
            style={{ color: brandBlueSoft }}
          >
            {t("classManagementPage.subtitle")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

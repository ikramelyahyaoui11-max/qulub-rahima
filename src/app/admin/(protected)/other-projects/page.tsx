import { getOtherProjects } from "@/lib/store";
import OtherProjectForm from "./OtherProjectForm";

export default async function AdminOtherProjectsPage() {
  const projects = await getOtherProjects();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-extrabold text-brand-green-900">إضافة عنصر جديد</h2>
        <p className="mt-1 text-sm text-brand-green-900/60">مثال: بئر مياه، بطانية، مشروع رزق</p>
        <div className="mt-4">
          <OtherProjectForm />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-brand-green-900">
          أبواب القلوب الرحيمة الأخرى ({projects.length})
        </h2>
        <div className="mt-4 flex flex-col gap-5">
          {projects.map((project) => (
            <OtherProjectForm key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

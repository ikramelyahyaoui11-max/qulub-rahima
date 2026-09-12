import { JOURNEY_STEPS } from "@/lib/data";

export default function Journey() {
  return (
    <section id="journey" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <h2 className="text-2xl font-extrabold text-brand-green-900 sm:text-3xl">
            رحلة ذبيحتك مع القلوب الرحيمة
          </h2>
          <span className="btn-primary px-4 py-1.5 text-xs">التنفيذ في يوم أو اتنين فقط</span>
        </div>

        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          <div className="absolute inset-x-8 top-9 hidden h-0.5 bg-gradient-to-l from-brand-green-800/0 via-brand-green-800/25 to-brand-green-800/0 lg:block" />
          {JOURNEY_STEPS.map((item) => (
            <div
              key={item.step}
              className="card-elevate relative flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-brand-cream-100 px-3 py-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-700 to-brand-green-900 text-sm font-bold text-white shadow-sm">
                {item.step}
              </span>
              <p className="text-sm font-bold text-brand-green-900">{item.title}</p>
              <p className="text-xs leading-5 text-brand-green-900/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

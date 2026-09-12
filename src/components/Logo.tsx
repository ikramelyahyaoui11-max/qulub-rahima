import Image from "next/image";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-brand-green-900";
  const subColor = variant === "light" ? "text-white/70" : "text-brand-green-700/70";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          variant === "light" ? "bg-white/95 p-1.5" : ""
        }`}
      >
        <Image
          src="/logo-mark.png"
          alt="شعار القلوب الرحيمة"
          width={48}
          height={48}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <div className="flex flex-col leading-tight">
        <span className={`text-lg font-extrabold ${textColor}`}>القلوب الرحيمة</span>
        <span className={`text-[11px] font-medium ${subColor}`}>لتنفيذ المشروعات بأفريقيا</span>
      </div>
    </div>
  );
}

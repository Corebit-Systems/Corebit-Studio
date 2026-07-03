import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  accent?: "indigo" | "coral" | "mint";
}

export default function Card({ title, children, accent = "indigo" }: CardProps) {
  const accentColor =
    accent === "indigo"
      ? "border-indigo-500 hover:shadow-indigo-200"
      : accent === "coral"
      ? "border-pink-500 hover:shadow-pink-200"
      : "border-teal-500 hover:shadow-teal-200";

  return (
    <div
      className={`rounded-xl border ${accentColor} bg-white/80 backdrop-blur-sm p-6 shadow-md transition-transform hover:scale-[1.02]`}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

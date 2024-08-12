"use client";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
        {title}
      </h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

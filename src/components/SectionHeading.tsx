type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
};

export default function SectionHeading({ eyebrow, title, description, tone = "light" }: SectionHeadingProps) {
  const titleColor = tone === "dark" ? "text-ink" : "text-paper";
  const descriptionColor = tone === "dark" ? "text-ink/70" : "text-paper/70";

  return (
    <div className="reveal mb-10 max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase text-signal">{eyebrow}</p>
      <h2 className={`font-display text-3xl font-semibold sm:text-4xl ${titleColor}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 ${descriptionColor}`}>{description}</p>}
    </div>
  );
}

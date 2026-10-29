type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-slate-300">{description}</p>
      ) : null}
    </div>
  );
}

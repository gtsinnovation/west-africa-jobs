import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface TopicCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  external?: boolean;
}

export function TopicCard({ href, icon: Icon, title, description, external }: TopicCardProps) {
  const content = (
    <>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-amber-400 bg-amber-400/10 text-amber-300">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-slate-300">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-300 group-hover:gap-2">
        Explore
        <ArrowRight className="h-4 w-4 transition-all" />
      </span>
    </>
  );

  const className =
    "group flex flex-col rounded-2xl border-2 border-amber-400/50 bg-[#132a52] p-6 shadow-lg transition-all hover:-translate-y-1 hover:border-amber-400 hover:shadow-amber-400/10";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

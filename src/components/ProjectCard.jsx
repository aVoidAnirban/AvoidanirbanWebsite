import { ArrowUpRight } from 'lucide-react'

export default function ProjectCard({ project, index }) {
  const { title, description, tags, image, demo, repo } = project

  return (
    <article className="flex h-full flex-col gap-4.5 rounded-xl border border-line bg-panel p-7 transition hover:-translate-y-1 hover:border-accent">
      <div className="flex items-center justify-between font-mono text-[13px] text-muted">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>

      <div className="flex h-42 items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-bg font-mono text-[13px] text-muted">
        {image ? (
          <img src={image} alt={`${title} screenshot`} className="size-full object-cover" loading="lazy" />
        ) : (
          '[SCREENSHOT]'
        )}
      </div>

      <h3 className="text-[22px] font-bold">{title}</h3>
      <p className="text-[15px] text-muted">{description}</p>

      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-6">
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-[15px] font-bold text-accent hover:underline hover:underline-offset-4"
          >
            Live demo
          </a>
        )}
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-[15px] font-bold text-muted transition-colors hover:text-ink"
          >
            Source code
          </a>
        )}
      </div>
    </article>
  )
}

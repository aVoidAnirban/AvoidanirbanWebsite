import Giscus from '@giscus/react'
import { site } from '../data/site'
import Section, { SectionHead } from './Section'

export default function Comments() {
  const { repo, repoId, category, categoryId } = site.giscus
  const configured = repo && repoId && category && categoryId

  return (
    <Section id="comments">
      <SectionHead eyebrow="04 / feedback" title="Leave a reaction or comment" />

      <div className="max-w-3xl">
        {configured ? (
          <Giscus
            repo={repo}
            repoId={repoId}
            category={category}
            categoryId={categoryId}
            mapping="specific"
            term="Portfolio"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="dark"
            lang="en"
            loading="lazy"
          />
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-panel p-6 font-mono text-sm text-muted">
            Comments are not set up yet. Fill in the giscus values in src/data/site.js.
          </p>
        )}
      </div>
    </Section>
  )
}

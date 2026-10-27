import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import BlogPreview from '../components/BlogPreview'

const About = lazy(() => import('../components/About'))
const Skills = lazy(() => import('../components/Skills'))
const Projects = lazy(() => import('../components/Projects'))
const Experience = lazy(() => import('../components/Experience'))
const Contact = lazy(() => import('../components/Contact'))

export default function HomePage() {
  return (
  <>
      <Hero />
      <BlogPreview />
      <Suspense fallback={null}>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </Suspense>
    </>
  )
}

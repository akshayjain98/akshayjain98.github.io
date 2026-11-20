import { getProjects } from '@/lib/content';
import About from './components/About';
import { Contact } from './components/Contact';
import { Experience, Skills } from './components/Experience';
import Header from './components/Header';
import { Journey } from './components/Journey';
import { Projects } from './components/Projects';
import { Story } from './components/Story';
import { Reveal } from './components/ui/Reveal';

const container = 'w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16';

export default function Home() {
  return (
    <>
      <Header containerClass={container} />
      <main>
        <section id="top" className="bg-white text-apple-ink">
          <div className={`${container} lg:min-h-[calc(100svh-48px)] flex flex-col`}>
            <About />
          </div>
        </section>
        <section id="story" className="bg-black text-white scroll-mt-12">
          <div className={container}>
            <Reveal>
              <Story />
            </Reveal>
          </div>
        </section>
        <section id="projects" className="bg-apple-gray text-apple-ink scroll-mt-12">
          <div className={container}>
            <Projects projects={getProjects()} />
          </div>
        </section>
        <section id="experience" className="bg-black text-white scroll-mt-12">
          <div className={container}>
            <Experience />
          </div>
        </section>
        <section id="journey" className="bg-apple-gray text-apple-ink scroll-mt-12">
          <div className={container}>
            <Journey />
          </div>
        </section>
        <section id="skills" className="bg-white text-apple-ink scroll-mt-12">
          <div className={container}>
            <Skills />
          </div>
        </section>
        <section id="contact" className="bg-black text-white scroll-mt-12">
          <div className={container}>
            <Reveal>
              <Contact />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}

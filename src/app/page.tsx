import { getProjects } from '@/lib/content';
import About from './components/About';
import { Contact } from './components/Contact';
import { Experience, Skills } from './components/Experience';
import Header from './components/Header';
import { Projects } from './components/Projects';
import { Story } from './components/Story';
import { Reveal } from './components/ui/Reveal';

const container = 'w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16';

export default function Home() {
  return (
    <>
      <Header containerClass={container} />
      <main>
        <section id="top" className="bg-white text-black">
          <div className={`${container} min-h-[calc(100vh-77px)] flex flex-col`}>
            <About />
          </div>
        </section>
        <section id="story" className="bg-black text-white scroll-mt-20">
          <div className={container}>
            <Reveal>
              <Story />
            </Reveal>
          </div>
        </section>
        <section id="projects" className="bg-white text-black scroll-mt-20">
          <div className={container}>
            <Projects projects={getProjects()} />
          </div>
        </section>
        <section id="experience" className="bg-black text-white scroll-mt-20">
          <div className={container}>
            <Experience />
          </div>
        </section>
        <section id="skills" className="bg-white text-black scroll-mt-20">
          <div className={container}>
            <Skills />
          </div>
        </section>
        <section id="contact" className="bg-black text-white scroll-mt-20">
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

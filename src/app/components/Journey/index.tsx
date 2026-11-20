import { getJourneyGraph, getYearsOfExperience } from '@/lib/content';
import { Heading } from '../ui/Heading';
import { Reveal } from '../ui/Reveal';
import { NeuralGraph } from './NeuralGraph';

export const Journey = () => {
  const graph = getJourneyGraph();
  const years = getYearsOfExperience();
  const [yearNodes, roles, projects, tech] = graph.layers;
  const months = yearNodes.reduce((sum, y) => sum + y.weight, 0);

  return (
    <div className="flex flex-col gap-10 py-16 sm:py-20 lg:py-28">
      <div className="flex flex-col gap-3">
        <Heading>Journey</Heading>
        <p className="headline-apple max-w-3xl">{years}+ years, wired together.</p>
        <p className="mt-2 max-w-2xl text-[17px] leading-[1.47] text-[#6e6e73]">
          {months} months of work as a network: {yearNodes.length} years, {roles.length} roles, {projects.length} projects and the{' '}
          {tech.length} technologies they share.
        </p>
      </div>
      <Reveal>
        <NeuralGraph graph={graph} />
      </Reveal>
    </div>
  );
};

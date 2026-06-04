import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLesson } from "@/lib/lessons";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";
import { TopBar } from "@/components/TopBar";
import { CodeViewer } from "@/components/CodeViewer";
import { SimulationCanvas } from "@/components/SimulationCanvas";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { DeepDivePanel } from "@/components/DeepDivePanel";
import { ResourceLinks } from "@/components/ResourceLinks";

export const Route = createFileRoute("/lesson/$id")({
  loader: ({ params }) => {
    const lesson = getLesson(params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.title} · Visualize` },
          { name: "description", content: loaderData.lesson.subtitle },
        ]
      : [],
  }),
  component: LessonRoute,
});

function LessonRoute() {
  const { lesson } = Route.useLoaderData();
  const player = useLessonPlayer(lesson);
  const step = lesson.steps[player.stepIndex];

  return (
    <>
      <TopBar lesson={lesson} player={player} />
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="flex min-h-[760px] shrink-0">
          {/* Left: Code */}
          <div className="w-[42%] min-w-[380px] p-4 pr-2 overflow-hidden flex flex-col">
            <CodeViewer
              code={lesson.code}
              language={lesson.language}
              activeLines={step.lines}
            />
          </div>
          {/* Right: Simulation + Explanation */}
          <div className="flex-1 p-4 pl-2 flex flex-col gap-3">
            <ExplanationPanel
              step={step}
              index={player.stepIndex}
              total={lesson.steps.length}
              language={lesson.language}
            />
            <SimulationCanvas lesson={lesson} snapshot={step.snapshot} />
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 flex flex-col gap-4">
          <DeepDivePanel lesson={lesson} />
          <ResourceLinks resources={lesson.resources} language={lesson.language} />
        </div>
      </div>
    </>
  );
}

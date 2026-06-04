import type { Lesson } from "../types";

const code = `children = [
  {Worker, :a},
  {Worker, :b},
  {Worker, :c},
]

Supervisor.start_link(children,
  strategy: :one_for_one)

# later: worker :b crashes
Process.exit(b_pid, :kill)`;

export const supervisors: Lesson = {
  id: "elixir-supervisors",
  language: "elixir",
  topic: "OTP",
  title: "Supervisors & Let-It-Crash",
  subtitle: "When a worker dies, the supervisor restarts it. Failures become routine.",
  difficulty: "Advanced",
  code,
  panels: ["processes"],
  steps: [
    {
      title: "Supervisor starts",
      lines: [7, 8],
      explanation: "The supervisor process is born. It will spawn and **link** to each child.",
      snapshot: {
        processes: [
          { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
        ],
      },
    },
    {
      title: "Children spawned",
      lines: [1, 2, 3, 4, 5],
      explanation: "Each child starts under the supervisor. Links mean: if a child dies abnormally, the supervisor is notified.",
      snapshot: {
        processes: [
          { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
          { id: "a", name: "Worker :a", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "b", name: "Worker :b", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "c", name: "Worker :c", state: "running", role: "worker", parent: "sup", link: ["sup"] },
        ],
      },
    },
    {
      title: "Worker :b crashes",
      lines: [11],
      explanation: "`:b` is killed. Because of `:one_for_one`, **only the affected child** is restarted. `:a` and `:c` keep running.",
      snapshot: {
        processes: [
          { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
          { id: "a", name: "Worker :a", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "b", name: "Worker :b", state: "crashed", role: "worker", parent: "sup" },
          { id: "c", name: "Worker :c", state: "running", role: "worker", parent: "sup", link: ["sup"] },
        ],
      },
    },
    {
      title: "Restart — fresh state",
      lines: [8],
      explanation: "Supervisor spawns a brand-new `:b` with the initial state from `Worker.init/1`. The system self-heals.",
      snapshot: {
        processes: [
          { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
          { id: "a", name: "Worker :a", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "b2", name: "Worker :b (v2)", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "c", name: "Worker :c", state: "running", role: "worker", parent: "sup", link: ["sup"] },
        ],
      },
    },
    {
      title: "Other strategies",
      lines: [8],
      explanation: "`:one_for_all` would restart **all** children; `:rest_for_one` restarts the crashed child plus everything started after it. Choose by coupling.",
      snapshot: {
        processes: [
          { id: "sup", name: "Supervisor", state: "running", role: "supervisor" },
          { id: "a", name: "Worker :a", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "b2", name: "Worker :b (v2)", state: "running", role: "worker", parent: "sup", link: ["sup"] },
          { id: "c", name: "Worker :c", state: "running", role: "worker", parent: "sup", link: ["sup"] },
        ],
      },
    },
  ],
};

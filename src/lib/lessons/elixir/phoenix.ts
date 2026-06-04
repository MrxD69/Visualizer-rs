import type {
  EGenServerState,
  EMessage,
  EProcess,
  ESchedulerState,
  ETask,
  Lesson,
  LessonResource,
} from "../types";

const link = (label: string, url: string, note: string): LessonResource => ({
  label,
  url,
  note,
});

const docs = {
  requestLifecycle: link(
    "Phoenix request life-cycle",
    "https://hexdocs.pm/phoenix/request_lifecycle.html",
    "Endpoint -> router -> controller -> view in the official Phoenix guide.",
  ),
  controllers: link(
    "Phoenix controllers",
    "https://hexdocs.pm/phoenix/controllers.html",
    "Controller responsibilities and `conn` handling.",
  ),
  router: link(
    "Phoenix.Router",
    "https://hexdocs.pm/phoenix/Phoenix.Router.html",
    "Routing, scopes, and dispatch.",
  ),
  jsonApis: link(
    "Phoenix JSON and APIs",
    "https://hexdocs.pm/phoenix/json_and_apis.html",
    "Building JSON endpoints and shaping API responses.",
  ),
  contexts: link(
    "Phoenix contexts",
    "https://hexdocs.pm/phoenix/contexts.html",
    "How Phoenix organizes domain logic behind the web layer.",
  ),
  phoenixEcto: link(
    "Phoenix + Ecto guide",
    "https://hexdocs.pm/phoenix/ecto.html",
    "How Phoenix applications validate and persist data.",
  ),
  ectoStart: link(
    "Ecto getting started",
    "https://hexdocs.pm/ecto/getting-started.html",
    "Schemas, changesets, and queries from the Ecto guide.",
  ),
  ectoSchema: link(
    "Ecto.Schema",
    "https://hexdocs.pm/ecto/Ecto.Schema.html",
    "Defining transport entities such as stations, trips, and vehicles.",
  ),
  channels: link(
    "Phoenix channels",
    "https://hexdocs.pm/phoenix/channels.html",
    "Realtime sockets, topics, and client joins.",
  ),
  channelApi: link(
    "Phoenix.Channel",
    "https://hexdocs.pm/phoenix/Phoenix.Channel.html",
    "Channel callbacks and topic conventions.",
  ),
  pubsub: link(
    "Phoenix.PubSub",
    "https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html",
    "Topic subscription and broadcast at the core of Phoenix realtime.",
  ),
  liveView: link(
    "Phoenix LiveView",
    "https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html",
    "Server-side stateful views that push diffs to the client.",
  ),
  liveViewGuide: link(
    "Phoenix LiveView guide",
    "https://hexdocs.pm/phoenix/live_view.html",
    "How LiveView begins as HTTP and upgrades to a live session.",
  ),
  presence: link(
    "Phoenix Presence",
    "https://hexdocs.pm/phoenix/Phoenix.Presence.html",
    "Tracking joins, leaves, and metadata per topic.",
  ),
  presenceGuide: link(
    "Phoenix presence guide",
    "https://hexdocs.pm/phoenix/presence.html",
    "Presence setup patterns across channels and clusters.",
  ),
  plug: link(
    "Plug in Phoenix",
    "https://hexdocs.pm/phoenix/plug.html",
    "Request pipelines, halting, and middleware composition.",
  ),
  plugConn: link(
    "Plug.Conn",
    "https://hexdocs.pm/plug/Plug.Conn.html",
    "The request/response struct Phoenix moves through the pipeline.",
  ),
  req: link(
    "Req",
    "https://hexdocs.pm/req/Req.html",
    "Modern Elixir HTTP client for consuming external transit APIs.",
  ),
  oban: link(
    "Oban",
    "https://hexdocs.pm/oban/Oban.html",
    "Background jobs, retries, and supervision-aware processing.",
  ),
  genserver: link(
    "GenServer",
    "https://hexdocs.pm/elixir/GenServer.html",
    "Stateful server processes, `call`, `cast`, and `code_change`.",
  ),
  supervisor: link(
    "Supervisor",
    "https://hexdocs.pm/elixir/Supervisor.html",
    "Restart strategies for long-running transport services.",
  ),
  task: link(
    "Task",
    "https://hexdocs.pm/elixir/1.18.4/Task.html",
    "Short-lived concurrent work on the BEAM.",
  ),
  ets: link(
    "ETS",
    "https://www.erlang.org/docs/25/man/ets",
    "In-memory storage for hot transport lookups and caches.",
  ),
  digraph: link(
    "digraph",
    "https://www.erlang.org/docs/23/man/digraph",
    "Directed graph primitives for route and transfer modeling.",
  ),
  distributed: link(
    "Distributed Erlang",
    "https://www.erlang.org/docs/18/reference_manual/distributed",
    "Node connections, remote messaging, and failure behavior.",
  ),
  distributedApps: link(
    "Distributed applications",
    "https://www.erlang.org/doc/system/distributed_applications.html",
    "High-level distribution concerns across Erlang nodes.",
  ),
  codeLoading: link(
    "Code loading",
    "https://www.erlang.org/docs/21/reference_manual/code_loading",
    "Hot code loading and runtime upgrades on the BEAM.",
  ),
  telemetry: link(
    "Telemetry",
    "https://hexdocs.pm/telemetry/telemetry.html",
    "Instrumenting transport requests, queues, and realtime flow.",
  ),
};

const proc = (
  id: string,
  name: string,
  state: EProcess["state"],
  role: NonNullable<EProcess["role"]>,
  extras: Partial<EProcess> = {},
): EProcess => ({
  id,
  name,
  state,
  role,
  ...extras,
});

const msg = (
  id: string,
  from: string | undefined,
  to: string,
  content: string,
  phase: EMessage["phase"],
): EMessage => ({
  id,
  ...(from ? { from } : {}),
  to,
  content,
  phase,
});

const core = (id: string, queue: string[] = [], running?: string): ESchedulerState["cores"][number] =>
  running ? { id, running, queue } : { id, queue };

const sched = (...cores: ESchedulerState["cores"]): ESchedulerState => ({ cores });

const task = (id: string, label: string, status: ETask["status"]): ETask => ({
  id,
  label,
  status,
});

const gs = (
  pid: string,
  module: string,
  state: EGenServerState["state"],
  extras: Partial<EGenServerState> = {},
): EGenServerState => ({
  pid,
  module,
  state,
  ...extras,
});

const phoenixCoreLessons: Lesson[] = [
  {
    id: "phoenix-request-lifecycle",
    language: "elixir",
    topic: "Phoenix",
    title: "Phoenix Request Lifecycle",
    subtitle: "Trace an HTTP request from endpoint to rendered response.",
    difficulty: "Core",
    code: `scope "/api", TransitWeb do
  pipe_through :api
  get "/stations/:id", StationController, :show
end

def show(conn, %{"id" => id}) do
  station = Transit.Network.get_station!(id)
  render(conn, :show, station: station)
end`,
    panels: ["processes", "scheduler", "tasks"],
    resources: [docs.requestLifecycle, docs.controllers, docs.plugConn],
    steps: [
      {
        title: "Request enters the endpoint",
        lines: [1, 2, 3],
        explanation: "A client hits `/api/stations/:id`. Phoenix creates a request process and starts the Plug pipeline.",
        snapshot: {
          processes: [
            proc("client", "browser", "running", "user"),
            proc("req", "request#4021", "running", "worker", { parent: "client" }),
          ],
          scheduler: sched(core("1", [], "req"), core("2")),
          tasks: [
            task("endpoint", "endpoint plugs", "running"),
            task("router", "router match", "pending"),
            task("controller", "controller action", "pending"),
            task("view", "render response", "pending"),
          ],
        },
      },
      {
        title: "Router dispatches",
        lines: [1, 2, 3],
        explanation: "The router matches the `GET` path and hands control to `StationController.show/2`.",
        snapshot: {
          processes: [
            proc("client", "browser", "running", "user"),
            proc("req", "request#4021", "running", "worker", { parent: "client" }),
            proc("ctrl", "StationController", "ready", "worker", { parent: "req" }),
          ],
          scheduler: sched(core("1", ["ctrl"], "req"), core("2")),
          tasks: [
            task("endpoint", "endpoint plugs", "done"),
            task("router", "router match", "done"),
            task("controller", "controller action", "running"),
            task("view", "render response", "pending"),
          ],
        },
      },
      {
        title: "Controller talks to the domain",
        lines: [6, 7],
        explanation: "Controllers stay thin. They call a context, receive domain data, and prepare it for rendering.",
        snapshot: {
          processes: [
            proc("client", "browser", "running", "user"),
            proc("req", "request#4021", "running", "worker", { parent: "client" }),
            proc("ctrl", "StationController", "running", "worker", { parent: "req" }),
            proc("ctx", "Transit.Network", "ready", "genserver", { parent: "req" }),
          ],
          scheduler: sched(core("1", [], "ctrl"), core("2", ["ctx"])),
          tasks: [
            task("endpoint", "endpoint plugs", "done"),
            task("router", "router match", "done"),
            task("controller", "controller action", "running"),
            task("view", "render response", "pending"),
          ],
        },
      },
      {
        title: "View renders the response",
        lines: [7],
        explanation: "The final stage shapes a response and sends it back. Phoenix turns domain state into a transport-safe payload.",
        snapshot: {
          processes: [
            proc("client", "browser", "running", "user"),
            proc("req", "request#4021", "running", "worker", { parent: "client" }),
            proc("view", "StationJSON", "running", "worker", { parent: "req" }),
          ],
          scheduler: sched(core("1", [], "view"), core("2")),
          tasks: [
            task("endpoint", "endpoint plugs", "done"),
            task("router", "router match", "done"),
            task("controller", "controller action", "done"),
            task("view", "render response", "done"),
          ],
        },
      },
    ],
  },
  {
    id: "phoenix-rest-apis-transport-data",
    language: "elixir",
    topic: "Phoenix",
    title: "REST APIs for Transport Data",
    subtitle: "Design routes that map cleanly to stations, trips, and schedules.",
    difficulty: "Core",
    code: `scope "/api", TransitWeb do
  pipe_through :api

  resources "/stations", StationController, only: [:index, :show]
  get "/routes/:id/departures", RouteController, :departures
end`,
    panels: ["processes", "genserver", "tasks"],
    resources: [docs.jsonApis, docs.router, docs.contexts],
    steps: [
      {
        title: "Model resource boundaries",
        lines: [1, 4, 5],
        explanation: "Stations are resources. Departures are a derived view over schedules. Good APIs reflect that split.",
        snapshot: {
          processes: [
            proc("api", "TransitWeb.Endpoint", "running", "worker"),
            proc("req", "GET /routes/red/departures", "ready", "worker", { parent: "api" }),
          ],
          tasks: [
            task("parse", "parse route + params", "done"),
            task("load", "load departures", "running"),
            task("render", "serialize JSON", "pending"),
          ],
          genserver: gs("network", "Transit.Network", {
            resource: "routes/red/departures",
            method: "GET",
            scope: "public",
          }),
        },
      },
      {
        title: "Load transport state",
        lines: [4, 5],
        explanation: "The context gathers station, route, and timetable state behind one API-specific read function.",
        snapshot: {
          processes: [
            proc("api", "TransitWeb.Endpoint", "running", "worker"),
            proc("req", "GET /routes/red/departures", "running", "worker", { parent: "api" }),
            proc("ctx", "Transit.Network", "running", "genserver", { parent: "req" }),
          ],
          tasks: [
            task("parse", "parse route + params", "done"),
            task("load", "load departures", "running"),
            task("render", "serialize JSON", "pending"),
          ],
          genserver: gs("network", "Transit.Network", {
            route: "red",
            departures: 4,
            delayed: 1,
          }),
        },
      },
      {
        title: "Return a clean surface",
        lines: [4, 5],
        explanation: "A transport API should expose stable response shapes even if the underlying domain joins many tables and services.",
        snapshot: {
          processes: [
            proc("api", "TransitWeb.Endpoint", "running", "worker"),
            proc("req", "GET /routes/red/departures", "running", "worker", { parent: "api" }),
            proc("json", "RouteJSON", "running", "worker", { parent: "req" }),
          ],
          tasks: [
            task("parse", "parse route + params", "done"),
            task("load", "load departures", "done"),
            task("render", "serialize JSON", "done"),
          ],
          genserver: gs("network", "RouteJSON", {
            id: "red",
            departures: 4,
            next_stop: "Central",
          }),
        },
      },
    ],
  },
  {
    id: "phoenix-json-serialization-api-design",
    language: "elixir",
    topic: "Phoenix",
    title: "JSON Serialization & API Design",
    subtitle: "Shape transport responses for clarity, compatibility, and client ergonomics.",
    difficulty: "Core",
    code: `def show(%{station: station, departures: deps}) do
  %{
    data: %{
      id: station.id,
      name: station.name,
      departures: Enum.map(deps, &serialize_departure/1)
    }
  }
end`,
    panels: ["genserver", "tasks"],
    resources: [docs.jsonApis, docs.controllers, docs.plugConn],
    steps: [
      {
        title: "Start with domain structs",
        lines: [1, 2, 3],
        explanation: "Controllers and views receive rich Elixir data first. Serialization is where you choose the client-facing contract.",
        snapshot: {
          tasks: [
            task("domain", "load station struct", "done"),
            task("shape", "shape payload", "running"),
            task("send", "send JSON", "pending"),
          ],
          genserver: gs("json", "StationJSON", {
            station: "Central",
            departures_loaded: 3,
            shape: "internal",
          }),
        },
      },
      {
        title: "Flatten what clients need",
        lines: [2, 4, 5],
        explanation: "Good transport APIs expose what mobile or web clients need directly instead of leaking storage-level fields.",
        snapshot: {
          tasks: [
            task("domain", "load station struct", "done"),
            task("shape", "shape payload", "running"),
            task("send", "send JSON", "pending"),
          ],
          genserver: gs("json", "StationJSON", {
            id: "central",
            name: "Central",
            departures: 3,
            shape: "client-ready",
          }),
        },
      },
      {
        title: "Lock the envelope",
        lines: [2, 3, 4, 5, 6, 7],
        explanation: "A consistent envelope makes versioning, errors, and pagination easier across every transport endpoint.",
        snapshot: {
          tasks: [
            task("domain", "load station struct", "done"),
            task("shape", "shape payload", "done"),
            task("send", "send JSON", "done"),
          ],
          genserver: gs("json", "StationJSON", {
            envelope: "data",
            versionable: true,
            sparse_fields: false,
          }),
        },
      },
    ],
  },
  {
    id: "phoenix-contexts-transport-domain",
    language: "elixir",
    topic: "Phoenix",
    title: "Phoenix Contexts",
    subtitle: "Keep routes, trips, tickets, and live feeds behind domain-focused modules.",
    difficulty: "Core",
    code: `defmodule Transit.Network do
  def list_stations, do: Repo.all(Station)
  def departures_for_route(route_id), do: ...
end

defmodule Transit.Tickets do
  def purchase(attrs), do: ...
end`,
    panels: ["processes", "genserver", "tasks"],
    resources: [docs.contexts, docs.phoenixEcto, docs.genserver],
    steps: [
      {
        title: "Split by domain, not page",
        lines: [1, 2, 3, 6, 7],
        explanation: "Contexts draw boundaries around domain capability. `Network` and `Tickets` should evolve independently from controllers.",
        snapshot: {
          processes: [
            proc("web", "TransitWeb", "running", "worker"),
            proc("network", "Transit.Network", "ready", "genserver", { parent: "web" }),
            proc("tickets", "Transit.Tickets", "ready", "genserver", { parent: "web" }),
          ],
          tasks: [
            task("http", "controller calls context", "done"),
            task("domain", "execute business rules", "running"),
            task("render", "render result", "pending"),
          ],
          genserver: gs("network", "Transit.Network", {
            stations: 142,
            routes: 18,
            ownership: "transport topology",
          }),
        },
      },
      {
        title: "Keep web thin",
        lines: [2, 3, 6, 7],
        explanation: "The controller should not know SQL or OTP internals. It calls the context and gets back domain results.",
        snapshot: {
          processes: [
            proc("web", "TransitWeb", "running", "worker"),
            proc("ctrl", "RouteController", "running", "worker", { parent: "web" }),
            proc("network", "Transit.Network", "running", "genserver", { parent: "web" }),
          ],
          tasks: [
            task("http", "controller calls context", "done"),
            task("domain", "execute business rules", "running"),
            task("render", "render result", "pending"),
          ],
          genserver: gs("network", "Transit.Network", {
            query: "departures_for_route(red)",
            source: "context API",
            callers: 1,
          }),
        },
      },
      {
        title: "Contexts become the stable API",
        lines: [1, 6],
        explanation: "HTTP, LiveView, jobs, and channels can all call the same context. That is how a transport app avoids logic drift.",
        snapshot: {
          processes: [
            proc("web", "TransitWeb", "running", "worker"),
            proc("live", "RouteLive", "ready", "worker", { parent: "web" }),
            proc("job", "SyncSchedulesWorker", "ready", "task", { parent: "web" }),
            proc("network", "Transit.Network", "running", "genserver", { parent: "web" }),
          ],
          tasks: [
            task("http", "controller calls context", "done"),
            task("domain", "execute business rules", "done"),
            task("render", "render result", "done"),
          ],
          genserver: gs("network", "Transit.Network", {
            web: true,
            liveview: true,
            jobs: true,
          }),
        },
      },
    ],
  },
  {
    id: "phoenix-ecto-transport-modeling",
    language: "elixir",
    topic: "Phoenix",
    title: "Ecto Basics for Transport Data Modeling",
    subtitle: "Model stations, lines, trips, and vehicles with schemas and changesets.",
    difficulty: "Core",
    code: `schema "stations" do
  field :name, :string
  field :lat, :float
  field :lng, :float
  belongs_to :line, Transit.Network.Line
end`,
    panels: ["genserver", "tasks"],
    resources: [docs.ectoStart, docs.ectoSchema, docs.phoenixEcto],
    steps: [
      {
        title: "Schema captures transport entities",
        lines: [1, 2, 3, 4, 5],
        explanation: "Stations are first-class records with typed fields. Ecto makes the model explicit before queries ever run.",
        snapshot: {
          tasks: [
            task("schema", "define station fields", "done"),
            task("changeset", "validate params", "pending"),
            task("repo", "persist record", "pending"),
          ],
          genserver: gs("repo", "Transit.Network.Station", {
            fields: 4,
            relations: 1,
            persisted: false,
          }),
        },
      },
      {
        title: "Changesets validate input",
        lines: [2, 3, 4],
        explanation: "Transport data feeds are messy. Changesets let you reject bad coordinates or missing names before they hit the database.",
        snapshot: {
          tasks: [
            task("schema", "define station fields", "done"),
            task("changeset", "validate params", "running"),
            task("repo", "persist record", "pending"),
          ],
          genserver: gs("repo", "Transit.Network.StationChangeset", {
            valid: true,
            required: 3,
            source: "feed import",
          }),
        },
      },
      {
        title: "Repo persists the clean model",
        lines: [1],
        explanation: "Once the data is shaped and validated, the repo becomes a persistence detail instead of the place where business rules live.",
        snapshot: {
          tasks: [
            task("schema", "define station fields", "done"),
            task("changeset", "validate params", "done"),
            task("repo", "persist record", "done"),
          ],
          genserver: gs("repo", "Transit.Repo", {
            inserted: "station:central",
            line: "red",
            source: "validated changeset",
          }),
        },
      },
    ],
  },
];

const phoenixRealtimeLessons: Lesson[] = [
  {
    id: "phoenix-channels-live-vehicle-tracking",
    language: "elixir",
    topic: "Realtime",
    title: "Phoenix Channels for Live Vehicle Tracking",
    subtitle: "Push bus and train position updates over channel topics in real time.",
    difficulty: "Core",
    code: `def join("vehicle:" <> id, _params, socket) do
  {:ok, assign(socket, :vehicle_id, id)}
end

def handle_in("position", %{"lat" => lat, "lng" => lng}, socket) do
  broadcast!(socket, "position", %{lat: lat, lng: lng})
  {:noreply, socket}
end`,
    panels: ["processes", "mailbox", "scheduler"],
    resources: [docs.channels, docs.channelApi, docs.pubsub],
    steps: [
      {
        title: "Clients join a vehicle topic",
        lines: [1, 2],
        explanation: "Each vehicle or route can map to a topic. Subscribers isolate themselves to only the updates they care about.",
        snapshot: {
          processes: [
            proc("socket", "socket transport", "running", "worker"),
            proc("ch", "Channel vehicle:red-21", "waiting", "genserver", { parent: "socket" }),
            proc("viewer", "map client", "ready", "user"),
          ],
          scheduler: sched(core("1", ["viewer"], "socket"), core("2", ["ch"])),
        },
      },
      {
        title: "Position update arrives",
        lines: [5, 6],
        explanation: "A GPS feeder or upstream service pushes a new coordinate into the channel process.",
        snapshot: {
          processes: [
            proc("socket", "socket transport", "running", "worker"),
            proc("ch", "Channel vehicle:red-21", "running", "genserver", { parent: "socket" }),
            proc("gps", "gps feeder", "running", "worker"),
          ],
          messages: [
            msg("pos1", "gps", "ch", `%{"lat" => 36.8, "lng" => 10.1}`, "in-flight"),
          ],
          scheduler: sched(core("1", [], "gps"), core("2", [], "ch")),
        },
      },
      {
        title: "Broadcast fans out",
        lines: [6],
        explanation: "The channel rebroadcasts to every subscribed client. Phoenix handles the topic fanout; you manage the payload and topic design.",
        snapshot: {
          processes: [
            proc("socket", "socket transport", "running", "worker"),
            proc("ch", "Channel vehicle:red-21", "running", "genserver", { parent: "socket" }),
            proc("viewer-a", "map client A", "ready", "user"),
            proc("viewer-b", "map client B", "ready", "user"),
          ],
          messages: [
            msg("pos2", "ch", "viewer-a", "{lat: 36.8, lng: 10.1}", "in-flight"),
            msg("pos3", "ch", "viewer-b", "{lat: 36.8, lng: 10.1}", "in-flight"),
          ],
          scheduler: sched(core("1", ["viewer-a"], "ch"), core("2", ["viewer-b"])),
        },
      },
    ],
  },
  {
    id: "phoenix-pubsub-architecture",
    language: "elixir",
    topic: "Realtime",
    title: "PubSub Architecture",
    subtitle: "Broadcast arrivals, delays, and alerts without coupling every producer to every consumer.",
    difficulty: "Core",
    code: `Phoenix.PubSub.subscribe(Transit.PubSub, "station:central")

Phoenix.PubSub.broadcast(
  Transit.PubSub,
  "station:central",
  {:arrival_update, %{route: "R1", eta_min: 3}}
)`,
    panels: ["processes", "mailbox"],
    resources: [docs.pubsub, docs.channels, docs.presenceGuide],
    steps: [
      {
        title: "Consumers subscribe by topic",
        lines: [1],
        explanation: "Station boards, mobile apps, and admin dashboards can all subscribe to the same transport topic independently.",
        snapshot: {
          processes: [
            proc("pubsub", "Transit.PubSub", "running", "worker"),
            proc("board", "station board", "waiting", "worker", { parent: "pubsub" }),
            proc("app", "mobile app", "waiting", "user", { parent: "pubsub" }),
          ],
        },
      },
      {
        title: "One producer broadcasts once",
        lines: [3, 4, 5, 6],
        explanation: "The producer only knows the topic. It does not need to track every connected consumer explicitly.",
        snapshot: {
          processes: [
            proc("pubsub", "Transit.PubSub", "running", "worker"),
            proc("tracker", "arrival tracker", "running", "worker"),
            proc("board", "station board", "waiting", "worker", { parent: "pubsub" }),
            proc("app", "mobile app", "waiting", "user", { parent: "pubsub" }),
          ],
          messages: [
            msg("arr1", "tracker", "pubsub", `{:arrival_update, %{route: "R1", eta_min: 3}}`, "in-flight"),
          ],
        },
      },
      {
        title: "Fanout stays decoupled",
        lines: [2, 4],
        explanation: "PubSub becomes the spine of your realtime transport app: tracking, alerts, and control rooms all plug into the same event bus.",
        snapshot: {
          processes: [
            proc("pubsub", "Transit.PubSub", "running", "worker"),
            proc("board", "station board", "ready", "worker", { parent: "pubsub" }),
            proc("app", "mobile app", "ready", "user", { parent: "pubsub" }),
            proc("ops", "ops dashboard", "ready", "user", { parent: "pubsub" }),
          ],
          messages: [
            msg("arr2", "pubsub", "board", "{eta_min: 3}", "in-flight"),
            msg("arr3", "pubsub", "app", "{eta_min: 3}", "in-flight"),
            msg("arr4", "pubsub", "ops", "{eta_min: 3}", "in-flight"),
          ],
        },
      },
    ],
  },
  {
    id: "phoenix-liveview-real-time-ui-updates",
    language: "elixir",
    topic: "Realtime",
    title: "LiveView for Real-Time UI Updates",
    subtitle: "Keep route boards live without writing frontend websocket plumbing by hand.",
    difficulty: "Core",
    code: `def mount(%{"route_id" => route_id}, _session, socket) do
  {:ok, assign(socket, route_id: route_id, departures: [])}
end

def handle_info({:departure_update, deps}, socket) do
  {:noreply, assign(socket, departures: deps)}
end`,
    panels: ["processes", "genserver", "mailbox"],
    resources: [docs.liveView, docs.liveViewGuide, docs.pubsub],
    steps: [
      {
        title: "LiveView mounts as a process",
        lines: [1, 2],
        explanation: "LiveView starts with HTTP, then owns state on the server. The route board is now backed by a BEAM process.",
        snapshot: {
          processes: [
            proc("browser", "browser", "running", "user"),
            proc("live", "RouteLive red", "running", "genserver", { parent: "browser" }),
          ],
          genserver: gs("live", "RouteLive", {
            route_id: "red",
            departures: 0,
            connected: true,
          }),
        },
      },
      {
        title: "Realtime update lands in mailbox",
        lines: [5, 6],
        explanation: "LiveView reacts like any other process. It receives messages and mutates assigns on the server.",
        snapshot: {
          processes: [
            proc("browser", "browser", "running", "user"),
            proc("live", "RouteLive red", "running", "genserver", { parent: "browser" }),
            proc("tracker", "delay tracker", "running", "worker"),
          ],
          messages: [
            msg("dep1", "tracker", "live", "{:departure_update, deps}", "in-mailbox"),
          ],
          genserver: gs("live", "RouteLive", {
            route_id: "red",
            departures: 0,
            pending_update: true,
          }),
        },
      },
      {
        title: "Diff is pushed to the client",
        lines: [6],
        explanation: "LiveView updates server assigns and sends a compact diff. The client patches DOM state instead of rebuilding the whole page.",
        snapshot: {
          processes: [
            proc("browser", "browser", "ready", "user"),
            proc("live", "RouteLive red", "running", "genserver", { parent: "browser" }),
          ],
          genserver: gs("live", "RouteLive", {
            route_id: "red",
            departures: 5,
            rendered_diff: "sent",
          }, { lastReply: "5 departures rendered" }),
        },
      },
    ],
  },
  {
    id: "phoenix-presence-tracking",
    language: "elixir",
    topic: "Realtime",
    title: "Presence Tracking",
    subtitle: "Track which users are watching a route, station, or control screen in real time.",
    difficulty: "Core",
    code: `{:ok, _} = Presence.track(socket, socket.assigns.user_id, %{
  route_id: socket.assigns.route_id,
  joined_at: System.system_time(:second)
})`,
    panels: ["processes", "genserver", "mailbox"],
    resources: [docs.presence, docs.presenceGuide, docs.pubsub],
    steps: [
      {
        title: "Track viewers by topic",
        lines: [1, 2, 3],
        explanation: "Presence stores lightweight metadata per topic. That is enough to know who is watching a route right now.",
        snapshot: {
          processes: [
            proc("presence", "TransitWeb.Presence", "running", "genserver"),
            proc("live-a", "RouteLive user-12", "running", "genserver"),
          ],
          genserver: gs("presence", "TransitWeb.Presence", {
            topic: "route:red",
            viewers: 1,
            metadata: "route_id + joined_at",
          }),
        },
      },
      {
        title: "Join diffs propagate",
        lines: [1],
        explanation: "When another viewer joins, Presence computes a diff and broadcasts only the change, not the whole world.",
        snapshot: {
          processes: [
            proc("presence", "TransitWeb.Presence", "running", "genserver"),
            proc("live-a", "RouteLive user-12", "running", "genserver"),
            proc("live-b", "RouteLive user-44", "running", "genserver"),
          ],
          messages: [
            msg("prs1", "presence", "live-a", "{joins: user-44}", "in-flight"),
            msg("prs2", "presence", "live-b", "{joins: user-44}", "in-flight"),
          ],
          genserver: gs("presence", "TransitWeb.Presence", {
            topic: "route:red",
            viewers: 2,
            diff: "join",
          }),
        },
      },
      {
        title: "Presence is observation, not authority",
        lines: [2],
        explanation: "Use Presence for ephemeral live state. It should not become the source of truth for tickets, trips, or persistent user records.",
        snapshot: {
          processes: [
            proc("presence", "TransitWeb.Presence", "running", "genserver"),
            proc("live-a", "RouteLive user-12", "running", "genserver"),
            proc("live-b", "RouteLive user-44", "running", "genserver"),
          ],
          genserver: gs("presence", "TransitWeb.Presence", {
            topic: "route:red",
            viewers: 2,
            authoritative: false,
          }),
        },
      },
    ],
  },
  {
    id: "phoenix-streaming-vs-polling",
    language: "elixir",
    topic: "Realtime",
    title: "Streaming Updates vs Polling",
    subtitle: "Compare push-based transport feeds with repeated API polling.",
    difficulty: "Advanced",
    code: `# polling
Process.send_after(self(), :refresh, 5_000)

# streaming
Phoenix.PubSub.subscribe(Transit.PubSub, "route:red")`,
    panels: ["processes", "mailbox", "scheduler"],
    resources: [docs.pubsub, docs.liveView, docs.telemetry],
    steps: [
      {
        title: "Polling burns cycles",
        lines: [1, 2],
        explanation: "With polling, every client wakes up on a timer even when no vehicle position changed.",
        snapshot: {
          processes: [
            proc("client-a", "poller A", "ready", "user"),
            proc("client-b", "poller B", "ready", "user"),
            proc("api", "Transit API", "running", "worker"),
          ],
          scheduler: sched(core("1", ["client-b"], "client-a"), core("2", [], "api")),
          messages: [
            msg("poll1", "client-a", "api", ":refresh", "in-flight"),
            msg("poll2", "client-b", "api", ":refresh", "in-flight"),
          ],
        },
      },
      {
        title: "Streaming sleeps until data changes",
        lines: [4, 5],
        explanation: "With PubSub or Channels, clients wait quietly and wake only when a real transport event occurs.",
        snapshot: {
          processes: [
            proc("client-a", "subscriber A", "waiting", "user"),
            proc("client-b", "subscriber B", "waiting", "user"),
            proc("pubsub", "Transit.PubSub", "running", "worker"),
          ],
          scheduler: sched(core("1"), core("2", [], "pubsub")),
        },
      },
      {
        title: "Push wins under high fanout",
        lines: [4, 5],
        explanation: "Transport apps with many riders and sparse updates usually want streaming, then add polling only for fallback or reconciliation.",
        snapshot: {
          processes: [
            proc("client-a", "subscriber A", "ready", "user"),
            proc("client-b", "subscriber B", "ready", "user"),
            proc("pubsub", "Transit.PubSub", "running", "worker"),
          ],
          scheduler: sched(core("1", ["client-a"], "pubsub"), core("2", ["client-b"])),
          messages: [
            msg("push1", "pubsub", "client-a", "{delay: 2}", "in-flight"),
            msg("push2", "pubsub", "client-b", "{delay: 2}", "in-flight"),
          ],
        },
      },
    ],
  },
];

const transportSystemLessons: Lesson[] = [
  {
    id: "transport-route-calculation-pipeline",
    language: "elixir",
    topic: "Transport Systems",
    title: "Route Calculation Pipeline",
    subtitle: "Compute A -> B journeys across bus, metro, and walking segments.",
    difficulty: "Advanced",
    code: `def plan_trip(from, to) do
  graph = Network.route_graph()
  candidates = Router.expand(graph, from, to)
  Router.rank(candidates)
end`,
    panels: ["genserver", "tasks", "processes"],
    resources: [docs.contexts, docs.digraph, docs.task],
    steps: [
      {
        title: "Load the transport graph",
        lines: [1, 2],
        explanation: "Trip planning starts by loading a graph of stations, stops, routes, and walking links.",
        snapshot: {
          processes: [
            proc("planner", "trip planner", "running", "genserver"),
          ],
          tasks: [
            task("graph", "load route graph", "running"),
            task("expand", "expand candidates", "pending"),
            task("rank", "rank itineraries", "pending"),
          ],
          genserver: gs("planner", "Transit.Router", {
            from: "Airport",
            to: "Downtown",
            nodes: 218,
            edges: 604,
          }),
        },
      },
      {
        title: "Expand journey candidates",
        lines: [3],
        explanation: "The planner explores legal transfers and builds multiple candidate itineraries instead of betting on the first path found.",
        snapshot: {
          processes: [
            proc("planner", "trip planner", "running", "genserver"),
            proc("w1", "candidate worker 1", "ready", "task", { parent: "planner" }),
            proc("w2", "candidate worker 2", "ready", "task", { parent: "planner" }),
          ],
          tasks: [
            task("graph", "load route graph", "done"),
            task("expand", "expand candidates", "running"),
            task("rank", "rank itineraries", "pending"),
          ],
          genserver: gs("planner", "Transit.Router", {
            candidates: 6,
            transfers_max: 2,
            mode_mix: "bus+metro+walk",
          }),
        },
      },
      {
        title: "Rank and return the best journey",
        lines: [4],
        explanation: "Scoring turns a graph problem into a product decision: fastest, cheapest, fewest transfers, or most reliable.",
        snapshot: {
          processes: [
            proc("planner", "trip planner", "running", "genserver"),
          ],
          tasks: [
            task("graph", "load route graph", "done"),
            task("expand", "expand candidates", "done"),
            task("rank", "rank itineraries", "done"),
          ],
          genserver: gs("planner", "Transit.Router", {
            best: "Airport -> Metro M1 -> Walk",
            eta_min: 29,
            transfers: 1,
          }, { lastReply: "29 min" }),
        },
      },
    ],
  },
  {
    id: "transport-scheduling-system-design",
    language: "elixir",
    topic: "Transport Systems",
    title: "Scheduling System Design",
    subtitle: "Model timed departures and how one delay ripples through the day.",
    difficulty: "Advanced",
    code: `def propagate_delay(trip_id, delay_min) do
  trip = Schedules.get_trip!(trip_id)
  Schedules.shift_downstream_stops(trip, delay_min)
end`,
    panels: ["genserver", "tasks"],
    resources: [docs.contexts, docs.genserver, docs.ectoStart],
    steps: [
      {
        title: "Base timetable is deterministic",
        lines: [1, 2],
        explanation: "Schedules start as planned stop times. That static plan is the baseline every realtime adjustment mutates.",
        snapshot: {
          tasks: [
            task("load", "load trip timetable", "running"),
            task("propagate", "propagate delay", "pending"),
            task("publish", "publish new ETAs", "pending"),
          ],
          genserver: gs("sched", "Transit.Schedules", {
            trip: "R1-08:30",
            stops: 14,
            delay_min: 0,
          }),
        },
      },
      {
        title: "Delay shifts downstream stops",
        lines: [3],
        explanation: "A late departure is not local. Every later stop on that trip inherits some or all of the delay.",
        snapshot: {
          tasks: [
            task("load", "load trip timetable", "done"),
            task("propagate", "propagate delay", "running"),
            task("publish", "publish new ETAs", "pending"),
          ],
          genserver: gs("sched", "Transit.Schedules", {
            trip: "R1-08:30",
            stops: 14,
            delay_min: 7,
            impacted_stops: 11,
          }),
        },
      },
      {
        title: "Updated ETAs become the new truth",
        lines: [4],
        explanation: "After propagation, every rider-facing surface should read from the recomputed ETA set, not the original timetable.",
        snapshot: {
          tasks: [
            task("load", "load trip timetable", "done"),
            task("propagate", "propagate delay", "done"),
            task("publish", "publish new ETAs", "done"),
          ],
          genserver: gs("sched", "Transit.Schedules", {
            trip: "R1-08:30",
            live_schedule: true,
            published: 11,
          }, { lastReply: "11 ETAs updated" }),
        },
      },
    ],
  },
  {
    id: "transport-real-time-delays",
    language: "elixir",
    topic: "Transport Systems",
    title: "Handling Real-Time Delays",
    subtitle: "One late vehicle can cascade through routes, transfers, and rider plans.",
    difficulty: "Advanced",
    code: `def handle_info({:delay, route_id, minutes}, state) do
  state
  |> update_route(route_id, minutes)
  |> notify_affected_transfers(route_id)
end`,
    panels: ["processes", "mailbox", "genserver"],
    resources: [docs.genserver, docs.pubsub, docs.telemetry],
    steps: [
      {
        title: "Delay event enters the system",
        lines: [1],
        explanation: "A feeder or operator injects a delay event for a route or trip.",
        snapshot: {
          processes: [
            proc("tracker", "delay tracker", "running", "worker"),
            proc("router", "Transit.DelayCoordinator", "running", "genserver"),
          ],
          messages: [
            msg("d1", "tracker", "router", "{:delay, :red, 6}", "in-mailbox"),
          ],
          genserver: gs("router", "Transit.DelayCoordinator", {
            pending_events: 1,
            affected_routes: 0,
          }),
        },
      },
      {
        title: "Coordinator updates route state",
        lines: [2, 3],
        explanation: "The delay coordinator rewrites the live route view before any UI broadcast happens.",
        snapshot: {
          processes: [
            proc("tracker", "delay tracker", "running", "worker"),
            proc("router", "Transit.DelayCoordinator", "running", "genserver"),
          ],
          genserver: gs("router", "Transit.DelayCoordinator", {
            route: "red",
            delay_min: 6,
            affected_routes: 1,
          }),
        },
      },
      {
        title: "Transfers and riders are notified",
        lines: [4],
        explanation: "The hard part is not storing the delay. It is pushing its impact to transfers, boards, and trip plans that depended on the old ETA.",
        snapshot: {
          processes: [
            proc("router", "Transit.DelayCoordinator", "running", "genserver"),
            proc("route-live", "RouteLive red", "ready", "genserver"),
            proc("trip-live", "TripPlannerLive", "ready", "genserver"),
          ],
          messages: [
            msg("d2", "router", "route-live", "{delay: 6}", "in-flight"),
            msg("d3", "router", "trip-live", "{recompute: transfers}", "in-flight"),
          ],
          genserver: gs("router", "Transit.DelayCoordinator", {
            route: "red",
            transfers_notified: 4,
            riders_impacted: 32,
          }),
        },
      },
    ],
  },
  {
    id: "transport-caching-queries",
    language: "elixir",
    topic: "Transport Systems",
    title: "Caching Transport Queries",
    subtitle: "Use in-memory caches for hot stations, routes, and map fragments without making them your authority.",
    difficulty: "Advanced",
    code: `def cached_station(id) do
  case :ets.lookup(:stations_cache, id) do
    [{^id, station}] -> {:ok, station}
    [] -> load_and_cache_station(id)
  end
end`,
    panels: ["processes", "genserver", "tasks"],
    resources: [docs.ets, docs.contexts, docs.telemetry],
    steps: [
      {
        title: "A hot lookup arrives",
        lines: [1, 2],
        explanation: "Stations and route metadata are read constantly. Hitting the database every time becomes wasteful fast.",
        snapshot: {
          processes: [
            proc("client", "route board", "running", "user"),
            proc("cache", "stations_cache", "running", "genserver"),
          ],
          tasks: [
            task("lookup", "ETS lookup", "running"),
            task("miss", "fallback load", "pending"),
            task("fill", "write cache", "pending"),
          ],
          genserver: gs("cache", "Transit.Cache", {
            table: "stations_cache",
            hit_rate: "82%",
            authority: "db",
          }),
        },
      },
      {
        title: "Miss falls back to source",
        lines: [3, 4],
        explanation: "A cache miss should degrade to the source of truth cleanly, then refill the cache for the next read.",
        snapshot: {
          processes: [
            proc("client", "route board", "running", "user"),
            proc("cache", "stations_cache", "running", "genserver"),
            proc("repo", "Transit.Repo", "ready", "worker"),
          ],
          tasks: [
            task("lookup", "ETS lookup", "done"),
            task("miss", "fallback load", "running"),
            task("fill", "write cache", "pending"),
          ],
          genserver: gs("cache", "Transit.Cache", {
            miss_key: "central",
            stale_allowed: false,
            refill: true,
          }),
        },
      },
      {
        title: "Cache accelerates, it does not own",
        lines: [1],
        explanation: "The cache exists to reduce latency and load. Your transport model still belongs to the system behind it.",
        snapshot: {
          processes: [
            proc("client", "route board", "running", "user"),
            proc("cache", "stations_cache", "running", "genserver"),
          ],
          tasks: [
            task("lookup", "ETS lookup", "done"),
            task("miss", "fallback load", "done"),
            task("fill", "write cache", "done"),
          ],
          genserver: gs("cache", "Transit.Cache", {
            hit_rate: "83%",
            ttl_sec: 30,
            authority: "Transit.Network",
          }),
        },
      },
    ],
  },
  {
    id: "transport-rate-limiting-apis",
    language: "elixir",
    topic: "Transport Systems",
    title: "Rate Limiting APIs",
    subtitle: "Protect public transport endpoints when maps and apps spike traffic.",
    difficulty: "Advanced",
    code: `def call(conn, _opts) do
  if over_limit?(conn.remote_ip) do
    conn |> put_status(:too_many_requests) |> halt()
  else
    conn
  end
end`,
    panels: ["processes", "mailbox", "genserver"],
    resources: [docs.plug, docs.plugConn, docs.telemetry],
    steps: [
      {
        title: "Traffic surge hits the API",
        lines: [1],
        explanation: "A public transport endpoint can get hammered during disruptions or by badly behaved clients.",
        snapshot: {
          processes: [
            proc("gateway", "api gateway", "running", "worker"),
            proc("req-a", "request A", "ready", "worker", { parent: "gateway" }),
            proc("req-b", "request B", "ready", "worker", { parent: "gateway" }),
          ],
          messages: [
            msg("rl1", "req-a", "gateway", "GET /api/routes/red", "in-mailbox"),
            msg("rl2", "req-b", "gateway", "GET /api/routes/red", "in-mailbox"),
          ],
          genserver: gs("gateway", "Transit.RateLimiter", {
            window_sec: 60,
            burst: 100,
            key: "remote_ip",
          }),
        },
      },
      {
        title: "Limiter halts excess flow",
        lines: [2, 3],
        explanation: "Because Plug pipelines are composable, the limiter can reject traffic before expensive database or planning work begins.",
        snapshot: {
          processes: [
            proc("gateway", "api gateway", "running", "worker"),
            proc("req-a", "request A", "running", "worker", { parent: "gateway" }),
            proc("req-b", "request B", "exited", "worker", { parent: "gateway" }),
          ],
          genserver: gs("gateway", "Transit.RateLimiter", {
            accepted: 1,
            rejected: 1,
            protected_downstream: true,
          }),
        },
      },
      {
        title: "Protect the real work",
        lines: [4, 5],
        explanation: "Rate limiting is not just about fairness. It protects route planners, live feeds, and ticketing from overload cascades.",
        snapshot: {
          processes: [
            proc("gateway", "api gateway", "running", "worker"),
            proc("planner", "Transit.Router", "ready", "genserver"),
          ],
          genserver: gs("gateway", "Transit.RateLimiter", {
            planner_load: "stable",
            endpoint_status: "protected",
            downstream_calls_saved: 17,
          }),
        },
      },
    ],
  },
];

const transportConcurrencyLessons: Lesson[] = [
  {
    id: "transport-worker-processes-per-route",
    language: "elixir",
    topic: "Concurrency Applied",
    title: "Worker Processes per Route",
    subtitle: "Model each line or route as an isolated BEAM process.",
    difficulty: "Advanced",
    code: `for route_id <- ["red", "blue", "green"] do
  DynamicSupervisor.start_child(Transit.RouteSupervisor, {Transit.RouteWorker, route_id})
end`,
    panels: ["processes", "scheduler"],
    resources: [docs.supervisor, docs.genserver, docs.task],
    steps: [
      {
        title: "One worker per route",
        lines: [1, 2],
        explanation: "Each route can own its own state and inbox. That isolates high-churn lines from quiet ones.",
        snapshot: {
          processes: [
            proc("sup", "RouteSupervisor", "running", "supervisor"),
            proc("red", "RouteWorker red", "ready", "genserver", { parent: "sup" }),
            proc("blue", "RouteWorker blue", "ready", "genserver", { parent: "sup" }),
            proc("green", "RouteWorker green", "ready", "genserver", { parent: "sup" }),
          ],
          scheduler: sched(core("1", ["blue"], "red"), core("2", ["green"], "sup")),
        },
      },
      {
        title: "Busy routes consume more time",
        lines: [2],
        explanation: "The red line can be hot without blocking state updates for blue or green because each route has its own process.",
        snapshot: {
          processes: [
            proc("sup", "RouteSupervisor", "running", "supervisor"),
            proc("red", "RouteWorker red", "running", "genserver", { parent: "sup" }),
            proc("blue", "RouteWorker blue", "waiting", "genserver", { parent: "sup" }),
            proc("green", "RouteWorker green", "waiting", "genserver", { parent: "sup" }),
          ],
          scheduler: sched(core("1", [], "red"), core("2", [], "sup")),
        },
      },
      {
        title: "Isolation contains blast radius",
        lines: [1, 2],
        explanation: "By aligning process boundaries with route boundaries, faults and hot spots stay local more often.",
        snapshot: {
          processes: [
            proc("sup", "RouteSupervisor", "running", "supervisor"),
            proc("red", "RouteWorker red", "running", "genserver", { parent: "sup" }),
            proc("blue", "RouteWorker blue", "ready", "genserver", { parent: "sup" }),
            proc("green", "RouteWorker green", "ready", "genserver", { parent: "sup" }),
          ],
          scheduler: sched(core("1", ["blue"], "red"), core("2", ["green"])),
        },
      },
    ],
  },
  {
    id: "transport-supervising-live-tracking",
    language: "elixir",
    topic: "Concurrency Applied",
    title: "Supervising Live Tracking Services",
    subtitle: "Restart live feeders automatically when a route tracker crashes.",
    difficulty: "Advanced",
    code: `children = [
  {Transit.Tracker, :red},
  {Transit.Tracker, :blue}
]

Supervisor.start_link(children, strategy: :one_for_one)`,
    panels: ["processes", "mailbox"],
    resources: [docs.supervisor, docs.genserver, docs.channels],
    steps: [
      {
        title: "Trackers run under supervision",
        lines: [1, 2, 3, 6],
        explanation: "Realtime feeders are long-lived processes. They should start and restart under a supervisor, not ad hoc.",
        snapshot: {
          processes: [
            proc("sup", "TrackerSupervisor", "running", "supervisor"),
            proc("red", "Tracker red", "running", "worker", { parent: "sup" }),
            proc("blue", "Tracker blue", "running", "worker", { parent: "sup" }),
          ],
        },
      },
      {
        title: "A feeder crashes",
        lines: [2],
        explanation: "A broken GPS payload or upstream disconnect kills one tracker, not the whole realtime system.",
        snapshot: {
          processes: [
            proc("sup", "TrackerSupervisor", "running", "supervisor"),
            proc("red", "Tracker red", "crashed", "worker", { parent: "sup" }),
            proc("blue", "Tracker blue", "running", "worker", { parent: "sup" }),
          ],
          messages: [
            msg("exit1", "red", "sup", "{:EXIT, :bad_payload}", "in-mailbox"),
          ],
        },
      },
      {
        title: "Supervisor heals the gap",
        lines: [6],
        explanation: "The supervisor starts a fresh tracker and the route resumes receiving updates with minimal human intervention.",
        snapshot: {
          processes: [
            proc("sup", "TrackerSupervisor", "running", "supervisor"),
            proc("red2", "Tracker red (restarted)", "running", "worker", { parent: "sup" }),
            proc("blue", "Tracker blue", "running", "worker", { parent: "sup" }),
          ],
        },
      },
    ],
  },
  {
    id: "transport-message-fanout-station-updates",
    language: "elixir",
    topic: "Concurrency Applied",
    title: "Message Fanout for Station Updates",
    subtitle: "Broadcast one arrival update to many boards and riders efficiently.",
    difficulty: "Advanced",
    code: `for pid <- subscribers("station:central") do
  send(pid, {:arrival, "R1", 2})
end`,
    panels: ["processes", "mailbox", "scheduler"],
    resources: [docs.pubsub, docs.channels, docs.presence],
    steps: [
      {
        title: "One station, many listeners",
        lines: [1],
        explanation: "A central station can have passenger apps, platform displays, and ops screens all attached at once.",
        snapshot: {
          processes: [
            proc("station", "station broadcaster", "running", "genserver"),
            proc("board", "platform board", "waiting", "worker", { parent: "station" }),
            proc("app", "rider app", "waiting", "user", { parent: "station" }),
            proc("ops", "ops screen", "waiting", "user", { parent: "station" }),
          ],
          scheduler: sched(core("1", [], "station"), core("2")),
        },
      },
      {
        title: "Fanout hits every mailbox",
        lines: [1, 2],
        explanation: "The cost shifts from computing the update once to distributing it to many consumers quickly.",
        snapshot: {
          processes: [
            proc("station", "station broadcaster", "running", "genserver"),
            proc("board", "platform board", "ready", "worker", { parent: "station" }),
            proc("app", "rider app", "ready", "user", { parent: "station" }),
            proc("ops", "ops screen", "ready", "user", { parent: "station" }),
          ],
          messages: [
            msg("fan1", "station", "board", `{:arrival, "R1", 2}`, "in-flight"),
            msg("fan2", "station", "app", `{:arrival, "R1", 2}`, "in-flight"),
            msg("fan3", "station", "ops", `{:arrival, "R1", 2}`, "in-flight"),
          ],
          scheduler: sched(core("1", ["board"], "station"), core("2", ["app", "ops"])),
        },
      },
      {
        title: "Fanout pressure becomes visible",
        lines: [2],
        explanation: "As audience size grows, fanout work and downstream mailbox pressure become first-order system design concerns.",
        snapshot: {
          processes: [
            proc("station", "station broadcaster", "running", "genserver"),
            proc("board", "platform board", "running", "worker", { parent: "station" }),
            proc("app", "rider app", "running", "user", { parent: "station" }),
            proc("ops", "ops screen", "running", "user", { parent: "station" }),
          ],
          scheduler: sched(core("1", ["app"], "station"), core("2", ["ops"], "board")),
        },
      },
    ],
  },
  {
    id: "transport-backpressure-live-feeds",
    language: "elixir",
    topic: "Concurrency Applied",
    title: "Backpressure in Live Feeds",
    subtitle: "Understand what happens when realtime vehicle updates arrive faster than you can process them.",
    difficulty: "Advanced",
    code: `def handle_info({:position, point}, state) do
  Process.sleep(50)
  {:noreply, consume(point, state)}
end`,
    panels: ["processes", "mailbox", "scheduler"],
    resources: [docs.genserver, docs.telemetry, docs.pubsub],
    steps: [
      {
        title: "Updates arrive quickly",
        lines: [1],
        explanation: "A high-frequency feed may push positions faster than a GenServer can validate, store, and rebroadcast them.",
        snapshot: {
          processes: [
            proc("feed", "gps feed", "running", "worker"),
            proc("tracker", "vehicle tracker", "ready", "genserver"),
          ],
          messages: [
            msg("bp1", "feed", "tracker", "{:position, p1}", "in-mailbox"),
            msg("bp2", "feed", "tracker", "{:position, p2}", "in-mailbox"),
            msg("bp3", "feed", "tracker", "{:position, p3}", "in-mailbox"),
          ],
          scheduler: sched(core("1", ["tracker"], "feed"), core("2")),
        },
      },
      {
        title: "Processing cannot keep pace",
        lines: [2],
        explanation: "The tracker is safe and isolated, but its mailbox still grows because the work per message is too expensive.",
        snapshot: {
          processes: [
            proc("feed", "gps feed", "running", "worker"),
            proc("tracker", "vehicle tracker", "running", "genserver"),
          ],
          messages: [
            msg("bp1", "feed", "tracker", "{:position, p1}", "consumed"),
            msg("bp2", "feed", "tracker", "{:position, p2}", "in-mailbox"),
            msg("bp3", "feed", "tracker", "{:position, p3}", "in-mailbox"),
            msg("bp4", "feed", "tracker", "{:position, p4}", "in-mailbox"),
          ],
          scheduler: sched(core("1", [], "tracker"), core("2", [], "feed")),
        },
      },
      {
        title: "You need demand control",
        lines: [3],
        explanation: "Backpressure mitigation usually means batching, dropping stale points, or slowing the producer, not just adding hope.",
        snapshot: {
          processes: [
            proc("feed", "gps feed", "running", "worker"),
            proc("tracker", "vehicle tracker", "running", "genserver"),
          ],
          messages: [
            msg("bp2", "feed", "tracker", "{:position, p2}", "consumed"),
            msg("bp4", "feed", "tracker", "{:position, p4}", "in-mailbox"),
          ],
          scheduler: sched(core("1", [], "tracker"), core("2")),
        },
      },
    ],
  },
];

const transportIntegrationLessons: Lesson[] = [
  {
    id: "transport-external-transit-apis",
    language: "elixir",
    topic: "Integrations",
    title: "Consuming External Transit APIs",
    subtitle: "Pull bus and train positions from external providers without polluting your domain model.",
    difficulty: "Advanced",
    code: `case Req.get("https://provider.example/vehicles") do
  {:ok, %{body: body}} -> ingest_positions(body)
  {:error, reason} -> {:error, reason}
end`,
    panels: ["processes", "tasks", "mailbox"],
    resources: [docs.req, docs.contexts, docs.telemetry],
    steps: [
      {
        title: "Integration worker calls the provider",
        lines: [1],
        explanation: "External transit feeds belong in an integration boundary, not in controllers or UI-facing processes.",
        snapshot: {
          processes: [
            proc("worker", "feed fetcher", "running", "task"),
            proc("provider", "external provider", "ready", "worker"),
          ],
          tasks: [
            task("request", "fetch provider feed", "running"),
            task("decode", "decode payload", "pending"),
            task("ingest", "ingest positions", "pending"),
          ],
        },
      },
      {
        title: "Decode provider-specific payloads",
        lines: [2],
        explanation: "The provider format is not your app format. Decode and normalize it before it touches route workers.",
        snapshot: {
          processes: [
            proc("worker", "feed fetcher", "running", "task"),
          ],
          tasks: [
            task("request", "fetch provider feed", "done"),
            task("decode", "decode payload", "running"),
            task("ingest", "ingest positions", "pending"),
          ],
          messages: [
            msg("ext1", "worker", "ingest", "{positions: [...]} ", "in-flight"),
          ],
        },
      },
      {
        title: "Ingest normalized transport events",
        lines: [2, 3],
        explanation: "Normalize once at the edge, then publish internal events the rest of the system already understands.",
        snapshot: {
          processes: [
            proc("worker", "feed fetcher", "running", "task"),
            proc("ingest", "Transit.FeedIngestor", "ready", "genserver"),
          ],
          tasks: [
            task("request", "fetch provider feed", "done"),
            task("decode", "decode payload", "done"),
            task("ingest", "ingest positions", "done"),
          ],
          messages: [
            msg("ext2", "worker", "ingest", "{route: red, vehicle: 21}", "in-flight"),
          ],
        },
      },
    ],
  },
  {
    id: "transport-webhooks-delay-notifications",
    language: "elixir",
    topic: "Integrations",
    title: "Webhooks for Delay Notifications",
    subtitle: "Receive provider push events and turn them into internal delay updates.",
    difficulty: "Advanced",
    code: `post "/webhooks/delays", WebhookController, :delay

def delay(conn, params) do
  Transit.Delays.ingest_webhook(params)
  send_resp(conn, 202, "")
end`,
    panels: ["processes", "mailbox", "genserver"],
    resources: [docs.requestLifecycle, docs.plugConn, docs.contexts],
    steps: [
      {
        title: "Provider pushes into your endpoint",
        lines: [1],
        explanation: "Webhooks invert control: the upstream provider decides when your transport app hears about a disruption.",
        snapshot: {
          processes: [
            proc("provider", "provider webhook sender", "running", "worker"),
            proc("req", "POST /webhooks/delays", "ready", "worker"),
          ],
          messages: [
            msg("wh1", "provider", "req", "{route: red, delay: 9}", "in-flight"),
          ],
        },
      },
      {
        title: "Controller hands off quickly",
        lines: [3, 4],
        explanation: "The webhook endpoint should validate, enqueue, and ack fast. Heavy processing belongs deeper in the system.",
        snapshot: {
          processes: [
            proc("provider", "provider webhook sender", "running", "worker"),
            proc("req", "POST /webhooks/delays", "running", "worker"),
            proc("delays", "Transit.Delays", "ready", "genserver"),
          ],
          messages: [
            msg("wh2", "req", "delays", "{route: red, delay: 9}", "in-mailbox"),
          ],
          genserver: gs("delays", "Transit.Delays", {
            source: "webhook",
            acknowledged: true,
            pending: 1,
          }),
        },
      },
      {
        title: "Delay becomes an internal event",
        lines: [4],
        explanation: "Once ingested, webhook payloads should look like every other internal delay event, regardless of source.",
        snapshot: {
          processes: [
            proc("delays", "Transit.Delays", "running", "genserver"),
            proc("route-red", "RouteWorker red", "ready", "genserver"),
          ],
          messages: [
            msg("wh3", "delays", "route-red", "{:delay, 9}", "in-flight"),
          ],
          genserver: gs("delays", "Transit.Delays", {
            route: "red",
            normalized: true,
            source: "provider webhook",
          }),
        },
      },
    ],
  },
  {
    id: "transport-background-jobs-oban",
    language: "elixir",
    topic: "Integrations",
    title: "Background Jobs with Oban",
    subtitle: "Sync schedules and route metadata reliably outside the request path.",
    difficulty: "Advanced",
    code: `%SyncScheduleJob{route_id: "red"}
|> Oban.insert()

def perform(%Oban.Job{args: %{"route_id" => route_id}}) do
  Transit.Sync.fetch_schedule(route_id)
end`,
    panels: ["processes", "tasks", "scheduler"],
    resources: [docs.oban, docs.supervisor, docs.task],
    steps: [
      {
        title: "Insert job, do not block the request",
        lines: [1, 2],
        explanation: "Schedule sync belongs in the background so API latency stays stable even when external feeds are slow.",
        snapshot: {
          processes: [
            proc("api", "Transit API", "running", "worker"),
            proc("oban", "Oban queue", "ready", "genserver"),
          ],
          tasks: [
            task("enqueue", "insert Oban job", "running"),
            task("perform", "run sync job", "pending"),
            task("persist", "persist schedule", "pending"),
          ],
          scheduler: sched(core("1", [], "api"), core("2", ["oban"])),
        },
      },
      {
        title: "Worker process picks it up",
        lines: [4, 5],
        explanation: "Oban turns durable job rows into supervised worker execution on the BEAM.",
        snapshot: {
          processes: [
            proc("oban", "Oban queue", "running", "genserver"),
            proc("job", "SyncScheduleJob red", "running", "task", { parent: "oban" }),
          ],
          tasks: [
            task("enqueue", "insert Oban job", "done"),
            task("perform", "run sync job", "running"),
            task("persist", "persist schedule", "pending"),
          ],
          scheduler: sched(core("1", [], "job"), core("2", [], "oban")),
        },
      },
      {
        title: "Job writes durable results",
        lines: [5],
        explanation: "Use jobs for work that must survive request exits, node restarts, or temporary provider failures.",
        snapshot: {
          processes: [
            proc("oban", "Oban queue", "running", "genserver"),
            proc("job", "SyncScheduleJob red", "running", "task", { parent: "oban" }),
          ],
          tasks: [
            task("enqueue", "insert Oban job", "done"),
            task("perform", "run sync job", "done"),
            task("persist", "persist schedule", "done"),
          ],
          scheduler: sched(core("1"), core("2", [], "oban")),
        },
      },
    ],
  },
  {
    id: "transport-retry-strategies-unreliable-apis",
    language: "elixir",
    topic: "Integrations",
    title: "Retry Strategies for Unreliable APIs",
    subtitle: "Retry transport feed failures deliberately instead of amplifying them.",
    difficulty: "Advanced",
    code: `with {:error, reason} <- Req.get(feed_url) do
  {:snooze, backoff_ms(reason)}
end`,
    panels: ["processes", "tasks", "mailbox"],
    resources: [docs.req, docs.oban, docs.telemetry],
    steps: [
      {
        title: "Transient failure hits the worker",
        lines: [1],
        explanation: "Provider APIs fail in bursts. A single timeout should not become a permanent outage or a hammering loop.",
        snapshot: {
          processes: [
            proc("job", "FetchFeedJob", "running", "task"),
            proc("provider", "provider API", "crashed", "worker"),
          ],
          tasks: [
            task("fetch", "call provider", "running"),
            task("classify", "classify failure", "pending"),
            task("retry", "schedule retry", "pending"),
          ],
        },
      },
      {
        title: "Classify before retrying",
        lines: [1, 2],
        explanation: "Not every error deserves the same response. Timeout, 429, and malformed payloads should not share one retry policy.",
        snapshot: {
          processes: [
            proc("job", "FetchFeedJob", "running", "task"),
          ],
          tasks: [
            task("fetch", "call provider", "done"),
            task("classify", "classify failure", "running"),
            task("retry", "schedule retry", "pending"),
          ],
          messages: [
            msg("retry1", "job", "queue", "{timeout, backoff: 5s}", "in-flight"),
          ],
        },
      },
      {
        title: "Backoff protects both sides",
        lines: [2],
        explanation: "A backoff strategy protects your system and gives the provider space to recover instead of multiplying load during failure.",
        snapshot: {
          processes: [
            proc("job", "FetchFeedJob", "ready", "task"),
            proc("queue", "retry queue", "running", "genserver"),
          ],
          tasks: [
            task("fetch", "call provider", "done"),
            task("classify", "classify failure", "done"),
            task("retry", "schedule retry", "done"),
          ],
          messages: [
            msg("retry2", "queue", "job", "{retry_in, 5000}", "in-mailbox"),
          ],
        },
      },
    ],
  },
];

const transportRoutingLessons: Lesson[] = [
  {
    id: "transport-modeling-multimodal-routes",
    language: "elixir",
    topic: "Mapping",
    title: "Modeling Multimodal Routes",
    subtitle: "Represent bus, metro, and walking as one composed journey.",
    difficulty: "Advanced",
    code: `[
  {:walk, "Home", "Stop A", 6},
  {:bus, "R1", "Stop A", "Central", 14},
  {:metro, "M2", "Central", "Campus", 9}
]`,
    panels: ["genserver", "tasks"],
    resources: [docs.digraph, docs.contexts, docs.genserver],
    steps: [
      {
        title: "A trip is a sequence of mode segments",
        lines: [1, 2, 3, 4],
        explanation: "Multimodal planning works when walking and transit legs share one representation instead of living in separate systems.",
        snapshot: {
          tasks: [
            task("load", "load modal segments", "running"),
            task("compose", "compose journey", "pending"),
            task("score", "score route", "pending"),
          ],
          genserver: gs("planner", "Transit.Router", {
            walk_segments: 1,
            transit_segments: 2,
            total_modes: 3,
          }),
        },
      },
      {
        title: "Compose one traveler-visible route",
        lines: [1],
        explanation: "The rider sees one itinerary. The system internally preserves enough structure to explain each transfer and segment.",
        snapshot: {
          tasks: [
            task("load", "load modal segments", "done"),
            task("compose", "compose journey", "running"),
            task("score", "score route", "pending"),
          ],
          genserver: gs("planner", "Transit.Router", {
            itinerary: "walk -> bus -> metro",
            transfers: 2,
            rider_view: "single plan",
          }),
        },
      },
      {
        title: "Segments stay individually accountable",
        lines: [2, 3, 4],
        explanation: "Because the legs stay explicit, a delay in one mode can invalidate or re-rank the whole journey later.",
        snapshot: {
          tasks: [
            task("load", "load modal segments", "done"),
            task("compose", "compose journey", "done"),
            task("score", "score route", "done"),
          ],
          genserver: gs("planner", "Transit.Router", {
            bus_leg: "R1",
            metro_leg: "M2",
            recomputable: true,
          }),
        },
      },
    ],
  },
  {
    id: "transport-graph-based-route-representation",
    language: "elixir",
    topic: "Mapping",
    title: "Graph-Based Route Representation",
    subtitle: "Treat stations as nodes and connections as edges so algorithms can reason globally.",
    difficulty: "Advanced",
    code: `graph
|> :digraph.add_vertex("Central")
|> :digraph.add_edge("Central", "Campus", %{mode: :metro, min: 9})`,
    panels: ["genserver", "tasks"],
    resources: [docs.digraph, docs.contexts, docs.ectoSchema],
    steps: [
      {
        title: "Stations become vertices",
        lines: [1, 2],
        explanation: "A graph lets you reason over the whole network instead of manually branching through nested route lists.",
        snapshot: {
          tasks: [
            task("nodes", "add station vertices", "running"),
            task("edges", "add route edges", "pending"),
            task("query", "query graph", "pending"),
          ],
          genserver: gs("graph", "Transit.RouteGraph", {
            vertices: 142,
            edges: 0,
            representation: "digraph",
          }),
        },
      },
      {
        title: "Connections become edges",
        lines: [3],
        explanation: "Edges carry the useful routing metadata: mode, travel time, transfers, or reliability.",
        snapshot: {
          tasks: [
            task("nodes", "add station vertices", "done"),
            task("edges", "add route edges", "running"),
            task("query", "query graph", "pending"),
          ],
          genserver: gs("graph", "Transit.RouteGraph", {
            vertices: 142,
            edges: 388,
            labeled_edges: true,
          }),
        },
      },
      {
        title: "Algorithms now operate globally",
        lines: [1, 3],
        explanation: "Once the network is graph-shaped, path search and transfer logic can work over the whole topology consistently.",
        snapshot: {
          tasks: [
            task("nodes", "add station vertices", "done"),
            task("edges", "add route edges", "done"),
            task("query", "query graph", "done"),
          ],
          genserver: gs("graph", "Transit.RouteGraph", {
            shortest_path: "Airport -> Central -> Campus",
            hops: 3,
            global_reasoning: true,
          }),
        },
      },
    ],
  },
  {
    id: "transport-weighted-routing",
    language: "elixir",
    topic: "Mapping",
    title: "Weighted Routing",
    subtitle: "Optimize by time, cost, or transfer count instead of assuming one universal best path.",
    difficulty: "Advanced",
    code: `score = minutes * 1.0 + transfers * 6.0 + fare * 0.4
Router.rank(candidates, score)`,
    panels: ["genserver", "tasks"],
    resources: [docs.digraph, docs.contexts, docs.telemetry],
    steps: [
      {
        title: "Each route has multiple costs",
        lines: [1],
        explanation: "A trip is not just distance. Riders care about time, money, walking, and transfer pain differently.",
        snapshot: {
          tasks: [
            task("collect", "collect candidate metrics", "running"),
            task("score", "score candidates", "pending"),
            task("rank", "rank journeys", "pending"),
          ],
          genserver: gs("ranker", "Transit.Router", {
            minutes_weight: 1,
            transfer_weight: 6,
            fare_weight: 0.4,
          }),
        },
      },
      {
        title: "Weights encode product policy",
        lines: [1, 2],
        explanation: "Changing weights changes the product. The 'best' route is a business choice expressed mathematically.",
        snapshot: {
          tasks: [
            task("collect", "collect candidate metrics", "done"),
            task("score", "score candidates", "running"),
            task("rank", "rank journeys", "pending"),
          ],
          genserver: gs("ranker", "Transit.Router", {
            fastest: "route A",
            cheapest: "route B",
            fewest_transfers: "route C",
          }),
        },
      },
      {
        title: "One graph, many rider modes",
        lines: [2],
        explanation: "The same graph can serve commuter, tourist, and accessibility-first experiences by swapping the ranking policy.",
        snapshot: {
          tasks: [
            task("collect", "collect candidate metrics", "done"),
            task("score", "score candidates", "done"),
            task("rank", "rank journeys", "done"),
          ],
          genserver: gs("ranker", "Transit.Router", {
            profile: "commuter",
            best_eta: 27,
            best_transfers: 1,
          }),
        },
      },
    ],
  },
  {
    id: "transport-real-time-route-recalculation",
    language: "elixir",
    topic: "Mapping",
    title: "Real-Time Route Recalculation",
    subtitle: "Replan journeys when delays invalidate the route the rider was already taking.",
    difficulty: "Advanced",
    code: `def handle_info({:delay, route_id, minutes}, state) do
  state
  |> mark_impacted_itineraries(route_id)
  |> replan_if_needed()
end`,
    panels: ["genserver", "mailbox", "tasks"],
    resources: [docs.genserver, docs.pubsub, docs.digraph],
    steps: [
      {
        title: "A rider has an active itinerary",
        lines: [1],
        explanation: "Once a user is in motion, route planning becomes a stateful session, not a one-shot query.",
        snapshot: {
          tasks: [
            task("track", "track active itinerary", "running"),
            task("invalidate", "check impacted legs", "pending"),
            task("replan", "compute new route", "pending"),
          ],
          genserver: gs("planner", "TripSession", {
            itinerary: "R1 -> M2",
            rider_at: "Central",
            active: true,
          }),
        },
      },
      {
        title: "Delay invalidates the old plan",
        lines: [2],
        explanation: "A delay event can make the planned transfer impossible or suboptimal. The session must notice that immediately.",
        snapshot: {
          messages: [
            msg("re1", "delay-coordinator", "planner", "{:delay, :R1, 10}", "in-mailbox"),
          ],
          tasks: [
            task("track", "track active itinerary", "done"),
            task("invalidate", "check impacted legs", "running"),
            task("replan", "compute new route", "pending"),
          ],
          genserver: gs("planner", "TripSession", {
            itinerary: "R1 -> M2",
            transfer_missed: true,
            impacted: true,
          }),
        },
      },
      {
        title: "Planner returns a revised journey",
        lines: [3],
        explanation: "Realtime planners need to optimize from the rider's current position, not from the original trip start.",
        snapshot: {
          tasks: [
            task("track", "track active itinerary", "done"),
            task("invalidate", "check impacted legs", "done"),
            task("replan", "compute new route", "done"),
          ],
          genserver: gs("planner", "TripSession", {
            itinerary: "Walk -> R3",
            rider_at: "Central",
            replanned: true,
          }, { lastReply: "new ETA 18 min" }),
        },
      },
    ],
  },
];

const transportReliabilityLessons: Lesson[] = [
  {
    id: "transport-live-tracking-process-dies",
    language: "elixir",
    topic: "Reliability",
    title: "What Happens When a Live Tracking Process Dies",
    subtitle: "Follow supervision recovery when the process feeding vehicle positions crashes.",
    difficulty: "Advanced",
    code: `def handle_info({:tcp_closed, _socket}, state) do
  {:stop, :feed_closed, state}
end`,
    panels: ["processes", "mailbox"],
    resources: [docs.supervisor, docs.genserver, docs.channels],
    steps: [
      {
        title: "Tracker runs normally",
        lines: [1],
        explanation: "A live tracker owns a socket or provider connection and continually pushes position updates inward.",
        snapshot: {
          processes: [
            proc("sup", "TrackerSupervisor", "running", "supervisor"),
            proc("tracker", "VehicleTracker red-21", "running", "worker", { parent: "sup" }),
          ],
        },
      },
      {
        title: "Connection closes and process exits",
        lines: [1, 2],
        explanation: "The tracker decides it cannot continue and exits. That is a clean failure signal, not a silent stall.",
        snapshot: {
          processes: [
            proc("sup", "TrackerSupervisor", "running", "supervisor"),
            proc("tracker", "VehicleTracker red-21", "crashed", "worker", { parent: "sup" }),
          ],
          messages: [
            msg("die1", "tracker", "sup", "{:EXIT, :feed_closed}", "in-mailbox"),
          ],
        },
      },
      {
        title: "Supervisor restores the feed",
        lines: [2],
        explanation: "The BEAM advantage is operational recovery: the parent sees the exit and starts a fresh worker automatically.",
        snapshot: {
          processes: [
            proc("sup", "TrackerSupervisor", "running", "supervisor"),
            proc("tracker2", "VehicleTracker red-21 (restart)", "running", "worker", { parent: "sup" }),
          ],
        },
      },
    ],
  },
  {
    id: "transport-partial-system-outages",
    language: "elixir",
    topic: "Reliability",
    title: "Handling Partial System Outages",
    subtitle: "One transport provider can fail while the rest of the system keeps serving degraded but useful results.",
    difficulty: "Advanced",
    code: `case provider_status(:metro) do
  :down -> RoutePlanner.plan_without(:metro)
  :ok -> RoutePlanner.plan_all_modes()
end`,
    panels: ["processes", "genserver", "mailbox"],
    resources: [docs.distributedApps, docs.contexts, docs.telemetry],
    steps: [
      {
        title: "Multiple providers feed the system",
        lines: [1],
        explanation: "A multimodal app often depends on bus, metro, and rail data from different upstreams.",
        snapshot: {
          processes: [
            proc("bus", "bus provider", "running", "worker"),
            proc("metro", "metro provider", "running", "worker"),
            proc("planner", "RoutePlanner", "running", "genserver"),
          ],
          genserver: gs("planner", "RoutePlanner", {
            modes: 3,
            healthy_providers: 3,
            degraded: false,
          }),
        },
      },
      {
        title: "One provider goes dark",
        lines: [2],
        explanation: "The system should detect the outage and mark metro data unavailable instead of poisoning every response.",
        snapshot: {
          processes: [
            proc("bus", "bus provider", "running", "worker"),
            proc("metro", "metro provider", "crashed", "worker"),
            proc("planner", "RoutePlanner", "running", "genserver"),
          ],
          messages: [
            msg("out1", "metro", "planner", "{:provider_down, :metro}", "in-mailbox"),
          ],
          genserver: gs("planner", "RoutePlanner", {
            healthy_providers: 2,
            degraded: true,
            unavailable_mode: "metro",
          }),
        },
      },
      {
        title: "Serve a reduced answer",
        lines: [2, 3],
        explanation: "The correct answer is often a degraded route, not a blank screen. Reliability includes partial usefulness.",
        snapshot: {
          processes: [
            proc("bus", "bus provider", "running", "worker"),
            proc("planner", "RoutePlanner", "running", "genserver"),
          ],
          genserver: gs("planner", "RoutePlanner", {
            healthy_providers: 2,
            route_policy: "exclude metro",
            degraded: true,
          }, { lastReply: "bus-only itinerary" }),
        },
      },
    ],
  },
  {
    id: "transport-eventual-consistency-data",
    language: "elixir",
    topic: "Reliability",
    title: "Eventual Consistency in Transport Data",
    subtitle: "Different parts of the system may learn about the same delay at different times.",
    difficulty: "Advanced",
    code: `send(route_live, {:delay, :red, 5})
send(station_live, {:delay, :red, 5})`,
    panels: ["processes", "mailbox", "genserver"],
    resources: [docs.pubsub, docs.distributed, docs.telemetry],
    steps: [
      {
        title: "One event targets many readers",
        lines: [1, 2],
        explanation: "A single delay update must reach boards, planner sessions, and route maps, but not all consumers observe it simultaneously.",
        snapshot: {
          processes: [
            proc("source", "delay source", "running", "worker"),
            proc("route-live", "RouteLive red", "waiting", "genserver"),
            proc("station-live", "StationLive central", "waiting", "genserver"),
          ],
          messages: [
            msg("ec1", "source", "route-live", "{:delay, :red, 5}", "in-flight"),
            msg("ec2", "source", "station-live", "{:delay, :red, 5}", "in-flight"),
          ],
        },
      },
      {
        title: "One consumer updates first",
        lines: [1],
        explanation: "The route page may render the new ETA before the station board has even dequeued the message.",
        snapshot: {
          processes: [
            proc("route-live", "RouteLive red", "running", "genserver"),
            proc("station-live", "StationLive central", "ready", "genserver"),
          ],
          messages: [
            msg("ec1", "source", "route-live", "{:delay, :red, 5}", "consumed"),
            msg("ec2", "source", "station-live", "{:delay, :red, 5}", "in-mailbox"),
          ],
          genserver: gs("route-live", "RouteLive", {
            route: "red",
            delay_min: 5,
            rendered: true,
          }),
        },
      },
      {
        title: "System converges over time",
        lines: [2],
        explanation: "Eventual consistency means different views can be briefly out of sync as long as they converge quickly and observably.",
        snapshot: {
          processes: [
            proc("route-live", "RouteLive red", "running", "genserver"),
            proc("station-live", "StationLive central", "running", "genserver"),
          ],
          genserver: gs("route-live", "RouteLive", {
            route: "red",
            delay_min: 5,
            converged: true,
          }),
        },
      },
    ],
  },
  {
    id: "transport-graceful-degradation-routes",
    language: "elixir",
    topic: "Reliability",
    title: "Graceful Degradation of Routes",
    subtitle: "Return fallback paths when some live data is missing instead of failing completely.",
    difficulty: "Advanced",
    code: `if live_data_available?(route) do
  plan_live(route)
else
  plan_from_static_timetable(route)
end`,
    panels: ["genserver", "tasks", "processes"],
    resources: [docs.contexts, docs.ectoStart, docs.telemetry],
    steps: [
      {
        title: "Live data is the preferred path",
        lines: [1, 2],
        explanation: "When live positions and delays are available, the planner can return a route grounded in present conditions.",
        snapshot: {
          processes: [
            proc("planner", "RoutePlanner", "running", "genserver"),
          ],
          tasks: [
            task("live", "plan from live data", "running"),
            task("fallback", "static timetable fallback", "pending"),
            task("respond", "respond to rider", "pending"),
          ],
          genserver: gs("planner", "RoutePlanner", {
            live_data: true,
            static_timetable: true,
            mode: "live",
          }),
        },
      },
      {
        title: "Live feed disappears",
        lines: [3, 4],
        explanation: "A missing feed should trigger a controlled downgrade path, not a full planning outage.",
        snapshot: {
          processes: [
            proc("planner", "RoutePlanner", "running", "genserver"),
          ],
          tasks: [
            task("live", "plan from live data", "done"),
            task("fallback", "static timetable fallback", "running"),
            task("respond", "respond to rider", "pending"),
          ],
          genserver: gs("planner", "RoutePlanner", {
            live_data: false,
            static_timetable: true,
            mode: "fallback",
          }),
        },
      },
      {
        title: "Serve the best available answer",
        lines: [4],
        explanation: "Graceful degradation keeps the rider moving: maybe less precise, but still useful, explicit, and fast.",
        snapshot: {
          processes: [
            proc("planner", "RoutePlanner", "running", "genserver"),
          ],
          tasks: [
            task("live", "plan from live data", "done"),
            task("fallback", "static timetable fallback", "done"),
            task("respond", "respond to rider", "done"),
          ],
          genserver: gs("planner", "RoutePlanner", {
            result: "static ETA",
            precision: "degraded",
            rider_visible_notice: true,
          }, { lastReply: "fallback route returned" }),
        },
      },
    ],
  },
];

export const phoenixTransportLessons: Lesson[] = [
  ...phoenixCoreLessons,
  ...phoenixRealtimeLessons,
  ...transportSystemLessons,
  ...transportConcurrencyLessons,
  ...transportIntegrationLessons,
  ...transportRoutingLessons,
  ...transportReliabilityLessons,
];

# KINORA — The Complete Picture

> **Read this file first.** It consolidates everything you need to know about Kinora — the project, the architecture, the models, the tracks, the build plan, and the key decisions — in one place. Links to detailed docs at the bottom of each section.

---

## 1. What Is Kinora

Kinora turns any book or PDF into a **watchable, page-synced film that generates itself a few seconds ahead of wherever you're reading** — produced by a crew of AI agents whose shared memory keeps a feature-length adaptation visually consistent, managed by a production autopilot that handles errors, budgets, and quality gates autonomously with human-in-the-loop checkpoints at critical decisions.

The book stays on screen. As the film plays, a narrator reads the text aloud, the exact words being spoken highlight in sync (karaoke-style), and the page turns itself to follow the playhead. You can watch, read along, or both.

**Target users:**
- **Reluctant readers / ADHD** — the video pulls you forward; synced text keeps you reading words
- **Dyslexia** — simultaneous audio + highlighted text is an evidence-based decoding aid
- **Language learners** — watch the scene, hear the line, see the word, at reading pace
- **Manga / webtoon / indie authors** — instant animated adaptations of static panels

📄 **Details:** [`docs/PROJECT_OVERVIEW.md`](./docs/PROJECT_OVERVIEW.md) · [`docs/notes/what-is-kinora.md`](./docs/notes/what-is-kinora.md)

---

## 2. Hackathon Context

| | |
|---|---|
| **Hackathon** | Global AI Hackathon Series with Qwen Cloud |
| **Tracks** | T1 MemoryAgent · T2 AI Showrunner · T3 Agent Society · T4 Autopilot Agent · T5 EdgeAgent |
| **Our coverage** | **Primary: T2** · Secondary: T1, T3, T4 (not T5) |
| **Deadline** | Jul 9, 2026 · 2:00pm PDT |
| **Judging** | Jul 10 – Jul 31, 2026 |
| **Winners** | ~Aug 7, 2026 |
| **Prize** | $7K cash + $3K credits per track · $500 + $500 for blog/honorable mention |
| **Deployment** | Alibaba Cloud (mandatory) — ECS / Function Compute · OSS · DashScope |
| **API credits** | $40 Qwen Cloud voucher |
| **Free tier** | ~1,650 video-seconds + ~70M tokens, 90 days, Singapore endpoint |
| **API base** | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` (Singapore) |

**Submission requirements:**
- Public open-source repo with LICENSE visible in About
- Proof of Alibaba Cloud deployment (recording + code file link)
- Architecture diagram
- ~3-minute demo video (public on YouTube/Vimeo)
- Text description of features + functionality
- Track identified: Track 2 — AI Showrunner

📄 **Details:** [`docs/HACKATHON_REQUIREMENTS.md`](./docs/HACKATHON_REQUIREMENTS.md) · [`docs/reference/rules.md`](./docs/reference/rules.md)

---

## 3. The Three Core Ideas

### Thesis A — Consistency is a memory problem, not a model problem

A persistent, versioned **story canon** — what each character looks like, sounds like, where they are, and what has already happened — conditions every generated clip on the *relevant slice* of that truth. Continuity stops being a dice roll and becomes an emergent property of retrieval.

### Thesis B — The film is a function of attention

A 300-page book is ~25 minutes of video and would be insane to pre-render. Kinora never renders a film. It renders the **next few seconds**, just ahead of your eyes, spending its scarce video budget only on pages a human is actually arriving at, and **caching every accepted shot** so a re-read costs nothing.

### Thesis C — The pipeline is a production workflow, not a demo

A **production autopilot** manages the entire pipeline — automated quality gates at each stage, error remediation with strategy tables, real-time budget optimization with impact-ranked spending, and meaningful human-in-the-loop checkpoints that escalate only when judgment is genuinely needed.

These three reframes let one architecture win T2 (showrunner), satisfy T1 (memory), require T3 (the crew), and demonstrate T4 (the autopilot).

---

## 4. How It Works

### Generation-on-scroll

| Zone | ETA window | What exists | Video budget |
|---|---|---|---|
| **Committed** | 0 – ~45s | Full video, QA-passed, narrated, cached | **Spends video-seconds** |
| **Speculative** | ~45 – ~240s | One keyframe still per beat (image-gen) | **~zero** |
| **Cold** | > 240s | Plan + canon only | Free |

A **dual-watermark buffer with hysteresis** (L=25-40s, H=75s) makes generation bursty and event-driven — it fills to the high mark, then goes idle until the buffer drains.

### The crew (7 agents)

| Agent | Job | Model | Track |
|---|---|---|---|
| **Showrunner** | Plans production, decomposes book, arbitrates conflicts | `qwen3.6-plus` | T2, T3 |
| **Adapter** | PDF → screenplay → shot list | `qwen3.5-plus` | T2 |
| **Continuity Supervisor** | Owns canon writes, flags inconsistencies, versioning | `qwen3.6-plus` | T1, T3 |
| **Cinematographer** | Shot design: keyframe, camera, refs, Wan mode | `qwen3.6-plus` (vision) | T2 |
| **Generator** | Renders clip + narration | `wan2.7-i2v` / `wan2.7-t2v` + `cosyvoice-v3-plus` | T2 |
| **Critic / QA** | Scores clips against canon, decides pass/fix/regen | `qwen3.6-plus` (vision) | T2, T3 |
| **Production Manager** | Autopilot: quality gates, budget, remediation, HITL | `qwen3.6-flash` + `qwen3.6-plus` | **T4** |

### The memory layer

- **Canon graph** (versioned) — characters, locations, props, style, timeline
- **Episodic vector store** (FAISS + `text-embedding-v4`) — every shot + QA scores
- **Shot cache** (content-hash keyed, OSS) — free re-reads
- **Preference store** — Director edits as preference signals
- **MCP server** (FastAPI + SSE) — all agents read/write through one interface

### The production autopilot (Track 4)

- **Intake & triage** — classify PDF, safety scan, cost estimate, budget allocation
- **Quality gates** — stage-level checks with auto-proceed/remediate/escalate
- **Budget optimizer** — impact-ranked spending, real-time reallocation
- **Remediation engine** — strategy table per failure type, automated recovery
- **HITL orchestrator** — context-rich checkpoints, async resume, decision logging
- **Reporting & audit** — cost breakdown, quality metrics, audit trail

📄 **Details:** [`docs/TECHNICAL_SPEC.md`](./docs/TECHNICAL_SPEC.md) · [`docs/PRODUCTION_ARCHITECTURE.md`](./docs/PRODUCTION_ARCHITECTURE.md)

---

## 5. Model Stack (Verified June 2026 — All Alibaba Cloud)

### ⚠️ Critical: Model names have changed since the original design doc

The original `kinora.md` used wrong model names. The actual API names are different and the lineup has been updated. **See [`docs/ALIBABA_CLOUD_MODELS.md`](./docs/ALIBABA_CLOUD_MODELS.md) for the complete verified catalog.**

### Key changes:

| Old (Wrong) | New (Correct) | Why |
|---|---|---|
| `qwen3-max` | `qwen3.6-plus` or `qwen3.6-max-preview` | qwen3-max is now LEGACY |
| `qwen3-vl-plus` | `qwen3.6-plus` (vision is built-in now!) | No need for separate VL model |
| `qwen3.5-flash` | `qwen3.6-flash` or `qwen3.5-flash` | Both still work |
| `cosyvoice-v3.5-plus` | `cosyvoice-v3-plus` | **v3.5 is Beijing only, NOT Singapore!** |
| "Wan 2.7" | `wan2.7-i2v` / `wan2.7-t2v` | Specific model IDs needed |

### Complete model stack:

| Component | Model | Region |
|---|---|---|
| Showrunner, Continuity, Cinematographer, Critic | `qwen3.6-plus` | ✅ Singapore |
| Adapter | `qwen3.5-plus` | ✅ Singapore |
| Production Manager (routing) | `qwen3.6-flash` | ✅ Singapore |
| Production Manager (complex) | `qwen3.6-plus` | ✅ Singapore |
| Video generation (primary) | `wan2.7-i2v` | ✅ Singapore |
| Video generation (text-to-video) | `wan2.7-t2v` | ✅ Singapore |
| Video generation (alt) | `happyhorse-1.0-i2v` | ✅ Singapore |
| Narration / TTS | `cosyvoice-v3-plus` | ✅ Singapore |
| Keyframe / reference images | `wan2.7-image-pro` | ✅ Singapore |
| Text embeddings (episodic store) | `text-embedding-v4` | ✅ Singapore |
| Multimodal embeddings (CCS) | `tongyi-embedding-vision-plus` | ✅ Singapore |
| Reranking | `qwen3-rerank` | ✅ Singapore |
| OCR / PDF analysis | `qwen3.6-plus` (vision built-in) | ✅ Singapore |

**All models are from Alibaba Cloud / DashScope. No third-party models. No external APIs.**

📄 **Details:** [`docs/ALIBABA_CLOUD_MODELS.md`](./docs/ALIBABA_CLOUD_MODELS.md)

---

## 6. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Modern, fast, large ecosystem |
| **UI styling** | TailwindCSS + shadcn/ui + Lucide | Beautiful, accessible, fast to build |
| **Animations** | Framer Motion | Smooth transitions, buffer indicators |
| **Backend** | Python + FastAPI | DashScope SDK is Python-first, async support |
| **MCP server** | FastAPI + SSE protocol | Custom server exposing canon tools |
| **Canon graph** | SQLite (MVP) / PostgreSQL (prod) | Versioned, with JSON columns |
| **Vector store** | FAISS (local) / OpenSearch (Alibaba Cloud) | Episodic memory |
| **Shot cache** | Alibaba Cloud OSS | Content-hash keyed, permanent |
| **Render queue** | Alibaba Cloud MNS or Redis + RQ | Persistent, cancellable, DLQ |
| **Session state** | Redis | Multi-session, ephemeral |
| **Video stitching** | ffmpeg (ffmpeg-python) | Shot concatenation, audio normalization |
| **PDF processing** | PyMuPDF (fitz) | Text + image + bounding box extraction |
| **Real-time** | WebSocket (FastAPI native) | Bidirectional, Director mode needs it |
| **Deployment** | Alibaba Cloud ECS / Function Compute | Mandatory for hackathon |

📄 **Details:** [`docs/TECH_STACK.md`](./docs/TECH_STACK.md)

---

## 7. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                           │
│  PDF Reader │ Video Stage │ Director Tools │ Production Dashboard│
└──────────────────────────────────────────────────────────────┘
      │                                    ▲
      ▼                                    │
┌──────────────────────────────────────────────────────────────┐
│                   CONTROL PLANE                              │
│  Scheduler (watermark buffer) │ Budget Optimizer │           │
│  PRODUCTION AUTOPILOT (T4): Quality Gates, Remediation,      │
│  HITL Orchestrator, Reporting                                │
└──────────────────────────────────────────────────────────────┘
      │                                    │
      ▼                                    ▼
┌──────────────────────────────────────────────────────────────┐
│              CREATIVE PLANE — 7 AGENTS (T2, T3)              │
│  Showrunner → Adapter → Continuity Supervisor                │
│  Cinematographer → Generator → Critic                        │
│  Production Manager (monitors all, runs gates)               │
└──────────────────────────────────────────────────────────────┘
      │ all agents read/write through:
      ▼
┌──────────────────────────────────────────────────────────────┐
│              MEMORY LAYER — MCP CANON SERVER (T1)            │
│  Canon Graph (versioned) │ Episodic Store │ Shot Cache │     │
│  Preference Store                                            │
└──────────────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│              ALIBABA CLOUD INFRASTRUCTURE                     │
│  DashScope (qwen3.6-plus, wan2.7, cosyvoice) │ OSS │ MNS │  │
│  ECS / Function Compute │ FAISS / OpenSearch │ Redis         │
└──────────────────────────────────────────────────────────────┘
```

📄 **Details:** [`docs/TECHNICAL_SPEC.md`](./docs/TECHNICAL_SPEC.md) · [`docs/PRODUCTION_ARCHITECTURE.md`](./docs/PRODUCTION_ARCHITECTURE.md)

---

## 8. Track Coverage

| Track | Name | How Kinora Covers It |
|---|---|---|
| **T1** | MemoryAgent | Versioned canon graph, episodic store, forgetting, preference learning, MCP server |
| **T2** | AI Showrunner | Full short drama pipeline: PDF → screenplay → video → narration → stitch |
| **T3** | Agent Society | 7 agents, typed JSON contracts, negotiation protocol, conflict resolution, live agent feed |
| **T4** | Autopilot Agent | Production Manager: quality gates, remediation engine, budget optimizer, HITL checkpoints, audit trail |
| T5 | EdgeAgent | Not applicable |

**The tracks are emergent properties of one architecture, not bolted-together features.**

📄 **Details:** [`docs/PRODUCTION_ARCHITECTURE.md`](./docs/PRODUCTION_ARCHITECTURE.md)

---

## 9. What Makes It Production-Grade (Not a Toy)

- **Real error recovery** — Every failure has a specific strategy table, not generic retry
- **Budget optimization** — Impact-ranked spending, real-time reallocation, cost-benefit for edits
- **Meaningful HITL** — Context-rich escalation cards with options and costs, not "click OK"
- **Content safety** — Pre-scan, prompt sanitization, rejection learning
- **Multi-session** — Concurrent users with isolated state, shared cache
- **Persistence** — Data survives restarts (SQLite + OSS + FAISS on disk)
- **Clean API** — REST + WebSocket, not just a UI (platform, not app)
- **Self-improving** — Episodic memory + preference learning across sessions
- **Audit trail** — Every automated decision logged with reasoning

📄 **Details:** [`docs/PRODUCTION_ARCHITECTURE.md`](./docs/PRODUCTION_ARCHITECTURE.md) · [`docs/IMPROVEMENTS_AND_SUGGESTIONS.md`](./docs/IMPROVEMENTS_AND_SUGGESTIONS.md)

---

## 10. Build Plan (18 Days)

| Phase | Days | Focus | Deliverable |
|---|---|---|---|
| **Foundation** | 1–4 | Setup, PDF rendering, SyncEngine, Phase A ingest | Two-pane workspace, canon populated |
| **Memory + Agents** | 5–9 | MCP server, 7 agents, episodic store, budget optimizer | Full agent pipeline on demo book |
| **Generation** | 10–14 | Scheduler, render queue, remediation engine, stitching | Generation-on-scroll working |
| **Director + Polish** | 15–17 | Director mode, HITL, production dashboard, demo prep | All 4 tracks demo-ready |
| **Submit** | 18 | Demo video, deployment proof, Devpost | Submitted |

### Demo script (3 min):

| Time | Track | What to show |
|---|---|---|
| 0:00–0:25 | T2 | Viewer mode: video generating as you read, karaoke highlight |
| 0:25–1:10 | T2 | Generation-on-scroll: buffer filling, Ken-Burns bridge on fast scroll |
| 1:10–1:50 | T1, T2 | Director mode: "make coat crimson" → canon update → surgical re-render + cost display |
| 1:50–2:15 | T3 | Agent negotiation: continuity conflict → Showrunner arbitration → live in feed |
| 2:15–2:40 | T4 | Autopilot: quality gate catches bad shot → remediation auto-recovers → HITL budget override |
| 2:40–3:00 | T1-4 | Metrics: CCS chart, buffer sawtooth, production report. "Any book, any reader." |

📄 **Details:** [`docs/BUILD_ROADMAP.md`](./docs/BUILD_ROADMAP.md)

---

## 11. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Not enough time (18 days, 0 code) | Ship MVP loop only. Cut stretch features. |
| DashScope latency (1-5 min per video) | Pre-render demo. Increase L to 40s. |
| CosyVoice timestamps imprecise | Fall back to sentence-level highlighting. |
| CCS threshold (0.85) is arbitrary | Calibrate early with 10 test clips. |
| MCP server too complex | Fall back to function calling (Plan B). |
| `cosyvoice-v3.5-plus` not in Singapore | Use `cosyvoice-v3-plus` (has timestamps + cloning). |
| Demo fails live | Pre-cache everything. Cached-only fallback. |
| Budget runs out | Pre-render demo. Batch API. Image-only speculation. |
| `qwen3-max` is legacy | Use `qwen3.6-plus` (better: 1M context, built-in tools). |

📄 **Details:** [`docs/IMPROVEMENTS_AND_SUGGESTIONS.md`](./docs/IMPROVEMENTS_AND_SUGGESTIONS.md)

---

## 12. File Organization

```
QwenCloudHackathon/
├── README.md                            # Project front door
├── KINORA_COMPLETE_GUIDE.md            ← YOU ARE HERE — read this first
├── docs/
│   ├── PROJECT_OVERVIEW.md              # Executive summary
│   ├── TECHNICAL_SPEC.md                # Full technical architecture
│   ├── ALIBABA_CLOUD_MODELS.md          # Complete verified model catalog
│   ├── PRODUCTION_ARCHITECTURE.md       # Multi-track T1-T4 strategy & autopilot
│   ├── TECH_STACK.md                    # Framework & language recommendations
│   ├── HACKATHON_REQUIREMENTS.md        # Submission checklist & rules
│   ├── IMPROVEMENTS_AND_SUGGESTIONS.md  # Gaps, risks, improvements
│   ├── BUILD_ROADMAP.md                 # 18-day build plan
│   ├── notes/
│   │   ├── what-is-kinora.md            # Plain-English explainer
│   │   └── transcriptSaidFromTeammate.md  # Teammate's original brainstorm
│   └── reference/
│       ├── kinora_original_design.md    # Original full technical design (1,030 lines)
│       ├── kinora.md.pdf                # PDF version of design
│       ├── Qwen Cloud AI Showrunner...PDF  # Original project plan
│       ├── HackathonBackground.md       # Hackathon description & tracks
│       └── rules.md                     # Full official rules (418 lines)
├── frontend/                            # React + Tailwind frontend (to build)
└── backend/                             # Python FastAPI backend (to build)
```

### Reading order:

1. **`KINORA_COMPLETE_GUIDE.md`** (this file) — everything in one place
2. **`docs/ALIBABA_CLOUD_MODELS.md`** — verified model names (critical before coding)
3. **`docs/TECHNICAL_SPEC.md`** — full architecture details
4. **`docs/PRODUCTION_ARCHITECTURE.md`** — how T4 autopilot integrates
5. **`docs/BUILD_ROADMAP.md`** — day-by-day plan
6. **`docs/IMPROVEMENTS_AND_SUGGESTIONS.md`** — what to watch out for

---

## 13. Top 10 Priority Actions

1. **Fix all model names** — use `qwen3.6-plus`, not `qwen3-max`. See [`docs/ALIBABA_CLOUD_MODELS.md`](./docs/ALIBABA_CLOUD_MODELS.md)
2. **Add LICENSE file** (MIT) — required for submission
3. **Pick the demo book** — short, public-domain, 2-3 characters (e.g., "The Snow Queen")
4. **Build the MCP server** — it's the Technical Depth differentiator for T1
5. **Move agent activity feed to MVP** — it's the T3 visual proof
6. **Pre-render demo content** — don't rely on live generation during demo
7. **Test `cosyvoice-v3-plus` word timestamps early** — karaoke feature depends on them
8. **Add `ffmpeg` to the stack** — needed for video stitching
9. **Create `.env.example`** — so the team can set up quickly
10. **Start coding immediately** — 18 days is tight with zero code written

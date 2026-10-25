# Fire Clan Rising

A real-time strategy browser game where ninjas fight dragons, built by Andy together with his son Benjamin. Ninjas win by stealing the Dragon King Egg; dragons win when the egg hatches or by destroying the ninjas' Main Fortress.

## Key documents

1. [docs/game-design.md](docs/game-design.md) – the game design: story, factions, economy, map, balance principles.
2. [docs/roadmap.md](docs/roadmap.md) – version scope and milestone overview, linking to GitHub.
3. [CREDITS.md](CREDITS.md) – sources and licenses for all third-party assets and libraries. Update it whenever an asset or shipped library is added.
4. [docs/assets.md](docs/assets.md) – asset inventory, known gaps and the intake procedure (approval, safety checks, conversion, credits). Follow it for every new model, font or sound.
5. [docs/testing.md](docs/testing.md) – how Andy tests a pull request.

## Sessions – one session = one issue

1. **Each Claude session works on exactly one issue.** Andy starts a session by naming the issue (e.g. "work on #3").
2. **Start of a session:** read this file, then the issue body and **all** its comments, then the docs the issue links to. The issue is the spec; do not rely on memory of earlier sessions.
3. **Plan first:** present a short plan in Swedish and get Andy's approval before writing code (milestone-sized issues are first broken down into smaller issues, one per session).
4. **Log decisions on the issue** as they are made (comment, and update the issue body's *Decisions* section if it changes the spec). Anything a future session would need to know belongs on the issue, not only in the chat.
5. **Stay in scope.** Work that belongs to another issue goes there (as a comment), and new work becomes a new issue on the board.
6. **End of a session:** the PR is open with a preview link, the issue checklist and comments are up to date, and the Status is **Testing** – or, if the session stops early, a comment on the issue says exactly where the work stands and what is left.

## Tech stack and commands

1. TypeScript + [Three.js](https://threejs.org/) + [Vite](https://vite.dev/).
2. `npm run dev` – start the dev server on http://localhost:5173.
3. `npm run typecheck` – type check without building.
4. `npm run build` – type check and production build.

## Code conventions

1. Indentation with tabs.
2. Code, comments and documentation in English. Conversation with Andy in Swedish.
3. Source layout: `src/game` (game loop, state), `src/render` (scene, camera), `src/world` (terrain, map, pathfinding), `src/units`, `src/input`, `src/utils`.
4. All 3D models are CC0 and loaded through the asset registry, never referenced directly by game code.

## Work tracking – GitHub is the source of truth

All work is tracked in GitHub issues and the project board. The board is the single source of truth for what is planned, in progress and done. Local files never hold task state.

1. **Board:** [Fire Clan Rising project](https://github.com/users/andyjohansson/projects/1) (columns: Todo, In Progress, Testing, Done)
2. **Milestones:** [github.com/andyjohansson/fire-clan-rising/milestones](https://github.com/andyjohansson/fire-clan-rising/milestones) – one per roadmap step.
3. **Repository:** `andyjohansson/fire-clan-rising`

### Rules

1. **No work without an issue.** Before changing code or docs, make sure there is an issue for the work, added to the board and linked to a milestone when one fits. If none exists, create it (and ask Andy first if the work is not already agreed).
2. **Read before starting.** Read the issue body and comments first; they are the spec and the record of decisions.
3. **Move the card when starting.** Set the issue's Status to **In Progress** as soon as work begins. Only the issues actually being worked on should be In Progress.
4. **Keep the issue updated while working.**
	1. Tick the checklist items in the issue body as they are completed.
	2. Add a comment for important decisions, changes of plan, blockers, and what was verified.
	3. New work discovered along the way becomes a new issue (on the board, with a milestone), not an unrecorded side task.
5. **Reference the issue in every commit**, e.g. `Add asset registry (#1)`. The pull request description uses `Closes #1`, so the issue closes when the PR is merged.
6. **Finish properly.** When the work is done: all checklist items ticked and a short comment summarising what was done and how it was verified. When the PR is opened, set the Status to **Testing**. When the PR is merged, the issue closes and its Status is set to **Done**. If Andy finds a problem, move it back to **In Progress** while fixing.
7. **Keep docs in sync.** When a milestone is completed, update [docs/roadmap.md](docs/roadmap.md). When design decisions change, update [docs/game-design.md](docs/game-design.md) in the same piece of work.
8. **Ask before pushing** to the remote.

## Branches and pull requests

### Branch model

```
main  ← releases, only updated by merging dev
 └ dev  ← integration branch (default branch on GitHub)
    └ feature/issue-<number>-<slug>  ← one branch per issue, e.g. feature/issue-1-asset-registry
    └ fix/issue-<number>-<slug>      ← for bug fixes
```

### Rules

1. **Never commit directly to `main` or `dev`.** Every issue gets its own branch, created from the latest `dev`.
2. **One issue per branch, one branch per pull request.** If the work grows, split it into a new issue and branch.
3. **Pull requests:** feature/fix branch → `dev`; `dev` → `main` when a milestone is completed. Fill in the PR template. The **How to test** section must give Andy numbered, step-by-step instructions with the expected result of each step – concrete enough to follow without knowing the code. The general routine is in [docs/testing.md](docs/testing.md).
4. **Andy approves, Claude merges.** Andy tests and gives his verdict in the chat. Nothing on GitHub enforces this, so Claude checks it before every merge:
	1. Andy has explicitly approved **that specific PR** in the chat (e.g. "looks good, merge it"). Approval of another PR, a general "go ahead", or a passing build does not count. If in doubt, ask.
	2. Claude comments on the PR, e.g. `Approved by Andy in chat.`, so the approval is on record.
	3. Claude waits for all required checks to pass, then merges.
	4. Never merge without step 1.
5. **Make testing effortless for Andy.** When a PR is ready, Claude prepares everything so Andy only has to look and click:
	1. Wait for the `preview` check and give Andy the **preview link** (`https://andyjohansson.github.io/fire-clan-rising/pr-preview/pr-<number>/`).
	2. Also switch the local checkout to the PR branch (with `npm install` if dependencies changed) and make sure the dev server is running, as a fallback.
	3. Give Andy a short checklist in Swedish in the chat: what to look at and what should happen – a few lines, no commands to type.
	4. After merging, switch the local checkout back to `dev`, pull, and set the issue's Status to **Done** on the board.
6. **Merge methods:** "Squash and merge" for feature/fix → `dev`; "Create a merge commit" for `dev` → `main`.
7. **Keep branches current:** before opening a PR, update the branch with the latest `dev`.

### Previews and deployment

1. Every PR is built and published as a preview on GitHub Pages ([preview.yml](.github/workflows/preview.yml)); the link is posted on the PR and the preview is removed when the PR closes.
2. Every push to `dev` is published at [andyjohansson.github.io/fire-clan-rising](https://andyjohansson.github.io/fire-clan-rising/) ([deploy-dev.yml](.github/workflows/deploy-dev.yml)).
3. Vite uses a relative `base`, so the same build works at any URL. Reference files in `public/` with `import.meta.env.BASE_URL`, never a hard-coded `/`.

### Enforced on GitHub

1. Rulesets protect `main` and `dev`: changes only through pull requests, no force pushes, no deletion.
2. Required checks before merging:
	1. `build` – typecheck and production build ([ci.yml](.github/workflows/ci.yml)).
	2. `branch-policy` – PRs into `main` must come from `dev`; PRs into `dev` must come from `feature/issue-…` or `fix/issue-…` ([pr-policy.yml](.github/workflows/pr-policy.yml)).
3. Andy's test approval is not a GitHub check; it is the merge rule in *Branches and pull requests* above.

### Board commands

Project and field IDs for `gh project item-edit`:

| Name | ID |
|------|----|
| Project | `PVT_kwHOAEvRM84BoogR` (number 1, owner `andyjohansson`) |
| Status field | `PVTSSF_lAHOAEvRM84BoogRzhnHrcw` |
| Todo | `f75ad846` |
| In Progress | `47fc9ee4` |
| Testing | `06a73d1b` |
| Done | `98236657` |

```bash
# Find the board item ID for an issue (here #1)
gh project item-list 1 --owner andyjohansson --format json --jq '.items[] | select(.content.number==1) | .id'

# Set its Status (here: In Progress)
gh project item-edit --project-id PVT_kwHOAEvRM84BoogR --id <ITEM_ID> --field-id PVTSSF_lAHOAEvRM84BoogRzhnHrcw --single-select-option-id 47fc9ee4

# Create a new issue and add it to the board
gh issue create -R andyjohansson/fire-clan-rising --title "..." --milestone "1b. Visuals and map" --body "..."
gh project item-add 1 --owner andyjohansson --url <ISSUE_URL>

# Comment on and close an issue
gh issue comment 1 -R andyjohansson/fire-clan-rising --body "..."
gh issue close 1 -R andyjohansson/fire-clan-rising --comment "..."
```

New issues added to the board get no Status by default; set it to Todo (or In Progress) right after adding.

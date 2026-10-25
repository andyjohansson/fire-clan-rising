# Testing a pull request

Every pull request is tested and approved by Andy before Claude merges it. Normally Claude gives you the preview link and a short checklist in the chat – this guide explains the details. Each PR also has a **How to test** section with the exact steps for that change.

## 1. Open the game

**The easy way – the preview link:** every pull request is built automatically and gets its own link, posted as a comment on the PR (and given to you by Claude in the chat), e.g.

`https://andyjohansson.github.io/fire-clan-rising/pr-preview/pr-25/`

Click it – nothing to install, and it also works on a phone or tablet (the controls still need a mouse). The preview updates with every new commit on the PR and is removed when the PR is closed.

**The latest dev version** is always at [andyjohansson.github.io/fire-clan-rising](https://andyjohansson.github.io/fire-clan-rising/) – a good bookmark for Benjamin.

## 2. Locally (fallback)

Only needed if the preview is not available. In the terminal, in the project folder:

```bash
git fetch
git switch <branch-name>
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173). The branch name is shown at the top of the PR.

## 3. Test

1. **Follow the PR's "How to test" steps** one by one.
2. **Quick check of the basics** (every game PR):
	1. The loading screen appears and the game starts.
	2. No red errors in the browser console (Chrome: `Cmd+Option+J`, Safari: `Cmd+Option+C`).
	3. The camera moves (WASD / arrows / screen edges) and zooms (mouse wheel).
	4. Ninjas can be selected (click or drag a box) and moved (right click).
	5. The game runs smoothly. To check the numbers, open the browser console and type `fcr.fps()` (see below).
3. **Let Benjamin try it** if the change is something he will notice.

PRs that only change GitHub settings or documentation are tested on GitHub instead – the PR says so.

### Developer commands

Typed in the browser console (Chrome: `Cmd+Option+J`, Safari: `Cmd+Option+C`) once the game has started. The game prints `Dev commands: fcr.help()` in the console as a reminder.

| Command | What it does |
|---------|--------------|
| `fcr.fps()` | Shows or hides the performance meter in the top-right corner: FPS (green ≥ 50, yellow 30–49, red < 30), frame time with the worst frame, draw calls and triangles. Off by default. |
| `fcr.help()` | Lists all developer commands. |

## 4. Approve or report

Give your verdict to Claude in the chat:

**Everything works:** say so (e.g. "looks good, merge it"). Claude then ticks **Tested** in the PR, waits for the checks to pass, merges, and the linked issue closes automatically.

**Something is wrong:** describe what you did, what happened, and what you expected – a screenshot helps. Claude fixes it on the same branch, and you test again.

## 5. After merging

The change is published to the dev site within a few minutes, and Claude switches your local copy back to the latest `dev`.

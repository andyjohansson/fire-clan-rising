# Testing a pull request

Every pull request is tested by Andy before it is merged. This guide explains how. Each PR also has a **How to test** section with the exact steps for that change.

## 1. Get the branch

In the terminal, in the project folder:

```bash
git fetch
git switch <branch-name>
```

The branch name is shown at the top of the PR, e.g. `feature/issue-1-asset-registry`.

If the PR changes `package.json` (new libraries), also run:

```bash
npm install
```

## 2. Start the game

If the dev server is not already running:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). If the server was already running, the page reloads by itself after `git switch` – otherwise refresh the browser.

## 3. Test

1. **Follow the PR's "How to test" steps** one by one.
2. **Quick check of the basics** (every game PR):
	1. The loading screen appears and the game starts.
	2. No red errors in the browser console (Chrome: `Cmd+Option+J`, Safari: `Cmd+Option+C`).
	3. The camera moves (WASD / arrows / screen edges) and zooms (mouse wheel).
	4. Ninjas can be selected (click or drag a box) and moved (right click).
	5. The game runs smoothly.
3. **Let Benjamin try it** if the change is something he will notice.

PRs that only change GitHub settings or documentation are tested on GitHub instead – the PR says so.

## 4. Approve or report

**Everything works:**

1. Open the PR on GitHub and tick **Tested by Andy** in the description (click the checkbox).
2. Wait a few seconds until the `tested-by-andy` check turns green.
3. Click **Squash and merge** (or **Create a merge commit** for `dev` → `main`) and confirm.
4. The linked issue closes automatically.

**Something is wrong:**

1. Do not tick the checkbox.
2. Write a comment on the PR: what you did, what happened, and what you expected. A screenshot helps.
3. Claude fixes it on the same branch, and you test again.

## 5. Back to dev

After merging, switch back to the latest `dev`:

```bash
git switch dev
git pull
```

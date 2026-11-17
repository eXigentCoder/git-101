# 07 · Stretch topics

**Goal:** a grab-bag of tools that make you faster once the basics are second nature. Do them in any
order. Each takes 5–10 minutes.

## Stash: park work in progress

You're halfway through a change when someone asks you to look at another branch.

1. Make an uncommitted change, e.g. add a term to [`site/data/glossary.json`](../site/data/glossary.json).
2. Stash it: **Stash** in Fork's toolbar, or `git stash push -m "half-done glossary term"`.
3. `git status` is clean. Switch branches, do other work, come back.
4. Bring it back: in Fork's sidebar open **Stashes**, right-click → **Apply** (or **Pop**, which also
   deletes the stash). CLI: `git stash pop`.

`git stash list` shows all stashes. `git stash -u` also stashes new, untracked files (by default they're
left behind).

## Cherry-pick: copy one commit

`practice/cherry-pick` has three commits: two experiments you **don't** want (a dark background and Comic
Sans 😬) and one you **do**, `Add "AI agent" to the glossary`.

1. `git switch main`
2. Look at the branch: `git log --oneline main..practice/cherry-pick`
3. Copy only the glossary commit:
   - **Fork:** click `practice/cherry-pick` in the sidebar, right-click the *AI agent* commit →
     **Cherry-pick**.
   - **CLI:** `git cherry-pick <sha>` (or `git cherry-pick practice/cherry-pick~1`; `~1` means "one
     commit before the tip").
4. Refresh the glossary. *AI agent* is there, and no Comic Sans.

The copied commit has a new ID on `main`. Cherry-picking is great for back-porting a fix to a release
branch; just don't use it as a substitute for merging whole branches.

## Bisect: find the commit that broke something

`practice/bisect` has eight harmless-looking commits. Somewhere among them, one broke the glossary (the
page shows an error instead of the terms, and `npm test` fails). Binary search finds it in about three steps instead of
eight.

> Fork doesn't have a bisect screen, so use the terminal (Git Bash or PowerShell on Windows).

1. Confirm the bug: `git switch practice/bisect`, run `npm test` (it fails), and look at the glossary
   page.
2. Start bisecting, telling Git a bad commit and a good one (where the branch started):

   ```sh
   git bisect start practice/bisect $(git merge-base main practice/bisect)
   ```

3. Git checks out a commit halfway between. Test it (`npm test`, or refresh the browser) and tell Git
   the result: `git bisect good` or `git bisect bad`. Repeat until Git prints
   **`<sha> is the first bad commit`**.
4. Watch Fork's graph while you do this. You'll see `HEAD` hopping around the branch.
5. Finish with `git bisect reset` to go back to where you were.

**Even better: automate it.** Because `npm test` exits non-zero when the site is broken:

```sh
git bisect start practice/bisect $(git merge-base main practice/bisect)
git bisect run npm test
git bisect reset
```

Then use `git show <sha>` to see the culprit. Can you spot the typo?

## Blame and file history: who changed this, and why?

- **Fork:** right-click a file (in the commit's file list or **File Tree**) → **Blame** or **File History**.
- **CLI:**

  ```sh
  git blame site/data/glossary.json                # last commit to touch each line
  git log --oneline --follow -- site/css/styles.css # every commit that changed a file
  git log -S "Hallucination" --oneline             # commits that added or removed a string
  ```

Blame isn't about blame. It's about finding the commit message (and pull request) that explains *why*
a line is the way it is.

## .gitignore: keep files out of Git

Some files should never be committed: dependencies (`node_modules/`), build output, logs, local config,
secrets.

1. Create a file you don't want to commit, e.g. `notes/scratch.local.md`. Write anything in it.
2. `git status`: it doesn't show up. Why? Run `git check-ignore -v notes/scratch.local.md`. The
   [`.gitignore`](../.gitignore) has a `*.local.*` rule.
3. Create `notes/todo.txt`. It *does* show up. Add `notes/*.txt` to `.gitignore` and check again. Commit
   the `.gitignore` change. Ignore rules are shared with the whole team.
4. Ignoring a file that's **already committed** doesn't untrack it. You'd need
   `git rm --cached <file>` first (it stays on your disk but leaves the repo).

⚠️ If you ever commit a password or API key, deleting it in a later commit doesn't remove it from history.
Rotate the secret immediately, then worry about cleaning history.

## More to explore

- **Tags:** `git tag -a v1.0 -m "First release"` and `git push origin v1.0` mark releases.
- **`git switch -`:** jump back to the previous branch, like `cd -`.
- **Worktrees:** `git worktree add ../git-101-hotfix main` checks out a second branch in another folder
  at the same time. (The practice-branch script uses one behind the scenes.)
- **Aliases:** `git config --global alias.st status`, `alias.lg "log --oneline --graph --all --decorate"`.
- **Signing commits** with SSH or GPG keys so GitHub shows them as *Verified*.
- **[Pro Git](https://git-scm.com/book/en/v2)**, the free official book. Chapters 2, 3 and 7 are gold.

Back to the [course map](../README.md#course-map).

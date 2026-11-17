# 05 · Rebase and tidying up

**Goal:** keep history readable. Pull with rebase instead of creating noisy merge commits, and squash a
messy run of commits into clean ones *before* you share them.

⏱️ About 10 minutes.

## Concept

**Rebase** takes your commits and replays them, one by one, on top of a different starting point. The
result looks as if you'd started your work later. History becomes a straight line instead of a fork and
a join.

```text
Before:            A───B───C  origin/main
                        \
                         X───Y  main (your local commits)

git pull (merge):  A───B───C───────M  main
                        \         /
                         X───Y───┘

git pull --rebase: A───B───C───X'───Y'  main
```

Notice `X'` and `Y'`: rebased commits are **new commits** with new IDs. The originals are left behind.
That's fine for commits only you have. It's a real problem for commits other people already have.

### ⚠️ The golden rule

> **Never rewrite history that other people have already pulled.**
> Rebase, amend, squash and reset freely on your *own, unshared* commits. Once commits are on a shared
> branch (`main`, `develop`, or a branch a teammate is working on), only add new commits on top.

How that fits our pull request workflow into `develop`:

- Your feature branch is yours. Rebasing it onto the latest `develop` and squashing your WIP commits
  before (or during) review is good manners.
- After rebasing a branch you'd already pushed, a normal push is rejected. Use
  `git push --force-with-lease`, never plain `--force`: it refuses if someone else pushed to the branch
  in the meantime.
- Never rebase or force-push `develop` or `main`. If something bad lands there, `git revert` it
  ([lesson 06](06-undoing-things.md)).

## Practical

### Part A: merge pull vs rebase pull

You need a commit on the remote that you don't have yet, *and* a local commit the remote doesn't have.

1. Make the remote change:
   - **Live session:** the facilitator pushes a commit to `main`.
   - **Self-paced:** on GitHub, open *your fork* → `notes/reading-list.md` → the ✏️ pencil icon. Add a line
     under *Using AI at work*, and commit directly to `main`.
2. Locally on `main`, change a *different* file, e.g. add an event to `site/data/timeline.json`, and
   commit.
3. Pull with **merge** first, to see what it looks like:
   - **Fork:** **Pull**, with *Rebase instead of merge* **unticked**.
   - **CLI:** `git pull --no-rebase`
   - Look at the graph: a little loop and a `Merge branch 'main' of github.com:…` commit. Multiply that by
     a team pulling ten times a day…
4. Undo that merge: `git reset --hard ORIG_HEAD` (Git saves where you were before a merge in `ORIG_HEAD`).
   Your local commit is still there, and the merge is gone.
5. Now pull with **rebase**:
   - **Fork:** **Pull** with *Rebase instead of merge* **ticked**.
   - **CLI:** `git pull --rebase`
6. Look at the graph again: one straight line, with your commit sitting on top of the remote one. Push it.

If a rebase hits a conflict, resolve it the same way as in lesson 04, then `git add <file>` and
`git rebase --continue` (Fork shows a **Continue** button). `git rebase --abort` bails out.

### Part B: squash messy commits with interactive rebase

`practice/messy-commits` has five commits with messages like `wip`, `fix typo` and `asdf`, and they
build `notes/prompting-tips.md` (this file only exists on that branch).
Turn them into two tidy commits.

1. `git switch practice/messy-commits` and look at its history: `git log --oneline -6`.
2. Start an interactive rebase of the last five commits:
   - **Fork:** right-click the commit *just below* `wip` (the one the branch started from) →
     **Interactive Rebase** → rebase onto that commit. Fork shows the commits with a drop-down action for
     each.
   - **CLI:** `git rebase -i HEAD~5`. Your editor opens a to-do list, oldest commit first.
3. Set the actions:

   ```text
   reword  wip                                         → "Add prompting tips notes"
   fixup   more tips
   fixup   fix typo
   fixup   asdf
   reword  oops forgot the link from the reading list  → "Link prompting tips from the reading list"
   ```

   - `pick`: keep as is
   - `reword`: keep the changes, change the message
   - `squash`: fold into the commit above and combine the messages
   - `fixup`: fold into the commit above and throw this message away
   - `drop`: delete the commit entirely
4. Save and close (or click **Rebase** in Fork). Git asks for the new messages for the `reword`s.

**What you should see:** `git log --oneline -3` shows two clean commits. The file's final contents are
identical, and only the story told by the history changed. Check with
`git diff practice/messy-commits@{1} practice/messy-commits` (no output means no difference).

Messed it up? `git rebase --abort` during the rebase, or `git reset --hard ORIG_HEAD` straight after it.

## Stretch

- Make a change, then commit it with `git commit --fixup <sha>` pointing at an earlier commit.
  `git rebase -i --autosquash <base>` puts the fixup in the right place for you.
- `git config --global pull.rebase true` makes `git pull` rebase by default. Many teams prefer that.
- Rebase a whole feature branch onto the latest `main`: `git switch <feature>` then `git rebase main`.
  Compare the graph before and after.
- Read up on `git rebase --onto` for moving a branch from one base to another.
- Reorder commits in the interactive rebase to-do list. What happens if two reordered commits touch the
  same lines?

Next: [06 · Undoing things](06-undoing-things.md)

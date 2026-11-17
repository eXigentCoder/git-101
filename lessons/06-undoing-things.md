# 06 · Undoing things

**Goal:** know the right "undo" for each situation, and know that committed work is almost never truly
lost.

⏱️ About 8 minutes.

## Which undo do I need?

| Situation | Use | Safe on shared branches? |
|-----------|-----|--------------------------|
| Typo in the last commit message, or forgot a file | `git commit --amend` | ❌ only if not pushed yet |
| Throw away changes in a file I haven't staged | `git restore <file>` | ✅ (but the changes are gone) |
| Unstage a file but keep the changes | `git restore --staged <file>` | ✅ |
| Undo a commit that's already pushed/shared | `git revert <commit>` | ✅ adds a new "undo" commit |
| Undo local commits that aren't shared yet | `git reset <commit>` | ❌ rewrites history |
| "Help, I lost something!" | `git reflog` | ✅ read-only |

## Practical

Do these on `main` (or any branch you haven't shared). Keep the site open so you can watch the changes.

### 1. Amend the last commit

1. Change the footer text in [`site/index.html`](../site/index.html) and commit it with a deliberately bad
   message, e.g. `footr`.
2. Fix the message:
   - **Fork:** tick **Amend** above the commit box. Fork loads the last commit's message, so edit it and
     click **Commit**.
   - **CLI:** `git commit --amend -m "Update the footer text"`
3. Amend also adds forgotten changes: edit the file again, stage it, and amend. It's still one commit.

The amended commit gets a **new ID**, which is why you don't amend commits you've already pushed.

### 2. Discard and unstage

1. Make a silly change to [`site/css/styles.css`](../site/css/styles.css) (e.g. `--radius: 0;`) and stage it.
2. Unstage it: select it under *Staged* and click **Unstage**, or `git restore --staged site/css/styles.css`.
3. Discard it: right-click → **Discard Changes**, or `git restore site/css/styles.css`.

⚠️ Discarded uncommitted changes are **gone**, and the reflog can't save them. Git only protects what's been
committed (or stashed).

### 3. Revert a commit (the safe undo)

Undo the accent colour change you committed in lesson 02, as if it had already gone to production:

1. Find the commit in Fork's graph (or `git log --oneline -- site/css/styles.css`).
2. **Fork:** right-click it → **Revert Commit**. **CLI:** `git revert <sha>`
3. Refresh the site. The colour is back to the original purple (if that commit also had conflicts merged
   on top, you may need to resolve a small conflict, same as lesson 04).

**What you should see:** a *new* commit, `Revert "Change accent colour to teal"`, on top. History isn't
rewritten; you've added an "undo" that everyone can pull. That's why it's the right tool on `develop`
and `main`.

### 4. Reset (rewinding a branch)

1. Create a scratch branch and make two throwaway commits (change anything, commit twice):

   ```sh
   git switch -c scratch/<name>
   ```

2. Rewind the last two commits. There are three flavours:

   | Mode | Branch moves back | Staged changes | Your files |
   |------|------------------|----------------|------------|
   | `--soft` | ✅ | changes stay **staged** | unchanged |
   | `--mixed` (default) | ✅ | changes become **unstaged** | unchanged |
   | `--hard` | ✅ | cleared | ⚠️ **changes thrown away** |

   Try `git reset --soft HEAD~2` and look at `git status`: the work is still there, staged and ready to
   recommit as one. Then `git reset --hard HEAD` to throw it away.

   In Fork: right-click the commit you want to go back to → **Reset 'scratch/<name>' to Here**, then pick
   Soft, Mixed or Hard.

### 5. The reflog: your safety net

You just "deleted" two commits with a hard reset. They're not gone.

```sh
git reflog
```

This lists everywhere `HEAD` has pointed recently (kept for about 90 days by default). Find the line from
just before the reset and bring it back:

```sh
git reset --hard HEAD@{2}        # or use the commit ID you see in the reflog
# or, more gently, keep it on a new branch:
git branch rescued <sha>
```

The reflog is local and per-machine. It can rescue anything you **committed**, even after a bad rebase
or a deleted branch.

## Stretch

- `git revert -m 1 <merge-commit>` reverts a whole merge. Why does Git need `-m 1`?
- Delete a branch with `git branch -D`, then rescue it from the reflog.
- `git restore --source=HEAD~3 site/data/glossary.json` brings back an old version of one file without
  moving any branch.
- `git reflog show practice/messy-commits` shows the reflog for one branch, including the pre-rebase
  version from lesson 05.

Next: [07 · Stretch topics](07-stretch.md)

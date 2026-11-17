# Git cheat sheet

Commands on the left, the Fork equivalent on the right. `<thing>` means "put your value here".

## Everyday loop

| Command | What it does | In Fork |
|---------|--------------|---------|
| `git status` | What's changed, what's staged, which branch you're on | **Local Changes** view |
| `git diff` / `git diff --staged` | Unstaged / staged changes, line by line | Click a file in Unstaged / Staged |
| `git add <file>` | Stage a whole file | Select the file, click **Stage** |
| `git add -p` | Stage part of a file, hunk by hunk | Select lines in the diff, click **Stage** |
| `git commit -m "Message"` | Save staged changes as a commit | Type a subject, click **Commit** |
| `git push` | Send your commits to the remote | **Push** (toolbar) |
| `git pull` | Fetch and merge the remote's new commits | **Pull** (toolbar) |
| `git fetch` | Download remote commits without changing your branch | **Fetch** (toolbar) |
| `git log --oneline --graph --all` | The "train tracks" view in the terminal | **All Commits** view |

## Branches

| Command | What it does | In Fork |
|---------|--------------|---------|
| `git switch -c <branch>` | Create a branch and switch to it | **Branch** (toolbar), tick *Check out* |
| `git switch <branch>` | Switch branches | Double-click the branch in the sidebar |
| `git branch -a` | List local and remote branches | Sidebar: Branches / Remotes |
| `git merge <branch>` | Merge `<branch>` into the current branch | Right-click branch → **Merge into '<current>'** |
| `git merge --no-ff <branch>` | Always create a merge commit | Merge dialog → *No fast-forward* |
| `git push -u origin <branch>` | Push a new branch and track it | **Push**, tick *Create tracking reference* |
| `git branch -d <branch>` | Delete a merged local branch | Right-click → **Delete** |

## Conflicts

| Command | What it does | In Fork |
|---------|--------------|---------|
| `git status` | Shows "both modified" files | Conflicted files show at the top of Local Changes |
| *edit the file* | Remove `<<<<<<<`, `=======`, `>>>>>>>` and keep what you want | **Merge in Fork** opens the 3-way merge tool |
| `git checkout --ours <file>` / `--theirs` | Take one side completely | **Resolve using Mine / Theirs** |
| `git add <file>` then `git commit` | Mark as resolved and finish the merge | Stage, then **Commit** |
| `git merge --abort` | Give up and go back to before the merge | **Abort** in the merge banner |

## Rewriting local history (only for commits you haven't shared)

| Command | What it does | In Fork |
|---------|--------------|---------|
| `git commit --amend` | Change the last commit's message or contents | Tick **Amend** above the commit box |
| `git pull --rebase` | Replay your commits on top of the remote's | Pull dialog → *Rebase instead of merge* |
| `git rebase -i HEAD~<n>` | Squash, reword, reorder or drop the last n commits | Right-click a commit → **Interactive Rebase** |
| `git reset --soft HEAD~1` | Undo the last commit, keep changes staged | Right-click parent → **Reset to here** → Soft |
| `git reset --hard <commit>` | Move the branch and throw away changes ⚠️ | **Reset to here** → Hard |

## Safe undo

| Command | What it does | In Fork |
|---------|--------------|---------|
| `git restore <file>` | Discard unstaged changes to a file ⚠️ | Right-click file → **Discard Changes** |
| `git restore --staged <file>` | Unstage, keeping the changes | Select in Staged, click **Unstage** |
| `git revert <commit>` | New commit that undoes an old one (safe on shared branches) | Right-click commit → **Revert Commit** |
| `git reflog` | Everywhere `HEAD` has been; your safety net | Terminal |

## Extras

| Command | What it does | In Fork |
|---------|--------------|---------|
| `git stash` / `git stash pop` | Park unfinished work, bring it back | **Stash** (toolbar) / sidebar → Stashes → Apply |
| `git cherry-pick <commit>` | Copy one commit onto the current branch | Right-click commit → **Cherry-pick** |
| `git blame <file>` | Who last changed each line, and in which commit | Right-click file → **Blame** |
| `git log -p -- <file>` | A file's history | Right-click file → **File History** |
| `git bisect start <bad> <good>` | Binary-search history for the commit that broke something | Terminal |

## Good commit messages

- A short summary line (about 50 characters), in the imperative: *"Add glossary search"*, not *"added stuff"*.
- A blank line, then the *why* if it isn't obvious.
- One logical change per commit.

⚠️ = can throw work away. When in doubt, `git stash` or commit first, and remember `git reflog`.

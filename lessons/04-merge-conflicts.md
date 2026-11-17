# 04 · Merge conflicts

**Goal:** stay calm when Git says `CONFLICT`, and resolve conflicts in JSON, CSS and HTML using Fork's
merge tool and by hand.

⏱️ About 12 minutes. You need the practice branches from [lesson 00](00-setup.md#6-create-the-practice-branches)
(`npm run practice:setup`).

## Concept

Git merges line by line. If the two sides changed **different** lines, it combines them automatically.
If they changed the **same** lines (or lines right next to each other), Git can't know which you want,
so it stops and asks you. That's a conflict. It isn't an error; it's a question.

Git writes both versions into the file between markers:

```text
<<<<<<< HEAD
  --accent: #0b7285;          ← "ours": the branch you're on
=======
  --accent: #e8590c;          ← "theirs": the branch you're merging in
>>>>>>> practice/conflict-theme
```

To resolve it, edit the file into the version you want (one side, the other, or a mix), **delete all three
marker lines**, stage the file and commit. Changed your mind? `git merge --abort` puts everything back.

## Practical

### Conflict 1: JSON, resolved in Fork's merge tool

The branch `practice/conflict-glossary` rewrites the *Hallucination* definition. You'll change the same
line.

1. Create a branch from `main`: `git switch -c fix/<name>-hallucination main`.
2. In [`site/data/glossary.json`](../site/data/glossary.json), rewrite the `definition` of
   `"Hallucination"` in your own words. Commit it.
3. Merge the practice branch into yours:
   - **Fork:** right-click `practice/conflict-glossary` → **Merge into 'fix/<name>-hallucination'**.
   - **CLI:** `git merge practice/conflict-glossary`
4. Git reports `CONFLICT (content): Merge conflict in site/data/glossary.json`. In Fork, the file
   appears at the top of **Local Changes** as conflicted. Click **Merge in Fork** to open the 3-way merge
   tool: your version on one side, theirs on the other, the result below. Choose a side, or edit the
   result to combine the best bits of both, then click **Save**/**Resolve**.
5. Run `npm test`. JSON is unforgiving: a stray comma or leftover marker breaks the whole glossary page.
6. Commit the merge. Fork pre-fills a message like `Merge branch 'practice/conflict-glossary'…`.

### Conflict 2: CSS, resolved by hand

The branch `practice/conflict-theme` sets the accent colour to orange.

1. `git switch main`. If you changed `--accent` in lesson 02 you're all set. If not, change it now and
   commit.
2. `git merge practice/conflict-theme`
3. Open [`site/css/styles.css`](../site/css/styles.css) in your **editor** (not the merge tool) and find
   the markers. Look at the browser *before* resolving: the browser can't make sense of the lines with
   markers, so `--accent` is lost and the header loses its colour. Conflicts really do break things until
   you resolve them.
4. Keep one colour, delete the marker lines, save, and refresh to check.
5. Mark it resolved and finish: `git add site/css/styles.css`, then `git commit` (Git suggests a message).
   In Fork: stage the file, then **Commit**.

### Conflict 3: HTML between two teammates

`practice/conflict-html-a` and `practice/conflict-html-b` are two teammates who both reworded the home
page heading. One of them also changed the tagline underneath it, so the conflict covers both lines.

1. `git switch practice/conflict-html-a`
2. `git merge practice/conflict-html-b`
3. **Practise bailing out first.** Look at the conflict, then abort: **Abort** in Fork's merge banner, or
   `git merge --abort`. `git status` shows you're back exactly where you started. Now run the merge again.
4. Resolve however you like. A good resolution often isn't "mine" or "theirs" but a combination: maybe
   heading A with tagline B.
5. Run `npm test` (it also catches leftover conflict markers in HTML), check the page, then commit.

## What you should see

Each resolved merge appears in the graph as a merge commit joining two tracks, just like lesson 03. The only
difference is you helped write it.

## Avoiding conflicts in the first place

- Pull (or merge `develop` into your branch) often, so you're never far behind.
- Keep branches short-lived and pull requests small.
- Don't reformat whole files in the same commit as a real change. It touches every line, so it conflicts
  with everything.
- Talk to each other. "I'm reworking the glossary today" saves a lot of pain.

## Stretch

- `git config --global merge.conflictStyle zdiff3` adds the **original** (base) version between the
  markers, which makes it far easier to see what each side changed. Redo conflict 1 with it on.
- During a conflict: `git checkout --ours <file>` / `git checkout --theirs <file>` take one side
  completely. Careful: during a *rebase* "ours" and "theirs" are swapped!
- `git log --merge -p` shows the commits on both sides that touched the conflicted lines.
- `git rerere` ("reuse recorded resolution") remembers how you resolved a conflict and repeats it next
  time. Enable it with `git config --global rerere.enabled true`.

Next: [05 · Rebase and tidying up](05-rebase-and-tidying.md)

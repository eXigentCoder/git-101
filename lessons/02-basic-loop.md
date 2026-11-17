# 02 · The basic loop

**Goal:** edit, stage (including just *part* of a file), commit, push and read the history. You'll do this
loop hundreds of times a week.

⏱️ About 10 minutes. Have the site running (`npm start`) so you can see each change.

## Concept

```text
edit files  →  review (git status / git diff)  →  stage what belongs together  →  commit  →  push
```

Commit small, related changes together. A commit should be one idea you could describe in a single
sentence. The staging area is what makes that possible: you can have five things changed and commit
just one of them.

## Practical

### Step 1: fix the typos (Markdown)

[`notes/reading-list.md`](../notes/reading-list.md) has two deliberate typos: one in a course name and
one where *practise* (the verb) should be *practice* (the noun). Find and fix them in your editor.

- **Fork:** click **Local Changes**. The file appears under *Unstaged*. Click it to see the diff: red lines
  removed, green lines added.
- **CLI:** `git status`, then `git diff`.

Stage it (**Stage** button / `git add notes/reading-list.md`) and commit with a clear message:

```sh
git commit -m "Fix typos in the reading list"
```

In Fork, type the message in the *Commit subject* box and click **Commit**.

### Step 2: stage only part of a file (CSS)

Open [`site/css/styles.css`](../site/css/styles.css) and make **two** changes:

1. At the top, change `--accent` to a colour you like, e.g. `--accent: #0b7285;` (teal).
2. At the very bottom, add a "debugging" rule you *don't* want to commit:

   ```css
   * { outline: 1px dashed red; }
   ```

Refresh the browser. Everything has a red outline and the new colour.

Now commit **only the colour**:

- **Fork:** click `styles.css` in *Unstaged*. In the diff, select just the `--accent` line(s) and click
  **Stage** (Fork offers to stage the selected lines or the whole hunk). The file now appears in *both*
  Staged and Unstaged: that's correct.
- **CLI:** `git add -p site/css/styles.css`. Git shows each change ("hunk") and asks what to do: `y` to
  stage the colour change, `n` to skip the outline. Check with `git diff --staged` (what will be committed)
  and `git diff` (what won't).

Commit it: `git commit -m "Change accent colour to teal"`.

Then throw away the outline: **Fork:** right-click the file → **Discard Changes**; **CLI:**
`git restore site/css/styles.css`. Refresh and the outline is gone, but your colour is still there.

### Step 3: add a glossary term (JSON)

Add a term to [`site/data/glossary.json`](../site/data/glossary.json). Add it at the **end** of the list
(the page sorts terms alphabetically for you), and watch the commas: JSON needs a comma between items but
not after the last one.

```json
  {
    "term": "Prompt engineering",
    "definition": "Writing and refining prompts to get more useful, reliable answers from a model."
  }
```

Run `npm test` to check the JSON is valid, then refresh the **Glossary** page and search for your term.

While you're at it, add yourself to [`CONTRIBUTORS.md`](../CONTRIBUTORS.md). Commit both together:

```sh
git add site/data/glossary.json CONTRIBUTORS.md
git commit -m "Add prompt engineering to glossary and add myself as a contributor"
```

### Step 4: push and look at the graph

- **Self-paced (your fork):** click **Push** in Fork, or run `git push`.
- **Live session:** don't push `main` yet. The facilitator will demo it; you'll push your own branch in
  lesson 03.

Now look at history:

```sh
git log --oneline --graph --all
```

In Fork, open **All Commits**.

## What you should see

Three new commits in a straight line on `main`. After pushing, `main` and `origin/main` point at the same
commit. Before pushing, `origin/main` sits three commits behind and Fork shows **↑3** next to `main`.

## Good commit messages

- **Summary line:** what the commit does, in the imperative ("Add…", "Fix…", "Remove…"), about 50
  characters.
- **Body (optional):** after a blank line, *why* you made the change, if it isn't obvious.
- Avoid "wip", "stuff", "changes". Future-you, searching history at 11pm during an incident, will thank you.

## Stretch

- Use `git add -p` and press `s` to **split** a hunk, or `e` to edit it by hand.
- `git commit -v` shows the diff in your editor while you write the message.
- `git log --stat`, `git log -p -2` and `git show HEAD~1`: what does each show?
- `git diff HEAD~3 -- site/` compares the site folder now with three commits ago.

Next: [03 · Branches and merging](03-branches-and-merging.md)

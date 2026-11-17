# Facilitator guide

Run sheet for a 60-minute live session. The lessons are written for self-study, so in the room you
**explain the concept briefly, then let people work through the lesson's practical** while you and the
experienced folk walk around.

## Before the day

- [ ] Commit and push this course to `main` on GitHub.
- [ ] Add every attendee as a collaborator on the repo (**Settings → Collaborators**), or move it into the
      org, so they can push branches. Leave `main` unprotected for the session, or allow your own pushes
      at least.
- [ ] Send the [pre-session message](#pre-session-message) below. Ask people to do
      [lesson 00](lessons/00-setup.md) in advance and to tell you if anything fails.
- [ ] Do a full dry run on a fresh clone: `npm install`, `npm start`, `npm run practice:setup`, and work
      through lessons 02–06 yourself. It takes about 20 minutes and you'll spot surprises.
- [ ] Prepare the commits you'll push live to `main` during practicals 2 and 4. Make them touch a file the
      attendees *won't* be editing at that point, e.g. a new line at the end of `notes/reading-list.md`
      (practical 2) and a sentence in the *Learn more* section of `site/index.html` (practical 4).
      Keep them as two small local commits, or just make them live as a demo.
- [ ] Practice branches: everyone creates their own locally with `npm run practice:setup` (there's
      nothing to push). If you'd like them visible on GitHub too, `git push origin "refs/heads/practice/*:refs/heads/practice/*"`
      works, but it isn't needed.
- [ ] Screen setup: Fork on one side, terminal plus browser (`npm start`) on the other, with a big font.

## Run sheet

| Time | Segment | Lesson | You do | They do |
|------|---------|--------|--------|---------|
| 0–8 | How Git works | [01](lessons/01-how-git-works.md) | Whiteboard or graph: snapshots, parent pointers, branch = label, `HEAD`, the four places. Show the same history in Fork and `git log --oneline --graph --all`. | Watch, then find `main`, `origin/main` and the `practice/*` branches in Fork. |
| 8–18 | Basic loop | [02](lessons/02-basic-loop.md) | Demo partial staging in Fork (select lines → Stage) and `git add -p`. Push your own commit to `main`. | Fix the Markdown typos, stage just the CSS colour, add a glossary term. Commit locally; **don't push `main`**. |
| 18–30 | Branches and merging | [03](lessons/03-branches-and-merging.md) | Around minute 24, **push your prepared commit to `main`** and tell everyone to pull. Point out a fast-forward vs a merge commit on someone's graph. | Part A (fast-forward), then Part B: push `feature/<name>-timeline`, pull `main`, merge. |
| 30–42 | Merge conflicts | [04](lessons/04-merge-conflicts.md) | Explain the markers. Resolve one live in Fork's merge tool, then one by hand in an editor. | Conflicts 1–3. **Pair newer people with experienced ones** for this part. |
| 42–52 | Rebase and tidying | [05](lessons/05-rebase-and-tidying.md) | Push your second prepared commit, so everyone has a remote change to pull. Draw merge pull vs rebase pull. State the golden rule and tie it to our PRs into `develop` and `--force-with-lease`. | Part A (merge pull, `reset --hard ORIG_HEAD`, rebase pull), then Part B (squash `practice/messy-commits`). |
| 52–57 | Undoing things | [06](lessons/06-undoing-things.md) | Show the "which undo?" table. Demo `revert` vs `reset`, then rescue "lost" commits with `git reflog`. | Amend and revert at least; reset and reflog if there's time. |
| 57–60 | Q&A | [CHEATSHEET](CHEATSHEET.md) | Point at the cheat sheet, lesson 07 and the self-paced route for anything they missed. | Questions. |

Experienced people who finish early: point them at the **Stretch** section of the current lesson, then
[lesson 07](lessons/07-stretch.md) (cherry-pick, bisect with `git bisect run npm test`, stash, blame).

## Tips

- **Pairing:** seat or pair newer people with confident ones before you start, so it doesn't eat into
  practical time later. Conflicts (minute 30) and rebase (minute 42) are where people get stuck.
- **Keep everyone off shared `main`.** Attendees commit to their local `main` and push only their own
  `feature/<name>-…` branches. Fifteen people pushing to `main` at once turns into a lesson on rejected
  pushes. (That's a fun demo if you have spare time: push from two clones and show the rejection, then
  pull and push again.)
- **Expect a merge commit when they pull in practical 3:** their local `main` has lesson 02 commits that
  aren't on the remote, so `git pull` creates `Merge branch 'main' of …`. Don't fix it, point at it. That's
  exactly the noise `pull --rebase` avoids in practical 4.
- **Running behind?** Cut Conflict 3 and the reset/reflog parts. Everything is in the lessons for later.
- **Someone's repo is in a weird state?** `git status` first. It nearly always says what's going on and
  how to get out (`--abort`, `--continue`). Worst case: stash or commit, then clone fresh.
- **Windows:** use Git Bash or PowerShell for the commands, not `cmd.exe`. Line endings are handled by
  `.gitattributes`.
- **Fork's Git isn't on PATH.** If someone's terminal says `git: command not found`, they skipped
  installing Git; Fork alone isn't enough for the terminal half.

## Pre-session message

> **Subject: Git training tomorrow: 10 minutes of setup please** 🛠️
>
> Hi all,
>
> Looking forward to tomorrow's Git session. To make the most of the hour, please do this beforehand
> (about 10 minutes):
>
> 1. Install **Git**: [Git for Windows](https://git-scm.com/download/win) on Windows, or run
>    `xcode-select --install` (or `brew install git`) on Mac.
> 2. Install **Fork** from <https://git-fork.com/>. It's free to evaluate and has the clearest history
>    graph around. It bundles its own Git, but that one isn't available in your terminal, hence step 1.
> 3. Install **Node.js LTS** from <https://nodejs.org/> if you don't already have it.
> 4. Set your name and email:
>    `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`
> 5. Clone <https://github.com/eXigentCoder/git-101>, then run `npm install`, `npm start` and
>    `npm run practice:setup`. Check you can see the AI 101 page at <http://localhost:3000>.
>
> The full setup guide is in `lessons/00-setup.md` in the repo. If anything doesn't work, reply to me
> before the session and we'll sort it out.
>
> Bring your laptop and charger. If you're already a Git pro, there are stretch exercises waiting for
> you, and I may ask you to help a neighbour. 🙂

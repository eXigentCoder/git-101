# git-101

A hands-on introduction to Git, built around a tiny website: **AI 101**, a friendly primer on artificial
intelligence. You'll learn Git by changing the site (its Markdown, JSON, JavaScript, HTML and CSS) and
watching your changes appear in the browser and in the history graph.

It works two ways:

- **Live session:** a facilitator runs it as a one-hour workshop (see [FACILITATOR.md](FACILITATOR.md)).
- **Self-paced:** work through the [lessons](#course-map) on your own, at your own speed.

Experienced Git users: every lesson ends with a **Stretch** section, so you won't be bored.

## What's in here

```text
git-101/
├── site/                     The AI 101 website (what you'll edit)
│   ├── index.html            The primer page
│   ├── glossary.html         Glossary page with a search filter
│   ├── css/styles.css        Styles; colours live in variables at the top
│   ├── js/app.js             Loads the JSON below and renders it
│   └── data/
│       ├── glossary.json     Glossary terms
│       └── timeline.json     "A short history of AI" timeline
├── notes/reading-list.md     Markdown notes (with deliberate typos to fix)
├── CONTRIBUTORS.md           Add yourself here in lesson 02
├── lessons/                  The course, one file per lesson
├── scripts/
│   ├── setup-practice-branches.js   Creates local practice/* branches for the exercises
│   ├── setup-practice-branches.sh   Same thing, for Mac/Linux shells
│   └── check-site.js         Sanity checks, run with `npm test`
├── CHEATSHEET.md             One-page command and Fork reference
└── FACILITATOR.md            Run sheet for the live session
```

## Prerequisites

You need four things. [Lesson 00](lessons/00-setup.md) walks through each one.

1. **Git** on the command line.
   - Windows: [Git for Windows](https://git-scm.com/download/win) (accept the defaults).
   - Mac: run `xcode-select --install`, or `brew install git` if you use Homebrew.
   - Check with `git --version`.
2. **[Fork](https://git-fork.com/)**, a free-to-evaluate Git GUI for Mac and Windows with a very clear
   history graph. Fork ships with its own private copy of Git, but that copy isn't available in your
   terminal, which is why you still need step 1.
3. **[Node.js](https://nodejs.org/)** LTS (version 18 or newer), to run the site locally.
4. A **GitHub account** that can push over HTTPS or SSH.

Then tell Git who you are (this is stamped on every commit you make):

```sh
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Get the code

**Self-paced?** Fork the repo on GitHub first so you have your own copy you can push to:

1. Open <https://github.com/eXigentCoder/git-101> and click **Fork**.
2. Clone *your* fork: in Fork choose **File → Clone…** and paste
   `https://github.com/<your-username>/git-101.git`, or run:

   ```sh
   git clone https://github.com/<your-username>/git-101.git
   cd git-101
   ```

**In the live session?** Clone the shared repo the facilitator gives you (you'll have been added as a
collaborator):

```sh
git clone https://github.com/eXigentCoder/git-101.git
cd git-101
```

## Run the site

```sh
npm install
npm start
```

Open the address `serve` prints (usually <http://localhost:3000>). Leave it running. After each change,
refresh the browser to see it. Stop it with `Ctrl+C`.

Run `npm test` any time to check the JSON is valid and nothing is broken (handy after resolving a conflict).

## Create the practice branches

Some exercises need ready-made branches (conflicts, messy commits, a hidden bug). Create them locally with:

```sh
npm run practice:setup
```

This only creates local branches named `practice/*`. It doesn't change your files, your current branch or
anything on GitHub, and it's safe to run more than once. Run `npm run practice:list` to see what each one is
for.

## Course map

| # | Lesson | You'll practise on | Time |
|---|--------|--------------------|------|
| 00 | [Setup](lessons/00-setup.md) | Installing and checking your tools | 10 min |
| 01 | [How Git works](lessons/01-how-git-works.md) | Concepts: snapshots, the commit graph, branches, `HEAD` | 8 min |
| 02 | [The basic loop](lessons/02-basic-loop.md) | Markdown typo, CSS colour, JSON glossary term | 10 min |
| 03 | [Branches and merging](lessons/03-branches-and-merging.md) | New HTML section and glossary terms on a feature branch | 12 min |
| 04 | [Merge conflicts](lessons/04-merge-conflicts.md) | Conflicts in JSON, CSS and HTML | 12 min |
| 05 | [Rebase and tidying up](lessons/05-rebase-and-tidying.md) | `pull --rebase`, squashing messy commits | 10 min |
| 06 | [Undoing things](lessons/06-undoing-things.md) | Amend, discard, revert, reset, reflog | 8 min |
| 07 | [Stretch topics](lessons/07-stretch.md) | Stash, cherry-pick, bisect, blame, `.gitignore` | Open-ended |

Keep the [cheat sheet](CHEATSHEET.md) open while you work.

## A note on the content

The AI primer is deliberately short and simplified. It's accurate as far as it goes, but it's a teaching
prop, not a reference. Pull requests that improve it are welcome, which is also a great way to practise.

# 00 · Setup

**Goal:** have Git, Fork and Node working, a copy of the repo on your machine, the site running and the
practice branches created.

⏱️ About 10 minutes. In the live session, please do this *before* you arrive.

## 1. Install the tools

| Tool | Windows | Mac | Check it works |
|------|---------|-----|----------------|
| Git | [Git for Windows](https://git-scm.com/download/win), default options | `xcode-select --install` or `brew install git` | `git --version` |
| Fork | [git-fork.com](https://git-fork.com/) | [git-fork.com](https://git-fork.com/) | Opens 🙂 |
| Node.js | [nodejs.org](https://nodejs.org/) LTS | [nodejs.org](https://nodejs.org/) LTS, or `brew install node` | `node --version` (18+) |

> **Why install Git if Fork has it built in?** Fork bundles a private copy of Git that only Fork uses. Your
> terminal, VS Code and other tools need a "real" Git on your `PATH`. Every lesson shows both the Fork
> clicks and the command, so you'll want both.

## 2. Tell Git who you are

```sh
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the email address on your GitHub account so your commits link to your profile. Fork reads the same
settings (**Preferences → Git** in Fork shows them).

Optional, but handy:

```sh
git config --global init.defaultBranch main
git config --global pull.rebase false   # we'll compare merge and rebase pulls in lesson 05
```

## 3. Make sure you can reach GitHub

Either works:

- **HTTPS:** Fork can sign in for you under **Preferences → Accounts → GitHub**. On the command line, Git
  for Windows and macOS's keychain will prompt you the first time you push.
- **SSH:** if you already use SSH keys with GitHub, `ssh -T git@github.com` should greet you by name.

## 4. Get the repo

- **Self-paced:** fork <https://github.com/eXigentCoder/git-101> on GitHub (the **Fork** button, top right),
  then clone *your* fork.
- **Live session:** clone the shared repo directly; the facilitator will have added you as a collaborator.

In Fork: **File → Clone…**, paste the URL, pick a folder, click **Clone**. Or:

```sh
git clone https://github.com/<you-or-eXigentCoder>/git-101.git
cd git-101
```

If you cloned on the command line, add it to Fork with **File → Open Repository…** (or drag the folder
onto Fork).

## 5. Run the site

```sh
npm install
npm start
```

Open <http://localhost:3000>. You should see the purple **AI 101** page, a timeline near the bottom, and a
**Glossary** page with a search box. Leave it running in its own terminal tab.

> Opening `site/index.html` straight from disk (a `file://` address) won't load the timeline or glossary,
> because browsers block `fetch()` from local files. Always use `npm start`.

## 6. Create the practice branches

```sh
npm run practice:setup
```

You'll see a list of `practice/*` branches being created. They're only on your machine and nothing else
changes. You'll use them in lessons 04, 05 and 07. Run it again any time; it skips branches that already
exist (`npm run practice:setup -- --reset` rebuilds them).

## ✅ Check

- `git --version`, `node --version` and `git config user.email` all print something sensible.
- The site loads at <http://localhost:3000> with the timeline filled in.
- In Fork's sidebar, under **Branches**, you see `main` and a `practice` folder.

## Stretch

- Run `git config --list --show-origin` and work out which file each setting comes from.
- Set a nicer default editor for commit messages, e.g. `git config --global core.editor "code --wait"`.
- Add a log alias you'll use all day:
  `git config --global alias.lg "log --oneline --graph --all --decorate"`, then try `git lg`.

Next: [01 · How Git works](01-how-git-works.md)

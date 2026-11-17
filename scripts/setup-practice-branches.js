#!/usr/bin/env node
// Creates LOCAL practice branches for the git-101 lessons.
//
//   node scripts/setup-practice-branches.js            create any missing practice branches
//   node scripts/setup-practice-branches.js --list     show which practice branches exist
//   node scripts/setup-practice-branches.js --reset    recreate them from scratch
//   node scripts/setup-practice-branches.js --remove   delete them
//   node scripts/setup-practice-branches.js --base <ref>   build them on <ref> instead of main
//
// Safe to run as often as you like:
// - it only ever creates, moves or deletes local branches named practice/*
// - it never touches your working directory, staged changes or current branch
//   (commits are made in a temporary `git worktree` that is removed afterwards)
// - it never fetches, pushes or talks to a remote
// - existing practice branches are left alone unless you pass --reset
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PREFIX = 'practice/';
const repoDir = path.resolve(__dirname, '..');

// Commits are authored by a clearly-named bot so they're easy to spot in the graph,
// and so the script works even before you've set user.name / user.email.
const COMMIT_ENV = {
  ...process.env,
  GIT_AUTHOR_NAME: 'Git 101 Practice Script',
  GIT_AUTHOR_EMAIL: 'practice@git-101.invalid',
  GIT_COMMITTER_NAME: 'Git 101 Practice Script',
  GIT_COMMITTER_EMAIL: 'practice@git-101.invalid',
};

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: options.cwd || repoDir,
    env: options.env || process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function gitOk(args, options) {
  try {
    git(args, options);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// File edit helpers. They work on the temporary worktree, never on your files.
// ---------------------------------------------------------------------------

function editText(dir, relative, change) {
  const file = path.join(dir, relative);
  const before = fs.readFileSync(file, 'utf8');
  const after = change(before);
  if (after === before) {
    throw new Error(`Expected to change ${relative} but nothing matched. Has the file been restructured?`);
  }
  fs.writeFileSync(file, after);
}

function replaceLine(dir, relative, pattern, replacement) {
  editText(dir, relative, (text) => text.replace(pattern, replacement));
}

function editJson(dir, relative, change) {
  editText(dir, relative, (text) => {
    const data = JSON.parse(text);
    change(data);
    return `${JSON.stringify(data, null, 2)}\n`;
  });
}

function setDefinition(term, definition) {
  return (entries) => {
    const entry = entries.find((item) => item.term === term);
    if (!entry) throw new Error(`Glossary term "${term}" not found`);
    entry.definition = definition;
  };
}

function writeFile(dir, relative, contents) {
  const file = path.join(dir, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function appendFile(dir, relative, contents) {
  fs.appendFileSync(path.join(dir, relative), contents);
}

// ---------------------------------------------------------------------------
// The practice branches. Each commit is { message, apply(dir) }.
// ---------------------------------------------------------------------------

const ACCENT_LINE = /^(\s*--accent:\s*)[^;\r\n]+;/m;
const HERO_H1 = /^(\s*)<h1>AI 101[^<\r\n]*<\/h1>/m;
const HERO_TAGLINE = /^(\s*)<p class="tagline">What artificial intelligence is[^\r\n]*<\/p>/m;

const BRANCHES = [
  {
    name: 'practice/conflict-glossary',
    lesson: '04',
    about: 'rewrites the "Hallucination" definition in site/data/glossary.json',
    commits: [
      {
        message: 'Clarify the hallucination definition',
        apply: (dir) =>
          editJson(
            dir,
            'site/data/glossary.json',
            setDefinition(
              'Hallucination',
              'When an AI model states something false as if it were fact, often with invented sources or details.'
            )
          ),
      },
    ],
  },
  {
    name: 'practice/conflict-theme',
    lesson: '04',
    about: 'changes the --accent colour in site/css/styles.css to orange',
    commits: [
      {
        message: 'Switch the accent colour to orange',
        apply: (dir) => replaceLine(dir, 'site/css/styles.css', ACCENT_LINE, '$1#e8590c;'),
      },
    ],
  },
  {
    name: 'practice/conflict-html-a',
    lesson: '04',
    about: 'one teammate rewords the home page heading',
    commits: [
      {
        message: 'Make the home page heading punchier',
        apply: (dir) => replaceLine(dir, 'site/index.html', HERO_H1, '$1<h1>AI, explained simply</h1>'),
      },
    ],
  },
  {
    name: 'practice/conflict-html-b',
    lesson: '04',
    about: 'another teammate rewords the same heading and the tagline',
    commits: [
      {
        message: 'Reword home page heading and tagline',
        apply: (dir) => {
          replaceLine(dir, 'site/index.html', HERO_H1, '$1<h1>A no-nonsense guide to AI</h1>');
          replaceLine(
            dir,
            'site/index.html',
            HERO_TAGLINE,
            '$1<p class="tagline">Ten minutes to understand what AI is, how chat assistants work and where they fall short.</p>'
          );
        },
      },
    ],
  },
  {
    name: 'practice/messy-commits',
    lesson: '05',
    about: 'five scrappy commits that build notes/prompting-tips.md; tidy them with interactive rebase',
    commits: [
      {
        message: 'wip',
        apply: (dir) =>
          writeFile(dir, 'notes/prompting-tips.md', '# Prompting tips\n\n- Be specfic about what you want.\n'),
      },
      {
        message: 'more tips',
        apply: (dir) =>
          appendFile(
            dir,
            'notes/prompting-tips.md',
            '- Give context: who the answer is for and what it will be used for.\n- Ask for a format (a table, bullet points, JSON).\n'
          ),
      },
      {
        message: 'fix typo',
        apply: (dir) => editText(dir, 'notes/prompting-tips.md', (text) => text.replace('specfic', 'specific')),
      },
      {
        message: 'asdf',
        apply: (dir) =>
          appendFile(dir, 'notes/prompting-tips.md', '- Check the answer. The model can be confidently wrong.\n'),
      },
      {
        message: 'oops forgot the link from the reading list',
        apply: (dir) =>
          appendFile(dir, 'notes/reading-list.md', '- Our own [prompting tips](prompting-tips.md).\n'),
      },
    ],
  },
  {
    name: 'practice/cherry-pick',
    lesson: '07',
    about: 'two experiments you DON\'T want plus one useful glossary commit you do',
    commits: [
      {
        message: 'Experiment: dark page background',
        apply: (dir) => replaceLine(dir, 'site/css/styles.css', /^(\s*--bg:\s*)[^;\r\n]+;/m, '$1#20232c;'),
      },
      {
        message: 'Add "AI agent" to the glossary',
        apply: (dir) =>
          editJson(dir, 'site/data/glossary.json', (entries) => {
            entries.unshift({
              term: 'AI agent',
              definition:
                'A system that uses a model to plan and take actions, such as calling tools or APIs, to reach a goal with less step-by-step human input.',
            });
          }),
      },
      {
        message: 'Experiment: Comic Sans everywhere',
        apply: (dir) =>
          replaceLine(dir, 'site/css/styles.css', /^(\s*--font:\s*)[^;\r\n]+;/m, '$1"Comic Sans MS", cursive;'),
      },
    ],
  },
  {
    name: 'practice/bisect',
    lesson: '07',
    about: 'eight innocent-looking commits; one of them breaks the glossary. Find it with git bisect',
    commits: [
      {
        message: 'Add Elements of AI note to reading list',
        apply: (dir) =>
          appendFile(dir, 'notes/reading-list.md', '- Tip: Elements of AI has a free certificate at the end.\n'),
      },
      {
        message: 'Add "Embedding" to the glossary',
        apply: (dir) =>
          editJson(dir, 'site/data/glossary.json', (entries) => {
            entries.push({
              term: 'Embedding',
              definition: 'A list of numbers that represents the meaning of a piece of text, so similar ideas end up close together.',
            });
          }),
      },
      {
        message: 'Add GPT-3 to the timeline',
        apply: (dir) =>
          editJson(dir, 'site/data/timeline.json', (events) => {
            events.push({
              year: 2020,
              title: 'GPT-3',
              description: 'OpenAI\'s 175-billion-parameter model shows that simply scaling up language models unlocks surprising abilities.',
            });
          }),
      },
      {
        message: 'Soften the card corners',
        apply: (dir) => replaceLine(dir, 'site/css/styles.css', /^(\s*--radius:\s*)[^;\r\n]+;/m, '$116px;'),
      },
      {
        message: 'Add "Temperature" to the glossary',
        apply: (dir) =>
          editJson(dir, 'site/data/glossary.json', (entries) => {
            // The bug: "defintion" is misspelt, so the page shows "undefined" and npm test fails.
            entries.push({
              term: 'Temperature',
              defintion: 'A setting that controls how random a model\'s output is. Lower is more predictable, higher is more creative.',
            });
          }),
      },
      {
        message: 'Add IBM Watson to the timeline',
        apply: (dir) =>
          editJson(dir, 'site/data/timeline.json', (events) => {
            events.push({
              year: 2011,
              title: 'Watson wins Jeopardy!',
              description: 'IBM\'s Watson beats two of the quiz show\'s greatest champions.',
            });
          }),
      },
      {
        message: 'Add 3Blue1Brown tip to reading list',
        apply: (dir) =>
          appendFile(dir, 'notes/reading-list.md', '- Tip: watch the 3Blue1Brown videos at 0.75x speed the first time.\n'),
      },
      {
        message: 'Add "Inference" to the glossary',
        apply: (dir) =>
          editJson(dir, 'site/data/glossary.json', (entries) => {
            entries.push({
              term: 'Inference',
              definition: 'Using a trained model to produce an output, for example answering your prompt.',
            });
          }),
      },
    ],
  },
];

// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const options = { base: null, reset: false, remove: false, list: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--reset') options.reset = true;
    else if (arg === '--remove') options.remove = true;
    else if (arg === '--list') options.list = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--base') options.base = argv[++i];
    else throw new Error(`Unknown option "${arg}". Try --help.`);
  }
  return options;
}

function branchExists(name) {
  return gitOk(['show-ref', '--verify', '--quiet', `refs/heads/${name}`]);
}

// Branches checked out in any worktree (including this one) can't be moved or deleted.
function checkedOutBranches() {
  const output = git(['worktree', 'list', '--porcelain']);
  return new Set(
    output
      .split('\n')
      .filter((line) => line.startsWith('branch refs/heads/'))
      .map((line) => line.slice('branch refs/heads/'.length))
  );
}

function resolveBase(requested) {
  const candidates = requested ? [requested] : ['main', 'origin/main'];
  for (const ref of candidates) {
    if (gitOk(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`])) return ref;
  }
  throw new Error(
    requested
      ? `Can't find "${requested}". Check the branch name.`
      : 'Can\'t find a "main" branch. Pass --base <branch> to choose one.'
  );
}

function buildBranch(branch, base) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git101-practice-'));
  try {
    git(['worktree', 'add', '--detach', tempDir, base]);
    for (const commit of branch.commits) {
      commit.apply(tempDir);
      git(['add', '--all'], { cwd: tempDir });
      git(['-c', 'commit.gpgsign=false', 'commit', '--no-verify', '--quiet', '-m', commit.message], {
        cwd: tempDir,
        env: COMMIT_ENV,
      });
    }
    const tip = git(['rev-parse', 'HEAD'], { cwd: tempDir });
    git(['branch', '--force', branch.name, tip]);
    return tip;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
    gitOk(['worktree', 'prune']);
  }
}

function printHelp() {
  const lines = fs.readFileSync(__filename, 'utf8').split(/\r?\n/).slice(1);
  const header = lines.slice(0, lines.findIndex((line) => !line.startsWith('//')));
  console.log(header.map((line) => line.replace(/^\/\/ ?/, '')).join('\n'));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();

  if (!gitOk(['rev-parse', '--is-inside-work-tree'])) {
    throw new Error(`${repoDir} isn't a git repository. Clone the course repo first (see README.md).`);
  }

  if (options.list) {
    for (const branch of BRANCHES) {
      const mark = branchExists(branch.name) ? '✓' : '·';
      console.log(`${mark} ${branch.name.padEnd(28)} lesson ${branch.lesson}: ${branch.about}`);
    }
    return;
  }

  const busy = checkedOutBranches();

  if (options.remove) {
    for (const branch of BRANCHES) {
      if (!branchExists(branch.name)) continue;
      if (busy.has(branch.name)) {
        console.log(`! ${branch.name} is checked out, switch to another branch first. Skipped.`);
        continue;
      }
      git(['branch', '-D', branch.name]);
      console.log(`- deleted ${branch.name}`);
    }
    return;
  }

  const base = resolveBase(options.base);
  const baseSha = git(['rev-parse', '--short', `${base}^{commit}`]);
  console.log(`Building practice branches on ${base} (${baseSha}). Only local branches are touched.\n`);

  let failures = 0;
  for (const branch of BRANCHES) {
    if (!branch.name.startsWith(PREFIX)) throw new Error(`Refusing to touch non-practice branch ${branch.name}`);
    const exists = branchExists(branch.name);
    if (exists && !options.reset) {
      console.log(`= ${branch.name} already exists (use --reset to rebuild it)`);
      continue;
    }
    if (exists && busy.has(branch.name)) {
      console.log(`! ${branch.name} is checked out, switch to another branch before --reset. Skipped.`);
      continue;
    }
    try {
      const tip = buildBranch(branch, base);
      const count = branch.commits.length;
      console.log(`${exists ? '↻' : '+'} ${branch.name} (${count} commit${count === 1 ? '' : 's'}, ${tip.slice(0, 7)})`);
    } catch (error) {
      failures += 1;
      console.error(`✗ ${branch.name}: ${error.message.split('\n')[0]}`);
    }
  }

  console.log('\nDone. See them with: git branch --list "practice/*"  (or in Fork\'s sidebar under Branches)');
  if (failures > 0) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

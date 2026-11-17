#!/usr/bin/env node
// Quick sanity checks for the AI 101 site. Run with: npm test
//
// - every JSON file in site/data parses
// - glossary entries have a non-empty "term" and "definition", with no duplicates
// - timeline entries have a numeric "year", a "title" and a "description"
// - every local href/src in the HTML pages points at a file that exists
//
// Exits with code 1 on failure, which also makes it usable with `git bisect run`.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const siteDir = path.resolve(__dirname, '..', 'site');
const problems = [];

function readJson(relative) {
  const file = path.join(siteDir, relative);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    problems.push(`${relative}: not valid JSON (${error.message})`);
    return null;
  }
}

function isFilledString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkGlossary() {
  const glossary = readJson('data/glossary.json');
  if (glossary === null) return;
  if (!Array.isArray(glossary)) {
    problems.push('data/glossary.json: expected an array of { "term", "definition" } objects');
    return;
  }
  const seen = new Set();
  glossary.forEach((entry, index) => {
    const label = `data/glossary.json[${index}]${entry && entry.term ? ` (${entry.term})` : ''}`;
    if (!entry || !isFilledString(entry.term)) problems.push(`${label}: missing "term"`);
    if (!entry || !isFilledString(entry.definition)) problems.push(`${label}: missing "definition"`);
    if (entry && isFilledString(entry.term)) {
      const key = entry.term.trim().toLowerCase();
      if (seen.has(key)) problems.push(`${label}: duplicate term`);
      seen.add(key);
    }
  });
}

function checkTimeline() {
  const timeline = readJson('data/timeline.json');
  if (timeline === null) return;
  if (!Array.isArray(timeline)) {
    problems.push('data/timeline.json: expected an array of { "year", "title", "description" } objects');
    return;
  }
  timeline.forEach((entry, index) => {
    const label = `data/timeline.json[${index}]`;
    if (!entry || !Number.isInteger(entry.year)) problems.push(`${label}: "year" must be a whole number`);
    if (!entry || !isFilledString(entry.title)) problems.push(`${label}: missing "title"`);
    if (!entry || !isFilledString(entry.description)) problems.push(`${label}: missing "description"`);
  });
}

function checkOtherJson() {
  const dataDir = path.join(siteDir, 'data');
  for (const name of fs.readdirSync(dataDir)) {
    if (name.endsWith('.json') && name !== 'glossary.json' && name !== 'timeline.json') {
      readJson(path.join('data', name));
    }
  }
}

function checkHtmlLinks() {
  const pages = fs.readdirSync(siteDir).filter((name) => name.endsWith('.html'));
  for (const page of pages) {
    const html = fs.readFileSync(path.join(siteDir, page), 'utf8');
    if (/^(<{7}|={7}|>{7})/m.test(html)) problems.push(`${page}: still contains merge conflict markers`);
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (/^(?:[a-z]+:|#|\/\/)/i.test(target)) continue; // external links and anchors
      const file = path.join(siteDir, target.split(/[?#]/)[0]);
      if (!fs.existsSync(file)) problems.push(`${page}: link to "${target}" but that file doesn't exist`);
    }
  }
}

function checkConflictMarkers() {
  for (const relative of ['css/styles.css', 'js/app.js']) {
    const text = fs.readFileSync(path.join(siteDir, relative), 'utf8');
    if (/^(<{7}|={7}|>{7})/m.test(text)) problems.push(`${relative}: still contains merge conflict markers`);
  }
}

checkGlossary();
checkTimeline();
checkOtherJson();
checkHtmlLinks();
checkConflictMarkers();

if (problems.length > 0) {
  console.error('Site check failed:');
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}
console.log('Site check passed ✓');

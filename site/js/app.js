// AI 101 – renders the timeline and glossary from the JSON files in site/data.
// No frameworks, no build step: just the browser's fetch() and the DOM.

const DATA = {
  timeline: 'data/timeline.json',
  glossary: 'data/glossary.json',
};

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url} (HTTP ${response.status})`);
  }
  // If a merge left the JSON invalid, this is where it blows up.
  return response.json();
}

function showError(container, url, error) {
  const tag = container.tagName === 'DL' ? 'dt' : 'li';
  container.innerHTML = '';
  const item = document.createElement(tag);
  item.className = 'error';
  item.textContent = `Couldn't show ${url}: ${error.message}. Run "npm test" to find the problem.`;
  container.appendChild(item);
  console.error(error);
}

async function renderTimeline(container) {
  try {
    const events = await loadJson(DATA.timeline);
    container.innerHTML = '';
    events
      .slice()
      .sort((a, b) => a.year - b.year)
      .forEach((event) => {
        const item = document.createElement('li');

        const year = document.createElement('span');
        year.className = 'year';
        year.textContent = event.year;

        const body = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = event.title;
        const description = document.createElement('p');
        description.textContent = event.description;
        body.append(title, description);

        item.append(year, body);
        container.appendChild(item);
      });
  } catch (error) {
    showError(container, DATA.timeline, error);
  }
}

function renderGlossaryTerms(container, terms, filter) {
  const query = filter.trim().toLowerCase();
  const matches = terms.filter(
    (entry) =>
      entry.term.toLowerCase().includes(query) ||
      entry.definition.toLowerCase().includes(query)
  );

  container.innerHTML = '';
  if (matches.length === 0) {
    const empty = document.createElement('dt');
    empty.className = 'empty';
    empty.textContent = `No terms match "${filter}".`;
    container.appendChild(empty);
    return;
  }

  matches.forEach((entry) => {
    const term = document.createElement('dt');
    term.id = entry.term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    term.textContent = entry.term;
    const definition = document.createElement('dd');
    definition.textContent = entry.definition;
    container.append(term, definition);
  });
}

async function renderGlossary(container) {
  try {
    const terms = await loadJson(DATA.glossary);
    terms.sort((a, b) => a.term.localeCompare(b.term));

    const search = document.querySelector('[data-glossary-search]');
    renderGlossaryTerms(container, terms, '');
    if (search) {
      search.addEventListener('input', () => renderGlossaryTerms(container, terms, search.value));
    }
  } catch (error) {
    showError(container, DATA.glossary, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('[data-timeline]');
  if (timeline) renderTimeline(timeline);

  const glossary = document.querySelector('[data-glossary]');
  if (glossary) renderGlossary(glossary);
});

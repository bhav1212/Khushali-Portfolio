import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseFilters, serializeFilters, filterImages, availableOptions, matchingItems, normaliseFilters } from '../src/lib/discovery.ts';

test('room alternatives use OR while room, mood and concept combine with AND', () => {
  const images = [
    { id: 'warm-bedroom', rooms: ['bedroom'], moods: ['warm-neutrals'], concepts: ['built-in-storage'] },
    { id: 'warm-kitchen', rooms: ['kitchen'], moods: ['warm-neutrals'], concepts: ['built-in-storage'] },
    { id: 'cool-bedroom', rooms: ['bedroom'], moods: ['blue-cool'], concepts: ['built-in-storage'] },
    { id: 'warm-no-storage', rooms: ['bedroom'], moods: ['warm-neutrals'], concepts: ['curved-forms'] },
  ];
  const filters = parseFilters('?view=rooms&room=bedroom&room=kitchen&mood=warm-neutrals&concept=built-in-storage');
  assert.deepEqual(filterImages(images, filters).map(image => image.id), ['warm-bedroom', 'warm-kitchen']);
  assert.deepEqual(parseFilters(serializeFilters(filters)), filters);
});

test('unknown values and repeated URL parameters cannot distort filter state', () => {
  const filters = parseFilters('?view=invalid&room=bedroom&room=bedroom&room=unknown&mood=invalid&category=Workspaces');
  assert.equal(filters.view, 'projects');
  assert.deepEqual(filters.rooms, ['bedroom']);
  assert.deepEqual(filters.moods, []);
  assert.deepEqual(filters.categories, ['Workspaces']);
});


const collection = [
  { category: 'Residential', rooms: ['bedroom'], moods: ['warm-neutrals'], concepts: ['built-in-storage'] },
  { category: 'Residential', rooms: ['kitchen'], moods: ['blue-cool'], concepts: ['curved-forms'] },
  { category: 'Workspaces', rooms: ['office'], moods: ['dark-moody'], concepts: ['built-in-storage'] },
];

test('only options supported by the other active facets remain selectable', () => {
  const filters = parseFilters('?view=rooms&room=bedroom');
  assert.deepEqual([...availableOptions(collection, filters, 'moods')], ['warm-neutrals']);
  assert.deepEqual([...availableOptions(collection, filters, 'categories')], ['Residential']);
  assert.deepEqual([...availableOptions(collection, filters, 'concepts')], ['built-in-storage']);
  for (const facet of ['categories', 'rooms', 'moods', 'concepts']) {
    for (const option of availableOptions(collection, filters, facet)) {
      assert.ok(matchingItems(collection, { ...filters, [facet]: [option] }).length > 0);
    }
  }
});

test('unusable saved combinations recover to available matches and obsolete OR branches are removed', () => {
  const invalid = normaliseFilters(collection, parseFilters('?view=rooms&room=bedroom&mood=dark-moody'));
  assert.deepEqual(invalid.moods, []);
  assert.equal(matchingItems(collection, invalid).length, 1);
  const restricted = normaliseFilters(collection, parseFilters('?view=rooms&room=bedroom&room=kitchen&mood=blue-cool'));
  assert.deepEqual(restricted.rooms, ['kitchen']);
  assert.equal(matchingItems(collection, restricted).length, 1);
});

test('project-view links cannot retain hidden room mood or concept constraints', () => {
  const result = normaliseFilters(collection, parseFilters('?category=Residential&room=office&mood=dark-moody&concept=built-in-storage'));
  assert.equal(result.view, 'projects');
  assert.deepEqual(result.categories, ['Residential']);
  assert.deepEqual(result.rooms, []);
  assert.deepEqual(result.moods, []);
  assert.deepEqual(result.concepts, []);
  assert.deepEqual([...availableOptions(collection, result, 'categories')], ['Residential', 'Workspaces']);
});

test('every offered single-value facet path in the published collection has matching images', () => {
  const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url)));
  const items = projects.flatMap(project => project.gallery.map(image => ({ ...image, category: project.category })));
  const base = parseFilters('?view=rooms');
  let paths = 0;
  for (const category of availableOptions(items, base, 'categories')) {
    const categoryFilter = { ...base, categories: [category] };
    for (const room of availableOptions(items, categoryFilter, 'rooms')) {
      const roomFilter = { ...categoryFilter, rooms: [room] };
      for (const mood of availableOptions(items, roomFilter, 'moods')) {
        const moodFilter = { ...roomFilter, moods: [mood] };
        for (const concept of availableOptions(items, moodFilter, 'concepts')) {
          assert.ok(matchingItems(items, { ...moodFilter, concepts: [concept] }).length > 0);
          paths++;
        }
      }
    }
  }
  assert.ok(paths > 100);
});

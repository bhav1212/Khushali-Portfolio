import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectMatchesSection,projectSectionFromSearch} from '../src/lib/projectSections.ts';

test('three visual categories cover every project once and commercial includes offices',()=>{
  const projects=JSON.parse(readFileSync(new URL('../src/data/projects.json',import.meta.url)));
  for(const project of projects)assert.equal(['residential','commercial','exterior'].filter(section=>projectMatchesSection(project.category,section)).length,1);
  assert.equal(projectMatchesSection('Workspaces','commercial'),true);
  assert.equal(projectMatchesSection('Residential','plans'),false);
});
test('saved category links map to the new four-option navigation',()=>{
  assert.equal(projectSectionFromSearch(''),'residential');
  assert.equal(projectSectionFromSearch('?category=Workspaces'),'commercial');
  assert.equal(projectSectionFromSearch('?category=Landscape%20%2F%20Outdoor'),'exterior');
});

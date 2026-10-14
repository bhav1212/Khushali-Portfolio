import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url)));

test('published case studies have unique readable routes and real curated assets', () => {
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(project.gallery.length > 0);
    assert.equal(new Set(project.gallery.map(image => image.id)).size, project.gallery.length);
    assert.ok(project.palette.length > 0 && project.palette.length <= 5);
    for (const colour of project.palette) {
      assert.match(colour.hex, /^#[0-9A-F]{6}$/);
      assert.ok(project.gallery.some(image => image.id === colour.imageId));
    }
    for (const image of project.gallery) {
      assert.match(image.src, /^\/images\/[a-z0-9-]+\.webp$/);
      assert.ok(existsSync(resolve('public', image.src.slice(1))));
      assert.ok(image.caption && image.width && image.height);
    }
  }
  assert.equal(JSON.stringify(projects).includes('Google Drive'), false);
});

test('plan collections expose bilingual anonymous previews without downloadable PDFs',()=>{
  const plans=JSON.parse(readFileSync(new URL('../src/data/plans.json',import.meta.url)));
  const sheets=plans.flatMap(group=>group.sheets);
  assert.equal(new Set(sheets.map(sheet=>sheet.id)).size,20);
  for(const group of plans){
    assert.ok(group.title.en&&group.title.de);
    for(const sheet of group.sheets){
      assert.ok(sheet.title.en&&sheet.title.de&&sheet.width&&sheet.height);
      assert.ok(existsSync(resolve('public',sheet.src.slice(1))));
      assert.ok(!sheet.download&&!sheet.format);
      assert.doesNotMatch(sheet.src,/\/plans\/\d{2}-mr-/i);
    }
  }
  assert.equal(readdirSync('public/plans').some(file=>file.endsWith('.pdf')),false);
  assert.equal(existsSync('public/drawings')&&readdirSync('public/drawings').some(file=>file.endsWith('.pdf')),false);
});

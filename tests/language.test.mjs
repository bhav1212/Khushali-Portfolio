import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ui,localPath} from '../src/lib/i18n.ts';
const projects=JSON.parse(readFileSync(new URL('../src/data/projects.json',import.meta.url)));
const copies=JSON.parse(readFileSync(new URL('../src/data/project-copy.json',import.meta.url)));

test('every UI string and published project has both languages',()=>{
  assert.deepEqual(Object.keys(ui.en).sort(),Object.keys(ui.de).sort());
  for(const project of projects)for(const language of ['en','de']){
    const copy=copies[project.id][language];
    assert.ok(copy.title&&copy.intro&&copy.detail);
    assert.deepEqual(copy.gallery.map(image=>image.id),project.gallery.map(image=>image.id));
    assert.ok(copy.gallery.every(image=>image.caption&&Array.isArray(image.materials)));
    assert.equal(copy.videos.length,project.videos.length);
  }
});
test('English routes are default and German links preserve their path and filters',()=>{
  assert.equal(localPath('/projects?view=rooms&room=bedroom','en'),'/projects?view=rooms&room=bedroom');
  assert.equal(localPath('/projects/example#image-1','de'),'/de/projects/example#image-1');
});

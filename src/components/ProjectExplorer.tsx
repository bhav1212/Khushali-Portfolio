import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import type { Project } from '../data/portfolio';
import {ui,localPath,categoryText,deRooms,deMoods,deConcepts,type Language} from '../lib/i18n';
import { availableOptions, categories, conceptLabels, emptyFilters, matchingItems, moodColours, moodLabels, normaliseFilters, parseFilters, roomLabels, serializeFilters, type Facet, type Filters } from '../lib/discovery';

const Arrow = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" /></svg>;
gsap.registerPlugin(Flip, useGSAP);

export default function ProjectExplorer({ projects, language='en' }: { projects:Project[];language?:Language }) {
  const text=ui[language], roomText=language==='de'?deRooms:roomLabels, moodText=language==='de'?deMoods:moodLabels, conceptText=language==='de'?deConcepts:conceptLabels;
  const prefix=language==='de'?'/de':'';
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(8);
  const root = useRef<HTMLDivElement>(null);
  const layout = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const entries = projects.flatMap(project => project.gallery.map(image => ({ ...image, category: project.category, projectTitle: project.title, projectSlug: project.slug })));
  useEffect(() => {
    const restore = () => {
      const next = normaliseFilters(entries, parseFilters(window.location.search));
      if (serializeFilters(next) !== window.location.search) window.history.replaceState(null, '', prefix + '/projects' + serializeFilters(next));
      setFilters(next);
      setLimit(next.view === 'projects' ? 8 : 12);
    };
    restore(); setReady(true);
    window.addEventListener('popstate', restore);
    const closeOutside = (event: PointerEvent) => {
      root.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(menu => {
        if (!menu.contains(event.target as Node)) menu.open = false;
      });
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const menu = root.current?.querySelector<HTMLDetailsElement>('details[open]');
      if (menu) { menu.open = false; menu.querySelector('summary')?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('popstate', restore);
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const search = serializeFilters(filters);
    if (search !== window.location.search) window.history.pushState(null, '', prefix + '/projects' + search);
  }, [filters, ready]);

  const captureLayout = () => { if (root.current) layout.current = Flip.getState(root.current.querySelectorAll('.project-entry, .room-entry')); };
  const change = (next: Filters) => { captureLayout(); setFilters(normaliseFilters(entries, next)); setLimit(next.view === 'projects' ? 8 : 12); };
  const toggle = (facet: Facet, value: string) => change({
    ...filters, [facet]: filters[facet].includes(value) ? filters[facet].filter(item => item !== value) : [...filters[facet], value],
  });
  const clear = () => change({ ...emptyFilters, view: filters.view });
  useGSAP(() => {
    if (!layout.current) return;
    const previous = layout.current;
    layout.current = null;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    Flip.from(previous, { duration: .42, scale: true, ease: 'power3.out', prune: true, onEnter: elements => gsap.fromTo(elements, { clipPath: 'inset(0 14% 0 0)', y: 12 }, { clipPath: 'inset(0)', y: 0, duration: .35, stagger: {amount: .12}, ease: 'power3.out', clearProps: 'clipPath,transform' }) });
  }, { scope: root, dependencies: [filters, limit], revertOnUpdate: true });
  const selected = projects.filter(project => !filters.categories.length || filters.categories.includes(project.category));
  const rooms = matchingItems(entries, filters);
  const results = filters.view === 'projects' ? selected : rooms;
  const activeCount = filters.categories.length + filters.rooms.length + filters.moods.length + filters.concepts.length;
  const availableRooms = availableOptions(entries, filters, 'rooms');
  const availableConcepts = availableOptions(entries, filters, 'concepts');
  const availableMoods = availableOptions(entries, filters, 'moods');
  const availableCategories = availableOptions(entries, filters, 'categories');

  return <div className="explorer" data-ready={ready} ref={root}>
    <div className="explorer-toolbar">
      <div className="view-controls" role="group" aria-label={text.browse}>
        <button type="button" aria-pressed={filters.view === 'projects'} onClick={() => change({ ...emptyFilters, view: 'projects' })}>{text.projects}</button>
        <button type="button" aria-pressed={filters.view === 'rooms'} onClick={() => change({ ...emptyFilters, view: 'rooms' })}>{text.roomsMoods}</button>
      </div>
      <p className="result-count" role="status" aria-live="polite">{results.length} {filters.view === 'projects' ? language==='de'?text.projects:text.projects.toLowerCase() : text.spaces}</p>
    </div>
    <fieldset className="category-controls"><legend className="sr-only">{text.spaceType}</legend>
      <button type="button" aria-pressed={!filters.categories.length} onClick={() => change({ ...filters, categories: [] })}>{text.allSpaces}</button>
      {categories.filter(category => availableCategories.has(category)).map(category => <button key={category} type="button" aria-pressed={filters.categories.includes(category)} onClick={() => toggle('categories', category)}>{categoryText[language][category]}</button>)}
    </fieldset>
    {filters.view === 'rooms' && <div className="room-filters">
      <div className="facet-row">
        {(['rooms', 'concepts'] as const).map(facet => <details className="filter-facet" name="discovery-facets" key={facet}>
          <summary>{facet === 'rooms' ? text.chooseRoom : text.chooseConcept}{filters[facet].length > 0 && <span> ({filters[facet].length})</span>}</summary>
          <fieldset className="facet-options"><legend className="sr-only">{facet === 'rooms' ? text.rooms : text.concepts}</legend>
            {Object.entries(facet === 'rooms' ? roomText : conceptText).filter(([key]) => (facet === 'rooms' ? availableRooms : availableConcepts).has(key)).map(([key, label]) =>
              <label key={key}><input type="checkbox" checked={filters[facet].includes(key)} onChange={() => toggle(facet, key)} />{label}</label>)}
          </fieldset>
        </details>)}
        {activeCount > 0 && <button type="button" className="reset-control" onClick={clear}>{text.clear}</button>}
      </div>
      <fieldset className="mood-controls"><legend>{text.atmosphere}</legend>
        {Object.entries(moodText).filter(([key]) => availableMoods.has(key)).map(([key, label]) => <button type="button" key={key} aria-pressed={filters.moods.includes(key)} onClick={() => toggle('moods', key)}><span className="mood-swatch" style={{ backgroundColor: moodColours[key] }} aria-hidden="true" />{label}</button>)}
      </fieldset>
      {(filters.rooms.length > 0 || filters.concepts.length > 0) && <p className="active-filters">{[...filters.rooms.map(key => roomText[key]), ...filters.concepts.map(key => conceptText[key])].join(', ')}</p>}
    </div>}
    {results.length === 0 ? <div className="empty-results"><h2>{text.emptyTitle}</h2><p>{text.emptyCopy}</p><button className="button-link" type="button" onClick={clear}>{text.clear}<Arrow /></button></div> :
      filters.view === 'projects' ? <div className="project-index-grid">{selected.slice(0, limit).map(project => {
        const image = project.gallery[0];
        return <article className="project-entry" key={project.slug} style={{ '--project-surface': project.surface } as React.CSSProperties}>
          <a className="project-visual" href={localPath(`/projects/${project.slug}`,language)} aria-label={`${text.explore} ${project.title}`}><img src={image.src} srcSet={image.srcSet} sizes="(max-width: 700px) 100vw, 40vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async" /><span className="project-open">{text.enterSpace}<Arrow /></span></a>
          <div className="project-caption"><div><p className="caption-context">{categoryText[language][project.category]}</p><h2><a href={localPath(`/projects/${project.slug}`,language)}>{project.title}</a></h2></div><a className="project-arrow" href={localPath(`/projects/${project.slug}`,language)} aria-label={`${text.read} ${project.title}`}><Arrow /></a></div>
        </article>;
      })}</div> : <>
        <div className="room-index-grid">{rooms.slice(0, limit).map(image => <figure className="room-entry" key={image.id}>
          <a className="project-visual" href={localPath(`/projects/${image.projectSlug}#${image.id}`,language)} aria-label={`${text.exploreRoom}: ${image.projectTitle}`}><img src={image.src} srcSet={image.srcSet} sizes="(max-width: 700px) 100vw, 40vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async" /><span className="project-open">{text.exploreRoom}<Arrow /></span></a>
          <figcaption><a href={localPath(`/projects/${image.projectSlug}#${image.id}`,language)}>{image.projectTitle}</a><p>{image.rooms.filter(key => roomText[key]).map(key => roomText[key]).join(', ') || text.interiorStudy}</p></figcaption>
        </figure>)}</div>
      </>}
    {results.length > limit && <div className="load-more"><button type="button" className="button-link" onClick={() => { captureLayout(); setLimit(value => value + (filters.view === 'projects' ? 8 : 12)); }}>{filters.view === 'projects' ? text.moreProjects : text.moreSpaces}<Arrow /></button><span>{Math.min(limit, results.length)} {text.of} {results.length}</span></div>}
  </div>;
}

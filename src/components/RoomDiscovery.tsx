import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import type { Project } from '../data/portfolio';
import {ColourRibbon} from './ColourDiscovery';
import {ui,localPath,categoryText,deRooms,deMoods,deConcepts,type Language} from '../lib/i18n';
import { availableOptions, categories, conceptLabels, emptyFilters, matchingItems, moodColours, moodLabels, normaliseFilters, parseFilters, roomLabels, serializeFilters, type Facet, type Filters } from '../lib/discovery';

const Arrow = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" /></svg>;
gsap.registerPlugin(Flip, useGSAP);

export default function RoomDiscovery({ projects, language='en' }: { projects:Project[];language?:Language }) {
  const text=ui[language], roomText=language==='de'?deRooms:roomLabels, moodText=language==='de'?deMoods:moodLabels, conceptText=language==='de'?deConcepts:conceptLabels;
  const prefix=language==='de'?'/de':'';
  const [filters, setFilters] = useState<Filters>({...emptyFilters,view:'rooms'});
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(12);
  const root = useRef<HTMLDivElement>(null);
  const layout = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const fitFilterPanel=()=>{
    const panel=root.current?.querySelector<HTMLElement>('.catalogue-filter-panel[open] .catalogue-filter-content');
    if(!panel)return;
    if(innerHeight-panel.getBoundingClientRect().top<200)root.current?.querySelector('.catalogue-controls')?.scrollIntoView({block:'start',behavior:'instant'});
    panel.style.maxHeight=Math.max(120,Math.min(480,innerHeight-panel.getBoundingClientRect().top-12))+'px';
  };
  const entries = projects.flatMap(project => project.gallery.map(image => ({ ...image, category: project.category, projectTitle: project.title, projectSlug: project.slug })));
  useEffect(() => {
    const restore = () => {
      const next = normaliseFilters(entries, {...parseFilters(window.location.search),view:'rooms'});
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
      const menu = [...(root.current?.querySelectorAll<HTMLDetailsElement>('details[open]')||[])].at(-1);
      if (menu) { menu.open = false; menu.querySelector('summary')?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize',fitFilterPanel);
    return () => {
      window.removeEventListener('popstate', restore);
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize',fitFilterPanel);
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
  const rooms = matchingItems(entries, filters);
  const results = rooms;
  const activeCount = filters.categories.length + filters.rooms.length + filters.moods.length + filters.concepts.length;
  const availableRooms = availableOptions(entries, filters, 'rooms');
  const availableConcepts = availableOptions(entries, filters, 'concepts');
  const availableMoods = availableOptions(entries, filters, 'moods');
  const availableCategories = availableOptions(entries, filters, 'categories');
  const filmProject=projects.find(project=>project.videos.length>0);

  return <div className="explorer" data-ready={ready} data-colour-browsing={filters.moods.length>0} style={filters.moods.length?{'--colour-tone':moodColours[filters.moods[0]]} as CSSProperties:undefined} ref={root}>
    <div className="catalogue-controls">
    <div className="explorer-toolbar">
      <a className="inline-link" href={localPath('/projects',language)}>{text.projects}<Arrow/></a>
      <details className="catalogue-filter-panel" onToggle={event=>{if(event.target!==event.currentTarget)return;if(event.currentTarget.open){fitFilterPanel();return;}event.currentTarget.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(menu=>{menu.open=false;});}}>
        <summary>{language==='de'?'Filter':'Filters'}{activeCount>0&&<span>{activeCount}</span>}<Arrow/></summary>
        <div className="catalogue-filter-content">
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
        <button type="button" className="filter-apply inline-link" onClick={event=>{const panel=event.currentTarget.closest('details');if(panel){panel.open=false;panel.querySelector('summary')?.focus();}}}>{language==='de'?'Ergebnisse ansehen':'View results'} ({results.length})<Arrow/></button>
        </div>
      </details>
    </div>
    </div>
    <div className="catalogue-results-summary"><p className="result-count" role="status" aria-live="polite">{results.length} {text.spaces}{filters.moods.length>0&&' · '+filters.moods.map(key=>moodText[key]).join(', ')}</p>{filmProject&&<a className="catalogue-films" href={localPath(`/projects/${filmProject.slug}#walkthroughs`,language)}>{text.films}<Arrow/></a>}</div>
    {results.length === 0 ? <div className="empty-results"><h2>{text.emptyTitle}</h2><p>{text.emptyCopy}</p><button className="button-link" type="button" onClick={clear}>{text.clear}<Arrow /></button></div> :
      <>
        {filters.moods.length>0?<ColourRibbon key={serializeFilters(filters)} images={rooms.slice(0,limit)} language={language} label={filters.moods.map(key=>moodText[key]).join(', ')}/>:<div className="room-index-grid">{rooms.slice(0, limit).map(image => <figure className="room-entry" key={image.id}>
          <a className="project-visual" href={localPath(`/projects/${image.projectSlug}#${image.id}`,language)} aria-label={`${text.exploreRoom}: ${image.projectTitle}`}><img src={image.src} srcSet={image.srcSet} sizes="(max-width: 700px) 100vw, 40vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async" /><span className="project-open">{text.exploreRoom}<Arrow /></span></a>
          <figcaption><a href={localPath(`/projects/${image.projectSlug}#${image.id}`,language)}>{image.projectTitle}</a><p>{image.rooms.filter(key => roomText[key]).map(key => roomText[key]).join(', ') || text.interiorStudy}</p></figcaption>
        </figure>)}</div>}
      </>}
    {results.length > limit && <div className="load-more"><button type="button" className="button-link" onClick={() => { captureLayout(); setLimit(value => value + (filters.view === 'projects' ? 8 : 12)); }}>{filters.view === 'projects' ? text.moreProjects : text.moreSpaces}<Arrow /></button><span>{Math.min(limit, results.length)} {text.of} {results.length}</span></div>}
  </div>;
}

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from '../data/portfolio';
import { ui, localPath, type Language } from '../lib/i18n';

gsap.registerPlugin(useGSAP);
const Arrow = ({ left = false }: { left?: boolean }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={left ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" /></svg>;

export default function HeroCarousel({ projects, language='en' }: { projects: Project[]; language?:Language }) {
  const text=ui[language];
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[pageVisible,setPageVisible]=useState(true),[reduced,setReduced]=useState(false);
  const [paused,setPaused]=useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const direction = useRef(1);
  const gesture = useRef<number | null>(null);
  const selection = useRef(0);
  const project = projects[index];
  const select = async (next: number) => {
    const target = (next + projects.length) % projects.length;
    if (target === index) return;
    const version = ++selection.current;
    const image = root.current?.querySelector<HTMLImageElement>(`[data-slide="${target}"] img`);
    if (image) { image.loading='eager'; try { await image.decode(); } catch { return; } }
    if (version !== selection.current) return;
    direction.current = next >= index ? 1 : -1;
    setOutgoing(index); setIndex(target);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    if (root.current) observer.observe(root.current);
    const hide = () => setPageVisible(!document.hidden);
    const preference=matchMedia('(prefers-reduced-motion: reduce)'),reduce=()=>setReduced(preference.matches);reduce();preference.addEventListener('change',reduce);
    document.addEventListener('visibilitychange', hide);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hide);preference.removeEventListener('change',reduce); };
  }, []);
  useEffect(() => {
    if (!visible || hovered || focused || !pageVisible || reduced || paused) return;
    const timer = window.setTimeout(() => select(index + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [visible, hovered, focused, pageVisible, reduced, paused, index]);
  useEffect(() => {
    const selected = root.current?.querySelector<HTMLElement>('[data-current="true"]');
    if (selected) selected.parentElement?.scrollTo({ left: Math.max(0, selected.offsetLeft - selected.parentElement.clientWidth / 2 + selected.clientWidth / 2), behavior: 'instant' });
  }, [index]);
  useGSAP(() => {
    if (outgoing === null || !root.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setOutgoing(null); return; }
    const incoming = root.current.querySelector(`[data-slide="${index}"]`);
    const previous = root.current.querySelector(`[data-slide="${outgoing}"]`);
    const stage = root.current.querySelector<HTMLElement>('.showcase-stage');
    const frame = root.current.querySelector('.showcase-frame');
    const start = direction.current > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
    gsap.timeline({ onComplete: () => setOutgoing(null) })
      .fromTo(incoming, { clipPath: start, xPercent: direction.current * 5 }, { clipPath: 'inset(0 0% 0 0%)', xPercent: 0, duration: .7, ease: 'power3.inOut', clearProps: 'clipPath,transform' }, 0)
      .fromTo(previous, { xPercent: 0 }, { xPercent: direction.current * -5, duration: .7, ease: 'power3.inOut', clearProps: 'transform' }, 0)
      .fromTo(frame, { x: direction.current * -(stage?.clientWidth || 800) }, { x: 0, duration: .7, ease: 'power3.inOut', clearProps: 'transform' }, 0)
      .fromTo('.showcase-caption-title', { yPercent: 65 }, { yPercent: 0, duration: .5, ease: 'expo.out', clearProps: 'transform' }, .1)
      .fromTo('.showcase-palette span', { y: 12 }, { y: 0, duration: .4, stagger: .04, ease: 'power2.out', clearProps: 'transform' }, .2);
  }, { scope: root, dependencies: [index], revertOnUpdate: true });

  return <div className="showcase" id="showcase" ref={root} role="region" aria-roledescription={text.carousel} aria-label={text.carouselLabel} aria-describedby="showcase-keys" aria-keyshortcuts="P" data-index={index} data-transitioning={outgoing !== null}
    style={{ '--project-surface': project.surface } as React.CSSProperties}
    onMouseEnter={() => setHovered(true)} onMouseLeave={()=>setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setFocused(false);}}
    onKeyDown={event => {
      if (event.key.toLowerCase()==='p') { event.preventDefault();setPaused(value=>!value); }
      if (event.key === 'ArrowRight') { event.preventDefault(); select(index + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); select(index - 1); }
      if (event.key === 'Home') { event.preventDefault(); select(0); }
      if (event.key === 'End') { event.preventDefault(); select(projects.length - 1); }
    }}>
    <span id="showcase-keys" className="sr-only">{text.autoplayKeys}</span><div className="showcase-window"><div className="showcase-stage" onTouchStart={event => { gesture.current = event.touches[0].clientX; }} onTouchEnd={event => {
      if (gesture.current === null) return;
      const difference = event.changedTouches[0].clientX - gesture.current;
      if (Math.abs(difference) > 50) { if (event.cancelable) event.preventDefault(); select(index + (difference < 0 ? 1 : -1)); }
      gesture.current = null;
    }}>
      {projects.map((item, position) => <div key={item.slug} data-slide={position} className={`showcase-slide ${position === index ? 'is-current' : ''}`} hidden={position !== index && position !== outgoing} inert={position !== index} aria-hidden={position !== index} role="group" aria-roledescription={text.slide} aria-label={`${position + 1} ${text.of} ${projects.length}: ${item.title}`}>
        <a href={localPath(`/projects/${item.slug}`,language)} aria-label={`${text.explore} ${item.title}`}><img src={item.gallery[0].src} srcSet={item.gallery[0].srcSet} sizes="max(100vw, 160svh)" width={item.gallery[0].width} height={item.gallery[0].height} alt={item.gallery[0].caption} loading={position === index || position === (index + 1) % projects.length ? 'eager' : 'lazy'} fetchPriority={position === 0 ? 'high' : 'auto'} decoding="async" /></a>
      </div>)}
      <span className="showcase-frame" aria-hidden="true"></span>
      <div className="showcase-image-controls"><button type="button" onClick={() => select(index - 1)} aria-label={text.previousProject}><Arrow left /></button><button type="button" onClick={() => select(index + 1)} aria-label={text.nextProject}><Arrow /></button></div>
    </div>
    <div className="showcase-caption">
      <div className="showcase-title-window"><a className="showcase-caption-title" href={localPath(`/projects/${project.slug}`,language)} title={project.title}><span>{project.title}</span><Arrow /></a><p>{text.credit}</p></div>
      <p className="showcase-story">{project.intro}</p>
      <div className="showcase-palette" aria-hidden="true">{project.palette.map(colour => <span key={colour.hex} style={{ background: colour.hex }} />)}</div>
      <div className="showcase-controls"><span role="status" aria-live={hovered||focused||reduced?'polite':'off'}>{index + 1} / {projects.length}</span></div>
    </div></div>
    <div className="showcase-strip page-gutter" aria-label={text.chooseProject}>{projects.map((item, position) => <button type="button" key={item.slug} data-current={position === index} aria-pressed={position === index} aria-label={`${text.show} ${item.title}`} onClick={() => select(position)}><img src={item.gallery[0].src} srcSet={item.gallery[0].srcSet} sizes="130px" width={item.gallery[0].width} height={item.gallery[0].height} alt="" loading="lazy" /><span>{String(position + 1).padStart(2, '0')}</span></button>)}</div>
  </div>;
}

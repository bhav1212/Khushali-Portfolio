import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import type { PortfolioImage } from '../data/portfolio';
import { roomLabels } from '../lib/discovery';
import { ui, deRooms, type Language } from '../lib/i18n';
import PanoramaView from './PanoramaView';

gsap.registerPlugin(Flip, useGSAP);
const Arrow = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg>;

export default function Gallery({ images, title, language='en' }: { images:PortfolioImage[];title:string;language?:Language }) {
  const text=ui[language],labels=language==='de'?deRooms:roomLabels;
  const [activeId,setActiveId]=useState(images[0].id),[room,setRoom]=useState<string|null>(null),[open,setOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null);
  const layout=useRef<ReturnType<typeof Flip.getState>|null>(null),frame=useRef(0);
  const rooms=[...new Set(images.flatMap(image=>image.rooms))].filter(key=>labels[key]);
  const matched=room?images.filter(image=>image.rooms.includes(room)):images;
  const current=Math.max(0,matched.findIndex(image=>image.id===activeId));
  const changeRoom=(next:string|null)=>{if(root.current)layout.current=Flip.getState(root.current.querySelectorAll('.board-item'));setRoom(next);};
  useEffect(()=>{
    const restore=()=>{const position=images.findIndex(image=>image.id===location.hash.slice(1));if(position<0)return;setRoom(null);setActiveId(images[position].id);requestAnimationFrame(()=>document.getElementById(images[position].id)?.scrollIntoView({block:'center',behavior:'instant'}));};
    restore();window.addEventListener('hashchange',restore);return()=>{window.removeEventListener('hashchange',restore);cancelAnimationFrame(frame.current);};
  },[]);
  useLayoutEffect(()=>{
    if(!open||!dialog.current)return;
    const element=dialog.current,overflow=document.body.style.overflow;element.showModal();document.body.style.overflow='hidden';element.style.setProperty('--reader-header-height',(element.querySelector<HTMLElement>('.reader-top')!.offsetHeight+12)+'px');
    requestAnimationFrame(()=>element.querySelector<HTMLElement>(`[data-reader-id="${activeId}"]`)?.scrollIntoView({block:'start',behavior:'instant'}));
    return()=>{element.close();document.body.style.overflow=overflow;trigger.current?.focus({preventScroll:true});};
  },[open]);
  useGSAP(()=>{
    if(!layout.current)return;const previous=layout.current;layout.current=null;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    Flip.from(previous,{duration:.45,ease:'expo.out',prune:true,onEnter:elements=>gsap.fromTo(elements,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.35,clearProps:'clipPath'})});
  },{scope:root,dependencies:[room],revertOnUpdate:true});
  useGSAP(()=>{
    if(!open||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const image=dialog.current?.querySelector(`[data-reader-id="${activeId}"] img`);
    if(image)gsap.fromTo(image,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.5,ease:'expo.out',clearProps:'clipPath'});
  },{scope:root,dependencies:[open],revertOnUpdate:true});
  const followScroll=()=>{
    cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>{
      const element=dialog.current;if(!element?.open)return;
      const views=[...element.querySelectorAll<HTMLElement>('[data-reader-id]')],boundary=element.getBoundingClientRect().top+element.clientHeight*.4;
      const view=views.find(item=>item.getBoundingClientRect().bottom>boundary)||views.at(-1),id=view?.dataset.readerId;
      if(id){setActiveId(id);if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);}
    });
  };
  return <div className="view-board" ref={root} role="region" aria-label={`${title}: ${text.gallery}`} data-image={activeId}>
    <div className="board-toolbar"><p>{matched.length} {matched.length===1?text.view:text.views}</p>{rooms.length>1&&<div className="board-rooms" role="group" aria-label={text.focusSpace}><button type="button" aria-pressed={!room} onClick={()=>changeRoom(null)}>{text.allViews}</button>{rooms.map(key=><button key={key} type="button" aria-pressed={room===key} onClick={()=>changeRoom(key)}>{labels[key]}<span>{images.filter(image=>image.rooms.includes(key)).length}</span></button>)}</div>}</div>
    <div className="board-grid" data-count={matched.length}>{matched.map((image,position)=><figure className="board-item" key={image.id} data-active={image.id===activeId} style={{maxWidth:image.width}}>
      <a id={image.id} className="board-visual" href={image.src} aria-label={`${text.openImage} ${position+1}: ${image.caption}`} onClick={event=>{event.preventDefault();trigger.current=event.currentTarget;setActiveId(image.id);history.replaceState(null,'','#'+image.id);setOpen(true);}}>
        <img src={image.src} srcSet={image.srcSet} sizes="(max-width:700px) 45vw,30vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async"/>
        <span className="board-open">{text.openView}<Arrow/></span>
      </a><figcaption title={image.caption}>{image.caption}</figcaption>
    </figure>)}</div>
    <dialog className="view-reader" ref={dialog} aria-label={`${title}: ${text.gallery}`} onScroll={followScroll} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onKeyDown={event=>{if((event.target as Element).closest('.panorama-view[data-enabled="true"]')||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const next=matched[Math.max(0,Math.min(matched.length-1,current+(event.key==='ArrowRight'?1:-1)))];dialog.current?.querySelector<HTMLElement>(`[data-reader-id="${next.id}"]`)?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}} onClick={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
      <div className="reader-top"><div><p>{title}</p><span>{text.readerHint}</span></div><span className="gallery-count" aria-live="polite">{current+1} / {matched.length}</span><button type="button" className="text-control" autoFocus onClick={()=>setOpen(false)}>{text.backBoard}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>
      {open&&matched.map(image=><figure className="reader-view" data-reader-id={image.id} key={image.id}>{image.panoramaSrc?<PanoramaView image={image} language={language}/>:<img src={image.src} srcSet={image.srcSet} sizes="(max-width:700px) 100vw,85vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async" style={{maxWidth:image.width}}/>}<figcaption><p>{image.caption}</p><span>{image.kind}</span></figcaption></figure>)}
    </dialog>
  </div>;
}

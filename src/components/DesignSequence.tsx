import {useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import type {Project} from '../data/portfolio';
import {localPath,ui,type Language} from '../lib/i18n';

gsap.registerPlugin(ScrollTrigger,useGSAP);

export default function DesignSequence({project,language='en'}:{project:Project;language?:Language}){
  const root=useRef<HTMLElement>(null),player=useRef<gsap.core.Timeline|null>(null);
  const current=useRef(0),manual=useRef(false);
  const [step,setStep]=useState(0);
  const labels=language==='de'?['Skizze','Raum','Details']:['Sketch','Space','Details'];
  const images=[project.drawings[0],project.gallery[0],project.gallery[2]||project.gallery[1]||project.gallery[0]];
  const positions=[0,.48,1];
  const select=(next:number)=>{
    current.current=next;manual.current=true;setStep(next);
    const timeline=player.current;
    if(timeline){timeline.scrollTrigger?.disable(false);gsap.to(timeline,{progress:positions[next],duration:.55,ease:'power3.out',overwrite:true});}
    else root.current?.querySelectorAll<HTMLElement>('.design-layer').forEach((layer,index)=>{layer.style.clipPath=index<=next?'inset(0)':'inset(0 100% 0 0)';});
  };
  useGSAP(()=>{
    const media=gsap.matchMedia();
    media.add({animated:'(prefers-reduced-motion: no-preference)',still:'(prefers-reduced-motion: reduce)'},context=>{
      const layers=root.current!.querySelectorAll<HTMLElement>('.design-layer');
      layers.forEach((layer,index)=>gsap.set(layer,{clipPath:index<=current.current?'inset(0)':'inset(0 100% 0 0)'}));
      if(!context.conditions?.animated)return;
      const timeline=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top 75%',end:'bottom 30%',scrub:.4},onUpdate:()=>{
        if(manual.current)return;
        const progress=timeline.progress(),next=progress<.24?0:progress<.72?1:2;
        if(current.current!==next){current.current=next;setStep(next);}
      }});
      timeline.fromTo(layers[1],{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1,ease:'none'},.2)
        .fromTo(layers[2],{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1,ease:'none'},1.65);
      player.current=timeline;
      if(manual.current){timeline.scrollTrigger?.disable(false);timeline.progress(positions[current.current]);}
      return()=>{gsap.killTweensOf(timeline);player.current=null;};
    },root);
    return()=>media.revert();
  },{scope:root});
  return <section className="design-process page-gutter" ref={root} aria-labelledby={`design-title-${project.id}`} data-step={step} style={{'--project-surface':project.surface} as React.CSSProperties}>
    <div className="design-copy"><h2 id={`design-title-${project.id}`}>{language==='de'?'Von der Skizze zum Raum.':'From sketch to space.'}</h2><p>{project.title}</p>
      <div className="design-steps" role="group" aria-label={language==='de'?'Entwurfsansichten':'Design views'}>{labels.map((label,index)=><button type="button" key={label} aria-pressed={step===index} onClick={()=>select(index)}>{label}</button>)}</div>
      <nav className="design-colours" aria-label={ui[language].colours}>{project.palette.map(colour=><a key={colour.hex} href={localPath(`/projects/${project.slug}#${colour.imageId}`,language)} style={{background:colour.hex}} title={`${ui[language].colourView}: ${colour.hex}`} aria-label={`${ui[language].colourView}: ${colour.hex}`}/>)}</nav>
      <a className="inline-link" href={localPath(`/projects/${project.slug}`,language)}>{ui[language].enterSpace}<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg></a>
    </div>
    <div className="design-visual"><div className="design-stage">{images.map((image,index)=><div className="design-layer" key={`${image.id}-${index}`} aria-hidden={step!==index} style={{clipPath:index===0?'inset(0)':'inset(0 100% 0 0)'}}><img src={image.src} srcSet={image.srcSet} sizes="(max-width:700px) 100vw,65vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async"/></div>)}</div><p className="design-caption">{images[step].caption}</p></div>
  </section>;
}
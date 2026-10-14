import {useEffect,useRef,useState,type CSSProperties} from 'react';
import type {PortfolioImage,Project} from '../data/portfolio';
import {deMoods,localPath,ui,type Language} from '../lib/i18n';
import {moodColours,moodLabels} from '../lib/discovery';

type ColourImage=PortfolioImage&{projectTitle:string;projectSlug:string};
const Arrow=({back=false}:{back?:boolean})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={back?{transform:'rotate(180deg)'}:undefined}><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg>;

export function ColourRibbon({images,language,label}:{images:ColourImage[];language:Language;label:string}){
  const rail=useRef<HTMLDivElement>(null),[edges,setEdges]=useState({start:true,end:false});
  const update=()=>{const element=rail.current;if(element)setEdges({start:element.scrollLeft<2,end:element.scrollLeft+element.clientWidth>=element.scrollWidth-2});};
  useEffect(()=>{
    const element=rail.current;if(!element)return;
    update();
    const observer=new ResizeObserver(update);observer.observe(element);return()=>observer.disconnect();
  },[images]);
  const move=(direction:number)=>{const element=rail.current;if(element)element.scrollBy({left:direction*element.clientWidth*.85,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
  return <div className="colour-ribbon">
    <div className="colour-photo-rail" ref={rail} tabIndex={0} role="region" aria-label={label} onScroll={update} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}}}>
      {images.map(image=><figure className="colour-photo" key={image.id} data-image-id={image.id}>
        <a href={localPath(`/projects/${image.projectSlug}#${image.id}`,language)} aria-label={`${ui[language].exploreRoom}: ${image.projectTitle}`}><img src={image.src} srcSet={image.srcSet} sizes="(max-width:700px) 110vw,800px" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async"/></a>
        <figcaption><a href={localPath(`/projects/${image.projectSlug}#${image.id}`,language)}>{image.projectTitle}<Arrow/></a></figcaption>
      </figure>)}
    </div>
    <div className="colour-ribbon-controls page-gutter"><span>{ui[language].colourBrowseHint}</span><div>
      <button type="button" aria-label={ui[language].previousColourPhotos} disabled={edges.start} onClick={()=>move(-1)}><Arrow back/></button>
      <button type="button" aria-label={ui[language].nextColourPhotos} disabled={edges.end} onClick={()=>move(1)}><Arrow/></button>
    </div></div>
  </div>;
}

export default function ColourDiscovery({projects,language='en'}:{projects:Project[];language?:Language}){
  const [mood,setMood]=useState('warm-neutrals'),labels=language==='de'?deMoods:moodLabels;
  const available=new Set(projects.flatMap(project=>project.gallery.flatMap(image=>image.moods)));
  const images=projects.flatMap(project=>{const image=project.gallery.find(image=>image.moods.includes(mood));return image?[{...image,projectTitle:project.title,projectSlug:project.slug}]:[];}).slice(0,6);
  return <div className="colour-discovery" style={{'--colour-tone':moodColours[mood]} as CSSProperties}>
    <nav className="colour-theme-controls page-gutter" aria-label={ui[language].colourThemes}>{Object.entries(labels).filter(([key])=>available.has(key)).map(([key,label])=><button type="button" key={key} aria-pressed={mood===key} data-mood={key} onClick={()=>setMood(key)}><span style={{background:moodColours[key]}} aria-hidden="true"/>{label}</button>)}</nav>
    <ColourRibbon key={mood} images={images} language={language} label={labels[mood]}/>
    <a className="colour-all inline-link" href={localPath(`/projects?view=rooms&mood=${mood}`,language)}>{ui[language].allColourSpaces}: {labels[mood]}<Arrow/></a>
  </div>;
}

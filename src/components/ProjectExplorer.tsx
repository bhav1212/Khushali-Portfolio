import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {Flip} from 'gsap/Flip';
import {useGSAP} from '@gsap/react';
import type {Project} from '../data/portfolio';
import {ui,localPath,type Language} from '../lib/i18n';
import {projectSectionFromSearch,projectMatchesSection,sectionQuery,type ProjectSection} from '../lib/projectSections';
import ProjectCategoryNav from './ProjectCategoryNav';
import RoomDiscovery from './RoomDiscovery';

gsap.registerPlugin(Flip,useGSAP);
export default function ProjectExplorer({projects,language='en'}:{projects:Project[];language?:Language}){
  const text=ui[language],root=useRef<HTMLDivElement>(null),layout=useRef<ReturnType<typeof Flip.getState>|null>(null);
  const [section,setSection]=useState<ProjectSection>('residential'),[rooms,setRooms]=useState(false),[limit,setLimit]=useState(6);
  useEffect(()=>{const restore=()=>{setRooms(new URLSearchParams(location.search).get('view')==='rooms');setSection(projectSectionFromSearch(location.search));setLimit(6);};restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);},[]);
  const choose=(next:ProjectSection)=>{if(root.current)layout.current=Flip.getState(root.current.querySelectorAll('.project-entry'));setSection(next);setLimit(6);history.pushState(null,'',localPath('/projects?category='+encodeURIComponent(sectionQuery[next]),language));};
  useGSAP(()=>{if(!layout.current)return;const state=layout.current;layout.current=null;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;Flip.from(state,{duration:.28,scale:true,ease:'power2.out',prune:true});},{scope:root,dependencies:[section],revertOnUpdate:true});
  if(rooms)return <RoomDiscovery projects={projects} language={language}/>;
  const selected=projects.filter(project=>projectMatchesSection(project.category,section));
  return <div className="simple-project-catalogue" ref={root}><ProjectCategoryNav language={language} active={section} onSelect={choose}/><div className="simple-project-list">{selected.slice(0,limit).map(project=><article className="project-entry simple-project-row" key={project.id}>
    <h2><a href={localPath(`/projects/${project.slug}`,language)}>{project.title}</a></h2>
    <a className="simple-project-image" href={localPath(`/projects/${project.slug}`,language)} aria-label={`${text.explore} ${project.title}`}><img src={project.gallery[0].src} srcSet={project.gallery[0].srcSet} sizes="(max-width:700px) 100vw,600px" width={project.gallery[0].width} height={project.gallery[0].height} alt={project.gallery[0].caption} loading="lazy" decoding="async"/></a>
  </article>)}</div>{selected.length>limit&&<div className="load-more"><button type="button" className="inline-link" onClick={()=>setLimit(value=>value+6)}>{text.moreProjects}<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>}</div>;
}

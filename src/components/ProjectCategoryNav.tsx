import {ui,localPath,type Language} from '../lib/i18n';
import {projectSections,sectionQuery,type ProjectSection} from '../lib/projectSections';
export default function ProjectCategoryNav({language,active,onSelect}:{language:Language;active:ProjectSection;onSelect?:(section:ProjectSection)=>void}){
  const text=ui[language],labels={residential:text.residential,commercial:text.commercial,exterior:text.exterior,plans:text.plans};
  return <nav className="project-sections" aria-label={text.projectCategories}>{projectSections.map(section=><a key={section} href={localPath(section==='plans'?'/plans':`/projects?category=${encodeURIComponent(sectionQuery[section])}`,language)} aria-current={active===section?'page':undefined} onClick={event=>{if(section==='plans'||!onSelect||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onSelect(section);}}>{labels[section]}</a>)}</nav>;
}

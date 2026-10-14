export type ProjectSection='residential'|'commercial'|'exterior'|'plans';
export const projectSections:ProjectSection[]=['residential','commercial','exterior','plans'];
export const sectionQuery:Record<ProjectSection,string>={residential:'Residential',commercial:'Commercial',exterior:'Landscape / Outdoor',plans:''};
export function projectSectionFromSearch(search:string):ProjectSection{
  const category=new URLSearchParams(search).get('category');
  return category==='Commercial'||category==='Workspaces'?'commercial':category==='Landscape / Outdoor'||category==='Exterior'?'exterior':'residential';
}
export function projectMatchesSection(category:string,section:ProjectSection):boolean{
  return section==='commercial'?category==='Commercial'||category==='Workspaces':section==='residential'?category==='Residential':section==='exterior'?category==='Landscape / Outdoor':false;
}

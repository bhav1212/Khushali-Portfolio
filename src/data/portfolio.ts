import projectData from './projects.json';
import portraitData from './portrait.json';
import copyData from './project-copy.json';
import { ui, type Language } from '../lib/i18n';

export interface PortfolioImage {
  id: string;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  caption: string;
  rooms: string[];
  moods: string[];
  concepts: string[];
  materials: string[];
  kind: string;
  palette: string[];
  panoramaSrc?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  intro: string;
  detail: string;
  surface: string;
  featured: boolean;
  palette: { hex: string; imageId: string }[];
  gallery: PortfolioImage[];
  drawings: { id: string; src: string; srcSet: string; width: number; height: number; caption: string }[];
  videos: { src: string; poster: string; label: string }[];
  study?: boolean;
}

export const projects: Project[] = projectData;
export const portrait = portraitData;
export const featured = projects.filter(project => project.featured);
export const contactEmail = 'mail@iamkhushali.com';
interface ProjectCopy { title:string; intro:string; detail:string; gallery:{id:string;caption:string;materials:string[]}[]; drawings:{id:string;caption:string}[]; videos:{label:string}[]; }
export function translatedProjects(language: Language): Project[] {
  const copies = copyData as Record<string,Record<Language,ProjectCopy>>;
  return projects.map(project => {
    const copy = copies[project.id]?.[language];
    if (!copy) throw new Error(`Missing ${language} copy for ${project.id}`);
    return { ...project, title:copy.title, intro:copy.intro, detail:copy.detail,
      gallery:project.gallery.map(image => { const text=copy.gallery.find(item=>item.id===image.id)!;return {...image,caption:text.caption,materials:text.materials,kind:image.panoramaSrc?ui[language].panoramaVisualisation:project.study?ui[language].designStudy:ui[language].visualisation}; }),
      drawings:project.drawings.map(image=>({...image,caption:copy.drawings.find(item=>item.id===image.id)!.caption})),
      videos:project.videos.map((video,index)=>({...video,label:copy.videos[index].label})),
    };
  });
}

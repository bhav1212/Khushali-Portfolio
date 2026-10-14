import type {APIRoute} from 'astro';
import {projects} from '../data/portfolio';
import {localPath} from '../lib/i18n';

export const GET:APIRoute=({site})=>{
  const paths=['/','/projects/','/plans/','/about/','/contact/',...projects.map(project=>`/projects/${project.slug}/`)];
  const urls=paths.flatMap(path=>(['en','de'] as const).map(language=>{
    const url=(lang:'en'|'de')=>new URL(localPath(path,lang),site).href;
    return `<url><loc>${url(language)}</loc><xhtml:link rel="alternate" hreflang="en" href="${url('en')}"/><xhtml:link rel="alternate" hreflang="de-DE" href="${url('de')}"/><xhtml:link rel="alternate" hreflang="x-default" href="${url('en')}"/></url>`;
  }));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};

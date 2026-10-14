import {useEffect,useRef,useState} from 'react';
import type {PortfolioImage} from '../data/portfolio';
import {ui,type Language} from '../lib/i18n';

type Viewer={destroy():void;on(event:string,callback:()=>void):void;getYaw():number;getPitch():number;getHfov():number;setYaw(value:number):void;setPitch(value:number):void;setHfov(value:number):void};
declare global {interface Window {pannellum:{viewer:(element:HTMLElement,options:Record<string,unknown>)=>Viewer};}}
let loaded:Promise<void>|null=null;
function loadViewer(){
  if(window.pannellum)return Promise.resolve();
  if(!loaded)loaded=new Promise<void>((resolve,reject)=>{
    if(!document.querySelector('[data-panorama-style]')){const style=document.createElement('link');style.rel='stylesheet';style.href='/vendor/pannellum.css';style.dataset.panoramaStyle='true';document.head.append(style);}
    const script=document.createElement('script');script.src='/vendor/pannellum.js';script.onload=()=>resolve();script.onerror=()=>{script.remove();loaded=null;reject(new Error('Viewer unavailable'));};document.head.append(script);
  });
  return loaded;
}

export default function PanoramaView({image,language}:{image:PortfolioImage;language:Language}){
  const text=ui[language],root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null);
  const controller=useRef<Viewer|null>(null);
  const [enabled,setEnabled]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)setEnabled(false);},{threshold:.05});if(root.current)observer.observe(root.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{
    if(!enabled)return;let cancelled=false,viewer:Viewer|undefined;setReady(false);setError(false);
    loadViewer().then(()=>{if(cancelled||!stage.current)return;viewer=window.pannellum.viewer(stage.current,{type:'equirectangular',panorama:image.panoramaSrc,autoLoad:true,hfov:90,minHfov:30,maxHfov:120,showFullscreenCtrl:false,showZoomCtrl:false,mouseZoom:false,disableKeyboardCtrl:true,strings:{loadingLabel:text.panoramaLoading}});controller.current=viewer;viewer.on('load',()=>setReady(true));viewer.on('error',()=>setError(true));}).catch(()=>setError(true));
    return()=>{cancelled=true;viewer?.destroy();controller.current=null;};
  },[enabled]);
  return <div className="panorama-view" ref={root} data-enabled={enabled} data-ready={ready} onKeyDown={event=>{const viewer=controller.current;if(!viewer||!event.key.startsWith('Arrow'))return;event.preventDefault();if(event.key==='ArrowLeft'||event.key==='ArrowRight')viewer.setYaw(viewer.getYaw()+(event.key==='ArrowRight'?10:-10));else viewer.setPitch(Math.max(-80,Math.min(80,viewer.getPitch()+(event.key==='ArrowUp'?10:-10))));}}>
    <img className="panorama-preview" src={image.src} srcSet={image.srcSet} sizes="85vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" hidden={enabled&&ready&&!error}/>
    {enabled&&!error&&<div className="panorama-stage" ref={stage} role="img" aria-label={`${image.caption}. ${text.lookAround}`}/>}
    <div className="panorama-actions"><span>{enabled&&!error?text.lookAround:text.panoramaLabel}</span><div className="panorama-buttons">{enabled&&!error&&<><button type="button" aria-label={text.zoomOut} disabled={!ready} onClick={()=>{const viewer=controller.current;if(viewer)viewer.setHfov(Math.min(120,viewer.getHfov()+10));}}><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.5"/></svg></button><button type="button" aria-label={text.zoomIn} disabled={!ready} onClick={()=>{const viewer=controller.current;if(viewer)viewer.setHfov(Math.max(30,viewer.getHfov()-10));}}><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.5"/></svg></button></>}<button type="button" className="text-control" onClick={()=>setEnabled(value=>!value)}>{enabled?text.stillView:text.openPanorama}</button></div></div>
    {error&&<p className="panorama-error" role="status">{text.panoramaError}</p>}
  </div>;
}

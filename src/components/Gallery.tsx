import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {Flip} from 'gsap/Flip';
import {useGSAP} from '@gsap/react';
import type {PortfolioImage} from '../data/portfolio';
import {roomLabels} from '../lib/discovery';
import {ui,deRooms,type Language} from '../lib/i18n';
import PanoramaView from './PanoramaView';

gsap.registerPlugin(Flip,useGSAP);
const Arrow=()=> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg>;

export default function Gallery({images,title,language='en'}:{images:PortfolioImage[];title:string;language?:Language}){
  const text=ui[language],labels=language==='de'?deRooms:roomLabels;
  const [activeId,setActiveId]=useState(images[0].id),[room,setRoom]=useState<string|null>(null),[open,setOpen]=useState(false),[compareId,setCompareId]=useState<string|null>(null),[zoom,setZoom]=useState(1),[photoSrc,setPhotoSrc]=useState('');
  const root=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null),picture=useRef<HTMLImageElement>(null);
  const layout=useRef<ReturnType<typeof Flip.getState>|null>(null),request=useRef(0),pan=useRef({x:0,y:0}),drag=useRef<{x:number;y:number;px:number;py:number}|null>(null);
  const rooms=[...new Set(images.flatMap(image=>image.rooms))].filter(key=>labels[key]);
  const matched=room?images.filter(image=>image.rooms.includes(room)):images;
  const active=matched.find(image=>image.id===activeId)||matched[0],companion=matched.find(image=>image.id===compareId);
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resetZoom=()=>{setZoom(1);pan.current={x:0,y:0};if(picture.current){gsap.killTweensOf(picture.current);gsap.set(picture.current,{x:0,y:0,scale:1});}};
  const movePan=(dx:number,dy:number)=>{const image=picture.current,area=image?.parentElement;if(!image||!area)return;const aspect=active.width/active.height,w=Math.min(image.offsetWidth,image.offsetHeight*aspect),h=w/aspect,maxX=Math.max(0,(w*zoom-area.clientWidth)/2),maxY=Math.max(0,(h*zoom-area.clientHeight)/2);pan.current={x:Math.max(-maxX,Math.min(maxX,pan.current.x+dx)),y:Math.max(-maxY,Math.min(maxY,pan.current.y+dy))};gsap.set(image,pan.current);};
  const choose=(image:PortfolioImage,preview?:HTMLImageElement)=>{
    resetZoom();setActiveId(image.id);setPhotoSrc(preview?.currentSrc||image.src);history.replaceState(null,'','#'+image.id);
    const version=++request.current,high=new Image();high.src=image.src;high.decode().then(()=>{if(request.current===version)setPhotoSrc(image.src);}).catch(()=>{});
  };
  const changeRoom=(next:string|null)=>{if(root.current)layout.current=Flip.getState(root.current.querySelectorAll('.board-item'));setRoom(next);};
  useEffect(()=>{
    const restore=()=>{const image=images.find(item=>item.id===location.hash.slice(1));if(!image)return;setRoom(null);setActiveId(image.id);requestAnimationFrame(()=>document.getElementById(image.id)?.scrollIntoView({block:'center',behavior:'instant'}));};restore();window.addEventListener('hashchange',restore);return()=>window.removeEventListener('hashchange',restore);
  },[]);
  useLayoutEffect(()=>{
    if(!open||!dialog.current)return;const element=dialog.current,overflow=document.body.style.overflow;element.showModal();document.body.style.overflow='hidden';
    return()=>{element.close();document.body.style.overflow=overflow;trigger.current?.focus({preventScroll:true});};
  },[open]);
  useGSAP(()=>{
    if(!layout.current)return;const previous=layout.current;layout.current=null;if(reduced())return;
    if(matched.length===2){gsap.fromTo('.board-visual',{clipPath:'inset(0 0 12% 0)'},{clipPath:'inset(0)',duration:.2,clearProps:'clipPath'});return;}
    Flip.from(previous,{duration:.3,scale:true,ease:'power2.out',prune:true});
  },{scope:root,dependencies:[room],revertOnUpdate:true});
  useGSAP(()=>{
    const body=dialog.current?.querySelector('.proof-body');if(!open||reduced()||!body)return;gsap.fromTo(body,{y:12,clipPath:'inset(0 0 6% 0)'},{y:0,clipPath:'inset(0)',duration:.24,ease:'power2.out',clearProps:'transform,clipPath'});
  },{scope:root,dependencies:[open],revertOnUpdate:true});
  useGSAP(()=>{pan.current={x:0,y:0};if(picture.current)gsap.to(picture.current,{scale:zoom,x:0,y:0,duration:reduced()?0:.2,ease:'power2.out'});},{dependencies:[zoom],scope:root});
  const renderImage=(image:PortfolioImage,primary:boolean)=>image.panoramaSrc&&!companion?<PanoramaView key={image.id} image={image} language={language}/>:<img className="proof-photo" data-flip-id={'view-'+image.id} ref={primary?picture:undefined} src={primary?photoSrc||image.src:image.src} width={image.width} height={image.height} alt={image.caption} decoding="async" draggable={false} style={{maxWidth:`min(100%, ${image.width}px)`}}/>;
  return <div className="view-board" ref={root} role="region" aria-label={`${title}: ${text.gallery}`} data-image={active.id}>
    <div className="board-toolbar"><p>{matched.length} {matched.length===1?text.view:text.views}</p>{rooms.length>1&&<div className="board-rooms" role="group" aria-label={text.focusSpace}><button type="button" aria-pressed={!room} onClick={()=>changeRoom(null)}>{text.allViews}</button>{rooms.map(key=><button key={key} type="button" aria-pressed={room===key} onClick={()=>changeRoom(key)}>{labels[key]}<span>{images.filter(image=>image.rooms.includes(key)).length}</span></button>)}</div>}</div>
    <div className="board-grid" data-count={matched.length}>{matched.map((image,position)=><figure className="board-item" key={image.id} data-active={image.id===active.id} style={{maxWidth:image.width}}><a id={image.id} className="board-visual" href={image.src} aria-label={`${text.openImage} ${position+1}: ${image.caption}`} onClick={event=>{event.preventDefault();trigger.current=event.currentTarget;const preview=event.currentTarget.querySelector('img')!;choose(image,preview);setCompareId(null);setOpen(true);}}><img data-flip-id={'view-'+image.id} src={image.src} srcSet={image.srcSet} sizes="(max-width:700px) 45vw,30vw" width={image.width} height={image.height} alt={image.caption} loading="lazy" decoding="async"/><span className="board-open">{text.openView}<Arrow/></span></a><figcaption title={image.caption}>{image.caption}</figcaption></figure>)}</div>
    <dialog ref={dialog} className="view-reader proof-table" aria-label={`${title}: ${text.gallery}`} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} onKeyDown={event=>{if((event.target as Element).closest('.panorama-view[data-enabled="true"]'))return;if(zoom>1&&event.key.startsWith('Arrow')){event.preventDefault();movePan(event.key==='ArrowLeft'?40:event.key==='ArrowRight'?-40:0,event.key==='ArrowUp'?40:event.key==='ArrowDown'?-40:0);return;}if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const index=matched.findIndex(image=>image.id===active.id),next=matched[(index+(event.key==='ArrowRight'?1:-1)+matched.length)%matched.length];choose(next);setCompareId(null);}}>
      <div className="proof-top"><p>{title}</p><div className="proof-tools">{matched.length>1&&<button type="button" className="text-control" aria-pressed={Boolean(companion)} onClick={()=>{resetZoom();setCompareId(companion?null:matched.find(image=>image.id!==active.id)!.id);}}>{text.compareViews}</button>}{!companion&&!active.panoramaSrc&&<button type="button" className="text-control" aria-pressed={zoom>1} onClick={()=>setZoom(value=>value===1?2:1)}>{zoom===1?text.zoomIn:text.fitView}</button>}<button type="button" className="text-control" autoFocus onClick={()=>setOpen(false)}>{text.backBoard}<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5"/></svg></button></div></div>
      {open&&<div className="proof-body"><div className="proof-stage" data-comparing={Boolean(companion)}><figure className="proof-primary"><div className="proof-media" data-zoomed={zoom>1} onDoubleClick={()=>{if(!active.panoramaSrc&&!companion)setZoom(value=>value===1?2:1);}} onPointerDown={event=>{if(zoom===1||active.panoramaSrc)return;drag.current={x:event.clientX,y:event.clientY,px:pan.current.x,py:pan.current.y};event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event=>{const start=drag.current;if(!start)return;movePan(start.px+event.clientX-start.x-pan.current.x,start.py+event.clientY-start.y-pan.current.y);}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>{renderImage(active,true)}</div><figcaption>{active.caption}</figcaption></figure>{companion&&<figure className="proof-companion"><div className="proof-media">{renderImage(companion,false)}</div><figcaption>{companion.caption}</figcaption></figure>}</div><aside className="proof-overview"><p>{companion?text.pickComparison:text.chooseImage}</p><div className="proof-picks">{matched.map((image,index)=><button type="button" key={image.id} aria-label={`${text.showImage} ${index+1}: ${image.caption}`} aria-pressed={image.id===active.id||image.id===companion?.id} onClick={event=>{if(companion){if(image.id!==active.id)setCompareId(image.id);}else choose(image,event.currentTarget.querySelector('img')!);}}><img src={image.src} srcSet={image.srcSet} sizes="130px" width={image.width} height={image.height} alt=""/><span>{index+1}</span></button>)}</div></aside></div>}
    </dialog>
  </div>;
}

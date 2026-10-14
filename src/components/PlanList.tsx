import {useState} from 'react';
import {ui,type Language} from '../lib/i18n';
type Sheet={id:string;title:{en:string;de:string};src:string;width:number;height:number};
export default function PlanList({sheets,language}:{sheets:Sheet[];language:Language}){
 const [limit,setLimit]=useState(6),text=ui[language];
 return <div className="simple-project-catalogue"><div className="simple-project-list simple-plan-list">{sheets.slice(0,limit).map(sheet=><article className="simple-project-row plan-entry" key={sheet.id}><h2><a href={sheet.src} target="_blank" rel="noopener">{sheet.title[language]}</a></h2><a className="simple-project-image" href={sheet.src} target="_blank" rel="noopener" aria-label={`${text.openPlan}: ${sheet.title[language]}`}><img src={sheet.src} width={sheet.width} height={sheet.height} alt={sheet.title[language]} loading="lazy"/></a></article>)}</div>{sheets.length>limit&&<div className="load-more"><button className="inline-link" type="button" onClick={()=>setLimit(value=>value+6)}>{text.morePlans}<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>}</div>;
}

async(page)=>{
 const checks=[],errors=[];const check=(name,pass)=>{checks.push({name,pass:Boolean(pass)});};page.on('pageerror',error=>errors.push(error.message));
 const ready=async()=>{await page.waitForFunction(()=>!document.querySelector('astro-island[ssr]'));await page.evaluate(()=>document.fonts.ready);};
 const decode=async()=>page.locator('.colour-photo img').evaluateAll(async images=>{for(const image of images)image.loading='eager';await Promise.all(images.map(image=>image.decode().catch(()=>{})));});
 for(const [language,prefix] of [['en',''],['de','/de']]){
  await page.setViewportSize({width:1440,height:1000});await page.goto('http://localhost:4321'+prefix+'/');await ready();
  const island=page.locator('astro-island').filter({has:page.locator('.colour-discovery')});const properties=await island.getAttribute('props');const decodeProp=([type,value])=>type===1?value.map(decodeProp):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,value])=>[key,decodeProp(value)])):value;
  const projects=decodeProp(JSON.parse(properties).projects);const images=new Map(projects.flatMap(project=>project.gallery.map(image=>[image.id,image])));
  const themes=await page.locator('.colour-theme-controls button').evaluateAll(buttons=>buttons.map(button=>button.dataset.mood));
  check(language+' all eight actual themes available',themes.length===8);
  for(const mood of themes){
   await page.locator(`[data-mood="${mood}"]`).click();await page.waitForTimeout(450);
   const shown=await page.locator('.colour-discovery .colour-photo').evaluateAll(photos=>photos.map(photo=>photo.dataset.imageId));
   check(language+' '+mood+' contains matching photos',shown.length>0&&shown.every(id=>images.get(id)?.moods.includes(mood)));
   check(language+' '+mood+' selected state and all-results link',await page.locator(`[data-mood="${mood}"]`).getAttribute('aria-pressed')==='true'&&(await page.locator('.colour-all').getAttribute('href')).includes('mood='+mood));
  }
  for(const [profile,width,height] of [['desktop',1440,1000],['phone',390,844],['ipad',820,1180]]){
   await page.setViewportSize({width,height});await page.locator('[data-mood="blue-cool"]').click();await decode();await page.waitForTimeout(450);await page.locator('#discover').scrollIntoViewIfNeeded();
   check(language+profile+' no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const rail=page.locator('.colour-discovery .colour-photo-rail');
   check(language+profile+' ribbon scrolls horizontally',await rail.evaluate(element=>element.scrollWidth>element.clientWidth));
   check(language+profile+' photos retain source aspect ratio',await page.locator('.colour-discovery .colour-photo img').evaluateAll(images=>images.every(image=>Math.abs(image.clientWidth/image.clientHeight-Number(image.getAttribute('width'))/Number(image.getAttribute('height')))<.02)));
   await page.screenshot({path:'output/playwright/colour-ribbon-'+language+'-'+profile+'.png',scale:'css'});
   await page.locator('.colour-discovery .colour-ribbon-controls button').last().click();await page.waitForTimeout(900);check(language+profile+' next arrow moves ribbon',await rail.evaluate(element=>element.scrollLeft>100));
   await rail.focus();const before=await rail.evaluate(element=>element.scrollLeft);await page.keyboard.press('ArrowLeft');await page.waitForTimeout(900);check(language+profile+' keyboard moves ribbon',await rail.evaluate((element,before)=>element.scrollLeft<before,before));
  }
  const target=await page.locator('.colour-discovery .colour-photo a').first().getAttribute('href');await page.locator('.colour-all').click();await ready();await decode();
  check(language+' full colour results are horizontal',await page.locator('.explorer[data-colour-browsing="true"] .colour-photo-rail').count()===1);
  const rail=page.locator('.colour-photo-rail');await rail.evaluate(element=>element.scrollLeft=500);await page.waitForTimeout(300);const before=await rail.evaluate(element=>element.scrollLeft);
  while(await page.locator('.load-more button').count())await page.locator('.load-more button').click();
  check(language+' every blue image remains reachable',await page.locator('.colour-photo').count()===26);
  check(language+' showing more preserves horizontal position',Math.abs(await rail.evaluate(element=>element.scrollLeft)-before)<2);
  await page.setViewportSize({width:1440,height:1000});await rail.evaluate(element=>element.scrollLeft=0);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'output/playwright/colour-results-'+language+'-desktop.png',scale:'css'});
  await page.goto('http://localhost:4321'+target);await ready();check(language+' image links open the correct project',await page.locator('.board-item[data-active="true"]').count()===1||await page.locator('.board-focus[data-open="true"]').count()===1);
  await page.goto('http://localhost:4321'+prefix+'/projects');await ready();check(language+' overview stays at four categories',await page.locator('.project-sections a').count()===4&&await page.locator('.simple-project-row').count()===6);
  await page.goto('http://localhost:4321'+prefix+'/projects?view=rooms&room=bedroom');await ready();check(language+' ordinary room browsing retains its board',await page.locator('.room-index-grid .room-entry').count()>0);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4321/');await ready();check('reduced motion removes theme entrance',await page.locator('.colour-discovery .colour-photo').first().evaluate(element=>getComputedStyle(element).animationName==='none'));
 check('no browser errors',errors.length===0);return{checks,failed:checks.filter(check=>!check.pass),errors};
}

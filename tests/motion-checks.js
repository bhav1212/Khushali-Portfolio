async(page,base='http://localhost:4321')=>{
  const checks=[],errors=[],captures=[];
  const check=(name,pass,detail)=>checks.push({name,pass:Boolean(pass),detail});
  page.on('pageerror',error=>errors.push(error.message));
  const ready=async()=>{await page.waitForFunction(()=>!document.querySelector('astro-island[ssr]'));await page.evaluate(()=>document.fonts.ready);};
  const settled=()=>page.waitForFunction(()=>!document.querySelector('[data-motion-image]'));
  const capture=async(name)=>{const path=`output/playwright/motion-${name}.png`;await page.screenshot({path});captures.push(path);};
  for(const [language,prefix] of [['en',''],['de','/de']])for(const [profile,width,height] of [['desktop',1440,900],['phone',390,844],['ipad',820,1180]]){
    const label=`${language} ${profile}`;
    await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width,height});
    await page.goto(base+prefix+'/');await ready();await page.locator('.home-scene').waitFor();await page.waitForTimeout(1000);
    check(label+' home fits viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    check(label+' hero uses a full-width image',await page.locator('.showcase-stage').evaluate(element=>element.clientWidth>=document.body.clientWidth-2));
    const frames=[];
    for(const index of [0,6,7,0]){
      await page.locator('.showcase-strip button').nth(index).click();
      await page.waitForFunction(index=>document.querySelector('.showcase')?.getAttribute('data-index')===String(index),index);
      await page.waitForFunction(()=>document.querySelector('.showcase')?.getAttribute('data-transitioning')==='false');
      frames.push(await page.locator('.showcase-window').evaluate(element=>({height:element.clientHeight,strip:element.nextElementSibling.getBoundingClientRect().top+scrollY})));
    }
    check(label+' carousel keeps its frame',frames.every(frame=>Math.abs(frame.height-frames[0].height)<1&&Math.abs(frame.strip-frames[0].strip)<1),frames);
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(450);await capture(`${language}-${profile}-opening`);
    const sequence=page.locator('.design-process');await sequence.scrollIntoViewIfNeeded();await page.waitForTimeout(650);
    const scrollClip=await sequence.locator('.design-layer').nth(1).evaluate(element=>getComputedStyle(element).clipPath);
    check(label+' scrolling develops the room image',!scrollClip.includes('100%'),scrollClip);
    const palettePositions=[];
    for(const step of [0,1,2]){
      await sequence.locator('.design-steps button').nth(step).click();await page.waitForTimeout(600);
      check(label+` design stage ${step} is selectable`,await sequence.getAttribute('data-step')===String(step)&&await sequence.locator('.design-layer').nth(step).evaluate(element=>!getComputedStyle(element).clipPath.includes('100%')));
      palettePositions.push(await sequence.locator('.design-colours a').evaluateAll(elements=>elements.map(element=>{const bounds=element.getBoundingClientRect();return {left:bounds.left,top:bounds.top+scrollY,width:bounds.width,height:bounds.height};})));
    }
    check(label+' sequence palette remains fixed',palettePositions.every(positions=>positions.every((position,index)=>Object.keys(position).every(key=>Math.abs(position[key]-palettePositions[0][index][key])<1))),palettePositions);
    await capture(`${language}-${profile}-sequence`);
    await page.goto(base+prefix+'/projects');await ready();
    const catalogue=page.locator('.catalogue-entry').first();
    check(label+' catalogue pairs real image views',await catalogue.locator('.catalogue-detail img').count()===1);
    await page.locator('.primary-nav a').first().hover();await page.waitForTimeout(300);
    check(label+' header has one underline system',await page.locator('.primary-nav a').first().evaluate(element=>getComputedStyle(element).textDecorationLine==='none'&&getComputedStyle(document.querySelector('.nav-position')).visibility==='visible'));
    await page.locator('.view-controls button').nth(1).click();await page.locator('.filter-facet summary').first().click();
    await page.locator('.facet-options input').first().check();await page.keyboard.press('Escape');await page.waitForTimeout(550);
    check(label+' filters retain matching images',await page.locator('.room-entry').count()>0&&await page.locator('.empty-results').count()===0);
    check(label+' filter closes on Escape',await page.locator('.filter-facet[open]').count()===0);
    const roomLink=page.locator('.room-entry a.project-visual').first();const destination=await roomLink.getAttribute('href');
    await roomLink.click();await ready();check(label+' image links retain selection',new URL(page.url()).hash===new URL(destination,base).hash);
    await page.goto(base+prefix+'/projects/a-home-in-teal-and-timber');await ready();
    await page.locator('.board-rooms button').filter({hasText:language==='de'?'Schlafzimmer':'Bedrooms'}).click();await page.waitForTimeout(350);
    check(label+' filtered image pair stays horizontal',await page.locator('.board-item').evaluateAll(items=>{const bounds=items.map(item=>item.getBoundingClientRect());return bounds.length===2&&Math.abs(bounds[0].top-bounds[1].top)<1&&bounds[1].left>bounds[0].left;}));
    await page.locator('.board-rooms button').first().click();await page.waitForTimeout(350);
    check(label+' overview precedes full board and story',await page.evaluate(()=>document.querySelector('.case-overview img')&&document.querySelector('#gallery').getBoundingClientRect().top<document.querySelector('#story').getBoundingClientRect().top));
    const opener=page.locator('.board-visual').first(),openerId=await opener.getAttribute('id');await opener.click();await page.locator('.board-focus[data-open="true"]').waitFor();await settled();
    check(label+' expansion stays inline and leaves board available',await page.locator('dialog[open]').count()===0&&await page.locator('.board-item').count()>1&&await page.evaluate(()=>document.body.style.overflow!=='hidden'));
    check(label+' palette remains beside the board',await page.locator('.board-palette a').count()>0);
    check(label+' board opens one focused image',await page.locator('.proof-stage figure').count()===1);
    await page.locator('.proof-tools button').first().click();await page.locator('.proof-stage[data-comparing="true"]').waitFor();await settled();
    check(label+' compare preserves horizontal views',await page.locator('.proof-stage figure').count()===2&&await page.locator('.proof-stage').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length===2));
    await page.locator('.proof-picks button').nth(3).click();await settled();
    check(label+' comparison keeps its first image',await page.locator('.view-board').getAttribute('data-image')===openerId);
    await page.locator('.proof-stage img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));await capture(`${language}-${profile}-comparison`);
    await page.locator('.proof-tools button').first().click();await page.locator('.proof-stage[data-comparing="false"]').waitFor();await settled();
    await page.locator('.proof-picks button').nth(2).click();await settled();
    const selected=await page.locator('.view-board').getAttribute('data-image');
    await page.locator('.proof-tools button').nth(1).click();await page.waitForTimeout(250);await page.keyboard.press('ArrowRight');
    check(label+' zoom keyboard action pans instead of advancing',await page.locator('.view-board').getAttribute('data-image')===selected);
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.board-focus[data-open="true"]'));await settled();
    check(label+' close restores keyboard focus',await opener.evaluate(element=>document.activeElement===element));
    for(const route of ['/plans','/about','/contact']){
      await page.goto(base+prefix+route);await ready();
      check(label+route+' fits and retains its heading',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)&&await page.locator('main h1').isVisible());
      const disclosure=page.locator('.plan-collection,.career-timeline > details').first();
      if(await disclosure.count()){
        await disclosure.locator('summary').click();await page.waitForTimeout(400);check(label+route+' disclosure opens',await disclosure.getAttribute('open')!==null);
        await disclosure.locator('summary').click();await page.waitForTimeout(400);check(label+route+' disclosure closes',await disclosure.getAttribute('open')===null);
      }
    }
    await page.goto(base+prefix+'/projects/landscape-in-daylight-and-after-dark');await ready();
    check(label+' landscape films are easy to reach',await page.locator('.case-intro a[href="#walkthroughs"]').count()===1&&await page.locator('#walkthroughs video').count()===2);
    for(const video of await page.locator('#walkthroughs video').all()){
      await video.scrollIntoViewIfNeeded();await video.evaluate(element=>element.play());await page.waitForTimeout(200);
      check(label+' landscape film plays with audio enabled',await video.evaluate(element=>!element.paused&&!element.muted&&element.controls&&element.currentTime>0));await video.evaluate(element=>element.pause());
    }
    await page.goto(base+prefix+'/projects/panoramic-home-visualisations');await ready();await page.locator('.board-visual').first().click();await page.locator('.board-focus[data-open="true"]').waitFor();await settled();
    await page.locator('.panorama-actions .text-control').click();await page.waitForFunction(()=>document.querySelector('.panorama-view')?.dataset.ready==='true',null,{timeout:20000});
    check(label+' 360 view remains above its preview',await page.locator('.panorama-view').evaluate(element=>{const canvas=element.querySelector('canvas'),bounds=canvas.getBoundingClientRect();return element.querySelector('.panorama-preview').hidden&&Boolean(document.elementFromPoint(bounds.left+bounds.width/2,bounds.top+bounds.height/2)?.closest('.panorama-stage'));}));
    await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.board-focus[data-open="true"]'));await settled();
    await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+prefix+'/');await ready();
    await page.locator('.design-process').scrollIntoViewIfNeeded();await page.locator('.design-steps button').last().click();
    check(label+' reduced-motion sequence remains usable',await page.locator('.design-process').getAttribute('data-step')==='2');
    check(label+' reduced motion removes spatial page animation',await page.locator('.home-intro').evaluate(element=>getComputedStyle(element).transform==='none'));
  }
  check('no browser exceptions',errors.length===0,errors);
  return {checks,failed:checks.filter(check=>!check.pass),errors,captures};
}

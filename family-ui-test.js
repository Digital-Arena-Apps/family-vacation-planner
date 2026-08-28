// Family UI concept test — compact roster + edit-on-demand bottom sheet.
// Loaded by decision-demo-loader.js so the existing family profile model remains untouched.
(()=>{
  const VERSION='family-ui-test-1';
  let editingId=null;
  let draftRole='adult';
  let draftUnit='metric';

  const css=`
  .family-v2-source-hidden{display:none!important}
  .view[data-view="family"]>.page-heading{margin-bottom:14px}
  .view[data-view="family"]>.page-heading .eyebrow{color:var(--teal);letter-spacing:.11em}
  .view[data-view="family"]>.page-heading h2{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:clamp(2rem,7vw,2.75rem);line-height:1.02;margin:4px 0 7px}
  .view[data-view="family"]>.page-heading p{max-width:520px;margin:0;color:var(--muted);font-size:.98rem;line-height:1.5}
  .family-v2-roster{display:grid;gap:12px;margin:0 0 16px}
  .family-v2-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid rgba(13,107,103,.10);border-radius:22px;background:rgba(255,255,255,.92);box-shadow:0 10px 28px rgba(27,53,61,.07)}
  .family-v2-summary-main{display:flex;align-items:center;gap:11px;min-width:0}
  .family-v2-summary-icon{width:46px;height:46px;display:grid;place-items:center;border-radius:15px;background:#e6f6f4;overflow:hidden}
  .family-v2-summary-icon img{width:100%;height:100%;object-fit:cover}
  .family-v2-summary-copy{min-width:0;display:flex;flex-wrap:wrap;gap:5px;align-items:baseline}
  .family-v2-summary-copy b{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:1rem}
  .family-v2-summary-copy span{color:var(--teal);font-weight:800;font-size:.88rem}
  .family-v2-add{appearance:none;border:1px solid rgba(13,107,103,.16);background:#f1fbfa;color:var(--teal);border-radius:16px;padding:7px 12px 7px 7px;font-weight:800;white-space:nowrap;min-height:48px;display:flex;align-items:center;gap:6px}
  .family-v2-add img{width:34px;height:34px;object-fit:contain}
  .family-v2-list{display:grid;gap:10px}
  .family-v2-card{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) auto 18px;align-items:center;gap:12px;text-align:left;border:1px solid rgba(24,50,58,.075);border-radius:22px;background:#fff;padding:12px 14px;box-shadow:0 10px 26px rgba(27,53,61,.065);color:var(--ink);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}
  .family-v2-card:active{transform:scale(.985)}
  .family-v2-card:hover{border-color:rgba(13,107,103,.18);box-shadow:0 13px 30px rgba(27,53,61,.09)}
  .family-v2-avatar{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#e8f8f6,#d9f0ed);overflow:hidden}
  .family-v2-avatar img{width:100%;height:100%;object-fit:cover}
  .family-v2-card:nth-child(3n+2) .family-v2-avatar{background:linear-gradient(145deg,#fff3e7,#ffe5cf);color:#b85c2b}
  .family-v2-card:nth-child(3n) .family-v2-avatar{background:linear-gradient(145deg,#f1efff,#e3ddff);color:#5c4fa4}
  .family-v2-person{min-width:0}
  .family-v2-person b{display:block;font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:1.08rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .family-v2-person small{display:block;margin-top:3px;color:var(--muted);font-size:.84rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .family-v2-vibe{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:7px 10px;font-size:.78rem;font-weight:800;white-space:nowrap;background:#e9f8f6;color:#08746f}
  .family-v2-vibe.low{background:#fff4dc;color:#b87500}
  .family-v2-vibe.high{background:#fff0ed;color:#d95848}
  .family-v2-chevron{font-size:1.45rem;color:#809095;font-weight:400;line-height:1}
  .family-v2-empty{padding:22px;border:1px dashed rgba(24,50,58,.16);border-radius:20px;text-align:center;color:var(--muted);background:rgba(255,255,255,.56)}
  .family-v2-pref-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:2px 0 10px;padding:13px 15px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.72);color:var(--ink);text-align:left}
  .family-v2-pref-toggle span:first-child{display:grid;gap:2px}.family-v2-pref-toggle b{font-size:.95rem}.family-v2-pref-toggle small{color:var(--muted);font-size:.78rem}.family-v2-pref-action{color:var(--teal);font-weight:800;font-size:.85rem}
  #familyForm.family-v2-preferences-form{overflow:hidden;transition:max-height .28s ease,opacity .2s ease,margin .2s ease,padding .2s ease}
  #familyForm.family-v2-preferences-form.family-v2-collapsed{display:none}
  .family-v2-fab{position:fixed;right:max(18px,calc((100vw - 720px)/2 + 18px));bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:58;width:58px;height:58px;border:0;border-radius:50%;background:#fff8e9;box-shadow:0 14px 30px rgba(8,116,111,.28);display:grid;place-items:center;line-height:1;padding:3px}
  .family-v2-fab img{width:52px;height:52px;object-fit:contain}
  .family-v2-backdrop{position:fixed;inset:0;background:rgba(17,34,39,.34);backdrop-filter:blur(3px);z-index:110;opacity:0;pointer-events:none;transition:opacity .2s ease}
  .family-v2-backdrop.open{opacity:1;pointer-events:auto}
  .family-v2-sheet{position:fixed;left:50%;bottom:0;transform:translate(-50%,105%);width:min(760px,100%);max-height:min(78vh,690px);overflow:auto;overscroll-behavior:contain;z-index:120;background:#fff;border-radius:26px 26px 0 0;box-shadow:0 -20px 55px rgba(18,39,45,.2);padding:10px 18px calc(20px + env(safe-area-inset-bottom,0px));transition:transform .26s cubic-bezier(.2,.8,.2,1)}
  .family-v2-sheet.open{transform:translate(-50%,0)}
  .family-v2-handle{width:48px;height:5px;border-radius:999px;background:#d7dddd;margin:0 auto 12px}
  .family-v2-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:13px}.family-v2-sheet-head h3{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:1.35rem;margin:0}.family-v2-close{width:40px;height:40px;border:0;border-radius:50%;background:#f2f4f4;color:#536368;font-size:1.55rem;line-height:1}
  .family-v2-form{display:grid;gap:12px}.family-v2-field{display:grid;gap:6px}.family-v2-label{font-size:.78rem;color:#647479;font-weight:700}.family-v2-input,.family-v2-select{width:100%;border:1px solid rgba(24,50,58,.14);border-radius:15px;background:#fff;padding:12px 13px;color:var(--ink);outline:none;min-height:48px}.family-v2-input:focus,.family-v2-select:focus{border-color:rgba(13,107,103,.5);box-shadow:0 0 0 3px rgba(13,107,103,.08)}
  .family-v2-two{display:grid;grid-template-columns:1fr 1.25fr;gap:10px}.family-v2-height-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.family-v2-unit-toggle,.family-v2-role-toggle{display:flex;gap:4px;padding:3px;background:#f1f4f4;border-radius:12px}.family-v2-unit-toggle button,.family-v2-role-toggle button{border:0;background:transparent;color:#6d7d80;border-radius:9px;padding:6px 9px;font-size:.76rem;font-weight:800}.family-v2-unit-toggle button.active,.family-v2-role-toggle button.active{background:#fff;color:var(--teal);box-shadow:0 2px 8px rgba(24,50,58,.09)}
  .family-v2-height-imperial{display:grid;grid-template-columns:1fr auto 1fr auto;gap:6px;align-items:center}.family-v2-height-imperial span{color:var(--muted);font-weight:700}.family-v2-hidden{display:none!important}
  .family-v2-rides{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.family-v2-ride{border:1px solid rgba(24,50,58,.12);background:#fff;border-radius:14px;min-height:48px;padding:8px 7px;color:#6b797d;font-weight:800;font-size:.76rem}.family-v2-ride.active{border-color:#14928c;background:#eefaf8;color:#08746f;box-shadow:inset 0 0 0 1px rgba(20,146,140,.08)}
  .family-v2-actions{display:grid;grid-template-columns:auto minmax(150px,1fr);gap:12px;align-items:center;margin-top:4px}.family-v2-delete{border:0;background:transparent;color:#e25d50;font-weight:800;padding:12px 4px;text-align:left}.family-v2-done{border:0;border-radius:16px;background:linear-gradient(145deg,#119b94,#08746f);color:#fff;font-weight:800;min-height:52px;padding:12px 20px}
  body.family-v2-sheet-open{overflow:hidden}
  @media(max-width:520px){
    .family-v2-summary{padding:10px 11px}.family-v2-summary-icon{width:38px;height:38px}.family-v2-add{padding:9px 11px;font-size:.86rem}
    .family-v2-card{grid-template-columns:48px minmax(0,1fr) 18px;gap:10px;padding:11px 12px}.family-v2-avatar{width:48px;height:48px}.family-v2-vibe{grid-column:2;justify-self:start;margin-top:-2px;padding:5px 8px}.family-v2-chevron{grid-column:3;grid-row:1 / span 2}
    .family-v2-two{grid-template-columns:1fr 1.1fr}.family-v2-sheet{padding-left:14px;padding-right:14px}.family-v2-actions{grid-template-columns:1fr 1.5fr}
  }
  `;

  function injectStyles(){
    if(document.getElementById('familyV2TestStyles'))return;
    const style=document.createElement('style');style.id='familyV2TestStyles';style.textContent=css;document.head.appendChild(style);
  }
  function esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function members(){return Array.isArray(state?.profile?.members)?state.profile.members:[];}
  function avatarFor(m,index){
    if(typeof memberAvatar==='function')return memberAvatar(m,index);
    const fallback=['bobcat','manatee','otter','black_bear','alligator','sea_turtle','gecko','osprey'][index%8];
    return {key:fallback,src:`assets/ferda/avatars/avatar_${fallback}.webp`};
  }
  function initialFor(m,index){
    const name=String(m?.name||'').trim();
    if(name){const p=name.split(/\s+/).filter(Boolean);return (p.length>1?p[0][0]+p[p.length-1][0]:p[0][0]).toUpperCase();}
    return (+m?.age||0)<18?`C${index+1}`:`A${index+1}`;
  }
  function displayRole(m){const age=+m?.age||0;return age>=13&&age<18?'Teen':age<18?'Child':'Adult';}
  function displayHeight(m){
    const inches=+m?.height||0;if(!inches)return 'Height not set';
    if((m?.heightUnit||'metric')==='imperial'){const ft=Math.floor(inches/12),inch=Math.round(inches-ft*12);return `${ft}′ ${inch}″`;}
    return `${Math.round(inches*2.54)} cm`;
  }
  function vibe(thrill){
    if(thrill==='low')return {label:'Gentle rides',cls:'low',icon:'◇'};
    if(thrill==='high')return {label:'Big thrills',cls:'high',icon:'△'};
    return {label:'Some thrills',cls:'medium',icon:'≈'};
  }
  function findMember(id){return members().find(m=>String(m.id)===String(id));}

  function buildShell(){
    const view=document.querySelector('.view[data-view="family"]');if(!view||document.getElementById('familyV2Roster'))return false;
    const heading=view.querySelector(':scope > .page-heading');
    if(heading)heading.innerHTML='<div><div class="eyebrow">YOUR HOLIDAY CREW</div><h2>Family</h2><p>Set up your holiday crew once, then we can shape recommendations around the people actually travelling.</p></div>';

    const source=document.getElementById('familyMembers');
    const oldHeading=source?.previousElementSibling;
    if(source)source.classList.add('family-v2-source-hidden');
    if(oldHeading?.classList.contains('setup-heading'))oldHeading.classList.add('family-v2-source-hidden');

    const roster=document.createElement('section');roster.id='familyV2Roster';roster.className='family-v2-roster';
    roster.innerHTML=`<div class="family-v2-summary"><div class="family-v2-summary-main"><div class="family-v2-summary-icon"><img src="assets/ferda/icons/ferda-ui-icon-holiday-crew.webp" alt=""></div><div class="family-v2-summary-copy"><b>Your holiday crew</b><span id="familyV2Count"></span></div></div><button id="familyV2Add" class="family-v2-add" type="button"><img src="assets/ferda/icons/ferda-ui-icon-add-person.webp" alt="">Add person</button></div><div id="familyV2List" class="family-v2-list"></div>`;
    const form=document.getElementById('familyForm');view.insertBefore(roster,form||view.firstChild);

    if(form){
      form.classList.add('family-v2-preferences-form','family-v2-collapsed');
      const toggle=document.createElement('button');toggle.type='button';toggle.id='familyV2PreferencesToggle';toggle.className='family-v2-pref-toggle';toggle.innerHTML='<span><b>Trip & family preferences</b><small>Destination, budget, dietary notes and more</small></span><span class="family-v2-pref-action">Edit</span>';
      form.parentNode.insertBefore(toggle,form);
      toggle.addEventListener('click',()=>{
        const collapsed=form.classList.toggle('family-v2-collapsed');toggle.querySelector('.family-v2-pref-action').textContent=collapsed?'Edit':'Hide';
      });
      form.addEventListener('submit',()=>setTimeout(()=>{renderRoster();form.classList.add('family-v2-collapsed');toggle.querySelector('.family-v2-pref-action').textContent='Edit';},30));
    }

    const fab=document.createElement('button');fab.id='familyV2Fab';fab.className='family-v2-fab';fab.type='button';fab.setAttribute('aria-label','Add family member');fab.innerHTML='<img src="assets/ferda/icons/ferda-ui-icon-add-person.webp" alt="">';document.body.appendChild(fab);
    fab.addEventListener('click',()=>openSheet(null));
    document.getElementById('familyV2Add').addEventListener('click',()=>openSheet(null));

    const backdrop=document.createElement('div');backdrop.id='familyV2Backdrop';backdrop.className='family-v2-backdrop';document.body.appendChild(backdrop);backdrop.addEventListener('click',closeSheet);
    const sheet=document.createElement('aside');sheet.id='familyV2Sheet';sheet.className='family-v2-sheet';sheet.setAttribute('aria-hidden','true');sheet.innerHTML=sheetMarkup();document.body.appendChild(sheet);wireSheet();

    document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>{if(n.dataset.target==='family')setTimeout(renderRoster,20);}));
    return true;
  }

  function sheetMarkup(){return `
    <div class="family-v2-handle"></div>
    <div class="family-v2-sheet-head"><h3 id="familyV2SheetTitle">Edit person</h3><button id="familyV2Close" class="family-v2-close" type="button" aria-label="Close">×</button></div>
    <div class="family-v2-form">
      <div class="family-v2-field"><span class="family-v2-label">Person</span><div id="familyV2Role" class="family-v2-role-toggle"><button type="button" data-role="adult">Adult</button><button type="button" data-role="child">Child</button></div></div>
      <label class="family-v2-field"><span class="family-v2-label">Name</span><input id="familyV2Name" class="family-v2-input" type="text" maxlength="25" placeholder="Name or nickname"></label>
      <div class="family-v2-two">
        <label class="family-v2-field"><span class="family-v2-label">Age</span><input id="familyV2Age" class="family-v2-input" type="number" min="0" max="99" inputmode="numeric"></label>
        <div class="family-v2-field"><div class="family-v2-height-head"><span class="family-v2-label">Height</span><div id="familyV2Unit" class="family-v2-unit-toggle"><button type="button" data-unit="metric">cm</button><button type="button" data-unit="imperial">ft / in</button></div></div><div id="familyV2Metric"><input id="familyV2HeightCm" class="family-v2-input" type="number" min="50" max="230" inputmode="decimal" placeholder="137"></div><div id="familyV2Imperial" class="family-v2-height-imperial family-v2-hidden"><input id="familyV2HeightFt" class="family-v2-input" type="number" min="1" max="7" inputmode="numeric" placeholder="4"><span>′</span><input id="familyV2HeightIn" class="family-v2-input" type="number" min="0" max="11" inputmode="numeric" placeholder="6"><span>″</span></div></div>
      </div>
      <div class="family-v2-field"><span class="family-v2-label">Ride vibe</span><div id="familyV2Rides" class="family-v2-rides"><button class="family-v2-ride" type="button" data-thrill="low">Gentle</button><button class="family-v2-ride" type="button" data-thrill="medium">Some thrills</button><button class="family-v2-ride" type="button" data-thrill="high">Thrill seeker</button></div></div>
      <div class="family-v2-actions"><button id="familyV2Delete" class="family-v2-delete" type="button">Delete person</button><button id="familyV2Done" class="family-v2-done" type="button">Done</button></div>
    </div>`;}

  function wireSheet(){
    document.getElementById('familyV2Close').addEventListener('click',closeSheet);
    document.getElementById('familyV2Done').addEventListener('click',saveDraft);
    document.getElementById('familyV2Delete').addEventListener('click',deleteDraft);
    document.querySelectorAll('#familyV2Role button').forEach(b=>b.addEventListener('click',()=>{draftRole=b.dataset.role;syncRoleButtons();if(!editingId){const age=document.getElementById('familyV2Age'),h=document.getElementById('familyV2HeightCm');if(draftRole==='child'&&(!age.value||+age.value>=18)){age.value='10';if(!h.value)h.value='137';}if(draftRole==='adult'&&(!age.value||+age.value<18)){age.value='35';if(!h.value)h.value='173';}}}));
    document.querySelectorAll('#familyV2Unit button').forEach(b=>b.addEventListener('click',()=>{draftUnit=b.dataset.unit;syncUnitControls();}));
    document.querySelectorAll('#familyV2Rides button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#familyV2Rides button').forEach(x=>x.classList.toggle('active',x===b));}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('familyV2Sheet')?.classList.contains('open'))closeSheet();});
  }

  function syncRoleButtons(){document.querySelectorAll('#familyV2Role button').forEach(b=>b.classList.toggle('active',b.dataset.role===draftRole));}
  function syncUnitControls(){
    document.querySelectorAll('#familyV2Unit button').forEach(b=>b.classList.toggle('active',b.dataset.unit===draftUnit));
    document.getElementById('familyV2Metric').classList.toggle('family-v2-hidden',draftUnit!=='metric');document.getElementById('familyV2Imperial').classList.toggle('family-v2-hidden',draftUnit!=='imperial');
  }

  function openSheet(id){
    editingId=id?String(id):null;const m=editingId?findMember(editingId):null;
    draftRole=m?.role||((+m?.age||35)<18?'child':'adult');draftUnit=m?.heightUnit||'metric';
    document.getElementById('familyV2SheetTitle').textContent=m?`Edit ${m.name||'person'}`:'Add family member';
    document.getElementById('familyV2Name').value=m?.name||'';
    document.getElementById('familyV2Age').value=m?.age ?? (draftRole==='child'?10:35);
    const inches=+m?.height||0,cm=inches?Math.round(inches*2.54):(draftRole==='child'?137:173),ft=inches?Math.floor(inches/12):(draftRole==='child'?4:5),inch=inches?Math.round(inches-ft*12):(draftRole==='child'?6:8);
    document.getElementById('familyV2HeightCm').value=cm;document.getElementById('familyV2HeightFt').value=ft;document.getElementById('familyV2HeightIn').value=inch;
    const thrill=m?.thrill||'medium';document.querySelectorAll('#familyV2Rides button').forEach(b=>b.classList.toggle('active',b.dataset.thrill===thrill));
    document.getElementById('familyV2Delete').classList.toggle('family-v2-hidden',!m);document.getElementById('familyV2Done').textContent=m?'Done':'Add person';
    syncRoleButtons();syncUnitControls();
    document.getElementById('familyV2Backdrop').classList.add('open');document.getElementById('familyV2Sheet').classList.add('open');document.getElementById('familyV2Sheet').setAttribute('aria-hidden','false');document.body.classList.add('family-v2-sheet-open');
    setTimeout(()=>document.getElementById('familyV2Name')?.focus(),180);
  }
  function closeSheet(){document.getElementById('familyV2Backdrop')?.classList.remove('open');document.getElementById('familyV2Sheet')?.classList.remove('open');document.getElementById('familyV2Sheet')?.setAttribute('aria-hidden','true');document.body.classList.remove('family-v2-sheet-open');editingId=null;}

  function getThrill(){return document.querySelector('#familyV2Rides .active')?.dataset.thrill||'medium';}
  function getHeight(){
    if(draftUnit==='metric')return Math.max(0,(+document.getElementById('familyV2HeightCm').value||0)/2.54);
    return Math.max(0,(+document.getElementById('familyV2HeightFt').value||0)*12+(+document.getElementById('familyV2HeightIn').value||0));
  }
  function persist(){
    try{localStorage.setItem('ffvp_profile',JSON.stringify(state.profile));}catch(e){}
    try{if(typeof saveProfile==='function')saveProfile();}catch(e){}
    try{if(typeof loadProfileForm==='function')loadProfileForm();}catch(e){}
    renderRoster();
  }
  function saveDraft(){
    const wasEditing=!!editingId;
    const name=document.getElementById('familyV2Name').value.trim()||'Family member',age=Math.max(0,+document.getElementById('familyV2Age').value||0),height=Math.round(getHeight()*10)/10,thrill=getThrill();
    const band=typeof heightBandFromInches==='function'?heightBandFromInches(height):undefined;
    if(editingId){const i=members().findIndex(m=>String(m.id)===editingId);if(i>=0)state.profile.members[i]={...state.profile.members[i],name,age,height,heightUnit:draftUnit,heightBand:band||state.profile.members[i].heightBand,role:draftRole,thrill};}
    else{const id=globalThis.crypto?.randomUUID?.()||String(Date.now()+Math.random()),avatar=avatarFor({},members().length);state.profile.members=[...members(),{id,name,age,height,heightUnit:draftUnit,heightBand:band||'unknown',role:draftRole,thrill,avatarKey:avatar.key}];}
    persist();closeSheet();try{if(typeof showToast==='function')showToast(wasEditing?'Person updated':'Person added');}catch(e){}
  }
  function deleteDraft(){
    if(!editingId)return;if(members().length<=1){try{if(typeof showToast==='function')showToast('Keep at least one family member');}catch(e){}return;}
    state.profile.members=members().filter(m=>String(m.id)!==editingId);persist();closeSheet();try{if(typeof showToast==='function')showToast('Person removed');}catch(e){}
  }

  function renderRoster(){
    const list=document.getElementById('familyV2List'),count=document.getElementById('familyV2Count');if(!list||!count)return;
    const all=members();count.textContent=`· ${all.length} ${all.length===1?'person':'people'}`;
    if(!all.length){list.innerHTML='<div class="family-v2-empty">No family members yet. Add someone to start tailoring the trip.</div>';return;}
    list.innerHTML=all.map((m,i)=>{const v=vibe(m.thrill),avatar=avatarFor(m,i),meta=[displayRole(m),Number.isFinite(+m.age)?`${+m.age}`:'',displayHeight(m)].filter(Boolean).join(' · ');return `<button type="button" class="family-v2-card" data-family-v2-id="${esc(m.id)}"><span class="family-v2-avatar" aria-hidden="true"><img src="${esc(avatar.src)}" alt=""></span><span class="family-v2-person"><b>${esc(m.name||'Family member')}</b><small>${esc(meta)}</small></span><span class="family-v2-vibe ${v.cls}"><span>${v.icon}</span>${esc(v.label)}</span><span class="family-v2-chevron">›</span></button>`;}).join('');
    list.querySelectorAll('[data-family-v2-id]').forEach(card=>card.addEventListener('click',()=>openSheet(card.dataset.familyV2Id)));
  }

  function updateFabVisibility(){const view=document.querySelector('.view[data-view="family"]'),fab=document.getElementById('familyV2Fab');if(fab)fab.style.display=view?.classList.contains('active')?'grid':'none';}
  function start(attempt=0){
    if(typeof state==='undefined'||!document.getElementById('familyForm')){if(attempt<50)setTimeout(()=>start(attempt+1),80);return;}
    injectStyles();if(buildShell())renderRoster();updateFabVisibility();
    const view=document.querySelector('.view[data-view="family"]');if(view)new MutationObserver(()=>{updateFabVisibility();if(view.classList.contains('active'))renderRoster();}).observe(view,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pageshow',()=>setTimeout(renderRoster,30));
    document.documentElement.dataset.familyUiTest=VERSION;
  }
  start();
})();

/* Presentation mode: a scripted walkthrough with clean screens and speaker notes */
(function(){
const KEYS=["kodu.proto","kodu.proto.expat","kodu.proto.provider","kodu.cookie"];
let on=false,idx=0,snap=null,back=null,PS=null,notes=true,hidden=false;

function mk(role){const s=blank();s.role=role;Object.assign(s,JSON.parse(JSON.stringify(SAMPLE[role])));s.otpOk=true;s.loggedIn=true;if(role==="provider")s.verified=true;return s}
function use(role){if(S!==PS[role]){S=PS[role]}}
function pro(){ensure();return P.find(p=>p.name==="Mart Kask"&&p.cat==="Plumbing")||P.find(p=>p.cat==="Plumbing"&&p.city==="Tallinn"&&p.langs.some(l=>l[0]==="ES"))||P.find(p=>p.cat==="Plumbing")}
function job(){use("expat");ensure();const p=pro();let j=S.jobs2.find(x=>x.id==="pj1");
  if(!j){const d=p.slots?Object.keys(p.slots)[0]:"Tue";const sl=p.slots&&p.slots[d]?p.slots[d][0]:"10:00";
    j={id:"pj1",pid:p.id,title:"Leaking kitchen tap",desc:"Dripping for a week, the cupboard under the sink is wet.",urgency:"This week",photos:1,day:d,slot:sl,status:"quoted",hours:1.5,materials:MAT[p.cat][1],matDesc:MAT[p.cat][0]};
    S.jobs2.push(j);
    if(!S.chats[p.id])S.chats[p.id]={pid:p.id,t:Date.now(),unread:0,msgs:[{sys:true,text:`Chat with ${p.name.split(" ")[0]} started · translated automatically`}]};
    const c=S.chats[p.id];c.msgs.push({me:true,text:`Hi ${p.name.split(" ")[0]}, leaking kitchen tap. Dripping for a week, the cupboard under the sink is wet. Could you come ${j.day} at ${j.slot}?`,orig:"(Spanish original)",when:"10 min ago"});
    const r=REPLY(p,j);c.msgs.push({text:r.text,orig:r.orig,when:"8 min ago"});c.msgs.push({quote:j.id,when:"8 min ago"});c.t=Date.now();c.unread=0}
  if(j.status!=="quoted"&&j.status!=="paid")j.status="quoted";
  S.view=p.id;S.jobId=j.id;return j}

const SC=[
 {card:"open",title:"Kodu",note:"Expats in Estonia struggle to find a plumber or electrician who speaks their language, and they have no way to tell who is trustworthy. Kodu fixes both: verified local tradespeople, matched by language, with translated chat and payment held until the job is done."},
 {title:"The first impression",route:"welcome",note:"This is what a new visitor sees. The greeting rotates through the languages our users speak, and the promise is in one sentence: home repairs in your language, with people we have checked."},
 {title:"Two sides, one app",route:"role",role:"guest",note:"Kodu is a two sided marketplace. Expats book help, providers find work. Both register in a few steps, and providers go through identity, licence and VAT checks before they appear in search."},
 {title:"Sofia's home screen",route:"ehome",role:"expat",note:"Meet Sofia, a Spanish speaker living in Kesklinn. Her home screen shows providers who speak Spanish nearby, popular services and her open jobs. Everything is personalised from the languages she chose at sign up."},
 {title:"Language first search",route:"search",role:"expat",set:()=>{ensure();S.cat="Plumbing";S.q=""},note:"She searches for a plumber. Results are filtered by language and verification by default, and each card says why it matches: speaks Spanish, or English at C1, or chat will be translated."},
 {title:"Filters that matter",route:"filters",role:"expat",set:()=>{ensure();S.cat="Plumbing"},note:"Filters cover city and district for every major Estonian city, language, day and time, hourly or fixed job pricing, rating and licence. The button shows how many providers match before she commits."},
 {title:"A profile she can trust",route:"profile",role:"expat",set:()=>{S.view=pro().id},note:"She opens Mart Kask. He does not speak Spanish, but he speaks English at C1, and Kodu will translate the chat anyway. Verified ID and licence badges, languages with levels, prices, reviews and open slots are all visible before any money moves."},
 {title:"Describe the job",route:"book",role:"expat",set:()=>{const p=pro();S.view=p.id;S.draft={title:"Leaking kitchen tap",desc:"Dripping for a week, the cupboard under the sink is wet.","Photo 1":true}},note:"Booking takes three short steps: describe the problem, add a photo and pick a slot. The provider answers with a written quote before any work starts, so there are no surprises."},
 {title:"Chat without a language barrier",route:"chat",role:"expat",set:()=>{job()},note:"Sofia writes in Spanish and Mart reads Estonian. Every message is translated automatically and the original stays one tap away. The quote arrives inside the chat."},
 {title:"A clear quote",route:"job",role:"expat",set:()=>{job()},note:"The quote breaks down labour, materials and the Kodu fee. If her landlord is responsible for repairs, the landlord is asked to approve it first."},
 {title:"Safe payment",route:"pay",role:"expat",set:()=>{job()},note:"Payment is held by Kodu, not sent to the provider. It is released only when Sofia confirms the job is done, and she can open a dispute if something goes wrong."},
 {title:"Mart's dashboard",route:"phome",role:"provider",set:()=>{pensure()},note:"Now the other side, from Mart's phone. He is the plumber Sofia just booked. His dashboard shows new requests, today's jobs and money in escrow, and he can pause bookings for holidays."},
 {title:"A request worth taking",route:"preq",role:"provider",set:()=>{pensure();const r=S.pjobs.find(x=>x.status==="new")||S.pjobs[0];S.preqId=r.id},note:"Each request shows distance, urgency, photos and the customer's language. Mart can ask a question first, send a fixed price, a range or a paid site visit, use saved templates, or suggest another time instead of declining."},
 {title:"His week at a glance",route:"pjobs",role:"provider",set:()=>{pensure();S.ptab="Calendar";S.calView="Week"},note:"The calendar shows booked jobs by week or month, and every booking blocks the hours it takes so he is never double booked. Availability can be copied across the week in one tap."},
 {title:"Talking to customers",route:"pchat",role:"provider",set:()=>{pensure();const r=S.pjobs.find(x=>x.status==="new")||S.pjobs[0];if(!S.pchats[r.eid]){const k=Object.keys(S.pchats)[0];S.pview=k||r.eid}else S.pview=r.eid},note:"Mart writes in Estonian and the customer reads their own language. The job is pinned at the top of the chat, and his own quick replies save typing on site."},
 {title:"Getting paid",route:"pearn",role:"provider",set:()=>{pensure()},note:"Earnings show what is in escrow, what is pending and what has been paid out, with a weekly chart, a printable receipt for every job and a statement for his accountant."},
 {card:"close",title:"Kodu",note:"Kodu turns a stressful search into one trusted booking: the right language, a verified provider, a clear quote and protected payment. Thank you."}
];

const css=`
body.presenting .devbar,body.presenting .rolesw,body.presenting .demo,body.presenting .demotag,body.presenting .cookie,body.presenting [data-act=skip]{display:none!important}
#pres{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;width:min(720px,calc(100vw - 24px));background:rgba(22,32,29,.94);color:#fff;border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.28);font-family:inherit;user-select:none;-webkit-user-select:none;transition:opacity .2s,transform .2s}
#pres.pz-hid{opacity:0;pointer-events:none;transform:translate(-50%,20px)}
#pres .pz-pr{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 18px}
#pres .pz-pn{font-size:12px;font-weight:700;color:#BFE3D6;white-space:nowrap;font-variant-numeric:tabular-nums}
#pres .pz-pt{flex:1;min-width:0;font-family:Sora,sans-serif;font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#pres button{height:34px;min-width:34px;padding:0 12px;border-radius:17px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;font:inherit;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
#pres button.pz-nx{background:#BFE3D6;color:#16201D;border-color:#BFE3D6}
#pres button:hover{border-color:#fff}
#pres .pz-note{padding:0 18px 14px;font-size:14px;line-height:1.5;color:rgba(255,255,255,.86)}
#pres .pz-prog{height:3px;background:rgba(255,255,255,.12);border-radius:0 0 22px 22px;overflow:hidden}#pres .pz-prog span{display:block;height:100%;background:#BFE3D6;transition:width .3s}
#pres .pz-keys{font-size:11px;color:rgba(255,255,255,.5);padding:0 18px 10px}
#pcard{position:fixed;inset:0;z-index:9990;background:#F6F2EA;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
#pcard .pz-in{display:flex;flex-direction:column;align-items:center;gap:22px;max-width:760px;animation:pcIn .5s ease both}
#pcard h1{font-family:Sora,sans-serif;font-size:clamp(44px,8vw,88px);letter-spacing:-.03em;line-height:1;margin:0;color:#16201D}
#pcard p{font-size:clamp(17px,2.2vw,22px);color:#56605C;margin:0;line-height:1.45}
#pcard .pz-tags{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}#pcard .pz-tags span{padding:8px 14px;border-radius:18px;background:#fff;border:1px solid #E4DED3;font-size:14px;font-weight:700;color:#16201D}
#pcard .pz-by{font-size:13px;color:#8A918D;margin-top:8px}
@keyframes pcIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (max-width:600px){#pres .pz-keys{display:none}#pres .pz-pt{font-size:14px}#pres .pz-note{font-size:13px}}
@media print{#pres,#pcard{display:none}}`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

function card(kind){const c=document.getElementById("pcard")||document.body.appendChild(Object.assign(document.createElement("div"),{id:"pcard"}));
  c.innerHTML=kind==="open"
   ?`<div class="pz-in">${mark(110,"#BFE3D6")}<h1>kodu</h1><p>Home repairs in your language, from people we have checked.</p><div class="pz-tags"><span>Language matched</span><span>Verified providers</span><span>Translated chat</span><span>Protected payment</span></div><div class="pz-by">Maan Ronhaar · Interactive prototype</div></div>`
   :`<div class="pz-in">${mark(90,"#BFE3D6")}<h1>Thank you</h1><p>One trusted booking: the right language, a verified provider, a clear quote and protected payment.</p><div class="pz-tags"><span>Expat side</span><span>Provider side</span><span>Phone and desktop</span></div><div class="pz-by">Questions welcome</div></div>`}
function nocard(){const c=document.getElementById("pcard");if(c)c.remove()}

function panel(){let p=document.getElementById("pres");if(!p){p=document.createElement("div");p.id="pres";document.body.appendChild(p)}
  const s=SC[idx];p.className=hidden?"pz-hid":"";
  p.innerHTML=`<div class="pz-pr"><span class="pz-pn">${idx+1} / ${SC.length}</span><span class="pz-pt">${s.title==="Kodu"?(s.card==="open"?"Opening":"Closing"):s.title}</span><button data-pres="notes" title="Speaker notes (N)">${notes?"Hide notes":"Notes"}</button><button data-pres="prev" aria-label="Previous" ${idx?"":"disabled style=opacity:.4"}>‹</button><button class="pz-nx" data-pres="next" aria-label="Next">${idx===SC.length-1?"Finish":"Next ›"}</button><button data-pres="exit" aria-label="Exit presentation" title="Exit (Esc)">✕</button></div>${notes?`<div class="pz-note">${s.note}</div><div class="pz-keys">Arrow keys or space to move · N notes · H hide this bar · P phone frame · F full screen · Esc exit</div>`:""}<div class="pz-prog"><span style="width:${(idx+1)/SC.length*100}%"></span></div>`}

function show(i){idx=Math.max(0,Math.min(SC.length-1,i));const s=SC[idx];
  if(s.card){card(s.card)}else{nocard();if(s.role)use(s.role);if(s.set)s.set();save();history=[];err={};anim=true;dir="fwd";route=s.route;render();const sc=document.querySelector("#phone .screen");if(sc)sc.scrollTop=0;window.scrollTo(0,0)}
  document.querySelectorAll(".toast").forEach(x=>x.remove());panel()}

function start(){if(on)return;on=true;snap={};KEYS.forEach(k=>{try{snap[k]=localStorage.getItem(k)}catch(e){}});back={S,route};
  try{localStorage.setItem("kodu.cookie","no")}catch(e){}
  PS={guest:blank(),expat:mk("expat"),provider:mk("provider")};
  document.body.classList.add("presenting");notes=window.innerWidth>700;hidden=false;show(0)}
function stop(){if(!on)return;on=false;nocard();const p=document.getElementById("pres");if(p)p.remove();document.body.classList.remove("presenting");
  KEYS.forEach(k=>{try{if(snap[k]==null)localStorage.removeItem(k);else localStorage.setItem(k,snap[k])}catch(e){}});
  S=back.S;history=[];route=back.route;render();toast("Presentation ended")}
window.koduPresent=start;

document.addEventListener("click",e=>{const t=e.target.closest("[data-pres]");if(!t)return;e.stopPropagation();const a=t.dataset.pres;
  if(a==="start")start();else if(a==="next"){idx===SC.length-1?stop():show(idx+1)}else if(a==="prev")show(idx-1);else if(a==="exit")stop();else if(a==="notes"){notes=!notes;panel()}},true);

document.addEventListener("keydown",e=>{if(!on)return;const tag=(e.target.tagName||"").toLowerCase();if(tag==="input"||tag==="textarea")return;const k=e.key;
  if(k==="ArrowRight"||k==="PageDown"||k===" "){e.preventDefault();idx===SC.length-1?stop():show(idx+1)}
  else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault();show(idx-1)}
  else if(k==="Escape"){if(document.fullscreenElement)return;stop()}
  else if(k==="n"||k==="N"){notes=!notes;panel()}
  else if(k==="h"||k==="H"){hidden=!hidden;panel()}
  else if(k==="p"||k==="P"){document.body.classList.toggle("phone-mode");const b=document.querySelector("[data-dev=phone]");if(b)b.textContent=document.body.classList.contains("phone-mode")?"Desktop layout":"Phone frame";fit()}
  else if(k==="f"||k==="F"){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(err){}}
});

const db=document.querySelector(".devbar");if(db)db.insertAdjacentHTML("beforeend",`<button data-pres="start" style="background:#BFE3D6;color:#16201D;border-color:#BFE3D6;font-weight:700">Present</button>`);
if(/present/.test(location.hash+location.search))setTimeout(start,300);
})();

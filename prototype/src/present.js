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


/* ---- feature animations ---- */
let run=0,fxOn=true;
const fxLayer=()=>{let l=document.getElementById("pfx");if(!l){l=document.createElement("div");l.id="pfx";l.innerHTML=`<div class="pz-spot"></div><div class="pz-call"></div><div class="pz-cur"><svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.7L4 20z" fill="#16201D" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg></div>`;document.body.appendChild(l)}return l};
function clearFx(){run++;const l=document.getElementById("pfx");if(l)l.classList.remove("on","cur")}
const zz=ms=>new Promise(r=>setTimeout(r,ms));
function vis(el){const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&!el.closest("#pres,#pfx")}
function fnd(b){const root=document.getElementById("phone");let list;
  if(b.sel)list=[...root.querySelectorAll(b.sel)].filter(vis);
  else{list=[...root.querySelectorAll("*")].filter(e=>e.children.length<40&&e.textContent.includes(b.t)&&vis(e));list.sort((a,c)=>{const ra=a.getBoundingClientRect(),rc=c.getBoundingClientRect();return ra.width*ra.height-rc.width*rc.height});list=list.slice(0,1)}
  let el=b.last?list[list.length-1]:list[0];if(el&&b.up)el=el.closest(b.up)||el;return el}
function place(el,txt){const l=fxLayer(),sp=l.querySelector(".pz-spot"),cl=l.querySelector(".pz-call");const r=el.getBoundingClientRect(),p=6;
  Object.assign(sp.style,{left:r.left-p+"px",top:r.top-p+"px",width:r.width+p*2+"px",height:r.height+p*2+"px"});
  cl.textContent=txt||"";cl.style.display=txt?"block":"none";const cw=Math.min(300,innerWidth-24);cl.style.maxWidth=cw+"px";
  const ch=cl.offsetHeight||40;let top=r.top-p-ch-14,below=false;if(top<10){top=r.bottom+p+14;below=true}
  let left=Math.max(12,Math.min(innerWidth-cl.offsetWidth-12,r.left+r.width/2-cl.offsetWidth/2));
  cl.style.left=left+"px";cl.style.top=top+"px";cl.className="pz-call"+(below?" below":"");cl.style.setProperty("--ax",Math.max(16,Math.min(cl.offsetWidth-16,r.left+r.width/2-left))+"px");
  cl.classList.remove("pz-pop");void cl.offsetWidth;cl.classList.add("pz-pop");l.classList.add("on")}
async function cursorTo(el,my){const l=fxLayer(),c=l.querySelector(".pz-cur");const r=el.getBoundingClientRect();l.classList.add("cur");
  c.style.left=r.left+Math.min(r.width/2,60)+"px";c.style.top=r.top+r.height/2+"px";await zz(650);if(my!==run)return false;
  c.classList.remove("tap");void c.offsetWidth;c.classList.add("tap");await zz(180);return my===run}
async function countUp(el,my){const o=el.textContent;const m=o.match(/\d[\d,]*(\.\d+)?/);if(!m)return;const n=parseFloat(m[0].replace(/,/g,"")),d=(m[1]||"").length-(m[1]?1:0);const t0=performance.now();
  while(true){if(my!==run){el.textContent=o;return}const k=Math.min(1,(performance.now()-t0)/900),e=1-Math.pow(1-k,3);el.textContent=o.replace(m[0],(n*e).toLocaleString("en-IE",{minimumFractionDigits:d,maximumFractionDigits:d}));if(k>=1)break;await zz(16)}el.textContent=o}
async function play(fx){const my=++run;if(!fx||!fxOn)return;await zz(800);
  for(const b of fx){if(my!==run)return;
    if(b.wait){await zz(b.wait);continue}
    const el=fnd(b);if(!el)continue;
    el.scrollIntoView({block:"center",behavior:"smooth"});{let last=null;for(let k=0;k<14;k++){await zz(70);const tp=el.getBoundingClientRect().top;if(last!==null&&Math.abs(tp-last)<0.5&&k>3)break;last=tp}}if(my!==run)return;
    place(el,b.c);
    if(b.count)countUp(el,my);
    if(b.type){if(!await cursorTo(el,my))return;el.focus({preventScroll:true});el.value="";for(const ch of b.type){if(my!==run)return;el.value+=ch;el.dispatchEvent(new Event("input",{bubbles:true}));await zz(55)}
      el.blur();await zz(500);if(b.send&&el.form){el.form.requestSubmit();await zz(500)}fxLayer().classList.remove("cur");continue}
    if(b.click){if(!await cursorTo(el,my))return;await zz(150);el.click();await zz(900);fxLayer().classList.remove("cur");const el2=fnd(b);if(el2&&my===run)place(el2,b.c);await zz(900);continue}
    await zz(1900)}
  if(my!==run)return;await zz(400);if(my===run)fxLayer().classList.remove("on","cur")}
addEventListener("resize",()=>{if(on)clearFx()});
document.addEventListener("pointerdown",e=>{if(on&&!e.target.closest("#pres"))clearFx()},true);
document.addEventListener("wheel",()=>{if(on)clearFx()},{passive:true});

const SC_FULL=[
 {card:"open",title:"Kodu",note:"Expats in Estonia struggle to find a plumber or electrician who speaks their language, and they have no way to tell who is trustworthy. Kodu fixes both: verified local tradespeople, matched by language, with translated chat and payment held until the job is done."},
 {title:"The first impression",fx:[{t:"providers ready",c:"Live count of verified providers"},{sel:".greet",c:"Greets you in every language our users speak"},{t:"Find a service",up:"button",c:"One tap to start, for expats or for providers"}],route:"welcome",note:"This is what a new visitor sees. The greeting rotates through the languages our users speak, and the promise is in one sentence: home repairs in your language, with people we have checked."},
 {title:"Two sides, one app",fx:[{t:"I need help at home",up:"button",click:1,c:"Expats book help"},{t:"I offer services",up:"button",click:1,c:"Providers find work"},{t:"Both sides see Kodu",c:"Translation is built into both sides"}],route:"role",role:"guest",note:"Kodu is a two sided marketplace. Expats book help, providers find work. Both register in a few steps, and providers go through identity, licence and VAT checks before they appear in search."},
 {title:"Sofia's home screen",fx:[{t:"Hola Sofia",c:"Greeted in Spanish, her own language"},{t:"verified providers",c:"Her district and how many verified providers serve it"},{t:"Plumbing",up:"button",c:"Popular services one tap away"},{t:"Popular in Tallinn",c:"Ranked by reviews in her city"}],route:"ehome",role:"expat",note:"Meet Sofia, a Spanish speaker living in Kesklinn. Her home screen shows providers who speak Spanish nearby, popular services and her open jobs. Everything is personalised from the languages she chose at sign up."},
 {title:"Language first search",fx:[{sel:"input[name=q]",type:"Plumber",c:"She just types what she needs"},{t:"Speaks ES or EN",up:"button",c:"Language filter is on by default"},{t:"Speaks English C1",c:"Every card says why it matches"},{t:"€38",count:1,c:"Price before she even opens the profile"}],route:"search",role:"expat",set:()=>{ensure();S.cat="Plumbing";S.q=""},note:"She searches for a plumber. Results are filtered by language and verification by default, and each card says why it matches: speaks Spanish, or English at C1, or chat will be translated."},
 {title:"Filters that matter",fx:[{t:"District in Tallinn",c:"City first, then district, for every major Estonian city"},{t:"Kesklinn",up:"button",click:1,c:"Narrow it down to her neighbourhood"},{t:"My languages",up:"button",c:"Only providers who speak her languages"},{t:"Show ",up:"button",c:"See the count before committing"}],route:"filters",role:"expat",set:()=>{ensure();S.cat="Plumbing"},note:"Filters cover city and district for every major Estonian city, language, day and time, hourly or fixed job pricing, rating and licence. The button shows how many providers match before she commits."},
 {title:"A profile she can trust",fx:[{t:"Verified ID",c:"Identity checked by Kodu"},{t:"Licensed",c:"Licence checked against the register"},{sel:".note",c:"Exactly how they will talk to each other"},{sel:".mrow",c:"Small jobs can be booked instantly at a fixed price"},{sel:".pgrid",c:"Photos from real Kodu jobs"},{t:"Reply from",up:".rreply",c:"Providers can answer every review"}],route:"profile",role:"expat",set:()=>{S.view=pro().id},note:"She opens Mart Kask. He does not speak Spanish, but he speaks English at C1, and Kodu will translate the chat anyway. Verified ID and licence badges, languages with levels, a fixed price menu, photos of past work, reviews with his replies and his cancellation policy are all visible before any money moves."},
 {title:"Describe the job",fx:[{sel:"input[name=title]",type:"Leaking kitchen tap",c:"Describe the problem in her own words"},{t:"Added",c:"A photo helps the provider quote accurately"},{t:"This week",up:"button",click:1,c:"Set how urgent it is"},{t:"Choose a time",up:"button",c:"Then pick a slot from his calendar"}],route:"book",role:"expat",set:()=>{const p=pro();S.view=p.id;S.draft={title:"Leaking kitchen tap",desc:"Dripping for a week, the cupboard under the sink is wet.","Photo 1":true}},note:"Booking takes three short steps: describe the problem, add a photo and pick a slot. The provider answers with a written quote before any work starts, so there are no surprises."},
 {title:"Chat without a language barrier",fx:[{t:"Delivered in Estonian",c:"Written in Spanish, delivered in Estonian"},{t:"ET: Jah",c:"His original message stays one tap away"},{sel:".qcard",c:"The quote arrives right inside the chat"},{sel:"input[name=msg]",type:"Can you bring the cartridge with you?",send:1,c:"Let us send a message live"},{wait:2600},{sel:".bub2",last:1,c:"His reply arrives already translated"}],route:"chat",role:"expat",set:()=>{job()},note:"Sofia writes in Spanish and Mart reads Estonian. Every message is translated automatically and the original stays one tap away. The quote arrives inside the chat."},
 {title:"A clear quote",fx:[{t:"Materials",up:".row",c:"Materials listed separately"},{t:"Kodu service fee",up:".row",c:"Our fee is shown, never hidden"},{t:"Total to hold in escrow",up:".row",c:"One clear total"}],route:"job",role:"expat",set:()=>{job()},note:"The quote breaks down labour, materials and the Kodu fee. If her landlord is responsible for repairs, the landlord is asked to approve it first."},
 {title:"Safe payment",fx:[{t:"Total held in escrow",up:".row",c:"The money goes to Kodu, not the provider"},{t:"Apple Pay",up:"[data-pay]",click:1,c:"Pay the way she already pays"},{t:"Held in escrow.",c:"Released only when she confirms the job"},{t:"Pay €",up:"button",c:"One tap to book"}],route:"pay",role:"expat",set:()=>{job()},note:"Payment is held by Kodu, not sent to the provider. It is released only when Sofia confirms the job is done, and she can open a dispute if something goes wrong."},
 {title:"Small jobs in one tap",route:"slots",role:"expat",set:()=>{const p=pro();S.view=p.id;const it=pmenu(p)[0];const d=Object.keys(p.slots)[0];S.draft={title:it.name,desc:"Booked from the fixed price menu.",menu:0,price:it.price,mins:it.mins,day:d,slot:p.slots[d][0]}},fx:[{t:"Fixed price, instant booking",up:".card",c:"No quote, no waiting: the price is fixed"},{t:"Book and pay",up:"button",click:1,c:"Straight to secure payment"}],note:"For small, standard jobs Sofia does not need a quote at all. Mart publishes a fixed price menu, and she books and pays in one go. The money is still held in escrow until the job is done."},
 {title:"Mart's dashboard",fx:[{t:"Tere, Mart",c:"Mart sees Kodu in Estonian"},{t:"€356.00",count:1,c:"Money safely held in escrow for him"},{t:"Accepting new requests",c:"Pause anytime, or for a date range"},{t:"Urgent, no hot water",c:"Urgent jobs stand out"},{t:"2.4 km",c:"Distance to every job"}],route:"phome",role:"provider",set:()=>{pensure()},note:"Now the other side, from Mart's phone. He is the plumber Sofia just booked. His dashboard shows new requests, today's jobs and money in escrow, and he can pause bookings for holidays."},
 {title:"A request worth taking",fx:[{t:"You both speak",c:"He knows how they will talk before replying"},{t:"Ask a question first",up:"button",c:"Ask before quoting, no commitment"},{t:"Small repair, 1 h",up:"button",click:1,c:"Saved templates fill a quote in one tap"},{t:"Ask for materials as a deposit",up:"button",click:1,c:"Parts paid up front, so he never pays out of pocket"},{t:"Save as template",c:"And any quote can become a template"}],route:"preq",role:"provider",set:()=>{pensure();const r=S.pjobs.find(x=>x.status==="new")||S.pjobs[0];S.preqId=r.id},note:"Each request shows distance, urgency, photos and the customer's language. Mart can ask a question first, send a fixed price, a range or a paid site visit, use saved templates, ask for the materials as a deposit, or suggest another time instead of declining."},
 {title:"When the job grows",route:"preq",role:"provider",set:()=>{pensure();const j=S.pjobs.find(x=>x.status==="paid"&&!x.instant)||S.pjobs[0];delete j.co;S.preqId=j.id;S.coOpen=true;S.coPhoto=false;S.coAmt="";S.coReason="";S.finishing=false},fx:[{sel:"input[name=coamt]",type:"35",c:"He found a corroded valve: extra €35"},{t:"Add photo",up:"button",click:1,c:"A photo shows the customer the problem"},{t:"Send to",up:"button",click:1,c:"Sent translated for approval"},{wait:3300},{t:"Change order approved",up:".note",c:"Approved in the app and added to escrow"}],note:"Real jobs often turn out bigger than quoted. Instead of arguing about cash on the doorstep, Mart sends a change order with a photo and a reason. The customer approves it in the app and the extra amount joins the escrow."},
 {title:"His week at a glance",fx:[{t:"Week of",c:"His whole week in one view"},{t:"Leaking kitchen tap",c:"Each booking blocks the hours it takes"},{t:"Month",up:"button",click:1,c:"Switch to the month view"}],route:"pjobs",role:"provider",set:()=>{pensure();S.ptab="Calendar";S.calView="Week"},note:"The calendar shows booked jobs by week or month, and every booking blocks the hours it takes so he is never double booked. Availability can be copied across the week in one tap."},
 {title:"Talking to customers",fx:[{sel:".jstrip",c:"The jobs with this customer, pinned on top"},{t:"Translated ES",c:"He writes Estonian, she reads Spanish"},{t:"I can come at the booked time",up:"button",click:1,c:"His own quick replies, one tap to send"},{wait:600},{sel:".bub2",last:1,c:"Sent and translated for her"}],route:"pchat",role:"provider",set:()=>{pensure();const r=S.pjobs.find(x=>x.status==="new")||S.pjobs[0];if(!S.pchats[r.eid]){const k=Object.keys(S.pchats)[0];S.pview=k||r.eid}else S.pview=r.eid},note:"Mart writes in Estonian and the customer reads their own language. The job is pinned at the top of the chat, and his own quick replies save typing on site."},
 {title:"Getting paid",fx:[{t:"Next payout",c:"When his next payout arrives"},{sel:".chart",c:"Earnings week by week"},{t:"View statement",up:"button",c:"A statement for his accountant"}],route:"pearn",role:"provider",set:()=>{pensure()},note:"Earnings show what is in escrow, what is pending and what has been paid out, with a weekly chart, a printable receipt for every job and a statement for his accountant."},
 {title:"A profile that sells",route:"pme",role:"provider",set:()=>{pensure();S.insurance=false;S.menuAdding=false},fx:[{sel:".scorev",count:1,c:"Profile strength, with exactly what is missing"},{t:"Upload  +20%",up:"button",click:1,c:"Every step raises his ranking in search"},{sel:".pgrid",c:"Before and after photos of his work"},{t:"Service menu",up:".card",c:"Fixed prices customers can book instantly"},{t:"Cancellation policy",up:".card",c:"His own cancellation rules, shown to customers"}],note:"Mart's profile tells him what to improve: a photo, his insurance, more work photos. Profiles above 80% get up to three times more requests. Here he also sets his fixed price menu and his cancellation policy."},
 {title:"Answering reviews",route:"previews",role:"provider",set:()=>{pensure();S.replyOpen=null;delete S.revReplies[1]},fx:[{t:"Reply publicly",up:"button",click:1,c:"Reply to any review in his own language"},{t:"Sorry about the delay",up:"button",click:1,c:"Start from a ready made reply"},{t:"Post reply",up:"button",click:1,c:"Posted and translated for every reader"},{t:"Rate your customers",c:"Private customer ratings protect providers"}],note:"Providers can answer every review publicly, in their own language, and Kodu translates the reply. They also rate customers privately, so Kodu can spot difficult clients."},
 {title:"Know your business",route:"pinsights",role:"provider",set:()=>{pensure()},fx:[{t:"Quotes accepted",up:".kpi",c:"How many quotes turn into paid jobs"},{t:"Where the demand is",up:".card",c:"Demand by district, and where he is missing out"},{t:"Your price against the area",up:".card",c:"His rate against other Tallinn plumbers"},{t:"When customers want you",up:".card",c:"The busiest times to keep open"},{t:"Ways to get more work",c:"Concrete next steps, one tap each"}],note:"Insights turn Kodu's data into advice: how many quotes are accepted, where demand is, how his price compares with the area, when customers book, and three concrete actions to get more work."},
 {card:"close",title:"Kodu",note:"Kodu turns a stressful search into one trusted booking: the right language, a verified provider, a clear quote and protected payment. Thank you."}
];
const byT=t=>SC_FULL.find(x=>x.title===t);
const SC_NEW=[
 {card:"newopen",title:"Kodu",note:"Since the last version, Kodu has seven new features built from what real providers told us, plus a help centre. Fixed price services, materials deposits, change orders, cancellation policies, a profile score with a portfolio, review replies and business insights. We show each one from both sides of the marketplace."},
 {title:"A profile that answers questions",route:"profile",role:"expat",set:()=>{S.view=pro().id},fx:[{sel:".mrow",c:"Fixed price services, bookable instantly"},{sel:".pgrid",c:"Photos of his real work"},{t:"Reply from",up:".rreply",c:"The provider answers reviews"},{t:"Moderate cancellation",up:".card",c:"His cancellation rules, before she books"}],note:"This is what Sofia now sees on Mart's profile. A menu of fixed price jobs she can book instantly, photos of his recent work, his replies to reviews, and his cancellation policy. Everything she needs to decide is on one page."},
 byT("Small jobs in one tap"),
 {title:"An instant booking lands",route:"preq",role:"provider",set:()=>{pensure();let j=S.pjobs.find(x=>x.id==="pinst");if(!j){const m=S.menu[0];const e=EXPATS[5%EXPATS.length];j={id:"pinst",eid:e.id,title:m.name,desc:"Booked from your service menu at a fixed price.",photos:1,day:"Thu",slot:"11:00",date:16,status:"paid",fixed:m.price,instant:true,hours:m.mins/60,materials:0,matDesc:"none",ago:"just now",paidAt:"just now"};S.pjobs.unshift(j)}S.preqId=j.id;S.coOpen=false;S.finishing=false},fx:[{t:"Instant booking from your service menu",up:".note",c:"Booked and paid, no quote written"},{t:"Fixed price, service menu",up:".row",c:"His own fixed price"},{t:"Held in escrow for you",up:".row",c:"Still protected by escrow"}],note:"On Mart's side the booking simply arrives, already paid. He wrote no quote and had no back and forth. That makes small jobs worth taking."},
 {title:"Parts paid up front",route:"preq",role:"provider",set:()=>{pensure();const j=S.pjobs.find(x=>x.status==="new");j.deposit=false;j.materials=j.materials||pMat()[1];S.preqId=j.id;S.declining=false},fx:[{t:"Ask for materials as a deposit",up:"button",click:1,c:"One switch in the quote"},{t:"Paid to you at booking",up:".row",c:"Paid to him when the customer books"},{t:"You receive",up:".row",c:"Labour stays in escrow until the job is done"}],note:"Plumbers told us they hate paying for parts out of their own pocket. Now a quote can ask for the materials as a deposit. Mart receives that amount when the customer books, and the labour stays in escrow."},
 {title:"What the customer sees",route:"pay",role:"expat",set:()=>{const j=job();j.status="quoted";j.deposit=true;delete j.co},fx:[{t:"paid to Mart now",up:".row",c:"The deposit is clearly labelled"},{t:"materials deposit goes to",up:".note",c:"She knows exactly where her money goes"},{t:"Moderate cancellation",up:".note",c:"And his cancellation policy, before she pays"}],note:"Sofia sees the deposit before she pays: which part goes to Mart now, and which part waits in escrow. The cancellation policy is shown on the same screen."},
 byT("When the job grows"),
 {title:"Approving extra work",route:"job",role:"expat",set:()=>{const j=job();j.status="paid";j.paidAt="today";j.deposit=false;j.co={amt:35,reason:"The valve under the sink is corroded and needs replacing too, otherwise it will leak again.",status:"pending"}},fx:[{sel:".cocard",c:"Reason, photo and price, translated"},{t:"Approve",up:"button",click:1,c:"She approves in one tap"},{t:"Extra work, approved",up:".row",c:"Added to escrow, never paid in cash"}],note:"On Sofia's side the change order arrives translated, with the reason, a photo and the exact amount. She approves it in the app, and the extra joins the escrow. No cash and no argument at the door."},
 {title:"Profile strength",route:"pme",role:"provider",set:()=>{pensure();S.insurance=false;S.pphoto=false;S.portfolio=S.portfolio.slice(0,2);S.menuAdding=false},fx:[{sel:".scorev",count:1,c:"How complete his profile is"},{t:"Upload  +20%",up:"button",click:1,c:"Upload insurance, earn the Insured badge"},{sel:"[data-sv=portadd]",click:1,c:"Add a photo of his work"},{sel:".scorev",c:"Each step lifts his ranking in search"}],note:"Mart's profile now tells him exactly what is missing. Each item raises his score, and profiles above 80 percent get up to three times more requests. His work photos appear on his public profile."},
 {title:"Menu and cancellation rules",route:"pme",role:"provider",set:()=>{pensure();S.menuAdding=false;S.cpol="Moderate"},fx:[{t:"Service menu",up:".card",c:"His fixed price menu"},{sel:"[data-sv=mprice][data-arg='0:5']",click:1,c:"Change a price in one tap"},{t:"Cancellation policy",up:".card",c:"Three policies to choose from"},{t:"Strict",up:"button",click:1,c:"He decides how strict to be"}],note:"Here Mart manages his fixed price menu and chooses his cancellation policy: Flexible, Moderate or Strict. Customers see both on his profile before they book."},
 {title:"Protected from late cancellations",route:"preq",role:"provider",set:()=>{pensure();let j=S.pjobs.find(x=>x.lateFee);if(!j){j=S.pjobs.filter(x=>x.status==="paid"&&!x.instant).slice(-1)[0];j.status="cancelled";j.lateFee=cpolFeeFor(pq(j).net)}S.preqId=j.id},fx:[{t:"Late cancellation.",up:".note",c:"The customer cancelled six hours before"},{t:"You keep, late cancellation",up:".row",c:"He keeps the fee from his policy"}],note:"When a customer cancels late, the policy is applied automatically. Mart keeps the fee and it is paid out with his next payout."},
 byT("Answering reviews"),
 byT("Know your business"),
 {title:"Help when you need it",route:"help",role:"expat",set:()=>{S.helpTab="expat";S.helpPol="disputes"},fx:[{sel:"input[name=hq]",type:"refund",c:"Search 36 answers for both sides"},{sel:"details.hq",c:"Answers open right away"},{t:"Safety and policies",up:"button",click:1,c:"Five trust and safety policies"},{t:"Dispute resolution",up:".legaldoc",c:"Clear rules when something goes wrong"}],note:"Finally, the new help centre. Expats and providers each have their own answers, there is search, and the five trust and safety policies are one tap away: verification, community guidelines, payments, disputes and reviews."},
 {card:"newclose",title:"Kodu",note:"Seven features, all from real provider feedback, plus a help centre. Small jobs are faster, parts are paid up front, extra work is agreed in the app, and providers know how to grow. Thank you."}
];
let SC=SC_NEW;


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
#pcard{position:fixed;inset:0;overflow:hidden;z-index:9990;background:#F6F2EA;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
#pcard .pz-in{position:relative;display:flex;flex-direction:column;align-items:center;gap:22px;max-width:760px;animation:pcIn .5s ease both}
#pcard h1{font-family:Sora,sans-serif;font-size:clamp(44px,8vw,88px);letter-spacing:-.03em;line-height:1;margin:0;color:#16201D}
#pcard p{font-size:clamp(17px,2.2vw,22px);color:#56605C;margin:0;line-height:1.45}
#pcard .pz-tags{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}#pcard .pz-tags span{padding:8px 14px;border-radius:18px;background:#fff;border:1px solid #E4DED3;font-size:14px;font-weight:700;color:#16201D}
#pcard .pz-by{font-size:13px;color:#8A918D;margin-top:8px}
@keyframes pcIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (max-width:600px){#pres .pz-keys{display:none}#pres .pz-pt{font-size:14px}#pres .pz-note{font-size:13px}}

#pfx{position:fixed;inset:0;z-index:9980;pointer-events:none}
#pfx .pz-spot{position:fixed;border-radius:16px;box-shadow:0 0 0 200vmax rgba(22,32,29,.42),0 0 0 3px #BFE3D6,0 0 26px 6px rgba(191,227,214,.75);opacity:0;transition:left .5s cubic-bezier(.2,.8,.2,1),top .5s cubic-bezier(.2,.8,.2,1),width .5s cubic-bezier(.2,.8,.2,1),height .5s cubic-bezier(.2,.8,.2,1),opacity .35s}
#pfx.on .pz-spot{opacity:1;animation:pzRing 1.6s ease-in-out infinite}
@keyframes pzRing{0%,100%{box-shadow:0 0 0 200vmax rgba(22,32,29,.42),0 0 0 3px #BFE3D6,0 0 18px 4px rgba(191,227,214,.55)}50%{box-shadow:0 0 0 200vmax rgba(22,32,29,.42),0 0 0 5px #BFE3D6,0 0 34px 10px rgba(191,227,214,.9)}}
#pfx .pz-call{position:fixed;background:#16201D;color:#fff;font-family:Sora,sans-serif;font-weight:700;font-size:15px;line-height:1.35;padding:10px 14px;border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.25);opacity:0;transition:left .5s cubic-bezier(.2,.8,.2,1),top .5s cubic-bezier(.2,.8,.2,1),opacity .3s}
#pfx .pz-call::after{content:"";position:absolute;left:var(--ax,50%);bottom:-6px;width:12px;height:12px;background:#16201D;transform:translateX(-50%) rotate(45deg);border-radius:2px}
#pfx .pz-call.below::after{bottom:auto;top:-6px}
#pfx.on .pz-call{opacity:1}#pfx .pz-call.pz-pop{animation:pzPop .45s cubic-bezier(.2,1.4,.4,1)}
@keyframes pzPop{from{transform:scale(.85) translateY(6px);opacity:0}to{transform:none;opacity:1}}
#pfx .pz-cur{position:fixed;left:50%;top:110%;opacity:0;transition:left .6s cubic-bezier(.3,.7,.2,1),top .6s cubic-bezier(.3,.7,.2,1),opacity .3s;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))}
#pfx.cur .pz-cur{opacity:1}
#pfx .pz-cur::before{content:"";position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;background:rgba(191,227,214,.9);transform:scale(0);opacity:0}
#pfx .pz-cur.tap::before{animation:pzTap .6s ease-out}
@keyframes pzTap{0%{transform:scale(.2);opacity:1}100%{transform:scale(2.2);opacity:0}}
body.presenting .pz-enter>*:not(.sheet):not(.sheetbg):not(.bnav):not(.cta):not(.toast){animation:pzUp .55s cubic-bezier(.2,.8,.2,1) backwards}
body.presenting .pz-enter>*:nth-child(1){animation-delay:0.06s!important}
body.presenting .pz-enter>*:nth-child(2){animation-delay:0.12s!important}
body.presenting .pz-enter>*:nth-child(3){animation-delay:0.18s!important}
body.presenting .pz-enter>*:nth-child(4){animation-delay:0.24s!important}
body.presenting .pz-enter>*:nth-child(5){animation-delay:0.30s!important}
body.presenting .pz-enter>*:nth-child(6){animation-delay:0.36s!important}
body.presenting .pz-enter>*:nth-child(7){animation-delay:0.42s!important}
body.presenting .pz-enter>*:nth-child(8){animation-delay:0.48s!important}
body.presenting .pz-enter>*:nth-child(9){animation-delay:0.54s!important}
body.presenting .pz-enter>*:nth-child(10){animation-delay:0.60s!important}
body.presenting .pz-enter>*:nth-child(11){animation-delay:0.66s!important}
body.presenting .pz-enter>*:nth-child(12){animation-delay:0.72s!important}

@keyframes pzUp{from{opacity:0;transform:translateY(18px)}}
body.presenting .bbar{animation:pzGrow .9s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:bottom}
body.presenting .bcol:nth-child(1) .bbar{animation-delay:0.44s}
body.presenting .bcol:nth-child(2) .bbar{animation-delay:0.53s}
body.presenting .bcol:nth-child(3) .bbar{animation-delay:0.62s}
body.presenting .bcol:nth-child(4) .bbar{animation-delay:0.71s}
body.presenting .bcol:nth-child(5) .bbar{animation-delay:0.80s}
body.presenting .bcol:nth-child(6) .bbar{animation-delay:0.89s}
body.presenting .bcol:nth-child(7) .bbar{animation-delay:0.98s}
body.presenting .bcol:nth-child(8) .bbar{animation-delay:1.07s}

@keyframes pzGrow{from{transform:scaleY(0)}}
#pcard h1{animation:pzUp .7s .15s cubic-bezier(.2,.8,.2,1) backwards}
#pcard p{animation:pzUp .7s .3s cubic-bezier(.2,.8,.2,1) backwards}
#pcard svg{animation:pzLogo .9s cubic-bezier(.2,1.4,.4,1) backwards}
@keyframes pzLogo{from{transform:scale(.4) rotate(-12deg);opacity:0}}
#pcard .pz-tags span{animation:pzUp .5s cubic-bezier(.2,.8,.2,1) backwards}
#pcard .pz-tags span:nth-child(1){animation-delay:0.57s}
#pcard .pz-tags span:nth-child(2){animation-delay:0.69s}
#pcard .pz-tags span:nth-child(3){animation-delay:0.81s}
#pcard .pz-tags span:nth-child(4){animation-delay:0.93s}
#pcard .pz-tags span:nth-child(5){animation-delay:1.05s}

#pcard .pz-by{animation:pzUp .6s 1.1s backwards}
#pcard .pz-hi{height:34px;position:relative;width:260px;font-family:Sora,sans-serif;font-weight:700;font-size:24px;color:#0E5B4A}
#pcard .pz-hi span{position:absolute;inset:0;opacity:0;animation:pzWord 7.5s infinite}
#pcard .pz-hi span:nth-child(1){animation-delay:0.0s}
#pcard .pz-hi span:nth-child(2){animation-delay:1.5s}
#pcard .pz-hi span:nth-child(3){animation-delay:3.0s}
#pcard .pz-hi span:nth-child(4){animation-delay:4.5s}
#pcard .pz-hi span:nth-child(5){animation-delay:6.0s}

@keyframes pzWord{0%{opacity:0;transform:translateY(10px)}5%,17%{opacity:1;transform:none}22%,100%{opacity:0;transform:translateY(-10px)}}
#pcard .pz-glow{position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(191,227,214,.65),rgba(191,227,214,0) 65%);animation:pzFloat 8s ease-in-out infinite;pointer-events:none}
@keyframes pzFloat{0%,100%{transform:translate(-120px,-60px)}50%{transform:translate(120px,60px)}}
@media (prefers-reduced-motion:reduce){#pfx *,body.presenting .pz-enter>*,#pcard *{animation:none!important;transition:none!important}}
@media print{#pres,#pcard,#pfx{display:none}}`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

function card(kind){const c=document.getElementById("pcard")||document.body.appendChild(Object.assign(document.createElement("div"),{id:"pcard"}));
  if(kind==="newopen"||kind==="newclose"){c.innerHTML=kind==="newopen"?`<div class="pz-glow"></div><div class="pz-in">${mark(96,"#BFE3D6")}<div class="pz-by" style="margin:0;font-weight:700;color:#0E5A4C;letter-spacing:.08em;text-transform:uppercase">What is new</div><h1>kodu 2.0</h1><p>Seven features built from real provider feedback, and a help centre for everyone.</p><div class="pz-tags"><span>Fixed price menu</span><span>Materials deposits</span><span>Change orders</span><span>Cancellation policies</span><span>Profile score</span><span>Review replies</span><span>Insights</span><span>Help centre</span></div><div class="pz-by">Maan Ronhaar · Interactive prototype</div></div>`:`<div class="pz-glow"></div><div class="pz-in">${mark(90,"#BFE3D6")}<h1>Thank you</h1><p>Faster small jobs, parts paid up front, extra work agreed in the app, and clear rules for both sides.</p><div class="pz-tags"><span>Built from provider feedback</span><span>Both sides of the marketplace</span></div><div class="pz-by">Questions welcome</div></div>`;return}
  c.innerHTML=kind==="open"
   ?`<div class="pz-glow"></div><div class="pz-in">${mark(110,"#BFE3D6")}<div class="pz-hi"><span>Hello</span><span>Hola</span><span>Tere</span><span>Привет</span><span>Bonjour</span></div><h1>kodu</h1><p>Home repairs in your language, from people we have checked.</p><div class="pz-tags"><span>Language matched</span><span>Verified providers</span><span>Translated chat</span><span>Protected payment</span></div><div class="pz-by">Maan Ronhaar · Interactive prototype</div></div>`
   :`<div class="pz-glow"></div><div class="pz-in">${mark(90,"#BFE3D6")}<h1>Thank you</h1><p>One trusted booking: the right language, a verified provider, a clear quote and protected payment.</p><div class="pz-tags"><span>Expat side</span><span>Provider side</span><span>Phone and desktop</span></div><div class="pz-by">Questions welcome</div></div>`}
function nocard(){const c=document.getElementById("pcard");if(c)c.remove()}

function panel(){let p=document.getElementById("pres");if(!p){p=document.createElement("div");p.id="pres";document.body.appendChild(p)}
  const s=SC[idx];p.className=hidden?"pz-hid":"";
  p.innerHTML=`<div class="pz-pr"><span class="pz-pn">${idx+1} / ${SC.length}</span><span class="pz-pt">${s.card?(/open/.test(s.card)?"Opening":"Closing"):s.title}</span><button data-pres="notes" title="Speaker notes (N)">${notes?"Hide notes":"Notes"}</button>${s.fx?`<button data-pres="replay" title="Replay animation (R)">↻</button>`:""}<button data-pres="prev" aria-label="Previous" ${idx?"":"disabled style=opacity:.4"}>‹</button><button class="pz-nx" data-pres="next" aria-label="Next">${idx===SC.length-1?"Finish":"Next ›"}</button><button data-pres="exit" aria-label="Exit presentation" title="Exit (Esc)">✕</button></div>${notes?`<div class="pz-note">${s.note}</div><div class="pz-keys">Arrow keys or space to move · R replay · A animations on or off · N notes · H hide this bar · P phone frame · F full screen · Esc exit</div>`:""}<div class="pz-prog"><span style="width:${(idx+1)/SC.length*100}%"></span></div>`}

function show(i){clearFx();idx=Math.max(0,Math.min(SC.length-1,i));const s=SC[idx];
  if(s.card){card(s.card)}else{nocard();if(s.role)use(s.role);if(s.set)s.set();save();history=[];err={};anim=true;dir="fwd";route=s.route;render();const sc=document.querySelector("#phone .screen");if(sc){sc.scrollTop=0;if(fxOn){sc.classList.remove("pz-enter");void sc.offsetWidth;sc.classList.add("pz-enter")}}window.scrollTo(0,0);play(s.fx)}
  document.querySelectorAll(".toast").forEach(x=>x.remove());panel()}

function start(mode){if(on)return;SC=mode==="full"?SC_FULL:SC_NEW;on=true;snap={};KEYS.forEach(k=>{try{snap[k]=localStorage.getItem(k)}catch(e){}});back={S,route};
  try{localStorage.setItem("kodu.cookie","no")}catch(e){}
  PS={guest:blank(),expat:mk("expat"),provider:mk("provider")};
  document.body.classList.add("presenting");notes=window.innerWidth>700;hidden=false;show(0)}
function stop(){if(!on)return;clearFx();on=false;nocard();const p=document.getElementById("pres");if(p)p.remove();document.body.classList.remove("presenting");
  KEYS.forEach(k=>{try{if(snap[k]==null)localStorage.removeItem(k);else localStorage.setItem(k,snap[k])}catch(e){}});
  S=back.S;history=[];route=back.route;render();toast("Presentation ended")}
window.koduPresent=start;

document.addEventListener("click",e=>{const t=e.target.closest("[data-pres]");if(!t)return;e.stopPropagation();const a=t.dataset.pres;
  if(a==="start")start(t.dataset.mode||"new");else if(a==="next"){idx===SC.length-1?stop():show(idx+1)}else if(a==="prev")show(idx-1);else if(a==="exit")stop();else if(a==="notes"){notes=!notes;panel()}else if(a==="replay"){fxOn=true;play(SC[idx].fx)}},true);

document.addEventListener("keydown",e=>{if(!on)return;const tag=(e.target.tagName||"").toLowerCase();if(tag==="input"||tag==="textarea")return;const k=e.key;
  if(k==="ArrowRight"||k==="PageDown"||k===" "){e.preventDefault();idx===SC.length-1?stop():show(idx+1)}
  else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault();show(idx-1)}
  else if(k==="Escape"){if(document.fullscreenElement)return;stop()}
  else if(k==="n"||k==="N"){notes=!notes;panel()}
  else if(k==="r"||k==="R"){fxOn=true;play(SC[idx].fx)}
  else if(k==="a"||k==="A"){fxOn=!fxOn;if(!fxOn)clearFx();toast(fxOn?"Animations on":"Animations off")}
  else if(k==="h"||k==="H"){hidden=!hidden;panel()}
  else if(k==="p"||k==="P"){document.body.classList.toggle("phone-mode");const b=document.querySelector("[data-dev=phone]");if(b)b.textContent=document.body.classList.contains("phone-mode")?"Desktop layout":"Phone frame";fit()}
  else if(k==="f"||k==="F"){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(err){}}
});

const db=document.querySelector(".devbar");if(db)db.insertAdjacentHTML("beforeend",`<button data-pres="start" data-mode="new" style="background:#BFE3D6;color:#16201D;border-color:#BFE3D6;font-weight:700">Present what is new</button><button data-pres="start" data-mode="full">Full tour</button>`);
if(/fulltour/.test(location.hash+location.search))setTimeout(()=>start("full"),300);else if(/present/.test(location.hash+location.search))setTimeout(()=>start("new"),300);
})();

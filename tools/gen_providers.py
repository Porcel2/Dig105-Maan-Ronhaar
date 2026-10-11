import random, json
random.seed(7)
first={"ET":["Kristjan","Priit","Mart","Jaan","Kaur","Rasmus","Tõnu","Marko","Siim","Liis","Kadri","Maarja","Triin","Kersti","Anneli"],
"RU":["Andrei","Sergei","Dmitri","Nikolai","Pavel","Igor","Olga","Natalia","Irina","Svetlana"],
"UK":["Olena","Oksana","Taras","Bohdan","Iryna","Dmytro","Yulia"],
"FI":["Mikko","Jari","Petri","Sanna","Hanna"],
"EN":["James","Emma","Oliver","Grace"],"ES":["Carlos","Lucía","Diego"],"PT":["Ana","João","Beatriz"],"DE":["Lukas","Mia"],"IT":["Marco","Giulia"],"LV":["Jānis","Līga"],"PL":["Piotr","Agnieszka"]}
last={"ET":["Kask","Tamm","Lepp","Saar","Sepp","Mägi","Kukk","Rebane","Ilves","Pärn","Koppel","Luik","Raudsepp","Kuusk","Oja"],
"RU":["Volkov","Petrov","Ivanova","Smirnov","Kuznetsova","Popov","Sokolov"],"UK":["Shevchenko","Bondarenko","Kovalenko","Melnyk","Tkachenko"],
"FI":["Virtanen","Korhonen","Nieminen","Mäkinen"],"EN":["Walker","Hughes","Bennett"],"ES":["Ramírez","Ortega","Navarro"],"PT":["Ribeiro","Costa","Almeida"],"DE":["Becker","Hoffmann"],"IT":["Rossi","Conti"],"LV":["Bērziņš","Ozola"],"PL":["Nowak","Kowalski"]}
CITIES={"Tallinn":["Kesklinn","Kalamaja","Põhja-Tallinn","Mustamäe","Lasnamäe","Nõmme","Kristiine","Haabersti","Pirita","Kadriorg","Telliskivi","Õismäe"],
"Tartu":["Kesklinn","Annelinn","Karlova","Tähtvere","Ülejõe","Supilinn","Ropka","Raadi"],
"Narva":["Kesklinn","Kreenholm","Pähklimäe","Soldino","Kalevi"],
"Pärnu":["Kesklinn","Rannarajoon","Ülejõe","Raeküla","Mai","Vana-Pärnu"],
"Kohtla-Järve":["Järve","Ahtme","Sompa","Kukruse"],
"Viljandi":["Kesklinn","Kantreküla","Paalalinn","Uueveski"],
"Rakvere":["Kesklinn","Vallimägi","Tõrremäe"],
"Maardu":["Kesklinn","Muuga","Kallavere"],
"Kuressaare":["Kesklinn","Roomassaare","Tori"],
"Võru":["Kesklinn","Võlsi","Kubija"]}
areas=CITIES["Tallinn"]
cats={
"Plumbing":("Plumber",["Leaks","Boilers","Taps and mixers","Bathroom fittings","Radiators","Drains","Washing machines","Water heaters"],[30,45],"cartridge and seals",18),
"Electrical":("Electrician",["Sockets","Lighting","Fuse boards","EV chargers","Safety checks","Appliances","Smart home"],[34,50],"socket and cable",22),
"Painting":("Painter",["Interior walls","Ceilings","Wall prep","Exterior","Wallpaper","Colour advice"],[26,38],"paint and tape",42),
"Cleaning":("Cleaner",["Move out clean","Deep clean","Weekly clean","Windows","Carpets","After renovation"],[18,30],"supplies",8),
"Handyman":("Handyman",["Furniture assembly","Shelves and curtains","Door locks","TV mounting","Small repairs","Lightbulbs and fixtures"],[24,38],"fixings",12),
"Moving":("Mover",["Flat move","Single item","Furniture disposal","Packing","Storage run","IKEA pickup"],[28,45],"van and straps",25),
}
bios={"Plumbing":["{n} years on Tallinn apartments. Leaks, boilers and bathroom fittings, with a written quote first.","Emergency and planned plumbing in {a}. Photographs every repair for the landlord."],
"Electrical":["Certified electrician, {n} years. Sockets, lighting and fuse boards, safety certificate on request.","Smart home and lighting for rentals in {a}. Explains everything with photos."],
"Painting":["Interior painting and wall prep, {n} years. Clean edges, no mess left behind.","Painter and decorator working mostly with expat rentals in {a}."],
"Cleaning":["Move in and move out cleaning for rentals, {n} years. Deposit back guarantee on request.","Weekly and deep cleans in {a}, own supplies, keys handled carefully."],
"Handyman":["Furniture assembly, shelves and small repairs, {n} years. Brings own tools.","Fixes the small things landlords ignore. Based in {a}."],
"Moving":["Flat moves and single items with a van, {n} years. Packing material included.","Student and expat moves across Tallinn, based in {a}. Stairs are not a problem."]}
revtxt={"Plumbing":["Fixed the leak the same day and explained each step.","Quoted exactly what was charged. No surprises.","Came on time and left the bathroom spotless."],
"Electrical":["Replaced the sockets in one visit, very tidy.","Clear price breakdown in the app before starting.","Did a safety check before we moved in, worth it."],
"Painting":["Two rooms in two days, clean edges.","Great colour advice and a fair price.","Covered everything, no paint anywhere it should not be."],
"Cleaning":["Flat looked new, got the full deposit back.","On time, thorough, friendly.","Best clean we have had in Tallinn."],
"Handyman":["Assembled the whole IKEA order in an afternoon.","Fixed three small things for one fair price.","Quick reply and tidy work."],
"Moving":["Moved our flat in three hours, nothing broken.","Helped carry everything up four floors.","Single item pickup, cheap and fast."]}
revnames=[("Sofia R.","ES"),("Tomás B.","PT"),("Daniel K.","DE"),("Aisha M.","GB"),("Lina V.","LT"),("Marco P.","IT"),("James O.","US"),("Hannah W.","DE"),("Yuki T.","JP"),("Erik S.","SE"),("Natalia G.","RU"),("Chloé D.","FR"),("Mateo L.","ES"),("Priya N.","IN"),("Noah F.","NL")]
days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
times=["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
colors=["#BFE3D6","#F2C14E","#E4DED3","#D9643A","#0E5A4C","#CBCADB","#EBCECE"]
existing={"Plumbing":2,"Electrical":2,"Painting":2,"Cleaning":0,"Handyman":0,"Moving":0}
out=[];n=100;used=set(["Mart Kask","Olena Shevchenko","Priit Tamm","Ana Ribeiro","Andrei Volkov","Kristjan Lepp"])
allfirst=[x for v in first.values() for x in v]+["Kaspar","Mihkel","Liina","Eva","Hanna","Oskar","Robin","Nora","Laura","Henri","Karl","Sander","Mari","Katrin","Rein","Toomas","Viktor","Alina","Daria","Maksim","Artur","Jelena","Kristina","Vladislav","Timur"]; alllast=[x for v in last.values() for x in v]+["Lill","Vaher","Kallas","Rand","Teder","Allik","Põder","Paju","Laas","Kangur","Orav","Kivi","Jõgi","Lind","Mets","Nõmm","Tali","Uibo","Varik","Õun"]
plan=[]
for cat in cats:
    plan+= [(cat,"Tallinn")]*(15-existing[cat])
    for c in CITIES:
        if c!="Tallinn": plan+=[(cat,c)]*6
for cat,cityfix in plan:
        trade,jobs,rr,mat,matp=cats[cat]
        nat=random.choices(["ET","RU","UK","FI","EN","ES","PT","DE","IT","LV","PL"],[40,18,12,6,4,4,4,3,3,3,3])[0]
        for _ in range(20):
            name=random.choice(first[nat])+" "+random.choice(last[nat])
            if name not in used: break
        else:
            for _ in range(500):
                name=random.choice(allfirst)+" "+random.choice(alllast)
                if name not in used: break
        used.add(name)
        langs=[[nat,"Native"]]
        pool=[l for l in ["EN","ET","RU","ES","DE","FI","UK","PT","FR","IT","LV","PL","SV","AR","TR","ZH"] if l!=nat]
        for l in random.sample(pool,random.choice([1,2,2,3])):
            langs.append([l,random.choice(["A2","B1","B2","B2","C1"])])
        if nat!="ET" and not any(l=="ET" for l,_ in langs): langs.append(["ET",random.choice(["A2","B1","B2"])])
        badges=["Verified ID"]
        if cat in("Plumbing","Electrical") and random.random()<.75: badges.append("Licensed")
        rating=random.choice([4.4,4.5,4.6,4.7,4.7,4.8,4.8,4.9,5.0])
        if rating>=4.8 and random.random()<.6: badges.append("Top rated")
        city=cityfix;area=random.choice(CITIES[city]); yrs=random.randint(3,15)
        perjob=random.random()<({"Cleaning":.6,"Moving":.7,"Handyman":.3,"Painting":.3,"Plumbing":.15,"Electrical":.15}[cat])
        jobprice=random.choice({"Cleaning":[60,75,90,110,140],"Moving":[80,120,150,190,240],"Handyman":[45,60,80,95],"Painting":[180,240,320,420],"Plumbing":[70,90,120,150],"Electrical":[80,110,140,180]}[cat])
        rv=random.sample(revnames,2);rt=random.sample(revtxt[cat],2)
        slots={d:sorted(random.sample(times,random.randint(1,3))) for d in random.sample(days,random.randint(2,4))}
        n+=1
        out.append({"id":f"p{n}","name":name,"ini":"".join(w[0] for w in name.split()[:2]),"bg":random.choice(colors),"trade":trade,"cat":cat,"city":city,"area":area,"pricing":"job" if perjob else "hour","jobPrice":jobprice,"langs":langs,"badges":badges,
          "rate":random.randint(*rr),"rating":rating,"reviews":random.randint(8,160),"rel":random.randint(88,100),"reply":random.choice(["8 min","12 min","20 min","35 min","1 h","2 h"]),
          "bio":random.choice(bios[cat]).format(n=yrs,a=area),"tags":random.sample(jobs,random.randint(3,5)),
          "revs":[[rv[0][0],rv[0][1],rt[0],5,"2 weeks ago"],[rv[1][0],rv[1][1],rt[1],random.choice([4,5]),"1 month ago"]],"slots":slots})
open(__import__("pathlib").Path(__file__).resolve().parent.parent/"prototype"/"data"/"providers.json","w").write(json.dumps(out,ensure_ascii=False))
print(len(out))

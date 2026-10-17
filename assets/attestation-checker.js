/* QuickDocs: preliminary attestation checker. No form fields contain personal data. */
(function(){
"use strict";
var form=document.getElementById("qd-attestation-form");
if(!form)return;
var result=document.getElementById("qd-attestation-result");
var started=false;
var permitted=["india","uae","other"];
var types=["degree","marriage","birth"];
function safe(v,opts){return opts.includes(v)?v:opts[0];}
function label(v){return ({india:"India",uae:"UAE",other:"another country",degree:"degree certificate",marriage:"marriage certificate",birth:"birth certificate"})[v]||v;}
form.addEventListener("change",function(){
 if(!started){started=true;if(typeof window.quickdocsTrack==="function")window.quickdocsTrack("attestation_checker_start",{service:"attestation",source:"checker"});}
});
form.addEventListener("submit",function(e){
 e.preventDefault();
 var country=safe(form.elements.issued.value,permitted);
 var doc=safe(form.elements.document_type.value,types);
 var use=safe(form.elements.use.value,["uae","outside"]);
 var completed=safe(form.elements.completed.value,["unknown","none","some"]);
 var steps=[];
 if(country==="uae"){
 steps.push("Check whether the UAE issuing authority supports original digital attestation or needs an approved courier route. MOFA determines eligible routes according to authority and document type.");
 }else if(country==="india"){
 steps.push("Confirm the appropriate Indian issuing-authority/state verification and Ministry of External Affairs or mission requirements; the actual route depends on the document and its prior attestations.");
 steps.push("Check the UAE mission legalisation or Indian consular route required by the receiving authority.");
 }else{
 steps.push("Ask the competent issuing-country authority which preliminary authentication steps are required.");
 steps.push("Check the UAE mission requirements for the issuing country and the receiving authority.");
 }
 if(use==="uae"){steps.push("Review UAE MOFA requirements for the document, including required earlier attestations and eligible digital or courier processing.");}
 else{steps.push("Confirm the destination country's receiving-authority and mission legalisation requirements; UAE MOFA may be part of the chain for UAE-issued documents.");}
 if(doc==="degree"){steps.push("Check whether educational qualification recognition is a separate requirement; attestation alone does not establish academic recognition.");}
 if(doc==="marriage"){steps.push("For a new UAE spouse visa, confirm whether the marriage certificate requires attestation. Routine renewals usually use a different document checklist.");}
 if(doc==="birth"){steps.push("For new child sponsorship or newborn residency, confirm the accepting authority's specific birth-certificate requirements.");}
 if(completed==="none"){steps.push("Keep the original document available until the required initial authentication steps are confirmed.");}
 else if(completed==="some"){steps.push("Share which authority issued each existing stamp so the remaining steps can be verified.");}
 else{steps.push("Confirm any existing stamps or digital reference numbers before submitting an application.");}
 steps.push("Documents may need legally certified translation when not in Arabic or English; laminated documents may not be accepted by MOFA.");
 var list=result.querySelector("[data-qd-steps]");
 list.replaceChildren();
 steps.forEach(function(s){var li=document.createElement("li");li.textContent=s;list.appendChild(li);});
 var msg="Hello QuickDocs UAE, please verify my document attestation route.\nCountry of issue: "+label(country)+"\nDocument: "+label(doc)+"\nUse: "+(use==="uae"?"UAE":"Outside UAE")+"\nExisting steps: "+completed+"\nPlease send the requirements and service fee.";
 var a=result.querySelector("[data-qd-wa]");
 a.href="https://wa.me/971508979376?text="+encodeURIComponent(msg);
 result.hidden=false;
 result.querySelector("h3").textContent="Your preliminary checklist";
 if(typeof window.quickdocsTrack==="function")window.quickdocsTrack("attestation_checker_complete",{service:"attestation",source:"checker"});
 result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
})();
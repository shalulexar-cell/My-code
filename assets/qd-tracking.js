/* QuickDocs consent-gated, PII-minimising analytics. Configure GA4 via window.QUICKDOCS_GA4_ID to activate. */
(function(){
"use strict";
var ID=String(window.QUICKDOCS_GA4_ID||"");
var valid=/^G-[A-Z0-9]+$/.test(ID);
var allow=["attestation_checker_start","attestation_checker_complete","whatsapp_click","quote_request_click","phone_click","email_click"];
var sourceSet=["checker","home","mofa","service","family_visa","blog","floating","header","other"];
var consent=null;
try{consent=localStorage.getItem("qd_analytics_consent");}catch(e){}
function clean(value){return String(value||"other").toLowerCase().replace(/[^a-z0-9_-]/g,"_").slice(0,45);}
function source(v){v=clean(v);return sourceSet.includes(v)?v:"other";}
function getService(el){
 var name=el&&el.getAttribute("data-qd-service");
 if(!name){var p=location.pathname.match(/\/services\/([a-z0-9-]+)\.html/);name=p?p[1]:"other";}
 return clean(name);
}
function start(){
 if(!valid||consent!=="yes"||window.__qdAnalyticsLoaded)return;
 window.__qdAnalyticsLoaded=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag("js",new Date());
 window.gtag("config",ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
 var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ID);document.head.appendChild(s);
 window.gtag("event","page_view",{page_title:document.title,page_location:location.origin+location.pathname});
}
window.quickdocsTrack=function(name,props){
 if(!valid||consent!=="yes"||!allow.includes(name))return;
 props=props||{};
 if(typeof window.gtag==="function")window.gtag("event",name,{source:source(props.source),service:clean(props.service),page_path:location.pathname});
};
function save(v){
 consent=v;try{localStorage.setItem("qd_analytics_consent",v);}catch(e){}
 document.getElementById("qd-consent-banner")?.remove();
 if(v==="yes")start();
}
function banner(){
 if(!valid||consent!==null)return;
 var el=document.createElement("section");el.id="qd-consent-banner";el.className="qd-consent-banner";el.setAttribute("aria-label","Analytics preferences");
 el.innerHTML="<strong>Help us improve QuickDocs</strong><p>Allow optional analytics to measure page views and service enquiry clicks. We do not send your document details or WhatsApp messages to Analytics. <a href='/privacy.html' style='text-decoration:underline'>Privacy policy</a>.</p>";
 var accept=document.createElement("button");accept.type="button";accept.textContent="Allow analytics";
 var decline=document.createElement("button");decline.type="button";decline.textContent="Decline";
 accept.addEventListener("click",function(){save("yes");});
 decline.addEventListener("click",function(){save("no");});
 el.append(accept,decline);document.body.appendChild(el);
}
function init(){
 if(valid){if(consent==="yes")start();else banner();}
 document.addEventListener("click",function(e){
 var target=e.target.closest("a,button");if(!target)return;
 var href=target.getAttribute("href")||"";
 var src=target.getAttribute("data-qd-source")||"service";
 var service=getService(target);
 if(target.hasAttribute("data-qd-quote")||/Get Service fee/i.test(target.textContent||"")){
 window.quickdocsTrack("quote_request_click",{source:src,service:service});
 }
 else if(/^https:\/\/wa\.me\//i.test(href)){
 window.quickdocsTrack("whatsapp_click",{source:src,service:service});
 }
 else if(/^tel:/i.test(href)){window.quickdocsTrack("phone_click",{source:src,service:service});}
 else if(/^mailto:/i.test(href)){window.quickdocsTrack("email_click",{source:src,service:service});}
 },{capture:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
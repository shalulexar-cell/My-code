document.addEventListener("DOMContentLoaded",function(){
  if(window.lucide) lucide.createIcons();

  const form=document.querySelector('form[data-whatsapp-form="true"]');
  if(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      const get=n=>(form.querySelector(`[name="${n}"]`)?.value||"").trim();
      const name=get("name"),phone=get("phone"),email=get("email"),service=get("service"),message=get("message");
      if(!name||!phone){alert("Please enter your name and phone / WhatsApp number.");return;}
      const text="*New Enquiry – QuickDocs UAE*\n\n"+
        "*Name:* "+name+"\n"+
        "*Phone/WhatsApp:* "+phone+"\n"+
        (email?"*Email:* "+email+"\n":"")+
        (service?"*Service:* "+service+"\n":"")+
        (message?"*Requirements:* "+message+"\n":"")+
        "\nPlease assist with this enquiry.";
      window.open("https://wa.me/971508979376?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");
    });
  }

  document.querySelectorAll("#services [data-service]").forEach(btn=>{
    btn.addEventListener("click",function(){
      const service=this.getAttribute("data-service");
      const message="Hello QuickDocs UAE,\n\nI would like to enquire about:\n*"+service+"*\n\nPlease share the requirements and details.";
      window.open("https://wa.me/971508979376?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
    });
  });
});

function toggleFaq(btn){
  const content=btn.nextElementSibling;
  const icon=btn.querySelector("i");
  const open=content.classList.toggle("hidden")===false;
  btn.setAttribute("aria-expanded",open?"true":"false");
  if(icon) icon.classList.toggle("rotate-180");
}
function toggleMobileMenu(){
  const menu=document.getElementById("mobileMenu"),btn=document.getElementById("mobileMenuBtn");
  if(!menu||!btn)return;
  const hidden=menu.classList.contains("hidden");
  menu.classList.toggle("hidden");
  btn.setAttribute("aria-expanded",hidden?"true":"false");
}
function sendWhatsAppQuote(){
  const service=document.getElementById("qbService").value;
  const count=document.getElementById("qbCount").value;
  const speed=document.getElementById("qbSpeed").value;
  const message=`Hello QuickDocs UAE,

I would like a fast quote for:
• Service: ${service}
• Count: ${count}
• Priority: ${speed}

Please advise on document requirements and current timeline.`;
  window.open("https://wa.me/971508979376?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
}

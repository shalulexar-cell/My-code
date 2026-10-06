document.addEventListener("DOMContentLoaded",function(){

  const form=document.querySelector('form[data-whatsapp-form="true"]');
  if(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      const get=n=>(form.querySelector(`[name="${n}"]`)?.value||"").trim();
      const name=get("name"),phone=get("phone"),email=get("email"),service=get("service"),message=get("message");
      if(!name||!phone){alert("Please enter your name and phone / WhatsApp number.");return;}
      const text="*QuickDocs UAE – New Enquiry*\n\n"+
        "*Customer Details*\n"+
        "*Name:* "+name+"\n"+
        "*Phone / WhatsApp:* "+phone+"\n"+
        (email?"*Email:* "+email+"\n":"")+
        "\n*Enquiry*\n"+
        (service?"*Service:* "+service+"\n":"")+
        (message?"*Requirements:* "+message+"\n":"")+
        "\nPlease confirm the requirements, applicable fees and next steps.";
      window.open("https://wa.me/971508979376?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");
    });
  }

  document.querySelectorAll("#services [data-service]").forEach(btn=>{
    btn.addEventListener("click",function(){
      const service=this.getAttribute("data-service");
      const message="*QuickDocs UAE – Service Enquiry*\n\n*Service:* "+service+"\n\nPlease share the required documents, applicable fees and next steps.";
      window.open("https://wa.me/971508979376?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
    });
  });
});

function toggleFaq(btn){
  const content=btn.nextElementSibling;
  const icon=btn.querySelector("svg");
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
  const message=`*QuickDocs UAE – Fast Quote Request*

*Service:* ${service}
*Quantity:* ${count}
*Priority:* ${speed}

Please share the required documents, applicable fees and current processing timeline.`;
  window.open("https://wa.me/971508979376?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
}


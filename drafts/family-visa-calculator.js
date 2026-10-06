(function(root){
'use strict';
const fees=Object.freeze({outsideEntry:460,insideEntry:1098,statusChange:692,emiratesId:380,medical:320,residence:600,fileOpening:260,cancellation:320});
function estimate(input){
 const {adults,children,cancellations,location,fileOpening}=input;
 if(![adults,children,cancellations].every(n=>Number.isInteger(n)&&n>=0&&n<=20))throw new Error('Use whole numbers from 0 to 20.');
 const people=adults+children;
 if(people<1||people>20)throw new Error('Choose between 1 and 20 applicants.');
 if(cancellations>people)throw new Error('Cancellations cannot exceed the number of applicants.');
 if(!['inside','outside'].includes(location))throw new Error('Choose the applicants’ location.');
 const inside=location==='inside';
 const rows=[['Entry permits',people,inside?fees.insideEntry:fees.outsideEntry],...(inside?[['Change of status',people,fees.statusChange]]:[]),['Emirates ID',people,fees.emiratesId],['Medical fitness (age 18+)',adults,fees.medical],['Residence issuance',people,fees.residence],['Sponsor file opening',fileOpening?1:0,fees.fileOpening],['Existing visa cancellation',cancellations,fees.cancellation]].filter(x=>x[1]>0).map(([label,quantity,rate])=>({label,quantity,rate,subtotal:quantity*rate}));
 return {rows,total:rows.reduce((sum,r)=>sum+r.subtotal,0),people};
}
if(typeof module==='object'&&module.exports)module.exports={fees,estimate};
root.QuickDocsVisaEstimate={fees,estimate};
if(typeof document==='undefined')return;
const form=document.getElementById('visa-estimate');if(!form)return;
const output=document.getElementById('estimate-result'),error=document.getElementById('estimate-error'),send=document.getElementById('estimate-whatsapp');
function render(e){if(e)e.preventDefault();try{
 const input={adults:Number(form.elements.adults.value),children:Number(form.elements.children.value),cancellations:Number(form.elements.cancellations.value),location:form.elements.location.value,fileOpening:form.elements.fileOpening.checked};
 const result=estimate(input);const money=n=>new Intl.NumberFormat('en-AE',{style:'currency',currency:'AED',maximumFractionDigits:0}).format(n);
 output.replaceChildren();const table=document.createElement('table');table.innerHTML='<caption>Itemised estimate</caption><thead><tr><th scope="col">Item</th><th scope="col">Qty × rate</th><th scope="col">Amount</th></tr></thead>';const tbody=document.createElement('tbody');
 result.rows.forEach(row=>{let tr=document.createElement('tr');[row.label,`${row.quantity} × ${money(row.rate)}`,money(row.subtotal)].forEach((value,i)=>{const cell=document.createElement(i===0?'th':'td');if(i===0)cell.scope='row';cell.textContent=value;tr.appendChild(cell);});tbody.appendChild(tr);});table.appendChild(tbody);output.appendChild(table);
 const total=document.createElement('p');total.className='total';total.textContent='Estimated listed charges: '+money(result.total);output.appendChild(total);error.textContent='';
 const message=['Hello QuickDocs UAE, please confirm this family visa estimate.',`New application: ${input.adults} applicant(s) age 18+, ${input.children} under 18.`,`Location: ${input.location} UAE.`,`File opening: ${input.fileOpening?'included once':'not included'}.`,`Cancellations: ${input.cancellations}.`,...result.rows.map(r=>`${r.label}: ${money(r.subtotal)}`),`Listed charges: ${money(result.total)}. Please confirm visa duration, VAT, service fees, insurance and any extra charges.`].join('\n');
 send.href='https://wa.me/971508979376?text='+encodeURIComponent(message);send.hidden=false;
 }catch(err){error.textContent=err.message;output.replaceChildren();send.hidden=true;}}
form.addEventListener('submit',render);form.addEventListener('change',render);render();
})(typeof globalThis!=='undefined'?globalThis:this);

import{q as e,aj as y,S as l,a8 as A,B as w,aH as C,am as z,t as u,H as x,ar as D,x as P,aI as N,A as v,D as B,W as $,N as S,X as O,_ as I,at as k,C as F,a5 as E,a6 as L,a7 as H,aJ as R,ap as M,i as U}from"./index-BkMXhq-a.js";import{u as V}from"./useDocumentTitle-T24z4Lnb.js";import{u as q,L as G,S as c,a as J,b as K,l as W}from"./listResults-DqodbcdV.js";import{P as X}from"./pageHeader-BF3Ujvnc.js";import{d as g,c as d,b}from"./format-BgHf0aTA.js";import{u as Y,F as p,b as Q,r as j,p as Z}from"./formField-C5bFzo6b.js";import{w as ee}from"./titleNote-BYeS1rES.js";function se({invoice:s,onClose:t}){return s?e.jsxs(y,{open:!0,onClose:t,title:"Invoice details",footer:e.jsx(l,{direction:"row",spacing:8,justify:"flex-end",children:e.jsx(u,{variant:"secondary",outlined:!0,onClick:t,children:"Close"})}),children:[e.jsxs(l,{direction:"row",spacing:12,align:"center",className:"mb-3",children:[e.jsx(A,{size:"lg",text:s.customer}),e.jsxs("div",{children:[e.jsx("div",{className:"invoice-detail__title",children:s.id}),e.jsx("div",{className:"list-meta",children:s.customer}),e.jsx(l,{direction:"row",spacing:8,className:"mt-1",children:e.jsx(w,{color:C[s.status]??"secondary",children:g(s.status)})})]})]}),e.jsx(z,{spacing:4}),e.jsxs("div",{className:"invoice-detail__rows",children:[e.jsxs("div",{className:"invoice-detail__row",children:[e.jsx("span",{children:"Issued"}),e.jsx("strong",{children:d(s.issued)})]}),e.jsxs("div",{className:"invoice-detail__row",children:[e.jsx("span",{children:"Due"}),e.jsx("strong",{children:d(s.due)})]}),e.jsxs("div",{className:"invoice-detail__row",children:[e.jsx("span",{children:"Amount"}),e.jsx("strong",{children:b(s.amount)})]})]})]}):null}const te=N.filter(s=>s.value!=="all"),ae=Q({customer:[j("Customer")],amount:[j("Amount"),Z("Amount")],issued:[j("Issue date")],due:[j("Due date"),(s,t)=>t.issued&&s<t.issued?"The due date cannot be before the issue date.":void 0]}),ie=()=>{const s=new Date,t=new Date(s);return t.setDate(t.getDate()+30),{customer:"",amount:"",issued:s.toISOString().slice(0,10),due:t.toISOString().slice(0,10),status:"pending"}};function ne({open:s,onClose:t,onSave:m}){const a=Y({initialValues:ie(),validate:ae,onSubmit:o=>m({customer:o.customer.trim(),amount:Number(o.amount),issued:o.issued,due:o.due,status:o.status})});return e.jsx(y,{open:s,onClose:t,title:"New invoice",footer:e.jsxs(l,{direction:"row",spacing:8,justify:"flex-end",children:[e.jsx(u,{variant:"ghost",onClick:t,children:"Cancel"}),e.jsx(u,{type:"submit",form:"invoice-form",loading:a.submitting,leftIcon:e.jsx(P,{size:16}),children:"Create invoice"})]}),children:e.jsx("form",{id:"invoice-form",onSubmit:a.handleSubmit,noValidate:!0,children:e.jsxs(l,{direction:"column",spacing:12,children:[e.jsx(p,{error:a.errors.customer,children:e.jsx(x,{id:"customer",name:"customer",label:"Customer",placeholder:"Jane Doe",value:a.values.customer,onChange:a.handleChange("customer"),onBlur:a.handleBlur("customer")})}),e.jsx(p,{error:a.errors.amount,children:e.jsx(x,{id:"amount",name:"amount",label:"Amount",type:"number",min:"0",step:"0.01",placeholder:"0.00",value:a.values.amount,onChange:a.handleChange("amount"),onBlur:a.handleBlur("amount")})}),e.jsxs(l,{direction:"row",spacing:12,wrap:!0,children:[e.jsx(p,{error:a.errors.issued,className:"field-grow",children:e.jsx(x,{id:"issued",name:"issued",label:"Issued",type:"date",value:a.values.issued,onChange:a.handleChange("issued"),onBlur:a.handleBlur("issued")})}),e.jsx(p,{error:a.errors.due,className:"field-grow",children:e.jsx(x,{id:"due",name:"due",label:"Due",type:"date",value:a.values.due,onChange:a.handleChange("due"),onBlur:a.handleBlur("due")})})]}),e.jsx(D,{label:"Status","aria-label":"Status",options:te,value:a.values.status,onChange:a.handleChange("status")})]})})})}function r(s){return String(s??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function re(s){const t=window.open("","_blank","width=820,height=900");return t?(t.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${r(s.id)}</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 48px; }
  header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; }
  h1 { font-size: 28px; margin: 0; }
  .muted { color: #6b7280; font-size: 13px; }
  .id { font-size: 15px; font-weight: 600; margin-top: 4px; }
  table { border-collapse: collapse; margin-top: 32px; width: 100%; }
  th, td { border-bottom: 1px solid #e5e7eb; padding: 12px 8px; text-align: left; }
  th { color: #6b7280; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
  .total td { border-bottom: none; font-size: 18px; font-weight: 700; padding-top: 20px; }
  .right { text-align: right; }
  footer { color: #6b7280; font-size: 12px; margin-top: 48px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <header>
    <div>
      <h1>Invoice</h1>
      <div class="id">${r(s.id)}</div>
    </div>
    <div class="right">
      <strong>${r(v)}</strong>
      <div class="muted">support@naytak.io</div>
    </div>
  </header>

  <table>
    <tr><th>Billed to</th><th>Issued</th><th>Due</th><th class="right">Status</th></tr>
    <tr>
      <td>${r(s.customer)}</td>
      <td>${r(d(s.issued))}</td>
      <td>${r(d(s.due))}</td>
      <td class="right">${r(g(s.status))}</td>
    </tr>
    <tr class="total">
      <td colspan="3">Amount due</td>
      <td class="right">${r(b(s.amount))}</td>
    </tr>
  </table>

  <footer>Generated by ${r(v)} on ${r(d(new Date))}.</footer>
</body>
</html>`),t.document.close(),t.focus(),t.setTimeout(()=>t.print(),200),!0):!1}const oe=["id","customer"],le={status:(s,t)=>s.status===t};function je(){V("Invoices");const s=B(),t=$("invoices"),[m,a]=S.useState(null),[o,h]=S.useState(!1),n=q({items:t.items,searchKeys:oe,filters:le,defaultSort:"issued",pageSize:8}),T=i=>{const f=t.add(i);n.revealItem(f),h(!1),s.success(`Invoice ${f.id} created`)},_=i=>{re(i)||s.error("Allow pop-ups to print or save this invoice.")};return e.jsxs(O,{container:!0,fluid:!0,children:[e.jsx(I,{xs:12,spacing:2,className:"mb-3",children:e.jsx(X,{title:ee("Invoices","Track issued invoices and payment status"),actions:e.jsx(u,{size:"sm",leftIcon:e.jsx(k,{size:16}),onClick:()=>h(!0),children:"New invoice"})})}),e.jsx(I,{xs:12,spacing:2,children:e.jsxs(F,{title:W("All invoices",n),children:[e.jsx("div",{className:"mb-3",children:e.jsx(G,{list:n,searchPlaceholder:"Search invoice ID or customer…",filters:[{name:"status",label:"Status",options:N}]})}),n.visible.length>0?e.jsx("div",{className:"table-scroll",children:e.jsxs(E,{children:[e.jsx(L,{color:"primary",children:e.jsxs("tr",{children:[e.jsx(c,{list:n,field:"id",children:"Invoice"}),e.jsx(c,{list:n,field:"customer",children:"Customer"}),e.jsx(c,{list:n,field:"issued",children:"Issued"}),e.jsx(c,{list:n,field:"due",children:"Due"}),e.jsx(c,{list:n,field:"amount",children:"Amount"}),e.jsx(c,{list:n,field:"status",children:"Status"}),e.jsx("th",{scope:"col",style:{textAlign:"right"},children:"Actions"})]})}),e.jsx(H,{children:n.visible.map(i=>e.jsxs("tr",{children:[e.jsx("td",{children:i.id}),e.jsx("td",{children:i.customer}),e.jsx("td",{children:d(i.issued)}),e.jsx("td",{children:d(i.due)}),e.jsx("td",{children:b(i.amount)}),e.jsx("td",{children:e.jsx(w,{color:C[i.status]??"secondary",children:g(i.status)})}),e.jsx("td",{children:e.jsxs(l,{direction:"row",spacing:4,justify:"flex-end",children:[e.jsx(u,{size:"sm",variant:"ghost","aria-label":`Print invoice ${i.id}`,leftIcon:e.jsx(R,{size:16}),onClick:()=>_(i),children:"Print"}),e.jsx(u,{size:"sm",variant:"ghost",leftIcon:e.jsx(M,{size:16}),onClick:()=>a(i),children:"View"})]})})]},i.id))})]})}):e.jsx(J,{list:n,noun:"invoice",icon:e.jsx(U,{size:28}),onCreate:()=>h(!0),createLabel:"New invoice"}),e.jsx(K,{list:n,noun:"invoice"})]})}),m&&e.jsx(se,{invoice:m,onClose:()=>a(null)}),o&&e.jsx(ne,{open:!0,onClose:()=>h(!1),onSave:T})]})}export{je as InvoicesPage};

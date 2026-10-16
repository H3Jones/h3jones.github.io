import{n as e,r as t,t as n}from"./assets/core-BaFwG_ay.mjs";var r=document.createElement(`template`);r.innerHTML=`
  <style>
    :host { display: block; font: inherit; }
    form { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: end; }
    label { display: grid; gap: 0.25rem; font-size: 0.85em; }
    input { padding: 0.4rem; font: inherit; }
    button { padding: 0.45rem 1rem; font: inherit; }
    .error { color: #b91c1c; }
    .summary { display: grid; grid-template-columns: max-content 1fr; gap: 0.25rem 0.5rem; margin: 1rem 0 0; }
    .summary dt { font-weight: 600; }
    .summary dd { margin: 0; }
    table { border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.25rem 0.75rem; text-align: right; border-bottom: 1px solid #ddd; }
    th:first-child, td:first-child { text-align: left; }
  </style>
  <form part="form">
    <label>Formula <input name="formula" value="C6H12O6" required></label>
    <label>Charge <input name="charge" type="number" min="-255" max="255" step="1" value="1" required></label>
    <button type="submit">Calculate</button>
  </form>
  <div part="result" aria-live="polite"></div>
`;var i=class extends HTMLElement{static observedAttributes=[`formula`,`charge`];#e;#t;#n=0;connectedCallback(){if(!this.shadowRoot){let e=this.attachShadow({mode:`open`});e.append(r.content.cloneNode(!0)),this.#e=e.querySelector(`form`),this.#t=e.querySelector(`[part=result]`),this.#e.addEventListener(`submit`,e=>{e.preventDefault(),this.calculate()})}this.#i(),this.hasAttribute(`formula`)&&this.calculate()}attributeChangedCallback(){this.isConnected&&this.shadowRoot&&(this.#i(),this.calculate())}#r(){return this.#e.elements}#i(){let{formula:e,charge:t}=this.#r(),n=this.getAttribute(`formula`),r=this.getAttribute(`charge`);n!==null&&(e.value=n),r!==null&&(t.value=r)}async calculate(){let{formula:e,charge:t}=this.#r(),r=++this.#n;try{let i=await n().evaluateIon(e.value,t.valueAsNumber);return r===this.#n?(this.#a(i),this.dispatchEvent(new CustomEvent(`ms-result`,{detail:i,bubbles:!0})),i):void 0}catch(e){if(r!==this.#n)return;let t=e instanceof Error?e:Error(String(e));this.#t.replaceChildren(Object.assign(document.createElement(`p`),{className:`error`,textContent:t.message})),this.dispatchEvent(new CustomEvent(`ms-error`,{detail:t,bubbles:!0}));return}}#a(n){let r=document.createElement(`dl`);r.className=`summary`;let i=document.createElement(`span`);i.innerHTML=t(n.atom_counts);let a=(e,t)=>{let n=document.createElement(`dt`);n.textContent=e;let i=document.createElement(`dd`);typeof t==`string`?i.textContent=t:i.append(t),r.append(n,i)};a(`Parsed Formula:`,i),a(`Mass:`,n.mass.toFixed(6)),a(`m/z:`,n.mass_to_charge?.toFixed(6)??`N/A`),a(`DBE:`,String(n.dbe));let o=document.createElement(`table`);o.innerHTML=`<thead><tr><th>Atom</th><th>Count</th><th>RAM</th><th>Total Mass</th></tr></thead>`;let s=o.createTBody();for(let t of n.atom_counts){let n=s.insertRow();n.insertCell().innerHTML=e(t),n.insertCell().textContent=String(t.count),n.insertCell().textContent=t.atom_ram.toFixed(6),n.insertCell().textContent=t.total_mass.toFixed(6)}this.#t.replaceChildren(r,o)}};customElements.get(`ms-ion-calculator`)||customElements.define(`ms-ion-calculator`,i);
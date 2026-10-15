import { n as e, r as t, t as n } from "./core-CAR-I3h0.js";
//#region src/elements/ion-calculator.ts
var r = document.createElement("template");
r.innerHTML = "\n  <style>\n    :host { display: block; font: inherit; }\n    form { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: end; }\n    label { display: grid; gap: 0.25rem; font-size: 0.85em; }\n    input { padding: 0.4rem; font: inherit; }\n    button { padding: 0.45rem 1rem; font: inherit; }\n    .error { color: #b91c1c; }\n    table { border-collapse: collapse; margin-top: 1rem; }\n    th, td { padding: 0.25rem 0.75rem; text-align: right; border-bottom: 1px solid #ddd; }\n    th:first-child, td:first-child { text-align: left; }\n  </style>\n  <form part=\"form\">\n    <label>Formula <input name=\"formula\" value=\"C6H12O6\" required></label>\n    <label>Charge <input name=\"charge\" type=\"number\" min=\"-255\" max=\"255\" step=\"1\" value=\"1\" required></label>\n    <button type=\"submit\">Calculate</button>\n  </form>\n  <div part=\"result\" aria-live=\"polite\"></div>\n";
var i = class extends HTMLElement {
	static observedAttributes = ["formula", "charge"];
	#e;
	#t;
	#n = 0;
	connectedCallback() {
		if (!this.shadowRoot) {
			let e = this.attachShadow({ mode: "open" });
			e.append(r.content.cloneNode(!0)), this.#e = e.querySelector("form"), this.#t = e.querySelector("[part=result]"), this.#e.addEventListener("submit", (e) => {
				e.preventDefault(), this.calculate();
			});
		}
		this.#i(), this.hasAttribute("formula") && this.calculate();
	}
	attributeChangedCallback() {
		this.isConnected && this.shadowRoot && (this.#i(), this.calculate());
	}
	#r() {
		return this.#e.elements;
	}
	#i() {
		let { formula: e, charge: t } = this.#r(), n = this.getAttribute("formula"), r = this.getAttribute("charge");
		n !== null && (e.value = n), r !== null && (t.value = r);
	}
	async calculate() {
		let { formula: e, charge: t } = this.#r(), r = ++this.#n;
		try {
			let i = await n().evaluateIon(e.value, t.valueAsNumber);
			return r === this.#n ? (this.#a(i), this.dispatchEvent(new CustomEvent("ms-result", {
				detail: i,
				bubbles: !0
			})), i) : void 0;
		} catch (e) {
			if (r !== this.#n) return;
			let t = e instanceof Error ? e : Error(String(e));
			this.#t.replaceChildren(Object.assign(document.createElement("p"), {
				className: "error",
				textContent: t.message
			})), this.dispatchEvent(new CustomEvent("ms-error", {
				detail: t,
				bubbles: !0
			}));
			return;
		}
	}
	#a(n) {
		let r = document.createElement("p"), i = document.createElement("span");
		i.innerHTML = t(n.atom_counts);
		let a = n.mass_to_charge === null ? "" : `, m/z ${n.mass_to_charge.toFixed(6)}`;
		r.append(i, document.createTextNode(`: mass ${n.mass.toFixed(6)}${a}`));
		let o = document.createElement("table");
		o.innerHTML = "<thead><tr><th>Atom</th><th>Count</th><th>RAM</th><th>Total Mass</th></tr></thead>";
		let s = o.createTBody();
		for (let t of n.atom_counts) {
			let n = s.insertRow();
			n.insertCell().innerHTML = e(t), n.insertCell().textContent = String(t.count), n.insertCell().textContent = t.atom_ram.toFixed(6), n.insertCell().textContent = t.total_mass.toFixed(6);
		}
		this.#t.replaceChildren(r, o);
	}
};
customElements.get("ms-ion-calculator") || customElements.define("ms-ion-calculator", i);
//#endregion
export { i as MsIonCalculator };

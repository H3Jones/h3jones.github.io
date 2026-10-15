import { r as e, t } from "./core-Cd9Qw8-B.js";
//#region src/elements/mass-split.ts
var n = document.createElement("template");
n.innerHTML = "\n  <style>\n    :host { display: block; font: inherit; }\n    form { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: end; }\n    label { display: grid; gap: 0.25rem; font-size: 0.85em; }\n    input { padding: 0.4rem; font: inherit; }\n    button { padding: 0.45rem 1rem; font: inherit; }\n    .result { display: grid; gap: 0.25rem; margin-top: 1rem; }\n    .error { color: #b91c1c; }\n  </style>\n  <form part=\"form\">\n    <label for=\"formula-a\">Formula A</label>\n    <input id=\"formula-a\" name=\"formulaA\" value=\"C14H23S\" required>\n    <label for=\"formula-b\">Formula B</label>\n    <input id=\"formula-b\" name=\"formulaB\" value=\"C17H19\" required>\n    <button type=\"submit\">Calculate difference</button>\n  </form>\n  <div class=\"result\" part=\"result\" aria-live=\"polite\"></div>\n";
var r = class extends HTMLElement {
	static observedAttributes = ["formula-a", "formula-b"];
	#e;
	#t;
	#n;
	#r;
	#i = 0;
	connectedCallback() {
		if (!this.shadowRoot) {
			let e = this.attachShadow({ mode: "open" });
			e.append(n.content.cloneNode(!0)), this.#e = e.querySelector("form"), this.#t = e.querySelector("#formula-a"), this.#n = e.querySelector("#formula-b"), this.#r = e.querySelector("[part=result]"), this.#e.addEventListener("submit", (e) => {
				e.preventDefault(), this.calculate();
			});
		}
		this.#a(), this.hasAttribute("formula-a") && this.hasAttribute("formula-b") && this.calculate();
	}
	attributeChangedCallback() {
		this.isConnected && this.shadowRoot && (this.#a(), this.#t.value && this.#n.value && this.calculate());
	}
	#a() {
		let e = this.getAttribute("formula-a"), t = this.getAttribute("formula-b");
		e !== null && (this.#t.value = e), t !== null && (this.#n.value = t);
	}
	async calculate() {
		let e = ++this.#i;
		try {
			let n = await t().massSplit(this.#t.value, this.#n.value);
			return e === this.#i ? (this.#o(n), this.dispatchEvent(new CustomEvent("ms-mass-split-result", {
				detail: n,
				bubbles: !0
			})), n) : void 0;
		} catch (t) {
			if (e !== this.#i) return;
			let n = t instanceof Error ? t : Error(String(t));
			this.#r.replaceChildren(Object.assign(document.createElement("p"), {
				className: "error",
				textContent: n.message
			})), this.dispatchEvent(new CustomEvent("ms-error", {
				detail: n,
				bubbles: !0
			}));
			return;
		}
	}
	#o(t) {
		let n = (t, n) => {
			let r = document.createElement("div"), i = document.createElement("strong");
			i.textContent = `${t}: `;
			let a = document.createElement("span");
			return n === null ? a.textContent = "—" : a.innerHTML = e(n.atom_counts), r.append(i, a), r;
		}, r = document.createElement("div"), i = t.mass_difference > 0 ? "+" : "", a = (t.mass_difference * 1e3).toFixed(3);
		r.textContent = `Mass difference (A − B): ${i}${t.mass_difference.toFixed(6)} Da (${i}${a} mDa)`, this.#r.replaceChildren(n("A only", t.formula_a_only), n("B only", t.formula_b_only), r);
	}
};
customElements.get("ms-mass-split") || customElements.define("ms-mass-split", r);
//#endregion
export { r as MsMassSplit };

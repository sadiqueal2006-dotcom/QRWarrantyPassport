(() => {
  const root = document.getElementById("passportContent");
  const id = new URLSearchParams(location.search).get("id");
  const p = QWP.get(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  if (!p) { root.innerHTML = '<span class="eyebrow">DIGITAL PRODUCT PASSPORT</span><h1>Product record not found</h1><p class="muted">This demo record may not exist in this browser. Ask the registering shop for help.</p><a class="button secondary" href="index.html">Back to home</a>'; return; }
  const expiry = QWP.expiry(p), status = QWP.status(p);
  root.innerHTML = `<span class="eyebrow">DIGITAL PRODUCT PASSPORT</span><div class="panel-heading"><h1>${esc(p.product)}</h1><span class="${status === "Active" ? "status" : "demo-pill"}">${status.toUpperCase()}</span></div>
  <p class="muted">${esc(p.model || "Product model not provided")} · ${esc(p.id)}</p>
  <div class="passport-grid">
    <div class="detail"><span>Customer</span><strong>${esc(p.customer)}</strong></div>
    <div class="detail"><span>Registering shop</span><strong>Demo Shop</strong></div>
    <div class="detail"><span>Purchase date</span><strong>${QWP.date(p.purchaseDate)}</strong></div>
    <div class="detail"><span>Warranty valid until</span><strong>${QWP.date(expiry.toISOString().slice(0,10))}</strong></div>
  </div>
  ${p.billUrl ? `<p><a class="button secondary" href="${esc(p.billUrl)}" target="_blank" rel="noopener">View bill / document</a></p>` : ""}
  ${p.notes ? `<p class="muted">${esc(p.notes)}</p>` : ""}
  <div class="notice">This is a shop-entered product record. Warranty coverage, exclusions and claims remain subject to the manufacturer's / seller's written terms.</div>
  <form id="serviceForm" class="service-form"><h2>Request a service callback</h2><label>Your message<textarea name="message" rows="3" maxlength="500" required placeholder="Describe the issue"></textarea></label><label>Contact number<input name="phone" inputmode="tel" required placeholder="Your phone number"></label><button class="button primary">Submit request</button><div id="serviceMsg" class="message"></div></form>`;
  document.getElementById("serviceForm").addEventListener("submit", e => {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const all = QWP.all(), record = all.find(x => x.id === p.id);
    record.services = record.services || []; record.services.push({message:fd.get("message"),phone:fd.get("phone"),date:new Date().toISOString()}); QWP.save(all);
    document.getElementById("serviceMsg").textContent = "Demo request saved in this browser. It has not been sent to the shop.";
    e.currentTarget.reset();
  });
})();

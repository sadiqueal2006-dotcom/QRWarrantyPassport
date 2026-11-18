(() => {
  const KEY = "qwp_demo_products_v1";
  window.QWP = {
    key: KEY,
    all() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } },
    save(items) { localStorage.setItem(KEY, JSON.stringify(items)); },
    get(id) { return this.all().find(p => p.id.toLowerCase() === String(id || "").toLowerCase()); },
    id() { return "QWP-" + Math.random().toString(36).slice(2, 8).toUpperCase(); },
    date(value) { if (!value) return "—"; return new Date(value + "T00:00:00").toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"}); },
    expiry(p) { const d = new Date(p.purchaseDate + "T00:00:00"); d.setMonth(d.getMonth() + Number(p.months || 0)); return d; },
    status(p) { return this.expiry(p) >= new Date(new Date().toDateString()) ? "Active" : "Expired"; }
  };
  const form = document.getElementById("lookupForm");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("lookupId").value.trim();
    const p = QWP.get(id);
    const msg = document.getElementById("lookupMessage");
    if (p) location.href = "product.html?id=" + encodeURIComponent(p.id);
    else msg.textContent = "No demo record found. Check the Product ID or contact the registering shop.";
  });
})();

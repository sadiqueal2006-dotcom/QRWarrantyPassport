(() => {
  const $ = id => document.getElementById(id);
  const loginPanel = $("loginPanel"), dashboard = $("dashboard");
  let latestQrId = null;
  function showDashboard() { loginPanel.hidden = true; dashboard.hidden = false; render(); }
  $("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    if ($("pin").value === "1234") { sessionStorage.setItem("qwp_demo_login", "yes"); showDashboard(); }
    else $("loginMessage").textContent = "Incorrect demo PIN. Try 1234.";
  });
  if (sessionStorage.getItem("qwp_demo_login") === "yes") showDashboard();
  $("logout").addEventListener("click", () => { sessionStorage.removeItem("qwp_demo_login"); dashboard.hidden = true; loginPanel.hidden = false; });
  function render() {
    const items = QWP.all();
    $("totalProducts").textContent = items.length;
    $("activeProducts").textContent = items.filter(p => QWP.status(p) === "Active").length;
    $("productRows").innerHTML = items.length ? items.slice().reverse().map(p => `<tr><td><strong>${esc(p.id)}</strong></td><td>${esc(p.product)}</td><td>${esc(p.customer)}</td><td>${QWP.date(QWP.expiry(p).toISOString().slice(0,10))}</td><td><button class="text-button" data-view="${esc(p.id)}">Show QR</button></td></tr>`).join("") : '<tr><td colspan="5" class="muted">No products registered yet.</td></tr>';
    document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => createQr(b.dataset.view)));
  }
  function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function createQr(id) {
    const p = QWP.get(id); if (!p) return;
    latestQrId = id; const box = $("qrBox"); box.innerHTML = "";
    const target = new URL("product.html?id=" + encodeURIComponent(id), location.href).href;
    if (window.QRCode) new QRCode(box, {text:target,width:190,height:190,colorDark:"#12314b",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H});
    else box.textContent = "QR library unavailable. Connect to the internet and reload.";
    $("qrDetails").textContent = p.product + " · " + id;
    $("downloadQr").disabled = !window.QRCode;
  }
  $("productForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = {id:QWP.id(),customer:f.get("customer").trim(),phone:f.get("phone").trim(),product:f.get("product").trim(),model:f.get("model").trim(),purchaseDate:f.get("purchaseDate"),months:Number(f.get("months")),billUrl:f.get("billUrl").trim(),notes:f.get("notes").trim(),createdAt:new Date().toISOString(),services:[]};
    const items = QWP.all(); items.push(p); QWP.save(items); e.currentTarget.reset(); e.currentTarget.elements.months.value = 12;
    $("formMessage").textContent = "Product saved. QR passport created: " + p.id;
    render(); createQr(p.id);
  });
  $("downloadQr").addEventListener("click", () => {
    const img = $("qrBox").querySelector("img");
    if (!img) return;
    const a = document.createElement("a"); a.href = img.src; a.download = (latestQrId || "product") + "-qr.png"; a.click();
  });
  $("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(QWP.all(), null, 2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qwp-demo-products.json"; a.click(); URL.revokeObjectURL(a.href);
  });
  $("clearDemo").addEventListener("click", () => {
    if (confirm("Delete all demo product records from this browser?")) { QWP.save([]); $("qrBox").textContent = "Demo records cleared."; $("qrDetails").textContent = ""; $("downloadQr").disabled = true; render(); }
  });
})();
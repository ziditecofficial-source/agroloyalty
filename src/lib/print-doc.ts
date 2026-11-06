// Opens a printable document (user can "Save as PDF") with Agro Hospital letterhead.
export function printDocument(title: string, bodyHtml: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${title}</title><style>
  body{font-family:Manrope,system-ui,sans-serif;color:#0f172a;margin:40px}
  .lh{display:flex;justify-content:space-between;border-bottom:4px solid #15803d;padding-bottom:12px;margin-bottom:24px}
  .lh h1{margin:0;color:#166534;font-family:Georgia,serif}.lh small{color:#D4A017;font-weight:700}
  table{width:100%;border-collapse:collapse;margin-top:16px}th,td{padding:8px;border-bottom:1px solid #e2e8f0;text-align:left}
  th{background:#f0fdf4}.tot{text-align:right;font-size:18px;font-weight:700;margin-top:16px}
  .foot{margin-top:40px;font-size:12px;color:#64748b}
  </style></head><body>
  <div class="lh"><div><h1>Agro Hospital PLC</h1><small>Farmer's Voice | Quality in Diversity</small></div>
  <div style="text-align:right;font-size:12px">Bamenda • Yaounde<br/>Cameroon</div></div>
  ${bodyHtml}
  <div class="foot">Thank you for choosing Agro Hospital PLC. This document was generated from the Customer Portal.</div>
  <script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}

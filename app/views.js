// Views: render deal cards, the deal detail page, and small helpers. No state lives here.
export function money(n) { return '$' + n.toFixed(2).replace(/\.00$/, ''); }
export function pct(d) { return Math.round((1 - d.sale / d.usual) * 100); }
export function score(d) {
  const base = pct(d);
  const v = d.verdict === 'NEW LOW' ? 22 : d.verdict === 'STRONG' ? 12 : 0;
  return Math.min(99, base + v);
}
export function verdictClass(v) { return v === 'NEW LOW' ? 'v-low' : v === 'STRONG' ? 'v-strong' : 'v-routine'; }

export function cardHTML(d) {
  return `<article class="card">
    <div class="card-top"><span class="store">${d.store}</span><span class="off">-${pct(d)}%</span></div>
    <h3><a href="#/deal/${d.id}">${d.name}</a></h3>
    <p class="cat">${d.cat}</p>
    <p class="prices"><strong>${money(d.sale)}</strong> <s>${money(d.usual)}</s> <span class="save">save ${money(d.usual - d.sale)}</span></p>
    <p class="verdict ${verdictClass(d.verdict)}">${d.verdict} · score ${score(d)}/99</p>
    <p class="evidence">${d.evidence}</p>
    <p class="meta">Checked ${d.checked} · Source: ${d.source}</p>
    <p class="actions"><a class="buy" href="${d.url}" target="_blank" rel="noopener">View at ${d.store} →</a> <a href="#/deal/${d.id}">Details</a></p>
  </article>`;
}

export function detailHTML(d, sameCat) {
  const rows = sameCat.map(o => `<li><a href="#/deal/${o.id}">${o.name}</a> — ${money(o.sale)} at ${o.store} (-${pct(o)}%)</li>`).join('');
  return `<p><a href="#/">← All deals</a></p>
  <article class="detail">
    <div class="card-top"><span class="store">${d.store}</span><span class="off">-${pct(d)}%</span></div>
    <h2>${d.name}</h2>
    <p class="cat">${d.cat}</p>
    <p class="prices big"><strong>${money(d.sale)}</strong> <s>${money(d.usual)}</s> <span class="save">you save ${money(d.usual - d.sale)} (${pct(d)}% off)</span></p>
    <p class="verdict ${verdictClass(d.verdict)}">Is it really a deal? ${d.verdict} · score ${score(d)}/99</p>
    <p class="evidence">${d.evidence}</p>
    <dl>
      <dt>Price checked</dt><dd>${d.checked}</dd>
      <dt>Where the price was read</dt><dd>${d.source}</dd>
      <dt>Code / condition</dt><dd>${d.code}</dd>
      <dt>Store</dt><dd>${d.store}</dd>
    </dl>
    <p><a class="buy big" href="${d.url}" target="_blank" rel="noopener">Open this deal at ${d.store} →</a></p>
    <h3>Compare in ${d.cat}</h3><ul>${rows || '<li>No other deal in this category.</li>'}</ul>
  </article>`;
}

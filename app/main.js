// Main: wires search, filters, sort and hash routing to the views. Data comes from data.js.
import { DEALS } from './data.js';
import { cardHTML, detailHTML, pct, score } from './views.js';

const $ = s => document.querySelector(s);
const state = { q: '', cat: 'All', store: 'All', minOff: 0, sort: 'score' };

function fillSelect(el, values) {
  el.innerHTML = values.map(v => `<option>${v}</option>`).join('');
}
function filtered() {
  let list = DEALS.filter(d =>
    (state.cat === 'All' || d.cat === state.cat) &&
    (state.store === 'All' || d.store === state.store) &&
    pct(d) >= state.minOff &&
    (d.name + ' ' + d.store + ' ' + d.cat).toLowerCase().includes(state.q.toLowerCase()));
  if (state.sort === 'discount') list.sort((a, b) => pct(b) - pct(a));
  else if (state.sort === 'price') list.sort((a, b) => a.sale - b.sale);
  else list.sort((a, b) => score(b) - score(a));
  return list;
}
function renderList() {
  const list = filtered();
  $('#count').textContent = `${list.length} of ${DEALS.length} deals · prices checked 27 Nov 2026`;
  $('#grid').innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty">No deals match those filters. Try clearing the search.</p>';
}
function renderRoute() {
  const m = location.hash.match(/^#\/deal\/(.+)$/);
  if (m) {
    const d = DEALS.find(x => x.id === m[1]);
    if (d) {
      $('#list-view').hidden = true; $('#detail-view').hidden = false;
      $('#detail-view').innerHTML = detailHTML(d, DEALS.filter(x => x.cat === d.cat && x.id !== d.id));
      window.scrollTo(0, 0); return;
    }
  }
  $('#detail-view').hidden = true; $('#list-view').hidden = false; renderList();
}
fillSelect($('#cat'), ['All', ...new Set(DEALS.map(d => d.cat))]);
fillSelect($('#store'), ['All', ...new Set(DEALS.map(d => d.store))]);
$('#search').addEventListener('input', e => { state.q = e.target.value; renderList(); });
$('#cat').addEventListener('change', e => { state.cat = e.target.value; renderList(); });
$('#store').addEventListener('change', e => { state.store = e.target.value; renderList(); });
$('#discount').addEventListener('change', e => { state.minOff = Number(e.target.value); renderList(); });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; renderList(); });
window.addEventListener('hashchange', renderRoute);
renderRoute();

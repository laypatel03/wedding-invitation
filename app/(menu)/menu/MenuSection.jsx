'use client';

import { useEffect, useRef, useState } from 'react';
import { MENU, ADDONS } from './data';

const FILTERS = [
  { f: 'all', label: 'All items' },
  { f: 'protein', label: 'High protein · 15 g+' },
  { f: 'light', label: 'Light · under 300 kcal' },
];

const TABS = [...MENU.map(c => ({ id: c.id, name: c.name })), { id: 'addons', name: 'Add-ons' }];

function matches(filter, i) {
  return filter === 'all' || (filter === 'protein' ? i.p >= 15 : i.c < 300);
}

export default function MenuSection() {
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const tabsRef = useRef(null);
  const tabRefs = useRef({});

  // Highlight the tab for whichever category is currently under the sticky bar.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveId(e.target.id);
      });
    }, { rootMargin: '-120px 0px -60% 0px' });
    document.querySelectorAll('.cat, #addons').forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const t = tabRefs.current[activeId];
    if (t) tabsRef.current.scrollTo({ left: t.offsetLeft - 16, behavior: 'smooth' });
  }, [activeId]);

  return (
    <section id="menu" aria-labelledby="menu-title">
      <div className="menu-head">
        <div>
          <div className="eyebrow">Our menu</div>
          <h2 id="menu-title">What&apos;s cooking</h2>
        </div>
        <p>Tap a category to jump, or filter for high-protein and light options.</p>
      </div>
      <div className="bar">
        <div className="tabs" ref={tabsRef} role="navigation" aria-label="Menu categories">
          {TABS.map(t => (
            <a
              key={t.id}
              ref={el => { tabRefs.current[t.id] = el; }}
              className={t.id === activeId ? 'tab on' : 'tab'}
              href={`#${t.id}`}
            >
              {t.name}
            </a>
          ))}
        </div>
        <div className="filters" role="group" aria-label="Filters">
          {FILTERS.map(({ f, label }) => (
            <button key={f} className="filter" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div id="cats">
        {MENU.map(c => {
          const list = c.items.filter(i => matches(filter, i));
          return (
            <section key={c.id} className="cat" id={c.id} aria-labelledby={`h-${c.id}`}>
              <div className="cat-h"><h3 id={`h-${c.id}`}>{c.name}</h3><span>{c.sub}</span></div>
              {list.length ? (
                <div className="items">
                  {list.map(i => (
                    <article key={i.n} className="item">
                      <span className="veg" role="img" aria-label="Vegetarian"></span>
                      <h4>{i.n}</h4>
                      <span className="price">₹{i.r}</span>
                      <p>{i.d}</p>
                      <div className="nums">
                        <span className="num p">{i.p} g protein</span>
                        <span className="num">{i.c} kcal</span>
                        {i.t && <span className="tag">{i.t}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty">Nothing in this category matches the filter.</div>
              )}
            </section>
          );
        })}
      </div>

      <div className="addons" id="addons">
        <h3>Add-ons</h3>
        <div className="addon-list">
          {ADDONS.map(a => (
            <div key={a.n} className="addon"><b>{a.n}</b><span>+{a.p} g · +{a.c} kcal · ₹{a.r}</span></div>
          ))}
        </div>
      </div>

      <div className="note" role="note">
        <b>Please note</b>
        Protein and calorie values shown on this menu are approximate, not exact. They can vary with portion size, ingredients and seasonal fruits. Prices are in ₹ and inclusive of taxes.
      </div>
    </section>
  );
}

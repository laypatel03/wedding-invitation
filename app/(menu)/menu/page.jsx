import MenuSection from './MenuSection';
import CopyPhone from './CopyPhone';

export default function MenuPage() {
  return (
    <div className="wrap">
      <nav className="nav" aria-label="Main">
        <a className="brand" href="#top" id="top">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="19" r="13" fill="var(--turmeric)"/><path d="M17 6c0-3 3-5 7-5 0 4-3 6-7 5Z" fill="var(--leaf)"/><path d="M9 19a8 8 0 0 0 16 0Z" fill="var(--ink)" opacity=".9"/></svg>
          Healthy Hunger
        </a>
        <div className="nav-links">
          <a className="keep" href="#menu">Menu</a>
          <a href="#visit">Visit</a>
        </div>
      </nav>

      <header className="hero">
        <div>
          <div className="eyebrow"><span className="veg" aria-hidden="true"></span> 100% vegetarian café</div>
          <h1>Healthy<span>Hunger</span></h1>
          <p className="lede">Oats, sandwiches, smoothies, salads and fruit bowls. Every item shows its protein and calories, so you know what&apos;s on your plate.</p>
          <div className="cta">
            <a className="btn btn-primary" href="#menu">See the menu</a>
            <a className="btn btn-ghost" href="#visit">Find us</a>
          </div>
        </div>
        <aside className="label" aria-label="Featured item nutrition">
          <div className="lt">Today&apos;s Pick</div>
          <div className="serv">Protein Power Smoothie · 350 ml glass</div>
          <div className="row big"><span>Protein</span><b>34 g</b></div>
          <div className="row"><span>Calories</span><b>460</b></div>
          <div className="row"><span>Price</span><b>₹179</b></div>
          <div className="meter" aria-hidden="true"><i style={{ '--w': '68%' }}></i></div>
          <small>Milk, banana, oats, almonds and a scoop of whey. Values are approximate.</small>
        </aside>
      </header>

      <section className="promise" aria-label="What we promise">
        <div><strong>Numbers on every item</strong><span>Protein in grams and calories in kcal, right next to the price.</span></div>
        <div><strong>Made fresh, to order</strong><span>Fruits cut and smoothies blended when you order. Nothing pre-packed.</span></div>
        <div><strong>Pure veg kitchen</strong><span>No egg, no meat. Paneer, tofu, sprouts, dal and dairy for protein.</span></div>
      </section>

      <MenuSection />

      <section className="visit" id="visit" aria-labelledby="visit-title">
        <div>
          <div className="eyebrow">Visit us</div>
          <h2 id="visit-title">Come hungry. Leave light.</h2>
          <p className="lede">Dine in, take away, or call ahead and we&apos;ll have your order ready.</p>
        </div>
        <dl className="info">
          <div><dt>Address</dt><dd>[Shop no.], Main Road, near Bus Stand,<br />[Your Town], [District], [State] – [PIN]</dd></div>
          <div><dt>Hours</dt><dd>Mon – Sun · 7:30 AM – 10:00 PM</dd></div>
          <div><dt>Phone</dt><dd><CopyPhone phone="+91 00000 00000" /></dd></div>
          <div><dt>WhatsApp</dt><dd>+91 00000 00000</dd></div>
          <div><dt>Instagram</dt><dd>@healthyhunger.cafe</dd></div>
        </dl>
      </section>

      <footer>
        <span>© 2026 Healthy Hunger · Pure veg café</span>
        <span>Protein &amp; calories are approximate, not exact.</span>
      </footer>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BarChart3, CalendarDays, Check, CheckCircle2, Clock3, CreditCard, LayoutDashboard, Mail, MapPin, MessageCircle, Phone, Plus, Settings2, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';

const bookings = [
  { time: '09:00', initials: 'MS', name: 'Maya Sinclair', service: 'Signature facial · 60 min', tone: 'rose', status: 'Confirmed' },
  { time: '10:30', initials: 'JL', name: 'Jordan Lee', service: 'Deep-tissue massage · 90 min', tone: 'blue', status: 'Confirmed' },
  { time: '13:00', initials: 'AB', name: 'Aisha Bennett', service: 'Colour consultation · 45 min', tone: 'gold', status: 'Awaiting' },
  { time: '15:30', initials: 'NW', name: 'Noah Williams', service: 'Wellness session · 60 min', tone: 'green', status: 'Confirmed' },
];

function DashboardPreview() {
  return <div className="bf-dashboard" aria-label="BookFlow business dashboard preview">
    <div className="bf-browser"><span /><span /><span /><p>app.bookflow.com / loom-wellness / today</p><Settings2 size={13} /></div>
    <div className="bf-workspace">
      <aside className="bf-rail">
        <div className="bf-mini-brand"><i /> <b>BookFlow</b></div>
        <small>WORKSPACE</small>
        <a className="selected"><LayoutDashboard size={14} />Overview</a>
        <a><CalendarDays size={14} />Calendar</a>
        <a><UsersRound size={14} />Customers</a>
        <a><CreditCard size={14} />Payments</a>
        <div className="bf-rail-bottom"><div>LW</div><span>Loom Wellness</span></div>
      </aside>
      <section className="bf-main">
        <header><div><span>MONDAY, 17 JUNE</span><h3>Good morning, Lena.</h3></div><button><Plus size={13} /> New booking</button></header>
        <div className="bf-metrics">
          <article><span>TODAY'S BOOKINGS</span><strong>12</strong><em>↑ 3 from yesterday</em><div className="metric-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
          <article><span>EXPECTED REVENUE</span><strong>$1,248</strong><em>↑ 18% this week</em><svg viewBox="0 0 180 44" fill="none" aria-hidden="true"><path d="M1 36C19 34 19 23 38 27C54 31 62 14 78 20C95 27 102 9 119 16C133 22 144 4 179 8" /></svg></article>
          <article><span>OPEN SLOTS</span><strong>6</strong><em>2 after 4:00 PM</em><div className="slot-stack"><i /><i /><i /><i /><i /></div></article>
        </div>
        <div className="bf-section-head"><div><h4>Today’s rhythm</h4><span>Monday, June 17</span></div><div className="bf-tabs"><b>Schedule</b><span>Team</span></div></div>
        <div className="bf-list">{bookings.map(booking => <div className="bf-booking" key={booking.name}><time>{booking.time}</time><i className={`bf-avatar ${booking.tone}`}>{booking.initials}</i><div><b>{booking.name}</b><span>{booking.service}</span></div><em className={booking.status === 'Awaiting' ? 'pending' : ''}>{booking.status}</em><ArrowUpRight size={14} /></div>)}</div>
        <div className="bf-dashboard-foot"><div><span>WEEKLY PULSE</span><b>84% of slots filled</b><div className="bf-progress"><i /></div></div><div><span>NEXT UP</span><b>Bea Turner · 16:30</b><small>Colour &amp; finish · 75 min</small></div></div>
      </section>
    </div>
  </div>;
}

export function HomePage() {
  return <div className="bookflow-dark" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`); }}>
    <section className="bf-hero" id="home" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width - .5) * 2; const y = ((event.clientY - rect.top) / rect.height - .5) * 2; event.currentTarget.style.setProperty('--mouse-x', `${x * 18}px`); event.currentTarget.style.setProperty('--mouse-y', `${y * 14}px`); event.currentTarget.style.setProperty('--tilt-x', `${y * -2.2}deg`); event.currentTarget.style.setProperty('--tilt-y', `${x * 2.2}deg`); }} onMouseLeave={(event) => { event.currentTarget.style.setProperty('--mouse-x', '0px'); event.currentTarget.style.setProperty('--mouse-y', '0px'); event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg'); }}>
      <video className="bf-hero-video" autoPlay muted loop playsInline aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" /></video>
      <div className="bf-hero-glow" aria-hidden="true" />
      <div className="bf-copy">
        <div className="bf-announcement"><b>New</b><span>Say hello to smarter scheduling</span></div>
        <h1>Your bookings.<br />One clear <em>overview.</em></h1>
        <p>BookFlow keeps your calendar, team, and customers<br className="desktop-break" /> perfectly in sync.</p>
        <Link className="bf-primary" to="/register">Get started for free <ArrowUpRight size={16} /></Link>
      </div>
      <div className="bf-preview-wrap"><DashboardPreview /></div>
      <div className="bf-fade" aria-hidden="true" />
    </section>

    <section className="bf-story-section" id="about">
      <div className="bf-story-copy">
        <span className="bf-section-label">A BETTER WAY TO RUN THE DAY</span>
        <h2>Less admin.<br /><em>More presence.</em></h2>
        <p>BookFlow is the calm layer between your customers, your team, and the work you do best. We bring bookings, availability, payments, and client context into one shared rhythm.</p>
        <p>It is built for the moments that happen between appointments: the quick handover, the last-minute opening, the returning client who deserves to be remembered.</p>
        <Link className="bf-text-link" to="/register">See how it works <ArrowRight size={15} /></Link>
      </div>
      <div className="bf-story-panel">
        <div className="bf-story-stat"><strong>4.8<span>/5</span></strong><small>average customer rating</small></div>
        <div className="bf-story-stat"><strong>32k<span>+</span></strong><small>appointments coordinated</small></div>
        <div className="bf-story-note"><Sparkles size={17} /><p>“The tool disappears into the day. That is the point.”</p><small>— Amara Wells, Serein Studio</small></div>
      </div>
    </section>

    <section className="bf-workflow-section" id="how-it-works">
      <div className="bf-section-heading"><span className="bf-section-label">FROM FIRST CLICK TO FOLLOW-UP</span><h2>Everything that keeps<br /><em>the day moving.</em></h2><p>A practical system for the work customers see, and the details they never have to.</p></div>
      <div className="bf-workflow-grid">
        <article><span>01</span><Clock3 /><h3>Open your calendar</h3><p>Set services, hours, buffers, and staff availability once. BookFlow shows the right options automatically.</p></article>
        <article><span>02</span><UsersRound /><h3>Keep everyone aligned</h3><p>Your team sees the same schedule, customer notes, and changes in real time, wherever they are.</p></article>
        <article><span>03</span><ShieldCheck /><h3>Build the next visit in</h3><p>Confirm, collect, and follow up without rebuilding the story every time a customer returns.</p></article>
      </div>
    </section>

    <section className="bf-quote-section" id="stories">
      <div className="bf-quote-intro"><span className="bf-section-label">REAL DAYS, LESS FRICTION</span><h2>What changes when<br /><em>the details are handled.</em></h2></div>
      <div className="bf-testimonial-grid">
        <article className="bf-testimonial featured"><div className="bf-quote-mark">“</div><p>We stopped spending the first hour of every morning untangling messages. The team knows what is next, and clients feel the difference.</p><div className="bf-author"><div className="bf-author-avatar">LM</div><div><b>Lena Morgan</b><span>Founder, Loom Wellness</span></div></div></article>
        <article className="bf-testimonial"><p>“Our books are fuller, but the day feels lighter. That is a rare combination.”</p><div className="bf-author"><div className="bf-author-avatar">AW</div><div><b>Amara Wells</b><span>Owner, Serein Studio</span></div></div></article>
        <article className="bf-testimonial"><p>“The handoff between reception and the floor finally feels like one conversation.”</p><div className="bf-author"><div className="bf-author-avatar">JP</div><div><b>Jonas Park</b><span>Director, Northline Therapy</span></div></div></article>
      </div>
    </section>

    <section className="bf-features" id="features">
      <div className="bf-feature-intro"><span>ONE CALM CONTROL ROOM</span><h2>The entire day, <em>in flow.</em></h2><p>From a customer’s first tap to a familiar face walking through your door, BookFlow keeps the operational details quietly moving.</p></div>
      <div className="bf-feature-grid"><article><CalendarDays /><small>01 / SCHEDULE</small><h3>Booking without the back-and-forth.</h3><p>Show real availability, protect your time, and let clients manage their appointments with ease.</p></article><article><UsersRound /><small>02 / TEAM</small><h3>Everyone knows where they need to be.</h3><p>Give every teammate the services, hours, and client notes they need for a great day.</p></article><article><BarChart3 /><small>03 / GROWTH</small><h3>Know what’s working at a glance.</h3><p>Track revenue, returning customers, and your busiest services without spreadsheet archaeology.</p></article></div>
    </section>

    <section className="bf-home-pricing" id="pricing">
      <div className="bf-section-heading"><span className="bf-section-label">PLANS THAT GROW WITH YOU</span><h2>Choose the room<br /><em>you need today.</em></h2><p>Start with the essentials. Move up when the shape of your business changes. Every plan keeps the day clear.</p></div>
      <div className="bf-home-plan-grid">
        <article className="bf-home-plan"><div className="bf-home-plan-top"><span>STARTER</span><Sparkles size={18} /></div><h3>$0</h3><small>for getting your first rhythm</small><ul><li><CheckCircle2 size={14} /> Client self-booking page</li><li><CheckCircle2 size={14} /> Calendar overview</li><li><CheckCircle2 size={14} /> Email confirmations</li></ul><Link to="/register">Start free <ArrowUpRight size={15} /></Link></article>
        <article className="bf-home-plan featured"><div className="bf-home-plan-top"><span>STUDIO · MOST POPULAR</span><StarMark /></div><h3>$19</h3><small>for teams finding their flow</small><ul><li><CheckCircle2 size={14} /> Up to 5 team members</li><li><CheckCircle2 size={14} /> Payments and customer history</li><li><CheckCircle2 size={14} /> Priority reminders</li></ul><Link to="/pricing">Explore Studio <ArrowUpRight size={15} /></Link></article>
        <article className="bf-home-plan"><div className="bf-home-plan-top"><span>GROWTH</span><BarChart3 size={18} /></div><h3>$49</h3><small>for a busier, broader operation</small><ul><li><CheckCircle2 size={14} /> Unlimited bookings</li><li><CheckCircle2 size={14} /> Advanced insights</li><li><CheckCircle2 size={14} /> Revenue reports</li></ul><Link to="/pricing">Explore Growth <ArrowUpRight size={15} /></Link></article>
      </div>
      <Link className="bf-pricing-detail-link" to="/pricing">Compare every feature and manage your plan <ArrowRight size={15} /></Link>
    </section>

    <section className="bf-contact-section" id="contact">
      <div>
        <span className="bf-section-label">CONTACT</span>
        <h2>Tell us what your day<br /><em>needs to feel like.</em></h2>
        <p>Whether you run one room or a full team, we can help you shape BookFlow around your services, staff, and customer flow.</p>
        <div className="bf-contact-links">
          <a href="mailto:support@bookflow.app"><Mail size={15} /> support@bookflow.app</a>
          <a href="tel:+15550183042"><Phone size={15} /> +1 555 018 3042</a>
          <span><MapPin size={15} /> Remote support, Monday to Friday</span>
        </div>
      </div>
      <div className="bf-contact-card">
        <MessageCircle size={22} />
        <h3>Start a guided setup</h3>
        <p>Bring your calendar, your team, and your next great customer into one clear place.</p>
        <Link className="bf-primary" to="/register">Get started for free <ArrowUpRight size={16} /></Link>
        <small><Check size={13} /> No card required. Set up in minutes.</small>
      </div>
    </section>
  </div>;
}

function StarMark() { return <span className="bf-star-mark">★</span>; }

export default HomePage;

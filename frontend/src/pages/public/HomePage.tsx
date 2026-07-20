import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Clock3, CreditCard, LayoutDashboard, Plus, Search, Settings2, UsersRound } from 'lucide-react';

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
      </section>
    </div>
  </div>;
}

export function HomePage() {
  return <div className="bookflow-dark">
    <section className="bf-hero">
      <div className="bf-hero-glow" aria-hidden="true" />
      <div className="bf-copy">
        <div className="bf-announcement"><b>New</b><span>Meet BookFlow reporting</span><ArrowUpRight size={13} /></div>
        <h1>Every booking.<br />One clear <em>rhythm.</em></h1>
        <p>BookFlow brings appointments, teams, customers, and payments<br className="desktop-break" /> into one beautifully simple workspace.</p>
        <Link className="bf-primary" to="/register">Start booking for free <ArrowUpRight size={16} /></Link>
        <span className="bf-proof">No card required · Set up in minutes</span>
      </div>
      <div className="bf-preview-wrap"><DashboardPreview /></div>
      <div className="bf-fade" aria-hidden="true" />
    </section>

    <section className="bf-quote-section">
      <div className="bf-quote-mark">“</div>
      <p>“BookFlow gave our whole studio a calmer way to work. The team sees their day clearly, clients book without the back-and-forth, and every detail has a home.”</p>
      <div className="bf-author"><div className="bf-author-avatar">LM</div><div><b>Lena Morgan</b><span>Founder, Loom Wellness</span></div></div>
    </section>

    <section className="bf-capabilities" id="how-it-works">
      <p>ONE PLACE. EVERY MOVING PART.</p><h2>Make room for the work that matters.</h2>
      <div className="bf-cap-grid">
        <article><CalendarDays /><span>01</span><h3>A calendar that holds.</h3><p>Real-time availability, effortless rescheduling, and no accidental overlaps.</p></article>
        <article><UsersRound /><span>02</span><h3>Your team, in step.</h3><p>Give each person their own schedule, services, permissions, and focus.</p></article>
        <article><Clock3 /><span>03</span><h3>Customers who return.</h3><p>Keep every preference and visit close, from first booking to familiar face.</p></article>
      </div>
      <Link to="/companies" className="bf-discover"><Search size={15} /> Find a business on BookFlow <ArrowUpRight size={15} /></Link>
    </section>
  </div>;
}

export default HomePage;

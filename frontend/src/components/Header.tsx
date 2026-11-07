export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="LocalBuka home">
          <span className="brand-mark" aria-hidden="true">LB</span>
          <span className="brand-name">Local<span>Buka</span></span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a className="nav-link nav-active" href="#discover" aria-current="page">Discover</a>
          <a className="nav-link" href="#rewards">Rewards</a>
        </nav>
      </div>
    </header>
  );
}

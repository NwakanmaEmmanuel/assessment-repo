interface HeaderProps {
  forceFail: boolean;
  onForceFailChange: (value: boolean) => void;
}

export function Header({ forceFail, onForceFailChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="LocalBuka home">
          <span className="brand-mark" aria-hidden="true">LB</span>
          <span className="brand-name">Local<span>Buka</span></span>
        </a>
        <div className="header-right">
          <label className="demo-toggle" title="Demo switch: makes every favourite request fail so you can watch the rollback">
            <input type="checkbox" checked={forceFail} onChange={(e) => onForceFailChange(e.target.checked)} />
            <span className="demo-track" aria-hidden="true" />
            <span className="demo-label">Force failures</span>
          </label>
          <nav className="nav" aria-label="Primary">
            <a className="nav-link nav-active" href="#discover" aria-current="page">Discover</a>
            <a className="nav-link" href="#rewards">Rewards</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

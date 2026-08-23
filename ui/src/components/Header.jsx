export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <button type="button" className="logo" onClick={() => onNavigate('order')}>
        COZY
      </button>
      <nav className="nav">
        <button
          type="button"
          className={currentPage === 'order' ? 'nav-button active' : 'nav-button'}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button
          type="button"
          className={currentPage === 'admin' ? 'nav-button active' : 'nav-button'}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}

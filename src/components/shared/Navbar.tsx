import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useState, useEffect } from 'react'
import logo from '../../assets/images/logo.png'

const NAV_LINKS = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Squad', to: ROUTES.SQUAD },
  { label: 'Fixtures', to: ROUTES.FIXTURES },
  { label: 'Honours', to: ROUTES.HONOURS },
  { label: 'Gallery', to: ROUTES.GALLERY },
  { label: 'Contact', to: ROUTES.CONTACT },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Prevent background scroll when mobile menu is open
    document.body.style.overflow = isOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 h-18 z-50 bg-black/85 backdrop-blur-md border-b border-gold/20 flex items-center justify-between px-5 min-[641px]:px-7 min-[1025px]:px-12">
        {/* Logo */}
        <NavLink
          to={ROUTES.HOME}
          className="flex items-center gap-3 no-underline"
        >
          {/* Logo image */}
          <img
            src={logo}
            alt="Top G's CC logo"
            className="h-12 w-auto shrink-0"
          />

          {/* Club name */}
          <span className="font-['Bebas_Neue'] text-[22px] tracking-[2px] text-cream">
            TOP G's <span className="text-gold">CC</span>
          </span>
        </NavLink>

        {/* Desktop links - hidden below 900px */}
        <ul className="hidden min-[900px]:flex items-center gap-9 list-none">
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `
                  font-['Barlow_Condensed'] text-[13px] font-semibold
                  tracking-[2px] uppercase no-underline
                  transition-colors duration-200
                  ${isActive ? 'text-cream' : 'text-[#9b9b93] hover:text-gold'}
                `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Hamburger button - shown below 900px */}
        <button
          className="min-[900px]:hidden flex flex-col justify-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer p-0"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <span className="block w-[26px] h-[2px] bg-gold"></span>
          <span className="block w-[26px] h-[2px] bg-gold"></span>
          <span className="block w-[26px] h-[2px] bg-gold"></span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`
          fixed inset-0 z-[200]
          bg-black/98 backdrop-blur-[20px]
          flex flex-col items-center justify-center gap-2
          transition-all duration-300
          ${
            isOpen
              ? 'opacity-100 pointer-events-auto translate-y-0'
              : 'opacity-0 pointer-events-none -translate-y-5'
          }
        `}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-8 bg-transparent border-none text-gold text-[42px] leading-none cursor-pointer"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>

        {/* Menu links */}
        <ul className="list-none text-center">
          {NAV_LINKS.map(link => (
            <li key={link.to} className="my-[18px]">
              <NavLink
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
            font-['Bebas_Neue'] text-[34px] tracking-[2px] uppercase
            no-underline transition-colors duration-200
            ${isActive ? 'text-gold' : 'text-cream hover:text-gold'}
          `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

export default Navbar

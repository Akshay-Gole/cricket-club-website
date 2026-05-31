import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useState, useEffect } from 'react'
import logo from '../../assets/images/logo.png'

const NAV_LINKS = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Squad', to: ROUTES.SQUAD },
  { label: 'Fixtures', to: ROUTES.FIXTURES },
  { label: 'Honours', to: ROUTES.HONOURS },
  { label: 'News', to: ROUTES.NEWS },
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
      <nav className="fixed top-0 left-0 right-0 h-18 z-50 bg-[rgba(10,10,10,0.85)] backdrop-blur-md border-b border-[rgba(201,168,76,0.2)] flex items-center justify-between px-5 min-[641px]:px-7 min-[1025px]:px-12">
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
          <span className="font-['Bebas_Neue'] text-[22px] tracking-[2px] text-[#f5f5f0]">
            TOP G's <span className="text-[#c9a84c]">CC</span>
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
                  ${isActive ? 'text-[#f5f5f0]' : 'text-[#646459] hover:text-[#c9a84c]'}
                `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Join the Club CTA button - hidden below 900px */}
        <NavLink
          to={ROUTES.JOIN}
          className="hidden min-[900px]:inline-flex items-center font-['Barlow_Condensed'] text-[12px] font-bold tracking-[2.5px] uppercase no-underline text-[#0a0a0a] bg-[#c9a84c] px-[22px] py-[10px] rounded-[2px] transition-colors duration-200 hover:bg-[#f0c96a]"
        >
          Join the Club
        </NavLink>

        {/* Hamburger button - shown below 900px */}
        <button
          className="min-[900px]:hidden flex flex-col justify-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer p-0"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <span className="block w-[26px] h-[2px] bg-[#c9a84c]"></span>
          <span className="block w-[26px] h-[2px] bg-[#c9a84c]"></span>
          <span className="block w-[26px] h-[2px] bg-[#c9a84c]"></span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`
          fixed inset-0 z-[200]
          bg-[rgba(10,10,10,0.98)] backdrop-blur-[20px]
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
          className="absolute top-6 right-8 bg-transparent border-none text-[#c9a84c] text-[42px] leading-none cursor-pointer"
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
            ${isActive ? 'text-[#c9a84c]' : 'text-[#f5f5f0] hover:text-[#c9a84c]'}
          `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA inside menu */}
        <NavLink
          to={ROUTES.JOIN}
          onClick={() => setIsOpen(false)}
          className="mt-6 inline-flex items-center font-['Barlow_Condensed'] text-[12px] font-bold tracking-[2.5px] uppercase no-underline text-[#0a0a0a] bg-[#c9a84c] px-[22px] py-[10px] rounded-[2px] transition-colors duration-200 hover:bg-[#f0c96a]"
        >
          Join the Club
        </NavLink>
      </div>
    </header>
  )
}

export default Navbar

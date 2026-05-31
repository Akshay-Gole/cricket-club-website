import logo from '../../assets/images/logo.png'
import { ROUTES } from '../../constants/routes'
import { NavLink } from 'react-router-dom'

const SOCIAL_LINKS = [
  { label: 'Insta', href: 'https://www.instagram.com/topgs_cc/' },
  { label: 'Facebook', href: '#' },
  { label: 'X', href: '#' },
]

const NAV_COLUMNS = [
  {
    title: 'Navigate',
    links: [
      { label: 'Home', to: ROUTES.HOME },
      { label: 'Squad', to: ROUTES.SQUAD },
      { label: 'Fixtures', to: ROUTES.FIXTURES },
      { label: 'Honours', to: ROUTES.HONOURS },
      { label: 'News', to: ROUTES.NEWS },
      { label: 'Gallery', to: ROUTES.GALLERY },
    ],
  },
  {
    title: 'The Club',
    links: [
      { label: 'About Us', to: ROUTES.ABOUT },
      { label: 'Coaching Staff', to: ROUTES.SQUAD },
      { label: 'Join the Club', to: ROUTES.JOIN },
      { label: 'Sponsors', to: ROUTES.SPONSORS },
      { label: 'Contact', to: ROUTES.CONTACT },
      { label: 'Media', to: ROUTES.NEWS },
    ],
  },
]

const CONTACT_ITEMS = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@topgscc.com',
    href: 'mailto:hello@topgscc.com',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+61 400 000 000',
    href: 'tel:+61400000000',
  },
  {
    icon: '📍',
    label: 'Home Ground',
    value:
      'Lundie Gardens, Corner South Terrace and, Goodwood Rd, Adelaide SA 5000, Australia',
    href: null,
  },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] border-t border-[rgba(201,168,76,0.2)] text-[#8a8a7e]">
      {/* MAIN BODY */}
      <div
        className="
          grid
          grid-cols-1
          min-[641px]:grid-cols-2
          min-[901px]:grid-cols-3
          min-[1025px]:grid-cols-[1.4fr_1fr_1fr_1fr]
          pt-11 px-5 pb-7
          min-[641px]:pt-14 min-[641px]:px-7 min-[641px]:pb-8
          min-[1025px]:pt-16 min-[1025px]:px-12 min-[1025px]:pb-10
          gap-8
          min-[641px]:gap-y-9 min-[641px]:gap-x-8
          min-[1025px]:gap-12
        "
      >
        {/* BRAND COLUMN */}
        <div className="col-span-1 min-[641px]:col-span-full min-[1025px]:col-span-1 min-[641px]:max-w-[480px] min-[1025px]:max-w-none">
          {/* Logo: badge + wordmark */}
          <div className="flex items-center gap-[10px] mb-4">
            <img
              src={logo}
              alt="Top G's CC logo"
              className="h-12 w-auto shrink-0"
            />
            <div className="font-['Bebas_Neue'] text-[20px] tracking-[2px] text-[#f5f5f0]">
              TOP G's <span className="text-[#c9a84c]">CC</span>
            </div>
          </div>

          {/* Description */}
          <p className="font-['Barlow'] text-[13px] font-light text-[#8a8a7e] leading-[1.75] mb-6 max-w-full min-[641px]:max-w-[240px]">
            Play Hard. Win Harder. Adelaide's newest and most ambitious cricket
            club, est. 2026. Built by players, for players.
          </p>

          {/* Social buttons */}
          <div className="flex gap-2">
            {SOCIAL_LINKS.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Barlow_Condensed'] text-[10px] font-bold tracking-[1.5px] uppercase text-[#8a8a7e] border-[0.5px] border-[rgba(255,255,255,0.4)] px-3 py-[7px] rounded-[2px] no-underline transition-all duration-200 hover:text-[#f5f5f0] hover:border-[rgba(255,255,255,0.2)]"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* NAV COLUMNS — Navigate + The Club rendered from data */}
        {NAV_COLUMNS.map(column => (
          <div key={column.title}>
            {/* Column title */}
            <div className="font-['Barlow_Condensed'] text-[9px] min-[641px]:text-[10px] font-bold tracking-[3px] min-[641px]:tracking-[3.5px] uppercase text-[#c9a84c] mb-4 min-[641px]:mb-5 pb-[10px] min-[641px]:pb-3 border-b border-[rgba(255,255,255,0.4)]">
              {column.title}
            </div>

            {/* Link list */}
            <ul className="list-none flex flex-col gap-3 min-[641px]:gap-[10px]">
              {column.links.map(link => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="
                      flex items-center gap-[6px]
                      font-['Barlow'] text-[13px] font-light text-[#8a8a7e]
                      no-underline transition-colors duration-200
                      hover:text-[#f5f5f0]
                      before:content-[''] before:w-0 before:h-px before:bg-[#c9a84c]
                      before:transition-all before:duration-200
                      hover:before:w-3
                    "
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* CONTACT COLUMN */}
        <div>
          <div className="font-['Barlow_Condensed'] text-[9px] min-[641px]:text-[10px] font-bold tracking-[3px] min-[641px]:tracking-[3.5px] uppercase text-[#c9a84c] mb-4 min-[641px]:mb-5 pb-[10px] min-[641px]:pb-3 border-b border-[rgba(255,255,255,0.4)]">
            Contact
          </div>

          {CONTACT_ITEMS.map(item => (
            <div
              key={item.label}
              className="flex items-start gap-[10px] mb-[14px]"
            >
              {/* Icon box */}
              <div className="text-[14px] shrink-0 mt-px w-7 h-7 bg-[#161616] border-[0.5px] border-[rgba(255,255,255,0.1)] rounded-[2px] flex items-center justify-center">
                {item.icon}
              </div>

              {/* Label + value */}
              <div>
                <div className="font-['Barlow_Condensed'] text-[9px] font-bold tracking-[2px] uppercase  mb-0.5">
                  {item.label}
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-['Barlow'] text-[12px] font-light text-[#8a8a7e] no-underline transition-colors duration-200 hover:text-[#f5f5f0]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="font-['Barlow'] text-[12px] font-light text-[#8a8a7e]">
                    {item.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className="
        border-t border-[rgba(255,255,255,0.06)]
        flex flex-col items-center gap-[14px] text-center
        p-5
        min-[641px]:flex-row min-[641px]:justify-between min-[641px]:gap-6 min-[641px]:text-left
        min-[641px]:py-5 min-[641px]:px-12
      "
      >
        {/* Copyright */}
        <div className="font-['Barlow'] text-[13px] font-light  tracking-[0.5px] min-[641px]:tracking-normal">
          © {currentYear} Top G's Cricket Club. All rights reserved.
        </div>

        <div className="font-['Barlow'] text-[13px] font-light ">
          Designed & built by{' '}
          <a
            href="https://www.linkedin.com/in/akshaygole/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative ml-1 inline-block
              text-[#c9a84c] no-underline
              transition-colors duration-200
              after:absolute after:left-0 after:-bottom-[2px]
              after:h-px after:w-full after:origin-left after:scale-x-0
              after:bg-[#f0c96a]
              after:transition-transform after:duration-300 after:ease-out
              hover:text-[#f0c96a]
              hover:after:scale-x-100
            "
          >
            Akshay Gole
          </a>
        </div>

        {/* EST. 2026 */}
        <div className="font-['Bebas_Neue'] text-[13px] min-[641px]:text-[13px] tracking-[2.5px] min-[641px]:tracking-[3px]">
          EST. 2026
        </div>
      </div>
    </footer>
  )
}

export default Footer

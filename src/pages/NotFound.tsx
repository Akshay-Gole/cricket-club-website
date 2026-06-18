import logo from '../assets/images/logo.png'
import styles from './NotFound.module.css'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useState } from 'react'

function NotFound() {
  const [replayKey, setReplayKey] = useState(0)

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-5 py-10 text-center min-h-[calc(100vh-72px)]">
      {/* Field glow — soft green radial glow at the bottom */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_88%,color-mix(in_srgb,var(--color-green)_16%,transparent)_0%,transparent_70%)]" />

      {/* Ghost 404 watermark — huge faint outlined text behind everything */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-['Bebas_Neue'] text-[clamp(180px,28vw,320px)] leading-none whitespace-nowrap tracking-[8px] text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--color-gold)_30%,transparent)]">
        404
      </div>
      {/* ANIMATION SCENE */}
      <div key={replayKey} className={styles.scene}>
        {/* Logo shield — floats at top */}
        <div className={styles.logoWrap}>
          <img src={logo} alt="Top G's CC logo" className={styles.logoShield} />
        </div>

        {/* Ball rolling in from the left */}
        <div className={styles.ball} />

        {/* Stumps — get knocked flying */}
        <div className={styles.stumps}>
          <div className={`${styles.stump} ${styles.s1}`} />
          <div className={`${styles.stump} ${styles.s2}`} />
          <div className={`${styles.stump} ${styles.s3}`} />
        </div>

        {/* Bails — fly off */}
        <div className={`${styles.bail} ${styles.bailL}`} />
        <div className={`${styles.bail} ${styles.bailR}`} />

        {/* Impact effects */}
        <div className={styles.impactFlash} />
        <div className={styles.dust} />
        <div className={`${styles.spark} ${styles.sp1}`} />
        <div className={`${styles.spark} ${styles.sp2}`} />
        <div className={`${styles.spark} ${styles.sp3}`} />
        <div className={`${styles.spark} ${styles.sp4}`} />
        <div className={`${styles.spark} ${styles.sp5}`} />
        <div className={`${styles.spark} ${styles.sp6}`} />

        {/* Ground lines */}
        <div className={styles.crease} />
        <div className={styles.pitchSurface} />
      </div>

      {/* TEXT CONTENT */}
      <div className="relative z-[2]">
        {/* Error code line — bigger + clearer than mockup, as you wanted */}
        <div className="flex items-center justify-center gap-3 font-['Barlow_Condensed'] text-[14px] min-[641px]:text-[16px] font-bold tracking-[4px] uppercase text-gold mb-[10px] before:content-[''] before:w-6 before:h-px before:bg-gold after:content-[''] after:w-6 after:h-px after:bg-gold">
          Error 404 : Page Not Found
        </div>

        {/* Headline */}
        <h1 className="font-['Bebas_Neue'] text-[clamp(52px,8vw,92px)] leading-[0.92] tracking-[2px] text-cream mb-[6px]">
          BOWLED <span className="text-gold">OUT.</span>
        </h1>

        {/* Sub-headline */}
        <div className="font-['Bebas_Neue'] text-[clamp(18px,3vw,32px)] tracking-[3px] text-green-light mb-[18px]">
          CLEAN BOWLED. STUMPS FLYING.
        </div>

        {/* Description */}
        <p className="font-['Barlow'] text-[15px] font-light text-[#8a8a7e] max-w-[420px] mx-auto mb-6 leading-[1.75]">
          The page you're looking for has been dismissed for a duck. Moved,
          deleted, or never existed — much like that drive outside off stump.
        </p>
        {/* Score display */}
        <div className="inline-flex items-center bg-card border-[0.5px] border-[rgba(255,255,255,0.06)] mb-6 overflow-hidden">
          {/* You */}
          <div className="px-[22px] py-[10px]">
            <div className="font-['Barlow_Condensed'] text-[9px] font-bold tracking-[3px] uppercase text-[#8a8a7e] mb-0.5">
              You
            </div>
            <div className="font-['Bebas_Neue'] text-[28px] text-gold leading-none">
              0 / 1
            </div>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-[rgba(255,255,255,0.06)]" />

          {/* Status */}
          <div className="px-[18px] py-[10px] flex flex-col items-center justify-center">
            <div className="font-['Barlow_Condensed'] text-[9px] font-bold tracking-[2px] uppercase text-[#8a8a7e] mb-0.5">
              Status
            </div>
            <div className="font-['Barlow_Condensed'] text-[12px] font-bold tracking-[1px] text-[#d07060]">
              Bowled
            </div>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-[rgba(255,255,255,0.06)]" />

          {/* 404 */}
          <div className="px-[22px] py-[10px]">
            <div className="font-['Barlow_Condensed'] text-[9px] font-bold tracking-[3px] uppercase text-[#8a8a7e] mb-0.5">
              404
            </div>
            <div className="font-['Bebas_Neue'] text-[28px] text-cream leading-none">
              1 / 0
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 items-center justify-center flex-wrap">
          <NavLink
            to={ROUTES.HOME}
            className="font-['Barlow_Condensed'] text-[12px] font-bold tracking-[3px] uppercase text-black bg-gold px-[34px] py-[13px] rounded-[2px] no-underline transition-colors duration-200 hover:bg-gold-light"
          >
            Back to Home →
          </NavLink>
          <NavLink
            to={ROUTES.FIXTURES}
            className="font-['Barlow_Condensed'] text-[12px] font-bold tracking-[3px] uppercase text-[#8a8a7e] bg-transparent border-[0.5px] border-[rgba(255,255,255,0.06)] px-[26px] py-[13px] rounded-[2px] no-underline transition-all duration-200 hover:text-cream hover:border-[rgba(255,255,255,0.2)]"
          >
            View Fixtures
          </NavLink>
        </div>
      </div>

      {/* Replay button — ADD IT HERE */}
      <button
        onClick={() => setReplayKey(prev => prev + 1)}
        className="absolute bottom-4 right-5 min-[1025px]:right-10 font-['Barlow_Condensed'] text-[10px] font-bold tracking-[2px] uppercase text-[#8a8a7e] bg-transparent border-[0.5px] border-[rgba(255,255,255,0.06)] px-[14px] py-[7px] rounded-[2px] cursor-pointer transition-all duration-200 hover:text-cream hover:border-[rgba(255,255,255,0.2)] z-10"
      >
        ↺ Replay
      </button>
    </div>
  )
}

export default NotFound

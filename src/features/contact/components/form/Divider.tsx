interface DividerProps {
  label: string
}

function Divider({ label }: DividerProps) {
  return (
    <div className="relative my-5 h-px bg-white/[0.1]">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#0d0f0e] pr-3 font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted">
        {label}
      </span>
    </div>
  )
}

export default Divider

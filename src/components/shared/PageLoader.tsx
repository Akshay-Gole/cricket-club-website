interface PageLoaderProps {
  label?: string
  variant?: 'screen' | 'section'
  className?: string
}

function PageLoader({
  label = 'Loading...',
  variant = 'screen',
  className = '',
}: PageLoaderProps) {
  const wrapperClass =
    variant === 'screen' ? 'min-h-screen bg-black' : 'min-h-[220px]'

  return (
    <div
      className={`${wrapperClass} flex items-center justify-center ${className}`}
    >
      <div className="font-['Bebas_Neue'] text-gold text-2xl tracking-[3px]">
        {label}
      </div>
    </div>
  )
}

export default PageLoader

export default function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = '#DAFC68',
  colorTo = '#7be0ff',
}: {
  className?: string
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className || ''}`}
      style={{
        padding: '1px',
        background: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        backgroundSize: `${size}% 100%`,
        animation: `border-beam ${duration}s linear ${delay}s infinite`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    >
      <style jsx>{`
        @keyframes border-beam {
          to { background-position: ${size}% 0; }
        }
      `}</style>
    </div>
  )
}



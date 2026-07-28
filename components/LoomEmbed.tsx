/** The long-form sales video (~20 min) used on /vsl, /thank-you and the quiz result. */
export const VSL_LOOM_ID = '184e8823d9154d74aeca55a5cd488f08'

interface Props {
  /** Loom video id. Defaults to the long VSL. */
  id?: string
  /** Applied to the 16:9 wrapper. */
  className?: string
  title?: string
}

export default function LoomEmbed({ id = VSL_LOOM_ID, className = '', title }: Props) {
  const src =
    `https://www.loom.com/embed/${id}` +
    '?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&hide_title=true&t=0'

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-900/50 ${className}`}
      style={{ paddingBottom: '56.25%' }}
    >
      <iframe
        src={src}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}

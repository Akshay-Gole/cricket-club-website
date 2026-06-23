// Satellite view (&t=k) with a warm gold grade via CSS filter
const MAP_URL =
  'https://www.google.com/maps?q=Lundie+Gardens+Adelaide+SA&output=embed&t=k'

function ContactMap() {
  return (
    <div className="px-5 sm:px-7 lg:px-12 pb-20 lg:pb-24">
      <div className="relative rounded overflow-hidden border-[0.5px] border-white/[0.06]">
        <iframe
          title="Club home ground location"
          src={MAP_URL}
          className="w-full h-[440px] border-0 [filter:sepia(0.45)_saturate(1.2)_contrast(1.05)_brightness(0.9)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}

export default ContactMap

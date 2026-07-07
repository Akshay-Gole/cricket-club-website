import { useState } from 'react'
import ContactHero from '../features/contact/components/ContactHero'
import IntentSelector from '../features/contact/components/IntentSelector'
import { type IntentId } from '../features/contact/intents'
import logger from '../services/logger'
import ContactForm from '../features/contact/components/ContactForm'
import ContactMap from '../features/contact/components/ContactMap'

function Contact() {
  const [selectedIntent, setSelectedIntent] = useState<IntentId | null>(null)

  const handleIntentSelect = (intent: IntentId) => {
    setSelectedIntent(intent)
    logger.action('Contact intent selected', { intent })
  }

  return (
    <div className="relative overflow-hidden bg-[#080b09]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 64px, rgba(26,92,46,0.55) 64px, rgba(26,92,46,0.55) 65px), repeating-linear-gradient(90deg, transparent, transparent 86px, rgba(26,92,46,0.55) 86px, rgba(26,92,46,0.55) 87px)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(52,160,88,0.13),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(201,168,76,0.11),transparent_34%),linear-gradient(180deg,rgba(8,11,9,0.1)_0%,rgba(8,11,9,0.96)_62%)]" />

      <div className="relative z-[1]">
        <ContactHero />
        <IntentSelector
          selected={selectedIntent}
          onSelect={handleIntentSelect}
        />
        <ContactForm intent={selectedIntent} />
        <ContactMap />
      </div>
    </div>
  )
}

export default Contact

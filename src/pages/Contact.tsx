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
    <div>
      <ContactHero />
      <IntentSelector selected={selectedIntent} onSelect={handleIntentSelect} />
      <ContactForm intent={selectedIntent} />
      <ContactMap />
    </div>
  )
}

export default Contact

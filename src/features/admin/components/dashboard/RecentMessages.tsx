import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import { recentMessages } from '../../constants/dashboardData'

function RecentMessages() {
  return (
    <section className="rounded border border-white/[0.1] bg-[#161616] shadow-[0_14px_44px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.10] px-5 py-4">
        <div>
          <p className="font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
            Inbox
          </p>
          <h3 className="mt-1 font-display text-2xl tracking-[1px] text-white">
            Recent Messages
          </h3>
        </div>

        <Link
          to={ROUTES.ADMIN_MESSAGES}
          className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted transition-colors hover:text-gold"
        >
          View All →
        </Link>
      </div>

      <div className="divide-y divide-white/[0.10]">
        {recentMessages.map(message => (
          <article
            key={message.id}
            className="group flex gap-4 px-5 py-4 transition-colors hover:bg-white/[0.055]"
          >
            <div className="pt-1">
              <span
                className={`block h-2.5 w-2.5 rounded-full ${
                  message.unread ? 'bg-gold' : 'bg-white/15'
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">
                    {message.name}
                  </h4>
                  <p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[2px] text-gold/80">
                    {message.intent}
                  </p>
                </div>

                <span className="shrink-0 font-heading text-[10px] font-bold uppercase tracking-[1.5px] text-muted">
                  {message.time}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 font-body text-xs font-light leading-[1.7] text-muted">
                {message.preview}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentMessages

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearError, loginUser } from '../auth/store/authSlice'
import { ROUTES } from '../../constants/routes'
import logo from '../../assets/images/logo.png'

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, isLoading, error } = useAppSelector(state => state.auth)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const destination =
    (location.state as { from?: string } | null)?.from ?? ROUTES.ADMIN_DASHBOARD

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (user && token) {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
    }
  }, [navigate, user])

  const updateField = (field: 'email' | 'password', value: string) => {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }))

    if (error) {
      dispatch(clearError())
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await dispatch(loginUser(form)).unwrap()
      navigate(destination, { replace: true })
    } catch {
      // Error is displayed from Redux.
    }
  }

  return (
    <main className="grid min-h-screen bg-[#070a07] min-[901px]:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-white/[0.12] min-[901px]:flex min-[901px]:flex-col min-[901px]:justify-between min-[901px]:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,138,71,0.22),transparent_38%),linear-gradient(145deg,#102117_0%,#090c0a_65%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(201,168,76,1)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,1)_1px,transparent_1px)] [background-size:72px_72px]"
        />

        <div className="relative flex items-center gap-3">
          <img
            src={logo}
            alt="Top G's CC"
            className="h-14 w-14 object-contain"
          />

          <div>
            <div className="font-display text-[26px] tracking-[2px] text-white">
              TOP G'S <span className="text-gold">CC</span>
            </div>

            <div className="font-heading text-[9px] font-bold uppercase tracking-[3px] text-muted">
              Club Administration
            </div>
          </div>
        </div>

        <div className="relative max-w-[560px]">
          <div className="mb-5 flex items-center gap-3 font-heading text-[10px] font-bold uppercase tracking-[4px] text-gold">
            <span className="h-px w-10 bg-gold" />
            Private Access
          </div>

          <h1 className="font-display text-[clamp(64px,8vw,112px)] leading-[0.82] tracking-[2px] text-white">
            Run The
            <br />
            Club.
          </h1>

          <p className="mt-8 max-w-[440px] font-body text-sm font-light leading-[1.8] text-muted">
            Manage players, fixtures, club news, sponsors and member enquiries
            from one focused workspace.
          </p>
        </div>

        <p className="relative font-heading text-[9px] font-semibold uppercase tracking-[2px] text-muted/70">
          Authorised club personnel only
        </p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-7 min-[901px]:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.08),transparent_65%)] min-[901px]:hidden"
        />

        <div className="relative w-full max-w-[460px]">
          <div className="mb-10 flex items-center gap-3 min-[901px]:hidden">
            <img
              src={logo}
              alt="Top G's CC"
              className="h-12 w-12 object-contain"
            />

            <div>
              <div className="font-display text-[22px] tracking-[2px] text-white">
                TOP G'S <span className="text-gold">CC</span>
              </div>

              <div className="font-heading text-[9px] font-bold uppercase tracking-[3px] text-muted">
                Admin Portal
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[3px] text-gold">
              Welcome Back
            </div>

            <h2 className="font-display text-[42px] tracking-[1px] text-white sm:text-[52px]">
              Sign In
            </h2>

            <p className="mt-2 font-body text-sm font-light leading-[1.7] text-muted">
              Enter your administrator details to continue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="overflow-hidden rounded border border-white/[0.12] bg-[#1b241d] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="space-y-5 p-5 sm:p-7">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-email"
                  className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted"
                >
                  Email Address
                </label>

                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  placeholder="admin@topgscc.com"
                  onChange={event => updateField('email', event.target.value)}
                  className="w-full rounded-sm border border-white/[0.08] bg-[#191d1a] px-4 py-3.5 font-heading text-[15px] font-semibold tracking-[0.4px] text-white outline-none transition-colors placeholder:font-normal placeholder:text-muted/60 focus:border-gold/45 focus:bg-[#1b201c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-password"
                  className="font-heading text-[10px] font-bold uppercase tracking-[2.5px] text-muted"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    placeholder="Enter your password"
                    onChange={event =>
                      updateField('password', event.target.value)
                    }
                    className="w-full rounded-sm border border-white/[0.08] bg-[#191d1a] px-4 py-3.5 pr-16 font-heading text-[15px] font-semibold tracking-[0.4px] text-white outline-none transition-colors placeholder:font-normal placeholder:text-muted/60 focus:border-gold/45 focus:bg-[#1b201c]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(previous => !previous)}
                    className="absolute inset-y-0 right-0 px-4 font-heading text-[9px] font-bold uppercase tracking-[1.5px] text-muted hover:text-gold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-sm border border-[#c94c4c]/25 bg-[#c94c4c]/10 px-4 py-3 font-heading text-xs font-semibold tracking-[0.5px] text-[#e07060]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex min-h-12 w-full items-center justify-center rounded-sm bg-gold px-6 font-heading text-xs font-bold uppercase tracking-[3px] text-black transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:bg-muted"
              >
                {isLoading ? 'Signing In…' : 'Enter Dashboard →'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center font-body text-[11px] text-muted/70">
            Protected administration area
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login

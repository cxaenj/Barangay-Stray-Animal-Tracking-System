import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginUser, getUserProfile } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { PawPrint, Shield, HeartPulse, MapPin, Eye, EyeOff } from 'lucide-react'

const features = [
  { icon: <PawPrint className="h-5 w-5" />, title: 'Track Animals', desc: 'Monitor stray cats and dogs in your barangay' },
  { icon: <HeartPulse className="h-5 w-5" />, title: 'Health Records', desc: 'Keep vaccination and health status updated' },
  { icon: <MapPin className="h-5 w-5" />, title: 'Location Data', desc: 'Record sightings and common locations' },
  { icon: <Shield className="h-5 w-5" />, title: 'Community Safety', desc: 'Protect residents and animals alike' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setProfile, setLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await loginUser(email, password)
      setUser(user)
      const profile = await getUserProfile(user.uid)
      setProfile(profile)
      setLoading(false)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <PawPrint className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Barangay</h1>
              <p className="text-amber-100">Animal Tracking System</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Caring for Our<br />
            <span className="text-amber-200">Community Animals</span>
          </h2>
          
          <p className="text-lg text-amber-100 mb-12 max-w-md">
            A comprehensive system for monitoring, tracking, and caring for stray animals in your barangay.
          </p>

          {/* Feature Carousel */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  index === currentFeature 
                    ? 'bg-white/20 backdrop-blur-sm scale-100 opacity-100' 
                    : 'bg-transparent scale-95 opacity-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${index === currentFeature ? 'bg-white/20' : ''}`}>
                  {feature.icon}
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-amber-100">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-600/50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-4">
              <PawPrint className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Barangay Animal Tracking</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Stray Animal Monitoring System</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span className="flex-shrink-0">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base" disabled={busy}>
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Protected by Barangay Administration
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                <span>🔒 Secure Login</span>
                <span>•</span>
                <span>📱 Mobile Friendly</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-8">
            © 2024 Barangay Animal Tracking System
          </p>
        </div>
      </div>
    </div>
  )
}

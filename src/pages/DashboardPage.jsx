import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAnimals } from '@/lib/animals'
import { useAuthStore } from '@/store/authStore'
import { 
  PawPrint, Syringe, HeartPulse, AlertCircle, Plus, TrendingUp, 
  Calendar, MapPin, Clock, Activity, Cat, Dog, ArrowRight,
  Sparkles, Bell, CheckCircle2, Info
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = {
    total: animals.length,
    healthy: animals.filter((a) => a.healthStatus === 'healthy').length,
    vaccinated: animals.filter((a) => a.vaccinated).length,
    atRisk: animals.filter((a) => ['sick', 'injured', 'critical'].includes(a.healthStatus)).length,
    cats: animals.filter((a) => a.species === 'cat').length,
    dogs: animals.filter((a) => a.species === 'dog').length,
  }

  const recentAnimals = animals.slice(0, 5)
  const criticalAnimals = animals.filter((a) => ['sick', 'injured', 'critical'].includes(a.healthStatus))
  const unvaccinatedAnimals = animals.filter((a) => !a.vaccinated)

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-100 text-sm mb-1">
                <Sparkles className="h-4 w-4" />
                <span>{getGreeting()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{profile?.fullName || 'User'}</h1>
              <p className="text-amber-100 mt-1 text-sm">
                Welcome to Barangay Animal Tracking System
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <div className="flex items-center gap-2 text-amber-100 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickAction 
          icon={<Plus className="h-5 w-5" />} 
          label="Add Animal" 
          onClick={() => navigate('/animals/add')} 
          color="amber"
        />
        <QuickAction 
          icon={<PawPrint className="h-5 w-5" />} 
          label="View Animals" 
          onClick={() => navigate('/animals')} 
          color="blue"
        />
        <QuickAction 
          icon={<Activity className="h-5 w-5" />} 
          label="View Visits" 
          onClick={() => navigate('/visits')} 
          color="emerald"
        />
        <QuickAction 
          icon={<MapPin className="h-5 w-5" />} 
          label="Sightings Map" 
          onClick={() => {}} 
          color="purple"
          disabled
          badge="Soon"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<PawPrint className="h-5 w-5" />} label="Total Animals" value={stats.total} color="amber" trend="+2 this week" />
        <StatCard icon={<HeartPulse className="h-5 w-5" />} label="Healthy" value={stats.healthy} color="emerald" percent={stats.total ? Math.round((stats.healthy / stats.total) * 100) : 0} />
        <StatCard icon={<Syringe className="h-5 w-5" />} label="Vaccinated" value={stats.vaccinated} color="blue" percent={stats.total ? Math.round((stats.vaccinated / stats.total) * 100) : 0} />
        <StatCard icon={<AlertCircle className="h-5 w-5" />} label="At Risk" value={stats.atRisk} color="red" alert={stats.atRisk > 0} />
      </div>

      {/* Species Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardBody className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                <Cat className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.cats}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cats Registered</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                  {stats.total ? Math.round((stats.cats / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            {stats.total > 0 && (
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                  style={{ width: `${(stats.cats / stats.total) * 100}%` }}
                ></div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardBody className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Dog className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.dogs}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dogs Registered</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {stats.total ? Math.round((stats.dogs / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            {stats.total > 0 && (
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${(stats.dogs / stats.total) * 100}%` }}
                ></div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Alerts Section */}
      {(criticalAnimals.length > 0 || unvaccinatedAnimals.length > 0) && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Alerts & Notifications
          </h2>
          
          {criticalAnimals.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-400">
                  {criticalAnimals.length} animal{criticalAnimals.length > 1 ? 's' : ''} need{criticalAnimals.length === 1 ? 's' : ''} attention
                </p>
                <p className="text-sm text-red-600 dark:text-red-400/80 mt-0.5">
                  {criticalAnimals.map(a => a.name).join(', ')} {criticalAnimals.length === 1 ? 'is' : 'are'} marked as {criticalAnimals.map(a => a.healthStatus).join(', ')}
                </p>
              </div>
              <Link to="/animals" className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline whitespace-nowrap">
                View →
              </Link>
            </div>
          )}

          {unvaccinatedAnimals.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Syringe className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-700 dark:text-amber-400">
                  {unvaccinatedAnimals.length} animal{unvaccinatedAnimals.length > 1 ? 's' : ''} not vaccinated
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400/80 mt-0.5">
                  Schedule vaccination for: {unvaccinatedAnimals.slice(0, 3).map(a => a.name).join(', ')}{unvaccinatedAnimals.length > 3 ? ` and ${unvaccinatedAnimals.length - 3} more` : ''}
                </p>
              </div>
              <Link to="/animals" className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap">
                View →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Animals */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              Recent Animals
            </h2>
            <Link to="/animals" className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAnimals.map((a, index) => (
              <Link
                key={a.id}
                to={`/animals/${a.id}`}
                className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-[1.01] group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  a.species === 'cat' 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                  {a.species === 'cat' ? <Cat className="h-6 w-6" /> : <Dog className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{a.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{a.tagId}</span>
                    <span>•</span>
                    <span className="capitalize">{a.species}</span>
                    <span>•</span>
                    <span>{a.vaccinated ? '✓ Vaccinated' : 'Not vaccinated'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge label={a.healthStatus} variant={a.healthStatus === 'healthy' ? 'success' : a.healthStatus === 'critical' ? 'danger' : 'warning'} />
                  <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}

            {recentAnimals.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <PawPrint className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No animals recorded yet</p>
                <Button onClick={() => navigate('/animals/add')}>
                  <Plus className="mr-2 h-4 w-4" /> Add First Animal
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">💡 Did you know?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Regular monitoring of stray animals helps prevent disease outbreaks and improves community safety. 
                Make sure to update health records after each visit!
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value, color, trend, percent, alert }) {
  const colors = {
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  }

  return (
    <Card className={alert ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-gray-900' : ''}>
      <CardBody className="flex flex-col items-center text-center py-6 relative">
        {alert && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
        <div className={`p-3 rounded-xl mb-3 ${colors[color]}`}>
          {icon}
        </div>
        <p className={`text-3xl font-bold ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
        {typeof percent === 'number' && (
          <div className="w-full mt-3">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  color === 'emerald' ? 'bg-emerald-500' : 
                  color === 'blue' ? 'bg-blue-500' : 
                  color === 'red' ? 'bg-red-500' : 'bg-amber-500'
                }`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{percent}% of total</p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

function QuickAction({ icon, label, onClick, color, disabled, badge }) {
  const colors = {
    amber: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    blue: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
    emerald: 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    purple: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-white font-medium text-sm transition-all ${
        disabled 
          ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-60' 
          : `bg-gradient-to-br ${colors[color]} shadow-md hover:shadow-lg hover:scale-105 active:scale-95`
      }`}
    >
      {badge && (
        <span className="absolute top-1 right-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {icon}
      <span>{label}</span>
    </button>
  )
}

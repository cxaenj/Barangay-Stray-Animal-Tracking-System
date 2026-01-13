import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAnimals } from '@/lib/animals'
import { useAuthStore } from '@/store/authStore'
import { PawPrint, Syringe, HeartPulse, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { profile } = useAuthStore()
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [])

  const stats = {
    total: animals.length,
    healthy: animals.filter((a) => a.healthStatus === 'healthy').length,
    vaccinated: animals.filter((a) => a.vaccinated).length,
    atRisk: animals.filter((a) => ['sick', 'injured', 'critical'].includes(a.healthStatus)).length,
  }

  const recentAnimals = animals.slice(0, 5)

  if (loading) {
    return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {profile?.fullName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<PawPrint className="h-5 w-5" />} label="Total Animals" value={stats.total} color="amber" />
        <StatCard icon={<HeartPulse className="h-5 w-5" />} label="Healthy" value={stats.healthy} color="emerald" />
        <StatCard icon={<Syringe className="h-5 w-5" />} label="Vaccinated" value={stats.vaccinated} color="blue" />
        <StatCard icon={<AlertCircle className="h-5 w-5" />} label="At Risk" value={stats.atRisk} color="red" />
      </div>

      {/* Recent Animals */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Animals</h2>
            <Link to="/animals" className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentAnimals.map((a) => (
              <Link
                key={a.id}
                to={`/animals/${a.id}`}
                className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{a.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.tagId} • {a.species}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge label={a.healthStatus} variant={a.healthStatus === 'healthy' ? 'success' : 'warning'} />
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">{formatDateTime(a.updatedAt)}</span>
                </div>
              </Link>
            ))}

            {recentAnimals.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No animals recorded yet.</p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  }

  return (
    <Card>
      <CardBody className="flex flex-col items-center text-center py-6">
        <div className={`p-3 rounded-full mb-3 ${colors[color]}`}>
          {icon}
        </div>
        <p className={`text-3xl font-bold ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </CardBody>
    </Card>
  )
}

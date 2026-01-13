import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { logoutUser } from '@/lib/auth'
import { getAnimals } from '@/lib/animals'
import { formatDate } from '@/lib/utils'
import { 
  User, Mail, Shield, Calendar, MapPin, LogOut, Settings, 
  Award, PawPrint, Activity, TrendingUp, Star, Clock, 
  CheckCircle2, Users
} from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, reset } = useAuthStore()
  const [stats, setStats] = useState({ animals: 0, visits: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimals().then((animals) => {
      const totalVisits = animals.reduce((acc, a) => acc + (a.visits?.length || 0), 0)
      setStats({ animals: animals.length, visits: totalVisits })
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    reset()
    navigate('/login')
  }

  if (!profile) return (
    <div className="py-20 text-center">
      <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
        <span>Loading profile...</span>
      </div>
    </div>
  )

  const roleColors = {
    admin: 'warning',
    staff: 'info',
    veterinarian: 'success'
  }

  const roleIcons = {
    admin: <Shield className="w-5 h-5" />,
    staff: <Users className="w-5 h-5" />,
    veterinarian: <Activity className="w-5 h-5" />
  }

  const roleBadges = {
    admin: '🛡️ Administrator',
    staff: '👤 Staff Member',
    veterinarian: '🩺 Veterinarian'
  }

  const memberDays = profile.createdAt 
    ? Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-white rounded-full"></div>
            <div className="absolute top-2 left-10 w-16 h-16 border-4 border-white rounded-full"></div>
            <div className="absolute -bottom-8 left-1/3 w-32 h-32 border-4 border-white rounded-full"></div>
          </div>
        </div>

        <CardBody className="relative pt-0">
          {/* Avatar */}
          <div className="-mt-12 sm:-mt-16 mb-4 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold text-amber-600 dark:text-amber-400">
                    {profile.fullName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="pb-2 hidden sm:block">
                <Badge label={roleBadges[profile.role] || profile.role} variant={roleColors[profile.role] || 'default'} />
              </div>
            </div>
            <div className="pb-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            </div>
          </div>

          {/* Name and Role */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {profile.fullName}
              {profile.role === 'admin' && <Star className="h-5 w-5 text-amber-500" />}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
            <div className="sm:hidden mt-2">
              <Badge label={roleBadges[profile.role] || profile.role} variant={roleColors[profile.role] || 'default'} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{memberDays}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Days Active</p>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                <PawPrint className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.animals}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Animals</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                <Activity className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.visits}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visits</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="h-5 w-5 text-amber-500" />
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-gray-100 truncate">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">{profile.role}</p>
                </div>
              </div>

              {profile.address && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-gray-100">{profile.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(profile.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Status</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">Active</p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Achievement Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Animal Guardian</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You're helping protect and monitor stray animals in your community. Keep up the great work!
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {profile.role === 'admin' && (
          <Button variant="secondary" onClick={() => navigate('/admin/users')} className="justify-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </Button>
        )}
        <Button 
          variant="danger" 
          onClick={handleLogout} 
          className={`justify-center gap-2 ${profile.role !== 'admin' ? 'sm:col-span-2' : ''}`}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

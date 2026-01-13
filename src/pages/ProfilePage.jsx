import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { logoutUser } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { User, Mail, Shield, Calendar, MapPin } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, reset } = useAuthStore()

  const handleLogout = async () => {
    await logoutUser()
    reset()
    navigate('/login')
  }

  if (!profile) return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>

  const roleColors = {
    admin: 'warning',
    staff: 'info',
    veterinarian: 'success'
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>

      <Card>
        <CardBody className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <User className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{profile.fullName}</h2>
              <Badge label={profile.role} variant={roleColors[profile.role] || 'default'} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</p>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{profile.role}</p>
              </div>
            </div>

            {profile.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</p>
                  <p className="text-gray-900 dark:text-gray-100">{profile.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Member Since</p>
                <p className="text-gray-900 dark:text-gray-100">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        {profile.role === 'admin' && (
          <Button variant="secondary" onClick={() => navigate('/admin/users')} className="flex-1">
            User Management
          </Button>
        )}
        <Button variant="danger" onClick={handleLogout} className="flex-1 sm:flex-none">
          Logout
        </Button>
      </div>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Shell } from './components/Shell'
import { useAuthStore } from './store/authStore'
import { listenToAuth, getUserProfile } from './lib/auth'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnimalsPage from './pages/AnimalsPage'
import AddAnimalPage from './pages/AddAnimalPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import VisitsPage from './pages/VisitsPage'
import AddVisitPage from './pages/AddVisitPage'
import ProfilePage from './pages/ProfilePage'
import AdminUsersPage from './pages/AdminUsersPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { profile, loading } = useAuthStore()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Loading...</div>
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = listenToAuth(async (user) => {
      setUser(user)
      if (user) {
        const profile = await getUserProfile(user.uid)
        setProfile(profile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [setUser, setProfile, setLoading])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Shell />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="animals" element={<AnimalsPage />} />
          <Route path="animals/add" element={<AddAnimalPage />} />
          <Route path="animals/:id" element={<AnimalDetailPage />} />
          <Route path="visits" element={<VisitsPage />} />
          <Route path="visits/add" element={<AddVisitPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

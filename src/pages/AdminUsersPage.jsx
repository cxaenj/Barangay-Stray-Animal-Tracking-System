import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getUsers, deleteUser } from '@/lib/users'
import { registerUser } from '@/lib/auth'
import { Trash2, Plus, X } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'staff'
  })

  const update = (key, value) => setForm({ ...form, [key]: value })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await registerUser(form)
      setShowForm(false)
      setForm({ email: '', password: '', fullName: '', role: 'staff' })
      loadUsers()
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (uid) => {
    if (!window.confirm('Delete this user?')) return
    await deleteUser(uid)
    loadUsers()
  }

  const roleColors = {
    admin: 'warning',
    staff: 'info',
    veterinarian: 'success'
  }

  if (loading) return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="mr-2 h-4 w-4" /> Cancel</> : <><Plus className="mr-2 h-4 w-4" /> Add User</>}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title="Create User" />
          <CardBody>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              <Input label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="staff">Staff</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={busy}>
                  {busy ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{u.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge label={u.role} variant={roleColors[u.role] || 'default'} />
                  <button 
                    onClick={() => handleDelete(u.uid)} 
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

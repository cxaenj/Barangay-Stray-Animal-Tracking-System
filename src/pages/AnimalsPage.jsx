import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getAnimals, deleteAnimal } from '@/lib/animals'
import { useAnimalStore } from '@/store/animalStore'
import { Plus, Trash2, Eye } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function AnimalsPage() {
  const navigate = useNavigate()
  const { setAnimals, filter, setFilter, filteredAnimals } = useAnimalStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [setAnimals])

  const animals = filteredAnimals()

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this animal record?')) return
    await deleteAnimal(id)
    const updated = await getAnimals()
    setAnimals(updated)
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Animals</h1>
        <Button onClick={() => navigate('/animals/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add Animal
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or tag..."
                value={filter.search}
                onChange={(e) => setFilter({ search: e.target.value })}
              />
            </div>
            <select
              value={filter.species}
              onChange={(e) => setFilter({ species: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Species</option>
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
            </select>
            <select
              value={filter.healthStatus}
              onChange={(e) => setFilter({ healthStatus: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="healthy">Healthy</option>
              <option value="sick">Sick</option>
              <option value="injured">Injured</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-3">
        {animals.map((a) => (
          <Card key={a.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">{a.tagId}</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{a.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{a.species}</p>
                </div>
                <Badge
                  label={a.healthStatus}
                  variant={a.healthStatus === 'healthy' ? 'success' : a.healthStatus === 'critical' ? 'danger' : 'warning'}
                />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">{formatDateTime(a.updatedAt)}</span>
                <div className="flex items-center gap-2">
                  <Link to={`/animals/${a.id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
        {animals.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">No animals found.</div>
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Tag ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Species</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Vaccinated</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {animals.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-amber-600 dark:text-amber-400">{a.tagId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{a.name}</td>
                  <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{a.species}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={a.healthStatus}
                      variant={a.healthStatus === 'healthy' ? 'success' : a.healthStatus === 'critical' ? 'danger' : 'warning'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={a.vaccinated ? 'Yes' : 'No'} variant={a.vaccinated ? 'success' : 'default'} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDateTime(a.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/animals/${a.id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {animals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                    No animals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getAnimals, deleteAnimal } from '@/lib/animals'
import { useAnimalStore } from '@/store/animalStore'
import { Plus, Trash2, Eye, Cat, Dog, Grid, List, Search, Filter, RefreshCw, Download, PawPrint, HeartPulse, Syringe } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function AnimalsPage() {
  const navigate = useNavigate()
  const { setAnimals, filter, setFilter, filteredAnimals } = useAnimalStore()
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadAnimals()
  }, [setAnimals])

  const loadAnimals = async () => {
    const data = await getAnimals()
    setAnimals(data)
    setLoading(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnimals()
    setTimeout(() => setRefreshing(false), 500)
  }

  const animals = filteredAnimals()
  const allAnimals = useAnimalStore.getState().animals

  const stats = {
    total: allAnimals.length,
    healthy: allAnimals.filter((a) => a.healthStatus === 'healthy').length,
    vaccinated: allAnimals.filter((a) => a.vaccinated).length,
    cats: allAnimals.filter((a) => a.species === 'cat').length,
    dogs: allAnimals.filter((a) => a.species === 'dog').length,
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this animal record?')) return
    await deleteAnimal(id)
    const updated = await getAnimals()
    setAnimals(updated)
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
          <span>Loading animals...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Animals Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage and monitor all registered stray animals
          </p>
        </div>
        <Button onClick={() => navigate('/animals/add')} className="shadow-lg shadow-amber-500/20">
          <Plus className="mr-2 h-4 w-4" /> Add Animal
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <PawPrint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <Cat className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.cats}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cats</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Dog className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.dogs}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dogs</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.healthy}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthy</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Syringe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.vaccinated}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vaccinated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or tag..."
                value={filter.search}
                onChange={(e) => setFilter({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters:</span>
              </div>
              <select
                value={filter.species}
                onChange={(e) => setFilter({ species: e.target.value })}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">All Species</option>
                <option value="cat">🐱 Cat</option>
                <option value="dog">🐕 Dog</option>
              </select>
              <select
                value={filter.healthStatus}
                onChange={(e) => setFilter({ healthStatus: e.target.value })}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="healthy">✅ Healthy</option>
                <option value="sick">🤒 Sick</option>
                <option value="injured">🩹 Injured</option>
                <option value="critical">🚨 Critical</option>
              </select>
              <button
                onClick={handleRefresh}
                className={`p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${refreshing ? 'animate-spin' : ''}`}
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filters */}
          {(filter.search || filter.species !== 'all' || filter.healthStatus !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
              {filter.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs">
                  Search: {filter.search}
                  <button onClick={() => setFilter({ search: '' })} className="hover:text-amber-900">×</button>
                </span>
              )}
              {filter.species !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
                  Species: {filter.species}
                  <button onClick={() => setFilter({ species: 'all' })} className="hover:text-blue-900">×</button>
                </span>
              )}
              {filter.healthStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs">
                  Status: {filter.healthStatus}
                  <button onClick={() => setFilter({ healthStatus: 'all' })} className="hover:text-emerald-900">×</button>
                </span>
              )}
              <button 
                onClick={() => setFilter({ search: '', species: 'all', healthStatus: 'all' })}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear all
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-gray-100">{animals.length}</span> of {allAnimals.length} animals
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map((a) => (
            <Card key={a.id} className="group hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden">
              <CardBody className="p-0">
                {/* Card Header with Species Icon */}
                <div className={`p-4 ${a.species === 'cat' ? 'bg-gradient-to-r from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20' : 'bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${a.species === 'cat' ? 'bg-orange-200 dark:bg-orange-800/50 text-orange-600 dark:text-orange-400' : 'bg-blue-200 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400'}`}>
                        {a.species === 'cat' ? <Cat className="h-6 w-6" /> : <Dog className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{a.name}</p>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-mono">{a.tagId}</p>
                      </div>
                    </div>
                    <Badge
                      label={a.healthStatus}
                      variant={a.healthStatus === 'healthy' ? 'success' : a.healthStatus === 'critical' ? 'danger' : 'warning'}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Vaccination</span>
                    <Badge label={a.vaccinated ? '✓ Vaccinated' : 'Not Vaccinated'} variant={a.vaccinated ? 'success' : 'default'} />
                  </div>
                  
                  {a.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>📍</span>
                      <span className="truncate">{a.location}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Last updated: {formatDateTime(a.updatedAt)}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between p-4 pt-0">
                  <Link 
                    to={`/animals/${a.id}`} 
                    className="flex-1 text-center py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium text-sm hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleDelete(a.id)} 
                    className="ml-2 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3">Animal</th>
                  <th className="px-4 py-3">Tag ID</th>
                  <th className="px-4 py-3">Health</th>
                  <th className="px-4 py-3">Vaccinated</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {animals.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.species === 'cat' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                          {a.species === 'cat' ? <Cat className="h-5 w-5" /> : <Dog className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{a.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{a.species}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-amber-600 dark:text-amber-400 text-sm">{a.tagId}</td>
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
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {animals.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
            <PawPrint className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No animals found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {filter.search || filter.species !== 'all' || filter.healthStatus !== 'all'
              ? 'Try adjusting your filters to see more results'
              : 'Start by adding your first stray animal record'}
          </p>
          {!(filter.search || filter.species !== 'all' || filter.healthStatus !== 'all') && (
            <Button onClick={() => navigate('/animals/add')}>
              <Plus className="mr-2 h-4 w-4" /> Add First Animal
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAnimals } from '@/lib/animals'
import { Link } from 'react-router-dom'
import { ChevronRight, Cat, Dog, Calendar, Clock, Activity, Search, Filter, PawPrint, Stethoscope, MapPin } from 'lucide-react'

export default function VisitsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [])

  const filteredAnimals = animals.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.tagId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || a.healthStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: animals.length,
    needsCheckup: animals.filter((a) => ['sick', 'injured', 'critical'].includes(a.healthStatus)).length,
    recentlyVisited: animals.filter((a) => {
      const lastVisit = a.visits?.length > 0 ? new Date(a.visits[a.visits.length - 1].date) : null
      if (!lastVisit) return false
      const daysSince = (new Date() - lastVisit) / (1000 * 60 * 60 * 24)
      return daysSince <= 7
    }).length,
  }

  if (loading) return (
    <div className="py-20 text-center">
      <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
        <span>Loading visits...</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-amber-500" />
          Visit Records
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Track health checkups, vaccinations, and sightings for each animal
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Animals</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.needsCheckup}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Need Checkup</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.recentlyVisited}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visited This Week</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search animal by name or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="healthy">✅ Healthy</option>
                <option value="sick">🤒 Sick</option>
                <option value="injured">🩹 Injured</option>
                <option value="critical">🚨 Critical</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Animal List */}
      <div className="space-y-3">
        {filteredAnimals.map((a) => {
          const visitCount = a.visits?.length || 0
          const lastVisit = a.visits?.length > 0 ? a.visits[a.visits.length - 1] : null

          return (
            <Link
              key={a.id}
              to={`/animals/${a.id}`}
              className="block group"
            >
              <Card className="hover:shadow-lg transition-all hover:scale-[1.01] overflow-hidden">
                <CardBody className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Left side - Animal info */}
                    <div className={`p-4 sm:p-5 flex items-center gap-4 ${
                      a.species === 'cat' 
                        ? 'bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/20 dark:to-transparent' 
                        : 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent'
                    }`}>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        a.species === 'cat' 
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                        {a.species === 'cat' ? <Cat className="h-7 w-7" /> : <Dog className="h-7 w-7" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{a.name}</p>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-mono">{a.tagId}</p>
                        <Badge 
                          label={a.healthStatus} 
                          variant={a.healthStatus === 'healthy' ? 'success' : a.healthStatus === 'critical' ? 'danger' : 'warning'} 
                        />
                      </div>
                    </div>

                    {/* Right side - Visit info */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-700">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Activity className="h-4 w-4" />
                          <span><strong className="text-gray-900 dark:text-gray-100">{visitCount}</strong> total visits recorded</span>
                        </div>
                        {lastVisit && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>Last visit: {new Date(lastVisit.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {a.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{a.location}</span>
                          </div>
                        )}
                        {!lastVisit && (
                          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">No visits yet — Add first visit</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium group-hover:underline">
                          View Details
                        </span>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          )
        })}

        {/* Empty State */}
        {filteredAnimals.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <Stethoscope className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No animals match your search' : 'No animals registered yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters to see more results'
                : 'Add animals to start tracking their visits'}
            </p>
          </div>
        )}
      </div>

      {/* Help Tip */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardBody>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Quick Tip</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Click on any animal to view their complete visit history and add new visit records. 
                Regular checkups help maintain accurate health records!
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

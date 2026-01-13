import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAnimal, deleteAnimal } from '@/lib/animals'
import { getVisitsByAnimal } from '@/lib/visits'
import { formatDateTime } from '@/lib/utils'
import { 
  ChevronLeft, Trash2, Plus, Cat, Dog, MapPin, Calendar, 
  Heart, Syringe, Scissors, Scale, Palette, Clock, 
  Activity, FileText, AlertCircle, CheckCircle2, Edit
} from 'lucide-react'

export default function AnimalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAnimal(id), getVisitsByAnimal(id)]).then(([a, v]) => {
      setAnimal(a)
      setVisits(v)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this animal?')) return
    await deleteAnimal(id)
    navigate('/animals')
  }

  if (loading) return (
    <div className="py-20 text-center">
      <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
        <span>Loading animal details...</span>
      </div>
    </div>
  )
  
  if (!animal) return (
    <div className="py-20 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Animal not found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">This animal may have been deleted or doesn't exist.</p>
      <Button onClick={() => navigate('/animals')}>Back to Animals</Button>
    </div>
  )

  const healthColors = {
    healthy: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    sick: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    injured: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    critical: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  const visitTypeIcons = {
    checkup: Activity,
    vaccination: Syringe,
    treatment: Heart,
    sighting: MapPin,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/animals" 
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-600 dark:text-amber-400 font-mono">{animal.tagId}</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{animal.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete} 
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div className={`p-6 ${
          animal.species === 'cat' 
            ? 'bg-gradient-to-r from-orange-100 via-orange-50 to-amber-50 dark:from-orange-900/30 dark:via-orange-900/20 dark:to-amber-900/20' 
            : 'bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-50 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-indigo-900/20'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg ${
              animal.species === 'cat'
                ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white'
                : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'
            }`}>
              {animal.species === 'cat' ? <Cat className="h-12 w-12" /> : <Dog className="h-12 w-12" />}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  label={animal.healthStatus} 
                  variant={animal.healthStatus === 'healthy' ? 'success' : animal.healthStatus === 'critical' ? 'danger' : 'warning'} 
                />
                <Badge 
                  label={animal.vaccinated ? '✓ Vaccinated' : 'Not Vaccinated'} 
                  variant={animal.vaccinated ? 'success' : 'default'} 
                />
                <Badge 
                  label={animal.neutered ? '✓ Neutered' : 'Not Neutered'} 
                  variant={animal.neutered ? 'info' : 'default'} 
                />
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <span className="capitalize">{animal.species}</span> • {animal.sex}
                </span>
                {animal.estimatedAge && (
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    ~{animal.estimatedAge} years old
                  </span>
                )}
                {animal.location && (
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {animal.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard 
          icon={<Activity className="h-5 w-5" />} 
          label="Total Visits" 
          value={visits.length} 
          color="amber"
        />
        <StatCard 
          icon={<Syringe className="h-5 w-5" />} 
          label="Vaccinated" 
          value={animal.vaccinated ? 'Yes' : 'No'} 
          color={animal.vaccinated ? 'emerald' : 'gray'}
        />
        <StatCard 
          icon={<Heart className="h-5 w-5" />} 
          label="Health" 
          value={animal.healthStatus} 
          color={animal.healthStatus === 'healthy' ? 'emerald' : 'amber'}
        />
        <StatCard 
          icon={<Calendar className="h-5 w-5" />} 
          label="Registered" 
          value={new Date(animal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
          color="blue"
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Physical Details */}
        <Card>
          <CardHeader title="Physical Details" />
          <CardBody className="space-y-4">
            <DetailRow icon={<Palette className="h-4 w-4" />} label="Color/Markings" value={animal.color || 'Not specified'} />
            <DetailRow icon={<Scale className="h-4 w-4" />} label="Weight" value={animal.weight ? `${animal.weight} kg` : 'Not measured'} />
            <DetailRow icon={<Clock className="h-4 w-4" />} label="Estimated Age" value={animal.estimatedAge ? `${animal.estimatedAge} years` : 'Unknown'} />
            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Common Location" value={animal.location || 'Not specified'} />
          </CardBody>
        </Card>

        {/* Health Status */}
        <Card>
          <CardHeader title="Health Information" />
          <CardBody className="space-y-4">
            <div className={`p-4 rounded-xl border ${healthColors[animal.healthStatus]}`}>
              <div className="flex items-center gap-3">
                {animal.healthStatus === 'healthy' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertCircle className="h-6 w-6" />
                )}
                <div>
                  <p className="font-semibold capitalize">{animal.healthStatus}</p>
                  <p className="text-sm opacity-80">Current health status</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${animal.vaccinated ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <Syringe className={`h-5 w-5 mb-1 ${animal.vaccinated ? 'text-emerald-500' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${animal.vaccinated ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500'}`}>
                  {animal.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${animal.neutered ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <Scissors className={`h-5 w-5 mb-1 ${animal.neutered ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${animal.neutered ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500'}`}>
                  {animal.neutered ? 'Neutered/Spayed' : 'Not Neutered'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Notes */}
      {animal.notes && (
        <Card>
          <CardHeader title="Notes & Observations" />
          <CardBody>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{animal.notes}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Visits Timeline */}
      <Card>
        <CardHeader
          title={`Visit History (${visits.length})`}
          action={
            <Button size="sm" onClick={() => navigate(`/visits/add?animalId=${id}`)}>
              <Plus className="h-4 w-4 mr-1" /> Add Visit
            </Button>
          }
        />
        <CardBody>
          {visits.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">No visits recorded</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start tracking this animal's health by adding the first visit.
              </p>
              <Button onClick={() => navigate(`/visits/add?animalId=${id}`)}>
                <Plus className="h-4 w-4 mr-1" /> Add First Visit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((v, index) => {
                const VisitIcon = visitTypeIcons[v.visitType] || Activity
                return (
                  <div 
                    key={v.id} 
                    className="relative flex gap-4 pb-4 last:pb-0"
                  >
                    {/* Timeline line */}
                    {index < visits.length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-2rem)] bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <VisitIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <Badge label={v.visitType} variant="info" />
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(v.createdAt)}
                        </span>
                      </div>
                      {v.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{v.notes}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
    gray: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30',
  }

  return (
    <Card>
      <CardBody className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className={`font-bold capitalize ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </CardBody>
    </Card>
  )
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <span className="text-gray-400">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  )
}

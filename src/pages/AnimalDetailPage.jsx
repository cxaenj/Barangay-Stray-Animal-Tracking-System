import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAnimal, deleteAnimal } from '@/lib/animals'
import { getVisitsByAnimal } from '@/lib/visits'
import { formatDateTime } from '@/lib/utils'
import { ChevronLeft, Trash2, Plus } from 'lucide-react'

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

  if (loading) return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>
  if (!animal) return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Animal not found</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/animals" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{animal.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{animal.tagId}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      {/* Details */}
      <Card>
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Species" value={animal.species} />
          <Detail label="Sex" value={animal.sex} />
          <Detail label="Color" value={animal.color || '—'} />
          <Detail label="Estimated Age" value={animal.estimatedAge ? `${animal.estimatedAge} yrs` : '—'} />
          <Detail label="Weight" value={animal.weight ? `${animal.weight} kg` : '—'} />
          <Detail label="Location" value={animal.location || '—'} />
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Health</span>
            <div className="mt-1">
              <Badge label={animal.healthStatus} variant={animal.healthStatus === 'healthy' ? 'success' : 'warning'} />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vaccinated</span>
            <div className="mt-1">
              <Badge label={animal.vaccinated ? 'Yes' : 'No'} variant={animal.vaccinated ? 'success' : 'default'} />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Neutered</span>
            <div className="mt-1">
              <Badge label={animal.neutered ? 'Yes' : 'No'} variant={animal.neutered ? 'success' : 'default'} />
            </div>
          </div>
        </CardBody>
      </Card>

      {animal.notes && (
        <Card>
          <CardHeader title="Notes" />
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{animal.notes}</p>
          </CardBody>
        </Card>
      )}

      {/* Visits */}
      <Card>
        <CardHeader
          title="Visit History"
          action={
            <Button size="sm" onClick={() => navigate(`/visits/add?animalId=${id}`)}>
              <Plus className="h-4 w-4 mr-1" /> Add Visit
            </Button>
          }
        />
        <CardBody>
          {visits.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No visits recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {visits.map((v) => (
                <div key={v.id} className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <Badge label={v.visitType} variant="info" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDateTime(v.createdAt)}</span>
                  </div>
                  {v.notes && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{v.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
      <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{value}</p>
    </div>
  )
}

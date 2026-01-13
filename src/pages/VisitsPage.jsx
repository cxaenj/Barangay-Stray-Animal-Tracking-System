import { useEffect, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAnimals } from '@/lib/animals'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function VisitsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimals().then((data) => {
      setAnimals(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Visits</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Select an animal to view or add visit records
        </p>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {animals.map((a) => (
              <Link
                key={a.id}
                to={`/animals/${a.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{a.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.tagId} • {a.species}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge label={a.healthStatus} variant={a.healthStatus === 'healthy' ? 'success' : 'warning'} />
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
            {animals.length === 0 && (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                No animals registered yet.
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

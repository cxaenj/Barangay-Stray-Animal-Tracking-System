import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { addAnimal } from '@/lib/animals'
import { useAuthStore } from '@/store/authStore'
import { generateTagId } from '@/lib/utils'

export default function AddAnimalPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    tagId: generateTagId('cat'),
    name: '',
    species: 'cat',
    sex: 'unknown',
    location: '',
    healthStatus: 'healthy',
    vaccinated: false,
    neutered: false,
    estimatedAge: '',
    weight: '',
    color: '',
    notes: ''
  })

  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await addAnimal({
        ...form,
        estimatedAge: form.estimatedAge ? Number(form.estimatedAge) : null,
        weight: form.weight ? Number(form.weight) : null,
        createdBy: user?.uid || ''
      })
      navigate('/animals')
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Animal</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader title="Basic Information" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Input label="Tag ID" value={form.tagId} onChange={(e) => update('tagId', e.target.value)} required />
            <Input label="Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Species</label>
              <div className="flex gap-2">
                {['cat', 'dog'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      update('species', s)
                      update('tagId', generateTagId(s))
                    }}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      form.species === s 
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Sex</label>
              <select
                value={form.sex}
                onChange={(e) => update('sex', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Physical */}
        <Card>
          <CardHeader title="Physical Details" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Input label="Color" value={form.color} onChange={(e) => update('color', e.target.value)} />
            <Input label="Estimated Age (years)" type="number" value={form.estimatedAge} onChange={(e) => update('estimatedAge', e.target.value)} />
            <Input label="Weight (kg)" type="number" step="0.1" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
            <Input label="Location" value={form.location} onChange={(e) => update('location', e.target.value)} />
          </CardBody>
        </Card>

        {/* Health */}
        <Card>
          <CardHeader title="Health Status" />
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {['healthy', 'sick', 'injured', 'critical'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update('healthStatus', s)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      form.healthStatus === s 
                        ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.vaccinated} 
                  onChange={(e) => update('vaccinated', e.target.checked)} 
                  className="rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Vaccinated</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.neutered} 
                  onChange={(e) => update('neutered', e.target.checked)} 
                  className="rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500" 
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Neutered</span>
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader title="Notes" />
          <CardBody>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              placeholder="Additional notes..."
            />
          </CardBody>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/animals')} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button type="submit" disabled={busy} className="flex-1 sm:flex-none">
            {busy ? 'Saving...' : 'Save Animal'}
          </Button>
        </div>
      </form>
    </div>
  )
}

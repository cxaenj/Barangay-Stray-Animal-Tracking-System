import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { addVisit } from '@/lib/visits'
import { updateAnimal } from '@/lib/animals'
import { useAuthStore } from '@/store/authStore'

const visitTypes = [
  { key: 'checkup', label: 'General Checkup', icon: '🩺' },
  { key: 'vaccination', label: 'Vaccination', icon: '💉' },
  { key: 'neutering', label: 'Neutering/Spaying', icon: '✂️' },
  { key: 'treatment', label: 'Treatment', icon: '💊' },
  { key: 'followup', label: 'Follow-up', icon: '📋' },
]

export default function AddVisitPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const animalId = params.get('animalId')
  const { user } = useAuthStore()

  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    visitType: 'checkup',
    diagnosis: '',
    treatment: '',
    notes: '',
    vaccinated: false,
    neutered: false
  })

  const update = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!animalId) return alert('Animal ID is required')
    setBusy(true)
    try {
      await addVisit({
        animalId,
        visitType: form.visitType,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        notes: form.notes,
        vaccinated: form.vaccinated,
        neutered: form.neutered,
        recordedBy: user?.uid || ''
      })

      // Update animal status if vaccinated/neutered changed
      const updates = {}
      if (form.vaccinated) updates.vaccinated = true
      if (form.neutered) updates.neutered = true
      if (Object.keys(updates).length > 0) {
        await updateAnimal(animalId, updates)
      }

      navigate(`/animals/${animalId}`)
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Record Visit</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader title="Visit Type" />
          <CardBody className="grid gap-2">
            {visitTypes.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => update('visitType', t.key)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  form.visitType === t.key 
                    ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Medical Details" />
          <CardBody className="space-y-4">
            <Input label="Diagnosis" value={form.diagnosis} onChange={(e) => update('diagnosis', e.target.value)} />
            <Input label="Treatment Given" value={form.treatment} onChange={(e) => update('treatment', e.target.value)} />
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
          <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button type="submit" disabled={busy} className="flex-1 sm:flex-none">
            {busy ? 'Saving...' : 'Save Visit'}
          </Button>
        </div>
      </form>
    </div>
  )
}

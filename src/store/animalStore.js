import { create } from 'zustand'

const defaultFilter = {
  species: 'all',
  healthStatus: 'all',
  search: '',
}

export const useAnimalStore = create((set, get) => ({
  animals: [],
  filter: defaultFilter,
  setAnimals: (animals) => set({ animals }),
  setFilter: (updates) => set({ filter: { ...get().filter, ...updates } }),
  resetFilter: () => set({ filter: defaultFilter }),
  filteredAnimals: () => {
    const { animals, filter } = get()
    return animals.filter((a) => {
      const matchSpecies = filter.species === 'all' || a.species === filter.species
      const matchHealth = filter.healthStatus === 'all' || a.healthStatus === filter.healthStatus
      const matchSearch =
        !filter.search ||
        a.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
        a.tagId?.toLowerCase().includes(filter.search.toLowerCase())
      return matchSpecies && matchHealth && matchSearch
    })
  }
}))

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { petKeys, useCreatePet, useDeletePet, useListPets } from '../../generated/hooks.js'

export function App() {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')

  const queryClient = useQueryClient()
  const { data: pets = [], isLoading } = useListPets()
  const createPet = useCreatePet({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: petKeys.all() })
    },
  })
  const deletePet = useDeletePet({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: petKeys.all() })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !species.trim()) return
    createPet.mutate({ name: name.trim(), species: species.trim() })
    setName('')
    setSpecies('')
  }

  return (
    <main>
      <h1>Petstore</h1>

      <form onSubmit={handleSubmit}>
        <input
          data-testid="pet-name"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          data-testid="pet-species"
          placeholder="Species"
          value={species}
          onChange={e => setSpecies(e.target.value)}
        />
        <button data-testid="add-pet" type="submit">Add Pet</button>
      </form>

      {isLoading && <p>Loading...</p>}

      {!isLoading && pets.length === 0 && (
        <p data-testid="empty-state">No pets yet. Add your first pet above!</p>
      )}

      <ul>
        {pets.map(pet => (
          <li key={pet.id} data-testid="pet-row">
            <span data-testid="pet-name-display">{pet.name}</span>
            {' — '}
            <span data-testid="pet-species-display">{pet.species}</span>
            <button
              data-testid="delete-pet"
              onClick={() => deletePet.mutate(pet.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

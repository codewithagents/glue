import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError } from '../../generated/client.js'
import { petKeys, useCreatePet, useDeletePet, useListPets } from '../../generated/hooks.js'

type ZodIssue = { path: (string | number)[]; message: string }

function extractFieldErrors(issues: ZodIssue[]): { name?: string; species?: string } {
  const errors: { name?: string; species?: string } = {}
  for (const issue of issues) {
    const field = issue.path[0]
    if (field === 'name') errors.name = issue.message
    if (field === 'species') errors.species = issue.message
  }
  return errors
}

function parseValidationErrors(error: unknown): { name?: string; species?: string } {
  // Handle server-side 422 response (ApiError with Zod issues in body)
  if (error instanceof ApiError && error.status === 422) {
    const body = error.body as { issues?: ZodIssue[] }
    if (Array.isArray(body?.issues)) return extractFieldErrors(body.issues)
  }
  // Handle client-side ZodError (generated client validates before the request fires)
  if (
    error != null &&
    typeof error === 'object' &&
    'issues' in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    return extractFieldErrors((error as { issues: ZodIssue[] }).issues)
  }
  return {}
}

export function App() {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; species?: string }>({})

  const queryClient = useQueryClient()
  const { data: pets = [], isLoading } = useListPets()
  const createPet = useCreatePet({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: petKeys.all() })
      setName('')
      setSpecies('')
      setFieldErrors({})
    },
    onError: (error) => {
      setFieldErrors(parseValidationErrors(error))
    },
  })
  const deletePet = useDeletePet({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: petKeys.all() })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    createPet.mutate({ name: name.trim(), species: species.trim() })
  }

  return (
    <main>
      <h1>Petstore</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            data-testid="pet-name"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {fieldErrors.name && <span data-testid="pet-name-error">{fieldErrors.name}</span>}
        </div>
        <div>
          <input
            data-testid="pet-species"
            placeholder="Species"
            value={species}
            onChange={e => setSpecies(e.target.value)}
          />
          {fieldErrors.species && <span data-testid="pet-species-error">{fieldErrors.species}</span>}
        </div>
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

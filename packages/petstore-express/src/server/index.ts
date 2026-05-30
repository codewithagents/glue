import express from 'express'
import { createRouter } from '../../generated/router.js'
import { petService } from './petService.js'

const app = express()
app.use(express.json())
app.use('/api', createRouter(petService))

const PORT = process.env.PORT ?? 3002
app.listen(PORT, () => console.log(`petstore-express running on http://localhost:${PORT}`))

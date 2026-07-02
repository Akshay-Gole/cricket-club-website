import cors from 'cors'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import healthRoutes from './routes/health.routes.js'
import playerRoutes from './routes/player.routes.js'

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api', playerRoutes)

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  console.error(error)

  res.status(500).json({
    message: 'Something went wrong',
  })
})

app.use((_req, res) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

export default app

declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        id: string
        email: string
      }
    }
  }
}

export {}

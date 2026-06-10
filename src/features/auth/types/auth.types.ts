export interface User {
  id: string
  email: string
  name: string
  role: 'admin'
}

export interface LoginDto {
  email: string
  password: string
}

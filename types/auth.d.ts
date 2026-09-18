declare module '#auth-utils' {
  interface User {
    id: string
    name: string
    email?: string
    avatarUrl?: string
    isAdmin?: boolean
  }
}

export {}

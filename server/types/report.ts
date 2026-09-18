export interface Report {
  id: string
  listingId: string
  reason: string
  reporterId: string
  createdAt: string
  status: 'open' | 'resolved'
}

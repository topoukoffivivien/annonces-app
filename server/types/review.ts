export interface Review {
  id: string
  sellerId: string
  authorId: string
  authorName: string
  rating: number // 1 à 5
  comment: string
  createdAt: string
}

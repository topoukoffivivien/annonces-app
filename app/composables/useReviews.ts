export interface Review {
  id: string
  sellerId: string
  authorId: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export function useReviews() {
  async function fetchReviews(sellerId: string) {
    return await $fetch<{ reviews: Review[]; average: number; count: number }>(`/api/reviews/${sellerId}`)
  }

  async function submitReview(sellerId: string, rating: number, comment: string) {
    return await $fetch('/api/reviews', { method: 'POST', body: { sellerId, rating, comment } })
  }

  return { fetchReviews, submitReview }
}

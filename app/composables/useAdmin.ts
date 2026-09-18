import type { Listing } from './useListings'

export interface ReportWithListing {
  id: string
  listingId: string
  reason: string
  reporterId: string
  createdAt: string
  status: 'open' | 'resolved'
  listing: Listing | null
}

export function useAdmin() {
  async function fetchRejectedListings() {
    return await $fetch<{ rejected: Listing[] }>('/api/admin/listings')
  }

  async function approveListing(id: string) {
    return await $fetch<{ listing: Listing }>(`/api/admin/listings/${id}/approve`, { method: 'POST' })
  }

  async function deleteListingAdmin(id: string) {
    return await $fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
  }

  async function fetchReports() {
    return await $fetch<{ reports: ReportWithListing[] }>('/api/admin/reports')
  }

  async function resolveReport(id: string) {
    return await $fetch(`/api/admin/reports/${id}/resolve`, { method: 'POST' })
  }

  return { fetchRejectedListings, approveListing, deleteListingAdmin, fetchReports, resolveReport }
}

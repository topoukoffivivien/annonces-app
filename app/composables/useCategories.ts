export interface Category {
  slug: string
  name: string
  icon: string
}

export function useCategories() {
  const categories: Category[] = [
    { slug: 'vehicules', name: 'Véhicules', icon: 'car' },
    { slug: 'immobilier', name: 'Immobilier', icon: 'home' },
    { slug: 'electronique', name: 'Électronique', icon: 'smartphone' },
    { slug: 'mode-et-beaute', name: 'Mode & Beauté', icon: 'shirt' },
    { slug: 'emplois', name: 'Emplois', icon: 'briefcase' }
  ]
  const cities = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié']

  function categoryName(slug: string) {
    return categories.find(c => c.slug === slug)?.name || slug
  }

  function categoryIcon(slug: string) {
    return categories.find(c => c.slug === slug)?.icon || 'question'
  }

  return { categories, cities, categoryName, categoryIcon }
}
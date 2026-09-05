export interface Category {
  slug: string
  name: string
}

export function useCategories() {
  const categories: Category[] = [
    { slug: 'vehicules', name: 'Véhicules' },
    { slug: 'immobilier', name: 'Immobilier' },
    { slug: 'electronique', name: 'Électronique' },
    { slug: 'mode-et-beaute', name: 'Mode & Beauté' },
    { slug: 'emplois', name: 'Emplois' }
  ]
  const cities = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié']

  function categoryName(slug: string) {
    return categories.find(c => c.slug === slug)?.name || slug
  }

  return { categories, cities, categoryName }
}
export const roomLabels: Record<string, string> = {
  living: 'Living spaces', bedroom: 'Bedrooms', kitchen: 'Kitchens', dining: 'Dining',
  bathroom: 'Bathrooms', pooja: 'Pooja spaces', office: 'Offices', reception: 'Reception',
  conference: 'Meeting rooms', salon: 'Studios', terrace: 'Terraces', landscape: 'Landscape',
  exterior: 'Exteriors', exhibition: 'Exhibition spaces', hall: 'Halls', wardrobe: 'Dressing spaces', detail: 'Details',
};
export const moodLabels: Record<string, string> = {
  'warm-neutrals': 'Warm neutrals', 'light-airy': 'Light & airy', 'green-botanical': 'Green tones',
  'blue-cool': 'Blue & cool', 'pastel-soft': 'Soft pastels', 'dark-moody': 'Dark & moody',
  'bold-colour': 'Bold colour', monochrome: 'Monochrome',
};
export const moodColours: Record<string, string> = {
  'warm-neutrals': '#AA9580', 'light-airy': '#E5E5D9', 'green-botanical': '#7C8C72',
  'blue-cool': '#6B8793', 'pastel-soft': '#D9BAB6', 'dark-moody': '#4B4D48',
  'bold-colour': '#BE9852', monochrome: '#999A96',
};
export const conceptLabels: Record<string, string> = {
  'open-plan': 'Open-plan living', 'layered-lighting': 'Layered lighting', 'built-in-storage': 'Built-in storage',
  'geometric-detail': 'Geometric details', 'curved-forms': 'Curved forms', biophilic: 'Planting',
  'modern-minimal': 'Modern simplicity', 'decorative-classic': 'Decorative details',
  'material-contrast': 'Material contrasts', 'workspace-zoning': 'Workspace zoning',
};
export const categories = ['Residential', 'Commercial', 'Workspaces', 'Landscape / Outdoor'];

export interface Filters { view: 'projects' | 'rooms'; categories: string[]; rooms: string[]; moods: string[]; concepts: string[] }
export const emptyFilters: Filters = { view: 'projects', categories: [], rooms: [], moods: [], concepts: [] };

export function parseFilters(search: string): Filters {
  const query = new URLSearchParams(search);
  const valid = (key: string, values: string[]) => [...new Set(query.getAll(key).filter(value => values.includes(value)))];
  return {
    view: query.get('view') === 'rooms' ? 'rooms' : 'projects',
    categories: valid('category', categories), rooms: valid('room', Object.keys(roomLabels)),
    moods: valid('mood', Object.keys(moodLabels)), concepts: valid('concept', Object.keys(conceptLabels)),
  };
}

export function serializeFilters(filters: Filters): string {
  const query = new URLSearchParams();
  if (filters.view === 'rooms') query.set('view', 'rooms');
  for (const [key, values] of [['category', filters.categories], ['room', filters.rooms], ['mood', filters.moods], ['concept', filters.concepts]] as const) {
    for (const value of values) query.append(key, value);
  }
  return query.size ? '?' + query.toString() : '';
}

export function filterImages<T extends { rooms: string[]; moods: string[]; concepts: string[] }>(images: T[], filters: Filters): T[] {
  return images.filter(image => (['rooms', 'moods', 'concepts'] as const).every(facet =>
    !filters[facet].length || filters[facet].some(value => image[facet].includes(value))));
}

export interface DiscoveryItem { category: string; rooms: string[]; moods: string[]; concepts: string[] }
export type Facet = 'categories' | 'rooms' | 'moods' | 'concepts';

export function matchingItems<T extends DiscoveryItem>(items: T[], filters: Filters): T[] {
  return filterImages(items.filter(item => !filters.categories.length || filters.categories.includes(item.category)), filters);
}

export function availableOptions(items: DiscoveryItem[], filters: Filters, facet: Facet): Set<string> {
  const candidates = matchingItems(items, { ...filters, [facet]: [] });
  return new Set(candidates.flatMap(item => facet === 'categories' ? [item.category] : item[facet]));
}

export function normaliseFilters(items: DiscoveryItem[], requested: Filters): Filters {
  const result: Filters = { ...emptyFilters, view: requested.view };
  const facets: Facet[] = requested.view === 'projects' ? ['categories'] : ['categories', 'rooms', 'moods', 'concepts'];
  for (const facet of facets) {
    const available = availableOptions(items, result, facet);
    result[facet] = requested[facet].filter(value => available.has(value));
  }
  for (const facet of facets) {
    const available = availableOptions(items, result, facet);
    result[facet] = result[facet].filter(value => available.has(value));
  }
  return result;
}


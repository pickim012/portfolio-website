export type ExhibitionKind = 'solo' | 'group'

export type Route =
  | { view: 'home' }
  | { view: 'exhibitions'; kind: ExhibitionKind }
  | { view: 'paintings'; year: string }
  | { view: 'texts' }
  | { view: 'cv' }
  | { view: 'contacts' }

// A stable key used for animation transitions and equality checks.
export function routeKey(route: Route): string {
  switch (route.view) {
    case 'paintings':
      return `paintings-${route.year}`
    case 'exhibitions':
      return `exhibitions-${route.kind}`
    default:
      return route.view
  }
}

// Breadcrumb segments shown in the top-right navigator.
export function breadcrumb(route: Route): string[] {
  switch (route.view) {
    case 'home':
      return ['Home']
    case 'exhibitions':
      return ['Works', 'Exhibitions', route.kind === 'solo' ? 'Solo' : 'Group']
    case 'paintings':
      return ['Works', 'Paintings', route.year]
    case 'texts':
      return ['Works', 'Texts']
    case 'cv':
      return ['About', 'CV']
    case 'contacts':
      return ['About', 'Contacts']
  }
}

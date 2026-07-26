export type Route =
  | { view: 'home' }
  | { view: 'exhibitions' }
  | { view: 'paintings'; year: string }
  | { view: 'cv' }
  | { view: 'contacts' }

// A stable key used for animation transitions and equality checks.
export function routeKey(route: Route): string {
  switch (route.view) {
    case 'paintings':
      return `paintings-${route.year}`
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
      return ['Works', 'Exhibitions']
    case 'paintings':
      return ['Works', 'Paintings', route.year]
    case 'cv':
      return ['About', 'CV']
    case 'contacts':
      return ['About', 'Contacts']
  }
}

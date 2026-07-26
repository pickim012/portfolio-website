// Central content store — CMS-ready.
// Add new works, exhibitions, and CV entries here without touching components.

export const artist = {
  name: {
    first: 'Kim,',
    last: 'Yeadam',
  },
  intro: [
    'Kim, Yeadam is a contemporary painter based in Seoul.',
    'Her work explores stillness, memory, and the quiet weight of color — layered surfaces that ask to be looked at slowly.',
  ],
}

export type Exhibition = {
  id: string
  title: string
  type: string
  date: string
  gallery: string
  address: string
  images: { src: string; alt: string }[]
}

export const exhibitions: Exhibition[] = [
  {
    id: 'quiet-fields',
    title: 'Quiet Fields',
    type: 'Solo Exhibition',
    date: '4 March – 12 April 2026',
    gallery: 'Baik Art',
    address: '58 Samcheong-ro, Jongno-gu, Seoul',
    images: [
      { src: '/exhibitions/ex1-01.png', alt: 'Installation view of Quiet Fields, wide gallery hall' },
      { src: '/exhibitions/ex1-02.png', alt: 'Single large painting on a white wall with bench' },
    ],
  },
  {
    id: 'between-surfaces',
    title: 'Between Surfaces',
    type: 'Group Exhibition',
    date: '18 September – 30 October 2025',
    gallery: 'Kukje Gallery',
    address: '54 Samcheong-ro, Jongno-gu, Seoul',
    images: [
      { src: '/exhibitions/ex2-01.png', alt: 'Group exhibition view with several paintings under skylight' },
    ],
  },
]

export type Painting = {
  id: string
  title: string
  medium: string
  size: string
  date: string
  image: { src: string; alt: string }
}

export const paintingsByYear: Record<string, Painting[]> = {
  '2026': [
    {
      id: 'p-2026-1',
      title: 'Sage Interval',
      medium: 'Oil on canvas',
      size: '162 × 130 cm',
      date: '2026',
      image: { src: '/paintings/2026-01.png', alt: 'Sage green and off-white abstract color field painting' },
    },
    {
      id: 'p-2026-2',
      title: 'Low Horizon',
      medium: 'Oil on linen',
      size: '112 × 145 cm',
      date: '2026',
      image: { src: '/paintings/2026-02.png', alt: 'Ochre and pale grey horizontal band abstract painting' },
    },
  ],
  '2025': [
    {
      id: 'p-2025-1',
      title: 'Terracotta Hours',
      medium: 'Oil on canvas',
      size: '150 × 120 cm',
      date: '2025',
      image: { src: '/paintings/2025-01.png', alt: 'Terracotta and cream soft abstract painting' },
    },
    {
      id: 'p-2025-2',
      title: 'Still Air',
      medium: 'Acrylic on canvas',
      size: '120 × 120 cm',
      date: '2025',
      image: { src: '/paintings/2025-02.png', alt: 'Pale blue-grey and white minimal color field painting' },
    },
  ],
  '2024': [
    {
      id: 'p-2024-1',
      title: 'Sand Passage',
      medium: 'Oil on canvas',
      size: '160 × 128 cm',
      date: '2024',
      image: { src: '/paintings/2024-01.png', alt: 'Warm sand and charcoal grey vertical abstract painting' },
    },
    {
      id: 'p-2024-2',
      title: 'Olive Line',
      medium: 'Oil on linen',
      size: '110 × 150 cm',
      date: '2024',
      image: { src: '/paintings/2024-02.png', alt: 'Muted olive and bone white abstract landscape painting' },
    },
  ],
  '2023': [
    {
      id: 'p-2023-1',
      title: 'Rose Ground',
      medium: 'Oil on canvas',
      size: '145 × 115 cm',
      date: '2023',
      image: { src: '/paintings/2023-01.png', alt: 'Rose beige and pale grey layered abstract painting' },
    },
    {
      id: 'p-2023-2',
      title: 'Slate Study',
      medium: 'Acrylic on canvas',
      size: '120 × 120 cm',
      date: '2023',
      image: { src: '/paintings/2023-02.png', alt: 'Slate grey and cream minimal color field painting' },
    },
  ],
}

export const paintingYears = ['2026', '2025', '2024', '2023'] as const

export type CVEntry = {
  year: string
  items: string[]
}

export const cv: CVEntry[] = [
  {
    year: '2026',
    items: ['Quiet Fields, Solo Exhibition, Baik Art, Seoul'],
  },
  {
    year: '2025',
    items: [
      'Between Surfaces, Group Exhibition, Kukje Gallery, Seoul',
      'Slow Light, Two-person Exhibition, Gallery Hyundai, Seoul',
    ],
  },
  {
    year: '2024',
    items: ['The Long Afternoon, Solo Exhibition, PKM Gallery, Seoul'],
  },
  {
    year: '2023',
    items: [
      'New Contemporaries, Group Exhibition, SeMA, Seoul',
      'MFA, Painting, Hongik University, Seoul',
    ],
  },
]

export const contacts = [
  { label: 'Email', value: 'studio@kimyeadam.com', href: 'mailto:studio@kimyeadam.com' },
  { label: 'Instagram', value: '@kim.yeadam', href: 'https://instagram.com/kim.yeadam' },
  { label: 'Website', value: 'kimyeadam.com', href: 'https://kimyeadam.com' },
]

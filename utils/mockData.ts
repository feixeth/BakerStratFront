export type MapSlug = 'dust2' | 'mirage' | 'inferno' | 'anubis' | 'nuke' | 'ancient' | 'vertigo'

export interface StratSection {
  id: string
  type: 'setup' | 'text'
  title: string
  content: string
  setup?: { player: string; role: string }[]
}

export interface Strat {
  id: string
  mapSlug: MapSlug
  title: string
  tags: string[]
  version: number
  lastEdit: string
  author: string
  sections: StratSection[]
  cached: boolean
}

export interface MapInfo {
  slug: MapSlug
  name: string
  stratCount: number
  lastUpdated: string
  cached: boolean
  strats: Strat[]
}

export interface TeamMember {
  id: string
  pseudo: string
  email: string
  role: 'coach' | 'igl' | 'player'
  joinDate: string
}

export interface Invitation {
  id: string
  email: string
  role: 'coach' | 'igl' | 'player'
  sentAt: string
}

const mapStratData: Record<MapSlug, Strat[]> = {
  dust2: [
    {
      id: 's-d2-1',
      mapSlug: 'dust2',
      title: 'A Site Execution — Default',
      tags: ['execute', 'A-site', 'defaults'],
      version: 3,
      lastEdit: '2025-03-12',
      author: 'zonic',
      cached: true,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Long A, hold angle' },
            { player: 'blameF', role: 'Catwalk support' },
            { player: 'Magisk', role: 'Short, flash for site' },
            { player: 'Xyp9x', role: 'B tunnels, late rotate' },
            { player: 'gla1ve', role: 'Mid IGL, call timing' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Execution Plan',
          content: '## Execution\n**Step 1:** device smokes off CT from Long.\n\n**Step 2:** Magisk flashes short, **blameF** pushes cat.\n\n**Step 3:** gla1ve calls push at 1:20.\n\n*If enemy rotates from B, Xyp9x flanks.*',
        },
      ],
    },
    {
      id: 's-d2-2',
      mapSlug: 'dust2',
      title: 'B Rush — Force Buy',
      tags: ['rush', 'B-site', 'eco'],
      version: 2,
      lastEdit: '2025-03-08',
      author: 'gla1ve',
      cached: true,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'B tunnels entry' },
            { player: 'blameF', role: 'Trade fragger' },
            { player: 'Magisk', role: 'Smoke platform, support' },
            { player: 'Xyp9x', role: 'Flash + follow' },
            { player: 'gla1ve', role: 'Hold mid, late join' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Rush Plan',
          content: '## Plan\nAll 5 push B tunnels at round start.\n\n- **device** entries first\n- **Xyp9x** flashes over wall\n- If site is clear, **Magisk** plants back of plat\n\n*Fallback to short if B is stacked.*',
        },
      ],
    },
  ],
  mirage: [
    {
      id: 's-mir-1',
      mapSlug: 'mirage',
      title: 'A Take — Mid Control',
      tags: ['execute', 'A-site', 'mid-control'],
      version: 4,
      lastEdit: '2025-03-10',
      author: 'zonic',
      cached: true,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Connector, watch mid' },
            { player: 'blameF', role: 'A ramp, entry' },
            { player: 'Magisk', role: 'Palace flash support' },
            { player: 'Xyp9x', role: 'Underpass, lurk' },
            { player: 'gla1ve', role: 'Top mid, IGL' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Mid to A Execute',
          content: '## Mid Control\n**gla1ve** smokes window, **device** holds connector.\n\n## A Execute\n- **blameF** entries ramp at 1:15\n- **Magisk** flashes palace\n- **Xyp9x** rotates from underpass for flank\n\n*If mid is lost, fall back to A default.*',
        },
      ],
    },
    {
      id: 's-mir-2',
      mapSlug: 'mirage',
      title: 'B Fake + A Hit',
      tags: ['fake', 'B-site', 'A-site'],
      version: 1,
      lastEdit: '2025-03-05',
      author: 'gla1ve',
      cached: false,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Apps, make noise' },
            { player: 'blameF', role: 'A ramp, real entry' },
            { player: 'Magisk', role: 'Palace, flash' },
            { player: 'Xyp9x', role: 'B short, fake' },
            { player: 'gla1ve', role: 'Mid, call rotate' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Fake Plan',
          content: '## Fake B\n**Xyp9x** makes noise at B short, throws molotov.\n\n## Real A Hit\n- At 1:00, **blameF** + **Magisk** hit A\n- **device** rotates from apps to join\n\n*Fake must look real — commit 2 to B.*',
        },
      ],
    },
  ],
  inferno: [
    {
      id: 's-inf-1',
      mapSlug: 'inferno',
      title: 'B Site — Banana Control',
      tags: ['execute', 'B-site', 'banana'],
      version: 2,
      lastEdit: '2025-03-11',
      author: 'zonic',
      cached: true,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Banana entry' },
            { player: 'blameF', role: 'Sandbags, support' },
            { player: 'Magisk', role: 'CT smoke + flash' },
            { player: 'Xyp9x', role: 'A pit, hold rotation' },
            { player: 'gla1ve', role: 'Second mid, IGL' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Banana Execute',
          content: '## Banana Control\n**device** + **blameF** take banana at 0:30.\n\n## Execute\n- **Magisk** smokes CT, flashes coffins\n- **device** entries site\n- **Xyp9x** holds A for late rotate\n\n*If banana lost, default to A split.*',
        },
      ],
    },
  ],
  anubis: [
    {
      id: 's-anu-1',
      mapSlug: 'anubis',
      title: 'A Site — Water Push',
      tags: ['execute', 'A-site', 'water'],
      version: 2,
      lastEdit: '2025-03-09',
      author: 'gla1ve',
      cached: true,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Water entry' },
            { player: 'blameF', role: 'Connector support' },
            { player: 'Magisk', role: 'A main flash' },
            { player: 'Xyp9x', role: 'B hold, late rotate' },
            { player: 'gla1ve', role: 'Mid, IGL' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Water Execute',
          content: '## Setup\n**device** + **blameF** push water at 1:00.\n\n## Hit\n- **Magisk** flashes A main\n- **device** peeks site\n- **gla1ve** joins from mid\n\n*Watch for B push — Xyp9x holds alone.*',
        },
      ],
    },
  ],
  nuke: [
    {
      id: 's-nuke-1',
      mapSlug: 'nuke',
      title: 'Outside — Secret Push',
      tags: ['execute', 'outside', 'secret'],
      version: 3,
      lastEdit: '2025-03-07',
      author: 'zonic',
      cached: false,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Outside, secret' },
            { player: 'blameF', role: 'Garage support' },
            { player: 'Magisk', role: 'Lobby, flash' },
            { player: 'Xyp9x', role: 'Ramp, hold' },
            { player: 'gla1ve', role: 'Yard, IGL' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Outside Plan',
          content: '## Outside Control\n**device** pushes secret at 0:45.\n\n## Execute\n- **gla1ve** smokes big garage\n- **Magisk** flashes from lobby\n- **device** plants lower\n\n*If ramp pushed, Xyp9x calls rotate.*',
        },
      ],
    },
  ],
  ancient: [
    {
      id: 's-anc-1',
      mapSlug: 'ancient',
      title: 'B Site — Cave Split',
      tags: ['execute', 'B-site', 'cave'],
      version: 2,
      lastEdit: '2025-03-06',
      author: 'gla1ve',
      cached: true,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Cave entry' },
            { player: 'blameF', role: 'B main, support' },
            { player: 'Magisk', role: 'Donut flash' },
            { player: 'Xyp9x', role: 'A hold, late rotate' },
            { player: 'gla1ve', role: 'Mid, IGL' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Cave Split',
          content: '## Cave Push\n**device** enters cave at 1:00.\n\n## B Execute\n- **blameF** pushes B main\n- **Magisk** flashes from donut\n- **device** comes from cave\n\n*If cave blocked, default to B main only.*',
        },
      ],
    },
  ],
  vertigo: [
    {
      id: 's-ver-1',
      mapSlug: 'vertigo',
      title: 'A Site — Ramp Push',
      tags: ['execute', 'A-site', 'ramp'],
      version: 1,
      lastEdit: '2025-03-04',
      author: 'zonic',
      cached: false,
      sections: [
        {
          id: 'sec-1',
          type: 'setup',
          title: 'Player Setup',
          content: '',
          setup: [
            { player: 'device', role: 'Ramp entry' },
            { player: 'blameF', role: 'A main, support' },
            { player: 'Magisk', role: 'CT flash' },
            { player: 'Xyp9x', role: 'B, hold' },
            { player: 'gla1ve', role: 'Mid stairs, IGL' },
          ],
        },
        {
          id: 'sec-2',
          type: 'text',
          title: 'Ramp Execute',
          content: '## Ramp Control\n**device** + **blameF** take ramp at 0:45.\n\n## Execute\n- **Magisk** smokes CT spawn\n- **device** entries site\n- **gla1ve** joins from stairs\n\n*Watch B — Xyp9x alone.*',
        },
      ],
    },
  ],
}

export const maps: MapInfo[] = [
  { slug: 'dust2', name: 'Dust2', stratCount: 2, lastUpdated: '2025-03-12', cached: true, strats: mapStratData.dust2 },
  { slug: 'mirage', name: 'Mirage', stratCount: 2, lastUpdated: '2025-03-10', cached: true, strats: mapStratData.mirage },
  { slug: 'inferno', name: 'Inferno', stratCount: 1, lastUpdated: '2025-03-11', cached: true, strats: mapStratData.inferno },
  { slug: 'anubis', name: 'Anubis', stratCount: 1, lastUpdated: '2025-03-09', cached: true, strats: mapStratData.anubis },
  { slug: 'nuke', name: 'Nuke', stratCount: 1, lastUpdated: '2025-03-07', cached: false, strats: mapStratData.nuke },
  { slug: 'ancient', name: 'Ancient', stratCount: 1, lastUpdated: '2025-03-06', cached: true, strats: mapStratData.ancient },
  { slug: 'vertigo', name: 'Vertigo', stratCount: 1, lastUpdated: '2025-03-04', cached: false, strats: mapStratData.vertigo },
]

export function getMapBySlug(slug: string): MapInfo | undefined {
  return maps.find((m) => m.slug === slug)
}

export function getStratById(id: string): Strat | undefined {
  for (const m of maps) {
    const s = m.strats.find((s) => s.id === id)
    if (s) return s
  }
  return undefined
}

export function getMapNameBySlug(slug: string): string {
  return getMapBySlug(slug)?.name ?? slug
}

export const teamMembers: TeamMember[] = [
  { id: 'u-1', pseudo: 'zonic', email: 'zonic@astralis.gg', role: 'coach', joinDate: '2024-01-15' },
  { id: 'u-2', pseudo: 'gla1ve', email: 'gla1ve@astralis.gg', role: 'igl', joinDate: '2024-01-15' },
  { id: 'u-3', pseudo: 'device', email: 'device@astralis.gg', role: 'player', joinDate: '2024-02-01' },
]

export const pendingInvitations: Invitation[] = [
  { id: 'inv-1', email: 'Magisk@astralis.gg', role: 'player', sentAt: '2025-03-10' },
]

export const allTags: string[] = [
  'execute', 'A-site', 'B-site', 'rush', 'eco', 'mid-control',
  'fake', 'banana', 'water', 'outside', 'secret', 'cave', 'ramp', 'defaults',
]

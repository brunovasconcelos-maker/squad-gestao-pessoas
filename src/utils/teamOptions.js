import pencilRulerIcon from '../assets/icons/PencilRuler.svg'
import desktopIcon from '../assets/icons/Desktop.svg'
import briefcaseIcon from '../assets/icons/Briefcase.svg'
import vanIcon from '../assets/icons/Van.svg'
import graduationCapIcon from '../assets/icons/GraduationCap.svg'
import arrowUpRightIcon from '../assets/icons/ArrowUpRight.svg'
import usersFourIcon from '../assets/icons/UsersFour.svg'

export const TEAM_COLORS = [
  '#FBEDD0',
  '#E5F4FF',
  '#FDE2E2',
  '#E3F5E1',
  '#EDE3FB',
  '#FFE8D6',
  '#D9F2F0',
  '#FBE0F0',
  '#E0E7FF',
  '#F0E6D9',
]

const DEFAULT_ICON_ID = 'users-four'

export const TEAM_ICON_OPTIONS = [
  { id: 'pencil-ruler', src: pencilRulerIcon, alt: 'Design' },
  { id: 'desktop', src: desktopIcon, alt: 'Tecnologia' },
  { id: 'briefcase', src: briefcaseIcon, alt: 'Negócios' },
  { id: 'van', src: vanIcon, alt: 'Logística' },
  { id: 'graduation-cap', src: graduationCapIcon, alt: 'Pessoas' },
  { id: 'arrow-up-right', src: arrowUpRightIcon, alt: 'Marketing' },
  { id: DEFAULT_ICON_ID, src: usersFourIcon, alt: 'Geral' },
]

const KEYWORD_ICON_MAP = [
  { keywords: ['design'], iconId: 'pencil-ruler' },
  { keywords: ['dev', 'desenvolv', 'engenharia', 'tech', 'tecno'], iconId: 'desktop' },
  { keywords: ['venda', 'comercial', 'sales', 'negocio', 'negóci'], iconId: 'briefcase' },
  { keywords: ['log', 'operac', 'operaç'], iconId: 'van' },
  { keywords: ['rh', 'pessoa', 'people', 'humano', 'gente'], iconId: 'graduation-cap' },
  { keywords: ['marketing', 'growth', 'crescimento'], iconId: 'arrow-up-right' },
]

export function guessTeamIconId(name) {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return DEFAULT_ICON_ID
  const match = KEYWORD_ICON_MAP.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword)),
  )
  return match ? match.iconId : DEFAULT_ICON_ID
}

export function getTeamIconSrc(iconId) {
  const match = TEAM_ICON_OPTIONS.find((option) => option.id === iconId)
  return match ? match.src : usersFourIcon
}

export function pickDefaultColor(usedColors) {
  const usedSet = new Set(usedColors)
  const firstUnused = TEAM_COLORS.find((swatch) => !usedSet.has(swatch))
  return firstUnused ?? TEAM_COLORS[0]
}

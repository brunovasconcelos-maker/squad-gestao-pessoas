import { Cross, Bus, ForkKnife, Barbell, Tooth, Shield, Gift } from '@phosphor-icons/react'

export const BENEFICIO_TYPES = [
  'Plano de Saúde',
  'Vale Transporte',
  'Vale Alimentação',
  'Bem-Estar',
  'Plano Odontológico',
  'Seguro de Vida',
  'Outro',
]

const TYPE_ICON_BY_NAME = {
  'Plano de Saúde': Cross,
  'Vale Transporte': Bus,
  'Vale Alimentação': ForkKnife,
  'Bem-Estar': Barbell,
  'Plano Odontológico': Tooth,
  'Seguro de Vida': Shield,
  Outro: Gift,
}

export function getBeneficioTypeIcon(tipo) {
  return TYPE_ICON_BY_NAME[tipo] ?? Gift
}

export const BENEFICIO_PROVIDER_SUGGESTIONS = {
  'Plano de Saúde': [
    'Alice',
    'Amil',
    'SulAmérica',
    'Bradesco Saúde',
    'Hapvida NotreDame Intermédica',
    'Unimed',
    'Porto Seguro Saúde',
  ],
  'Vale Transporte': ['Bilhete Único', 'Uber', '99', 'VEM'],
  'Vale Alimentação': ['Caju', 'VR', 'Ticket', 'Alelo', 'Swile', 'Pluxee'],
  'Bem-Estar': ['Wellhub', 'TotalPass', 'SmartFit'],
  'Plano Odontológico': [
    'Odontoprev',
    'Amil Dental',
    'SulAmérica Odonto',
    'Bradesco Dental',
    'Uniodonto',
  ],
  'Seguro de Vida': [
    'Porto Seguro Vida',
    'Bradesco Vida e Previdência',
    'MetLife',
    'Prudential',
    'SulAmérica Vida',
  ],
}

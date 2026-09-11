import closeIcon from '../../assets/icons/Close.svg'
import userStickerIcon from '../../assets/illustrations/User.svg'
import badgeStickerIcon from '../../assets/illustrations/Vector.svg'
import plusStickerIcon from '../../assets/illustrations/+.svg'
import teamStickerIcon1 from '../../assets/illustrations/User-1.svg'
import teamStickerIcon2 from '../../assets/illustrations/User-2.svg'
import teamStickerIcon3 from '../../assets/illustrations/User-3.svg'
import briefcaseStickerIcon from '../../assets/illustrations/Briefcase.svg'
import plusAccentStickerIcon from '../../assets/illustrations/+-2.svg'
import giftStickerIcon from '../../assets/illustrations/Vector-1.svg'
import cardStickerIcon from '../../assets/illustrations/Vector-2.svg'
import dollarStickerIcon from '../../assets/illustrations/Vector-3.svg'
import IconButton from '../IconButton.jsx'
import './NovoModal.css'

const YELLOW = '#ffd668'

const SLOTS_BY_COUNT = {
  2: [
    { top: 30, left: 24, size: 84, rotate: -6, z: 1 },
    { top: 66, left: 84, size: 60, rotate: 10, z: 2 },
  ],
  3: [
    { top: 18, left: 18, size: 64, rotate: -10, z: 1 },
    { top: 54, left: 62, size: 72, rotate: 4, z: 3 },
    { top: 20, left: 96, size: 56, rotate: 12, z: 2 },
  ],
}

const OPTIONS = [
  {
    id: 'colaborador',
    label: 'Colaborador',
    functional: true,
    stickers: [
      { src: userStickerIcon, bg: YELLOW },
      { src: badgeStickerIcon, bg: 'var(--color-bg)' },
      { src: plusStickerIcon, bg: YELLOW },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    functional: false,
    stickers: [
      { src: teamStickerIcon1, bg: YELLOW },
      { src: teamStickerIcon2, bg: YELLOW },
      { src: teamStickerIcon3, bg: YELLOW },
    ],
  },
  {
    id: 'cargo',
    label: 'Cargo',
    functional: false,
    stickers: [
      { src: briefcaseStickerIcon, bg: 'var(--color-bg)' },
      { src: plusAccentStickerIcon, bg: YELLOW },
    ],
  },
  {
    id: 'beneficio',
    label: 'Benefício',
    functional: false,
    stickers: [
      { src: giftStickerIcon, bg: YELLOW },
      { src: cardStickerIcon, bg: YELLOW },
      { src: dollarStickerIcon, bg: 'var(--color-bg)' },
    ],
  },
]

function OptionCard({ option, onClick }) {
  const slots = SLOTS_BY_COUNT[option.stickers.length]
  return (
    <button type="button" className="novo-modal__card" onClick={onClick}>
      <div className="novo-modal__illustration">
        {option.stickers.map((sticker, index) => {
          const slot = slots[index]
          return (
            <span
              className="novo-modal__sticker"
              key={index}
              style={{
                width: slot.size,
                height: slot.size,
                top: slot.top,
                left: slot.left,
                zIndex: slot.z,
                background: sticker.bg,
                '--sticker-rotate': `${slot.rotate}deg`,
              }}
            >
              <img src={sticker.src} alt="" />
            </span>
          )
        })}
      </div>
      <span className="novo-modal__card-label">{option.label}</span>
    </button>
  )
}

function NovoModal({ onClose, onSelectColaborador }) {
  return (
    <div className="novo-modal-overlay" onClick={onClose}>
      <div className="novo-modal-stack">
        <IconButton
          icon={closeIcon}
          alt="Fechar"
          onClick={onClose}
          className="novo-modal__close-button"
        />
        <div className="novo-modal" onClick={(event) => event.stopPropagation()}>
          <h2 className="novo-modal__title">
            O que vamos{' '}
            <span className="novo-modal__title-gradient">criar hoje?</span>
          </h2>
          <div className="novo-modal__grid">
            {OPTIONS.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                onClick={option.functional ? onSelectColaborador : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NovoModal

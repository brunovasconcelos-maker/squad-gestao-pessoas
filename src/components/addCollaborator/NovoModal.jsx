import closeIcon from '../../assets/icons/Close.svg'
import badgeStickerIcon from '../../assets/illustrations/Vector.svg'
import plusStickerIcon from '../../assets/illustrations/+.svg'
import plusAccentStickerIcon from '../../assets/illustrations/+-1.svg'
import teamStickerIcon1 from '../../assets/illustrations/User.svg'
import teamStickerIcon2 from '../../assets/illustrations/User-1.svg'
import teamStickerIcon3 from '../../assets/illustrations/User-2.svg'
import teamStickerIcon4 from '../../assets/illustrations/User-3.svg'
import briefcaseStickerIcon from '../../assets/illustrations/Briefcase.svg'
import giftStickerIcon from '../../assets/illustrations/Vector-1.svg'
import cardStickerIcon from '../../assets/illustrations/Vector-2.svg'
import dollarStickerIcon from '../../assets/illustrations/Vector-3.svg'
import IconButton from '../IconButton.jsx'
import './NovoModal.css'

const YELLOW = '#ffd668'
const WHITE = 'var(--color-bg)'

const WIGGLE_OFFSETS = [-10, 10, -9, 11]
const WIGGLE_DELAYS = [0, 0.06, 0.12, 0.18]

function stickerStyle(sticker, index) {
  return {
    width: sticker.size,
    height: sticker.size,
    left: sticker.left,
    top: sticker.top,
    background: sticker.bg,
    borderRadius: sticker.borderRadius ?? sticker.size / 3,
    '--sticker-rotate': `${sticker.rotate}deg`,
    '--wiggle-offset': `${WIGGLE_OFFSETS[index % WIGGLE_OFFSETS.length]}deg`,
    '--wiggle-delay': `${WIGGLE_DELAYS[index % WIGGLE_DELAYS.length]}s`,
  }
}

const OPTIONS = [
  {
    id: 'colaborador',
    label: 'Colaborador',
    functional: true,
    stickers: [
      {
        src: badgeStickerIcon,
        size: 70.992,
        left: 33,
        top: 35.5,
        rotate: -7.01,
        bg: WHITE,
      },
      {
        src: plusStickerIcon,
        size: 46.49,
        left: 80.37,
        top: 78.01,
        rotate: 16.61,
        bg: YELLOW,
      },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    functional: false,
    stickers: [],
  },
  {
    id: 'cargo',
    label: 'Cargo',
    functional: false,
    stickers: [
      {
        src: briefcaseStickerIcon,
        size: 63.697,
        left: 33,
        top: 51.5,
        rotate: -7.01,
        bg: WHITE,
        borderRadius: 21.456,
      },
      {
        src: plusStickerIcon,
        size: 46.49,
        left: 80.37,
        top: 28.5,
        rotate: 16.61,
        bg: YELLOW,
      },
    ],
  },
  {
    id: 'beneficio',
    label: 'Benefício',
    functional: false,
    stickers: [
      {
        src: giftStickerIcon,
        size: 47.364,
        left: 64.67,
        top: 37.5,
        rotate: -17.07,
        bg: YELLOW,
      },
      {
        src: cardStickerIcon,
        size: 38.637,
        left: 80.89,
        top: 85.32,
        rotate: -1.11,
        bg: YELLOW,
      },
      {
        src: dollarStickerIcon,
        size: 43.115,
        left: 40,
        top: 63.01,
        rotate: 8.53,
        bg: WHITE,
      },
    ],
  },
]

const TIME_TEAM_ICONS = [
  teamStickerIcon1,
  teamStickerIcon2,
  teamStickerIcon3,
  teamStickerIcon4,
]
const TIME_CIRCLE_SIZE = 34.722
const TIME_CIRCLE_POSITIONS = [
  { left: 0, top: 0 },
  { left: 81.62, top: 3.7 },
  { left: 3.7, top: 51.428 },
  { left: 77.92, top: 47.728 },
]
const TIME_GROUP = { left: 22, top: 37.5, width: 116.342, height: 86.15, rotate: 7.23 }
const TIME_ACCENT = { size: 30.181, left: 65.71, top: 64.48, rotate: 7.23, bg: WHITE }

function TimeIllustration() {
  return (
    <>
      <div
        className="novo-modal__sticker-group"
        style={{
          left: TIME_GROUP.left,
          top: TIME_GROUP.top,
          width: TIME_GROUP.width,
          height: TIME_GROUP.height,
          '--sticker-rotate': `${TIME_GROUP.rotate}deg`,
          '--wiggle-offset': `${WIGGLE_OFFSETS[0]}deg`,
          '--wiggle-delay': `${WIGGLE_DELAYS[0]}s`,
        }}
      >
        {TIME_TEAM_ICONS.map((icon, index) => (
          <span
            className="novo-modal__circle"
            key={index}
            style={{
              width: TIME_CIRCLE_SIZE,
              height: TIME_CIRCLE_SIZE,
              left: TIME_CIRCLE_POSITIONS[index].left,
              top: TIME_CIRCLE_POSITIONS[index].top,
              background: YELLOW,
            }}
          >
            <img src={icon} alt="" />
          </span>
        ))}
      </div>
      <span
        className="novo-modal__sticker"
        style={{
          width: TIME_ACCENT.size,
          height: TIME_ACCENT.size,
          left: TIME_ACCENT.left,
          top: TIME_ACCENT.top,
          background: TIME_ACCENT.bg,
          borderRadius: TIME_ACCENT.size / 3,
          '--sticker-rotate': `${TIME_ACCENT.rotate}deg`,
          '--wiggle-offset': `${WIGGLE_OFFSETS[1]}deg`,
          '--wiggle-delay': `${WIGGLE_DELAYS[1]}s`,
        }}
      >
        <img src={plusAccentStickerIcon} alt="" />
      </span>
    </>
  )
}

function OptionCard({ option, onClick }) {
  return (
    <button type="button" className="novo-modal__card" onClick={onClick}>
      <div className="novo-modal__illustration">
        {option.id === 'time' ? (
          <TimeIllustration />
        ) : (
          option.stickers.map((sticker, index) => (
            <span
              className="novo-modal__sticker"
              key={index}
              style={stickerStyle(sticker, index)}
            >
              <img src={sticker.src} alt="" />
            </span>
          ))
        )}
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

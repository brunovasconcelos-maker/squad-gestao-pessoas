import closeIcon from '../../assets/icons/Close.svg'
import badgeStickerIcon from '../../assets/illustrations/Vector.svg'
import plusStickerIcon from '../../assets/illustrations/+-1.svg'
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
const BENEFICIO_STICKER_SIZE = 45

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
        size: BENEFICIO_STICKER_SIZE,
        left: 55,
        top: 40,
        rotate: -17.07,
        bg: YELLOW,
      },
      {
        src: cardStickerIcon,
        size: BENEFICIO_STICKER_SIZE,
        left: 68,
        top: 60,
        rotate: -1.11,
        bg: YELLOW,
      },
      {
        src: dollarStickerIcon,
        size: BENEFICIO_STICKER_SIZE,
        left: 48,
        top: 62,
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
const TIME_CIRCLE_GAP = 3.7
const TIME_CLUSTER_SIZE = TIME_CIRCLE_SIZE * 2 + TIME_CIRCLE_GAP
const TIME_CIRCLE_POSITIONS = [
  { left: 0, top: 0 },
  { left: TIME_CIRCLE_SIZE + TIME_CIRCLE_GAP, top: 0 },
  { left: 0, top: TIME_CIRCLE_SIZE + TIME_CIRCLE_GAP },
  { left: TIME_CIRCLE_SIZE + TIME_CIRCLE_GAP, top: TIME_CIRCLE_SIZE + TIME_CIRCLE_GAP },
]
const TIME_GROUP = {
  left: (160 - TIME_CLUSTER_SIZE) / 2,
  top: (160 - TIME_CLUSTER_SIZE) / 2,
  size: TIME_CLUSTER_SIZE,
  rotate: 7.23,
}
const TIME_ACCENT_SIZE = 30.181
const TIME_ACCENT_OFFSET = (TIME_CLUSTER_SIZE - TIME_ACCENT_SIZE) / 2

function TimeIllustration() {
  return (
    <div
      className="novo-modal__sticker-group"
      style={{
        left: TIME_GROUP.left,
        top: TIME_GROUP.top,
        width: TIME_GROUP.size,
        height: TIME_GROUP.size,
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
      <span
        className="novo-modal__sticker novo-modal__sticker--nested"
        style={{
          width: TIME_ACCENT_SIZE,
          height: TIME_ACCENT_SIZE,
          left: TIME_ACCENT_OFFSET,
          top: TIME_ACCENT_OFFSET,
          background: WHITE,
          borderRadius: TIME_ACCENT_SIZE / 3,
        }}
      >
        <img src={plusStickerIcon} alt="" />
      </span>
    </div>
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

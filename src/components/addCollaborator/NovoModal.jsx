import closeIcon from '../../assets/icons/Close.svg'
import arrowUpRightIcon from '../../assets/icons/ArrowUpRight.svg'
import userPlusIcon from '../../assets/icons/UserPlus.svg'
import usersFourIcon from '../../assets/icons/UsersFour.svg'
import briefcaseIcon from '../../assets/icons/Briefcase.svg'
import giftIcon from '../../assets/icons/Gift.svg'
import IconButton from '../IconButton.jsx'
import ModalOverlay from './ModalOverlay.jsx'
import './NovoModal.css'

const OPTIONS = [
  { id: 'colaborador', label: 'Colaborador', icon: userPlusIcon, functional: true },
  { id: 'time', label: 'Time', icon: usersFourIcon, functional: false },
  { id: 'cargo', label: 'Cargo', icon: briefcaseIcon, functional: false },
  { id: 'beneficio', label: 'Beneficio', icon: giftIcon, functional: false },
]

function NovoModal({ onClose, onSelectColaborador }) {
  return (
    <ModalOverlay width={808} className="novo-modal">
      <div className="novo-modal__header">
        <h2 className="novo-modal__title">Novo</h2>
        <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
      </div>
      <div className="novo-modal__grid">
        {OPTIONS.map((option) => (
          <button
            type="button"
            key={option.id}
            className="novo-modal__card"
            onClick={option.functional ? onSelectColaborador : undefined}
          >
            <div className="novo-modal__card-top">
              <span className="novo-modal__card-badge">
                <img src={option.icon} alt="" width={24} height={24} />
              </span>
              <img
                className="novo-modal__card-arrow"
                src={arrowUpRightIcon}
                alt=""
                width={24}
                height={24}
              />
            </div>
            <span className="novo-modal__card-label">{option.label}</span>
          </button>
        ))}
      </div>
    </ModalOverlay>
  )
}

export default NovoModal

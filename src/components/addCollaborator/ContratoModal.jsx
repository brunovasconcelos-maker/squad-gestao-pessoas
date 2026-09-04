import { useState } from 'react'
import closeIcon from '../../assets/icons/Close.svg'
import radioButtonIcon from '../../assets/icons/RadioButton.svg'
import circleIcon from '../../assets/icons/Circle.svg'
import IconButton from '../IconButton.jsx'
import ModalOverlay from './ModalOverlay.jsx'
import './buttons.css'
import './ContratoModal.css'

const CONTRACT_TYPES = ['Fixo', 'Freelancer', 'Consultor']

function ContratoModal({ value, onSave, onClose }) {
  const [selected, setSelected] = useState(value)

  return (
    <ModalOverlay width={532} className="contrato-modal">
      <div className="contrato-modal__header">
        <h2 className="contrato-modal__title">Contrato</h2>
        <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
      </div>

      <div className="contrato-modal__options">
        {CONTRACT_TYPES.map((type) => {
          const isSelected = type === selected
          return (
            <button
              type="button"
              key={type}
              className="contrato-modal__option"
              onClick={() => setSelected(type)}
            >
              <img
                src={isSelected ? radioButtonIcon : circleIcon}
                alt=""
                width={24}
                height={24}
              />
              <span className="contrato-modal__option-label">{type}</span>
            </button>
          )
        })}
      </div>

      <div className="contrato-modal__footer">
        <button type="button" className="text-button" onClick={onClose}>
          Voltar
        </button>
        <button
          type="button"
          className="pill-button"
          onClick={() => onSave(selected)}
        >
          Salvar
        </button>
      </div>
    </ModalOverlay>
  )
}

export default ContratoModal

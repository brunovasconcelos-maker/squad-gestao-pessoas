import radioButtonIcon from '../../assets/icons/RadioButton.svg'
import circleIcon from '../../assets/icons/Circle.svg'
import WizardShell from '../addCollaborator/WizardShell.jsx'
import { BENEFICIO_TYPES } from '../../utils/beneficioOptions.js'
import '../addCollaborator/buttons.css'
import '../addCollaborator/Step1BasicInfo.css'
import '../addCollaborator/RadioListModal.css'

function Step1TipoBeneficio({ tipo, onTipoChange, onExit, onContinue }) {
  const canContinue = Boolean(tipo)

  return (
    <WizardShell
      title="Novo Benefício"
      onClose={onExit}
      progress={25}
      footerLeft={
        <button type="button" className="text-button" onClick={onExit}>
          Voltar
        </button>
      }
      footerRight={
        <button
          type="button"
          className="pill-button"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continuar
        </button>
      }
    >
      <div className="step1">
        <p className="step1__contract-label">Qual o tipo de benefício?</p>
        <div className="radio-list-modal__options">
          {BENEFICIO_TYPES.map((option) => {
            const isSelected = option === tipo
            return (
              <button
                type="button"
                key={option}
                className="radio-list-modal__option"
                onClick={() => onTipoChange(option)}
              >
                <img
                  src={isSelected ? radioButtonIcon : circleIcon}
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="radio-list-modal__option-label">{option}</span>
              </button>
            )
          })}
        </div>
      </div>
    </WizardShell>
  )
}

export default Step1TipoBeneficio

import caretRightIcon from '../../assets/icons/CaretRight.svg'
import WizardShell from './WizardShell.jsx'
import './buttons.css'
import './Step2AdditionalInfo.css'

const FIELDS = [
  { id: 'email', label: 'Email' },
  { id: 'cargo', label: 'Cargo' },
  { id: 'time', label: 'Time' },
  { id: 'reporta-para', label: 'Reporta para' },
  { id: 'data-admissao', label: 'Data de admissão' },
  { id: 'salario', label: 'Salário' },
]

function Step2AdditionalInfo({ onBack, onExit, onContinue }) {
  return (
    <WizardShell
      onClose={onExit}
      progress={100}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button type="button" className="pill-button" onClick={onContinue}>
          Continuar
        </button>
      }
    >
      <div className="step2">
        <p className="step2__section-label">Informações</p>
        <div className="step2__list">
          {FIELDS.map((field) => (
            <div className="step2__row" key={field.id}>
              <span className="step2__row-label">{field.label}</span>
              <span className="step2__row-action">Adicionar</span>
              <span className="step2__row-icon">
                <img src={caretRightIcon} alt="" width={24} height={24} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </WizardShell>
  )
}

export default Step2AdditionalInfo

import { useState } from 'react'
import caretRightIcon from '../../assets/icons/CaretRight.svg'
import WizardShell from '../addCollaborator/WizardShell.jsx'
import ProviderModal from './ProviderModal.jsx'
import { getBeneficioTypeIcon } from '../../utils/beneficioOptions.js'
import '../addCollaborator/buttons.css'
import '../addCollaborator/Step1BasicInfo.css'
import '../addCollaborator/Step2AdditionalInfo.css'
import './Step2Beneficio.css'

function Step2Beneficio({ tipo, providerName, onProviderNameChange, onBack, onExit, onContinue }) {
  const [modalOpen, setModalOpen] = useState(false)

  const IconComponent = getBeneficioTypeIcon(tipo)

  return (
    <WizardShell
      title="Novo Benefício"
      onClose={onExit}
      progress={50}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button
          type="button"
          className="pill-button"
          disabled={!providerName}
          onClick={onContinue}
        >
          Continuar
        </button>
      }
    >
      <div className="step1">
        <p className="step2-beneficio__label">Qual o fornecedor?</p>

        <div className="step2__list">
          <button type="button" className="step2__row" onClick={() => setModalOpen(true)}>
            <span
              className={
                providerName
                  ? 'step2__row-label step2__row-label--filled'
                  : 'step2__row-label'
              }
            >
              Fornecedor
            </span>
            <span className="step2__row-action">
              {providerName ? (
                <span className="step2-beneficio__provider-item">
                  <span className="step2-beneficio__provider-icon">
                    <IconComponent size={20} />
                  </span>
                  {providerName}
                </span>
              ) : (
                'Buscar fornecedor'
              )}
            </span>
            <span className="step2__row-icon">
              <img src={caretRightIcon} alt="" width={24} height={24} />
            </span>
          </button>
        </div>
      </div>

      {modalOpen && (
        <ProviderModal
          tipo={tipo}
          onClose={() => setModalOpen(false)}
          onSelect={(name) => {
            onProviderNameChange(name)
            setModalOpen(false)
          }}
        />
      )}
    </WizardShell>
  )
}

export default Step2Beneficio

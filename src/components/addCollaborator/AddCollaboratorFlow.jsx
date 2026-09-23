import { useState } from 'react'
import TipoContratacaoStep from './TipoContratacaoStep.jsx'
import Step1BasicInfo from './Step1BasicInfo.jsx'
import Step2AdditionalInfo from './Step2AdditionalInfo.jsx'
import ContratoModal from './ContratoModal.jsx'
import DiscardConfirmModal from './DiscardConfirmModal.jsx'
import CltNomeStep from './clt/CltNomeStep.jsx'
import CltCargoTimeStep from './clt/CltCargoTimeStep.jsx'
import CltInfoStep from './clt/CltInfoStep.jsx'

function AddCollaboratorFlow({ onExit }) {
  // 'tipo' -> Tela 1 (shared entry).
  // 1 / 2 -> the existing, unmodified PJ/Freelancer/Consultor flow.
  // 'clt-nome' / 'clt-cargo-time' / 'clt-info' -> the rebuilt CLT flow.
  const [step, setStep] = useState('tipo')
  const [name, setName] = useState('')
  const [contractType, setContractType] = useState('Fixo')
  const [contratoModalOpen, setContratoModalOpen] = useState(false)
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false)

  const [cltName, setCltName] = useState('')
  const [cltCargo, setCltCargo] = useState('')
  const [cltTeam, setCltTeam] = useState('')

  const openDiscardConfirm = () => setDiscardConfirmOpen(true)

  const handleChooseTipo = (tipo) => {
    if (tipo === 'CLT') {
      setStep('clt-nome')
      return
    }
    // The app has no distinct "PJ" contractType yet - PJ and Consultor
    // share the exact same field set (Step2AdditionalInfo's FIELDS_CONTRATO
    // branches only on Fixo vs not) and are contractually equivalent here,
    // so PJ is stored as Consultor until PJ gets its own rebuilt path.
    setContractType(tipo === 'PJ' ? 'Consultor' : tipo)
    setStep(1)
  }

  return (
    <>
      {step === 'tipo' && (
        <TipoContratacaoStep onChoose={handleChooseTipo} onExit={onExit} />
      )}

      {step === 1 && (
        <Step1BasicInfo
          name={name}
          onNameChange={setName}
          contractType={contractType}
          onOpenContrato={() => setContratoModalOpen(true)}
          onExit={openDiscardConfirm}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2AdditionalInfo
          name={name}
          contractType={contractType}
          onBack={() => setStep(1)}
          onExit={openDiscardConfirm}
          onContinue={onExit}
        />
      )}

      {step === 'clt-nome' && (
        <CltNomeStep
          name={cltName}
          onNameChange={setCltName}
          onBack={openDiscardConfirm}
          onClose={openDiscardConfirm}
          onContinue={() => setStep('clt-cargo-time')}
        />
      )}

      {step === 'clt-cargo-time' && (
        <CltCargoTimeStep
          name={cltName}
          initialCargo={cltCargo}
          initialTeam={cltTeam}
          onBack={() => setStep('clt-nome')}
          onClose={openDiscardConfirm}
          onSkip={() => {
            setCltCargo('')
            setCltTeam('')
            setStep('clt-info')
          }}
          onContinue={(cargoName, teamName) => {
            setCltCargo(cargoName)
            setCltTeam(teamName)
            setStep('clt-info')
          }}
        />
      )}

      {step === 'clt-info' && (
        <CltInfoStep
          name={cltName}
          cargoName={cltCargo}
          teamName={cltTeam}
          onBack={() => setStep('clt-cargo-time')}
          onClose={openDiscardConfirm}
          onCreate={onExit}
        />
      )}

      {contratoModalOpen && (
        <ContratoModal
          value={contractType}
          onSave={(newValue) => {
            setContractType(newValue)
            setContratoModalOpen(false)
          }}
          onClose={() => setContratoModalOpen(false)}
        />
      )}

      {discardConfirmOpen && (
        <DiscardConfirmModal
          onCancel={() => setDiscardConfirmOpen(false)}
          onConfirm={onExit}
        />
      )}
    </>
  )
}

export default AddCollaboratorFlow

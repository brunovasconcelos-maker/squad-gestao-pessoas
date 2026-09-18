import { useMemo, useState } from 'react'
import Step1TipoBeneficio from './Step1TipoBeneficio.jsx'
import Step2Beneficio from './Step2Beneficio.jsx'
import Step3Beneficiarios from './Step3Beneficiarios.jsx'
import Step4Valores from './Step4Valores.jsx'
import DiscardConfirmModal from '../addCollaborator/DiscardConfirmModal.jsx'
import { COLLECTIONS, getCollection, addItem, generateId } from '../../utils/storage.js'
import { resolveBeneficiaryIds } from '../../utils/beneficiarios.js'
import { centsToAmount } from '../../utils/formatters.js'

function createEmptyVariant() {
  return { id: generateId(), digits: '', colaboradorIds: new Set() }
}

function NovoBeneficioFlow({ onExit }) {
  const [collaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const [times] = useState(() => getCollection(COLLECTIONS.TIMES))
  const [cargos] = useState(() => getCollection(COLLECTIONS.CARGOS))

  const [step, setStep] = useState(1)
  const [tipo, setTipo] = useState(null)
  const [providerName, setProviderName] = useState(null)
  const [outroSubtipo, setOutroSubtipo] = useState(null)
  const [outroName, setOutroName] = useState('')
  const [beneficiarios, setBeneficiarios] = useState({
    colaboradorIds: new Set(),
    teamNames: new Set(),
    cargoNames: new Set(),
    todaEmpresa: false,
  })
  const [variants, setVariants] = useState(() => [createEmptyVariant()])
  const [infoAdicional, setInfoAdicional] = useState({ link: '', contato: '', email: '' })
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false)

  const toggleInSet = (key, value) => {
    setBeneficiarios((prev) => {
      const nextSet = new Set(prev[key])
      if (nextSet.has(value)) {
        nextSet.delete(value)
      } else {
        nextSet.add(value)
      }
      return { ...prev, [key]: nextSet }
    })
  }

  const onToggleColaborador = (id) => toggleInSet('colaboradorIds', id)
  const onToggleTeam = (name) => toggleInSet('teamNames', name)
  const onToggleCargo = (name) => toggleInSet('cargoNames', name)
  const onToggleTodaEmpresa = () =>
    setBeneficiarios((prev) => ({ ...prev, todaEmpresa: !prev.todaEmpresa }))

  const resolvedBeneficiaryIds = useMemo(
    () =>
      resolveBeneficiaryIds(
        {
          colaboradorIds: Array.from(beneficiarios.colaboradorIds),
          teamNames: Array.from(beneficiarios.teamNames),
          cargoNames: Array.from(beneficiarios.cargoNames),
          todaEmpresa: beneficiarios.todaEmpresa,
        },
        collaborators,
      ),
    [beneficiarios, collaborators],
  )

  const onAddVariant = () => setVariants((prev) => [...prev, createEmptyVariant()])

  const onRemoveVariant = (id) =>
    setVariants((prev) => (prev.length > 1 ? prev.filter((variant) => variant.id !== id) : prev))

  const onDigitsChange = (id, digits) =>
    setVariants((prev) =>
      prev.map((variant) => (variant.id === id ? { ...variant, digits } : variant)),
    )

  const onAssign = (id, ids) => {
    const idSet = new Set(ids)
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === id) return { ...variant, colaboradorIds: idSet }
        let changed = false
        const filtered = new Set(variant.colaboradorIds)
        idSet.forEach((personId) => {
          if (filtered.has(personId)) {
            filtered.delete(personId)
            changed = true
          }
        })
        return changed ? { ...variant, colaboradorIds: filtered } : variant
      }),
    )
  }

  const onInfoAdicionalChange = (field, value) =>
    setInfoAdicional((prev) => ({ ...prev, [field]: value }))

  const handleSave = () => {
    const record = {
      tipo,
      name: tipo === 'Outro' ? outroName.trim() : providerName,
      outroSubtipo: tipo === 'Outro' ? outroSubtipo : null,
      beneficiarios: {
        colaboradorIds: Array.from(beneficiarios.colaboradorIds),
        teamNames: Array.from(beneficiarios.teamNames),
        cargoNames: Array.from(beneficiarios.cargoNames),
        todaEmpresa: beneficiarios.todaEmpresa,
      },
      valores: variants.map((variant) => ({
        id: variant.id,
        valor: centsToAmount(variant.digits),
        colaboradorIds: Array.from(variant.colaboradorIds),
      })),
      linkBeneficio: infoAdicional.link.trim() || null,
      contatoFornecedor: infoAdicional.contato.trim() || null,
      emailFornecedor: infoAdicional.email.trim() || null,
    }
    addItem(COLLECTIONS.BENEFICIOS, record)
    onExit()
  }

  return (
    <>
      {step === 1 && (
        <Step1TipoBeneficio
          tipo={tipo}
          onTipoChange={setTipo}
          onExit={() => setDiscardConfirmOpen(true)}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <Step2Beneficio
          tipo={tipo}
          providerName={providerName}
          onProviderNameChange={setProviderName}
          outroSubtipo={outroSubtipo}
          onOutroSubtipoChange={setOutroSubtipo}
          outroName={outroName}
          onOutroNameChange={setOutroName}
          onBack={() => setStep(1)}
          onExit={() => setDiscardConfirmOpen(true)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3Beneficiarios
          colaboradorIds={beneficiarios.colaboradorIds}
          teamNames={beneficiarios.teamNames}
          cargoNames={beneficiarios.cargoNames}
          todaEmpresa={beneficiarios.todaEmpresa}
          onToggleColaborador={onToggleColaborador}
          onToggleTeam={onToggleTeam}
          onToggleCargo={onToggleCargo}
          onToggleTodaEmpresa={onToggleTodaEmpresa}
          collaborators={collaborators}
          times={times}
          cargos={cargos}
          onBack={() => setStep(2)}
          onExit={() => setDiscardConfirmOpen(true)}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Step4Valores
          variants={variants}
          onAddVariant={onAddVariant}
          onRemoveVariant={onRemoveVariant}
          onDigitsChange={onDigitsChange}
          onAssign={onAssign}
          resolvedBeneficiaryIds={resolvedBeneficiaryIds}
          collaborators={collaborators}
          infoAdicional={infoAdicional}
          onInfoAdicionalChange={onInfoAdicionalChange}
          onBack={() => setStep(3)}
          onExit={() => setDiscardConfirmOpen(true)}
          onContinue={handleSave}
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

export default NovoBeneficioFlow

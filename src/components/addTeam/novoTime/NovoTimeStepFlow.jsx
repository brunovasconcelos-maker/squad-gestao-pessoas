import { useMemo, useState } from 'react'
import TimeNomeStep from './TimeNomeStep.jsx'
import TimeCorIconeStep from './TimeCorIconeStep.jsx'
import TimeMembrosStep from './TimeMembrosStep.jsx'
import TimeInfoStep from './TimeInfoStep.jsx'
import DiscardConfirmModal from '../../addCollaborator/DiscardConfirmModal.jsx'
import { COLLECTIONS, getCollection, setCollection, generateId } from '../../../utils/storage.js'
import { pickDefaultColorId, guessTeamIconName } from '../../../utils/teamOptions.js'

// The new step-by-step full-screen flow for creating a team, triggered from
// the "Time" card in the Criar Novo modal. Always creates a brand-new team
// (pending: false right away) - completing an existing pending draft still
// goes through the older NovoTimeFlow/Step1-2TeamInfo path from TimesGrid.
function NovoTimeStepFlow({ onExit }) {
  const [times] = useState(() => getCollection(COLLECTIONS.TIMES))
  const [collaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))

  const usedColors = useMemo(
    () => times.filter((team) => team.color).map((team) => team.color),
    [times],
  )

  const [step, setStep] = useState('nome')
  const [name, setName] = useState('')
  const [colorId, setColorId] = useState(() => pickDefaultColorId(usedColors))
  const [iconTouched, setIconTouched] = useState(false)
  const [iconName, setIconName] = useState(() => guessTeamIconName(''))
  const [memberOrder, setMemberOrder] = useState([])
  const [leaderId, setLeaderId] = useState(null)
  const [descricao, setDescricao] = useState('')
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false)

  const openDiscardConfirm = () => setDiscardConfirmOpen(true)

  const handleNameChange = (value) => {
    setName(value)
    if (!iconTouched) {
      setIconName(guessTeamIconName(value))
    }
  }

  const handleIconChange = (value) => {
    setIconTouched(true)
    setIconName(value)
  }

  const handleCreate = () => {
    const newTeam = {
      id: generateId(),
      name,
      color: colorId,
      icon: iconName,
      leaderId,
      membros: memberOrder,
      descricao,
      pending: false,
    }
    setCollection(COLLECTIONS.TIMES, [...times, newTeam])

    const memberIdSet = new Set(memberOrder)
    const updatedCollaborators = collaborators.map((collaborator) => {
      if (!memberIdSet.has(collaborator.id)) return collaborator
      if (collaborator.times.includes(name)) return collaborator
      return { ...collaborator, times: [...collaborator.times, name] }
    })
    setCollection(COLLECTIONS.COLABORADORES, updatedCollaborators)

    onExit()
  }

  return (
    <>
      {step === 'nome' && (
        <TimeNomeStep
          name={name}
          onNameChange={handleNameChange}
          onBack={openDiscardConfirm}
          onClose={openDiscardConfirm}
          onContinue={() => setStep('cor-icone')}
        />
      )}

      {step === 'cor-icone' && (
        <TimeCorIconeStep
          name={name}
          colorId={colorId}
          onColorChange={setColorId}
          iconName={iconName}
          onIconChange={handleIconChange}
          onBack={() => setStep('nome')}
          onClose={openDiscardConfirm}
          onContinue={() => setStep('membros')}
        />
      )}

      {step === 'membros' && (
        <TimeMembrosStep
          name={name}
          colorId={colorId}
          iconName={iconName}
          collaborators={collaborators}
          memberOrder={memberOrder}
          onMemberOrderChange={setMemberOrder}
          onBack={() => setStep('cor-icone')}
          onClose={openDiscardConfirm}
          onContinue={() => setStep('info')}
        />
      )}

      {step === 'info' && (
        <TimeInfoStep
          leaderId={leaderId}
          onLeaderChange={setLeaderId}
          memberOrder={memberOrder}
          collaborators={collaborators}
          descricao={descricao}
          onDescricaoChange={setDescricao}
          onBack={() => setStep('membros')}
          onClose={openDiscardConfirm}
          onCreate={handleCreate}
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

export default NovoTimeStepFlow

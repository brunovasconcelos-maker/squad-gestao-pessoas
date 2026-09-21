import { useState } from 'react'
import FieldModalShell from '../addCollaborator/FieldModalShell.jsx'
import '../addTeam/DescricaoModal.css'

function AdicionarNotaModal({ onSave, onClose }) {
  const [text, setText] = useState('')
  const trimmed = text.trim()

  return (
    <FieldModalShell
      title="Adicionar nota"
      onClose={onClose}
      onSave={() => onSave(trimmed)}
      saveDisabled={!trimmed}
    >
      <textarea
        className="descricao-modal__textarea"
        autoFocus
        placeholder="Escreva uma nota..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </FieldModalShell>
  )
}

export default AdicionarNotaModal

import { useState } from 'react'
import FieldModalShell from '../addCollaborator/FieldModalShell.jsx'
import './DescricaoModal.css'

function DescricaoModal({ value, onSave, onClose }) {
  const [descricao, setDescricao] = useState(value ?? '')

  return (
    <FieldModalShell
      title="Descrição"
      onClose={onClose}
      onSave={() => onSave(descricao)}
    >
      <textarea
        className="descricao-modal__textarea"
        autoFocus
        placeholder="Descreva o time..."
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
      />
    </FieldModalShell>
  )
}

export default DescricaoModal

import { useState } from 'react'
import FieldModalShell from '../addCollaborator/FieldModalShell.jsx'
import { isValidEmail } from '../../utils/formatters.js'
import '../addCollaborator/LargeFieldInput.css'

function EmailFornecedorModal({ value, onSave, onClose }) {
  const [email, setEmail] = useState(value ?? '')

  const trimmed = email.trim()
  const canSave = trimmed.length === 0 || isValidEmail(trimmed)

  return (
    <FieldModalShell
      title="Email do fornecedor"
      onClose={onClose}
      onSave={() => onSave(trimmed)}
      saveDisabled={!canSave}
    >
      <input
        type="text"
        autoFocus
        className="large-field-input"
        placeholder="nome@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
    </FieldModalShell>
  )
}

export default EmailFornecedorModal

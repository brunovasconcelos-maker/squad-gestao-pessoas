import { useEffect, useRef, useState } from 'react'
import closeIcon from '../../assets/icons/Close.svg'
import './InlineEditField.css'

function InlineEditField({
  value,
  displayValue,
  disabled,
  onSave,
  validate,
  formatForInput,
  parseInput,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)
  const savingRef = useRef(false)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = () => {
    if (disabled) return
    setDraft(value)
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setDraft(value)
  }

  const save = () => {
    if (validate && !validate(draft)) return
    savingRef.current = true
    onSave(draft)
    setEditing(false)
  }

  const handleBlur = () => {
    // Pressing Enter triggers save() then a blur as the input unmounts -
    // that blur must not also cancel and revert the just-saved value.
    if (savingRef.current) {
      savingRef.current = false
      return
    }
    cancel()
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="colaborador-detail__value-button"
        onClick={startEdit}
        disabled={disabled}
      >
        {displayValue}
      </button>
    )
  }

  return (
    <div className="inline-edit-field">
      <input
        ref={inputRef}
        type="text"
        inputMode={parseInput ? 'numeric' : 'text'}
        className="inline-edit-field__input"
        value={formatForInput ? formatForInput(draft) : draft}
        onChange={(event) =>
          setDraft(parseInput ? parseInput(event.target.value) : event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter') save()
          if (event.key === 'Escape') cancel()
        }}
        onBlur={handleBlur}
      />
      <button
        type="button"
        className="inline-edit-field__cancel"
        onMouseDown={(event) => event.preventDefault()}
        onClick={cancel}
      >
        <img src={closeIcon} alt="Cancelar" width={16} height={16} />
      </button>
    </div>
  )
}

export default InlineEditField

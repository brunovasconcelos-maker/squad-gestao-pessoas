import { useRef, useState } from 'react'
import calendarBlankIcon from '../../assets/icons/CalendarBlank.svg'
import FieldModalShell from './FieldModalShell.jsx'
import { todayIso, formatDatePt } from '../../utils/formatters.js'
import './DataAdmissaoModal.css'

function DataAdmissaoModal({ value, onSave, onClose }) {
  const [isoDate, setIsoDate] = useState(value ?? todayIso())
  const inputRef = useRef(null)

  return (
    <FieldModalShell
      title="Data de admissão"
      onClose={onClose}
      onSave={() => onSave(isoDate)}
    >
      <div className="date-field">
        <span className="date-field__value">{formatDatePt(isoDate)}</span>
        <button
          type="button"
          className="date-field__calendar-button"
          onClick={() => inputRef.current?.showPicker?.() ?? inputRef.current?.focus()}
        >
          <img src={calendarBlankIcon} alt="" width={24} height={24} />
        </button>
        <input
          ref={inputRef}
          type="date"
          className="date-field__native-input"
          value={isoDate}
          onChange={(event) => {
            if (event.target.value) setIsoDate(event.target.value)
          }}
        />
      </div>
    </FieldModalShell>
  )
}

export default DataAdmissaoModal

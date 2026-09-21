import { useEffect, useRef, useState } from 'react'
import calendarBlankIcon from '../../assets/icons/CalendarBlank.svg'
import Checkbox from '../addCollaborator/Checkbox.jsx'
import { useDropdownPosition } from '../../utils/useDropdownPosition.js'
import { todayIso, formatDatePt } from '../../utils/formatters.js'
import './ColaboradorDetail.css'

function DateField({ value, allowNoEnd, disabled, displayValue, onSave }) {
  const [open, setOpen] = useState(false)
  const [isoDate, setIsoDate] = useState(typeof value === 'string' ? value : todayIso())
  const [noEndDate, setNoEndDate] = useState(Boolean(allowNoEnd) && value === null)
  const anchorRef = useRef(null)
  const inputRef = useRef(null)
  const rect = useDropdownPosition(open, anchorRef)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event) {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const startEdit = () => {
    if (disabled) return
    setIsoDate(typeof value === 'string' ? value : todayIso())
    setNoEndDate(Boolean(allowNoEnd) && value === null)
    setOpen(true)
  }

  const selectDate = (date) => {
    setIsoDate(date)
    setNoEndDate(false)
    onSave(date)
    setOpen(false)
  }

  const toggleNoEnd = () => {
    const next = !noEndDate
    setNoEndDate(next)
    if (next) {
      onSave(null)
      setOpen(false)
    }
  }

  return (
    <div className="colaborador-field" ref={anchorRef}>
      <button
        type="button"
        className="colaborador-detail__value-button"
        onClick={startEdit}
        disabled={disabled}
      >
        {displayValue}
      </button>

      {open && rect && (
        <div
          className="colaborador-field__dropdown colaborador-date-field__dropdown"
          style={{ top: rect.top, right: rect.right }}
        >
          <div
            className={
              noEndDate
                ? 'colaborador-date-field colaborador-date-field--disabled'
                : 'colaborador-date-field'
            }
          >
            <span className="colaborador-date-field__value">{formatDatePt(isoDate)}</span>
            <button
              type="button"
              className="colaborador-date-field__calendar-button"
              disabled={noEndDate}
              onClick={() => inputRef.current?.showPicker?.() ?? inputRef.current?.focus()}
            >
              <img src={calendarBlankIcon} alt="" width={20} height={20} />
            </button>
            <input
              ref={inputRef}
              type="date"
              className="colaborador-date-field__native-input"
              value={isoDate}
              disabled={noEndDate}
              onChange={(event) => {
                if (event.target.value) selectDate(event.target.value)
              }}
            />
          </div>

          {allowNoEnd && (
            <button
              type="button"
              className="colaborador-date-field__no-end-toggle"
              onClick={toggleNoEnd}
            >
              <Checkbox checked={noEndDate} />
              <span className="colaborador-date-field__no-end-label">
                Não especificar data de fim
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DateField

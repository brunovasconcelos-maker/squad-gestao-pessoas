import { useEffect, useRef, useState } from 'react'
import { CalendarPlus, CameraPlus } from '@phosphor-icons/react'
import closeIcon from '../../../assets/icons/Close.svg'
import CltShell from './CltShell.jsx'
import InlineEditField from '../../colaborador/InlineEditField.jsx'
import Calendar from '../../colaborador/Calendar.jsx'
import { useDropdownPosition } from '../../../utils/useDropdownPosition.js'
import { COLLECTIONS, getCollection, addItem } from '../../../utils/storage.js'
import {
  todayIso,
  formatCurrencyBRL,
  formatAmountFromDigits,
  centsToAmount,
  buildEmailPrefix,
} from '../../../utils/formatters.js'
import '../buttons.css'
import '../../colaborador/ColaboradorDetail.css'
import './CltShell.css'
import './CltInfoStep.css'

function nextMondayIso() {
  const now = new Date()
  const day = now.getDay()
  const add = (8 - day) % 7 || 7
  const next = new Date(now)
  next.setDate(now.getDate() + add)
  const yyyy = next.getFullYear()
  const mm = String(next.getMonth() + 1).padStart(2, '0')
  const dd = String(next.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Ensures editing a currency field always starts pre-filled with "0,00"
// instead of empty - amountToDigits() returns '' for a falsy 0, which
// would otherwise blank the input the moment it opens.
function toDigits(value) {
  return Math.round((value ?? 0) * 100)
    .toString()
    .padStart(3, '0')
}

function AdmissaoField({ value, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const anchorRef = useRef(null)
  const rect = useDropdownPosition(pickerOpen, anchorRef)

  useEffect(() => {
    if (!pickerOpen) return
    function handleClickOutside(event) {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [pickerOpen])

  const today = todayIso()
  const nextMonday = nextMondayIso()

  return (
    <div className="clt-info__admissao" ref={anchorRef}>
      <button
        type="button"
        className={
          value === today
            ? 'clt-info__pill clt-info__pill--selected'
            : 'clt-info__pill'
        }
        onClick={() => onChange(today)}
      >
        Hoje
      </button>
      <button
        type="button"
        className={
          value === nextMonday
            ? 'clt-info__pill clt-info__pill--selected'
            : 'clt-info__pill'
        }
        onClick={() => onChange(nextMonday)}
      >
        Próxima segunda
      </button>
      <button
        type="button"
        className="icon-button clt-info__icon-button"
        onClick={() => setPickerOpen((prev) => !prev)}
        aria-label="Escolher data personalizada"
      >
        <CalendarPlus size={20} />
      </button>

      {pickerOpen && rect && (
        <div className="colaborador-field__dropdown" style={{ top: rect.top, left: rect.left }}>
          <Calendar
            value={value}
            onSelect={(date) => {
              onChange(date)
              setPickerOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function EmailField({ name, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const savingRef = useRef(false)

  const prefix = buildEmailPrefix(name)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = () => {
    setDraft(value ?? prefix)
    setEditing(true)
  }

  const cancel = () => setEditing(false)

  const save = () => {
    savingRef.current = true
    onSave(draft)
    setEditing(false)
  }

  const handleBlur = () => {
    if (savingRef.current) {
      savingRef.current = false
      return
    }
    cancel()
  }

  if (editing) {
    return (
      <div className="inline-edit-field">
        <input
          ref={inputRef}
          type="text"
          className="inline-edit-field__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
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

  if (value != null) {
    return (
      <button type="button" className="colaborador-detail__value-button" onClick={startEdit}>
        {value || prefix}
      </button>
    )
  }

  return (
    <button type="button" className="colaborador-detail__value-button" onClick={startEdit}>
      <span>{prefix}</span>
      <span className="clt-info__email-hint">email</span>
    </button>
  )
}

function ReportarParaField({ value, displaySuffix, collaborators, onSave }) {
  const [editing, setEditing] = useState(false)
  const [query, setQuery] = useState('')
  const anchorRef = useRef(null)
  const rect = useDropdownPosition(editing, anchorRef)

  useEffect(() => {
    if (!editing) return
    function handleClickOutside(event) {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        setEditing(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editing])

  const trimmedQuery = query.trim().toLowerCase()
  const filtered = trimmedQuery
    ? collaborators.filter((collaborator) => collaborator.name.toLowerCase().includes(trimmedQuery))
    : collaborators

  const select = (collaborator) => {
    onSave(collaborator.name, collaborator.cargos?.[0] ?? null)
    setEditing(false)
    setQuery('')
  }

  const startEdit = () => {
    setQuery('')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setQuery('')
  }

  const displayText = value ? (displaySuffix ? `${value} | ${displaySuffix}` : value) : 'Adicionar'

  if (!editing) {
    return (
      <button type="button" className="colaborador-detail__value-button" onClick={startEdit}>
        {displayText}
      </button>
    )
  }

  return (
    <div className="colaborador-field colaborador-field--fill" ref={anchorRef}>
      <div className="inline-edit-field">
        <input
          type="text"
          autoFocus
          className="inline-edit-field__input"
          placeholder="Buscar colaborador..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') cancelEdit()
          }}
        />
        <button
          type="button"
          className="inline-edit-field__cancel"
          onMouseDown={(event) => event.preventDefault()}
          onClick={cancelEdit}
        >
          <img src={closeIcon} alt="Cancelar" width={16} height={16} />
        </button>
      </div>

      {rect && (
        <div className="colaborador-field__dropdown" style={{ top: rect.top, left: rect.left }}>
          <div className="select-list__list">
            {filtered.map((collaborator) => (
              <button
                type="button"
                key={collaborator.id}
                className="select-list__item"
                onClick={() => select(collaborator)}
              >
                <span className="select-list__item-label">{collaborator.name}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="select-list__empty">Ninguém encontrado.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function CurrencyField({ value, onSave }) {
  return (
    <InlineEditField
      value={toDigits(value)}
      displayValue={formatCurrencyBRL(value ?? 0)}
      formatForInput={(digits) => (digits ? formatAmountFromDigits(digits) : '')}
      parseInput={(text) => text.replace(/\D/g, '')}
      onSave={(digits) => onSave(centsToAmount(digits))}
    />
  )
}

// Best-effort pre-fill: the selected cargo's already-established "reporta
// para" (the same union CargoDetail itself shows - names derived from its
// current holders' own reportaPara plus any manually-added extras), only
// for a completed (non-pending) cargo record. Takes the first name found
// and looks up that person's own current cargo for the "Nome | Cargo"
// display.
function computeReportaParaPrefill(cargoName, collaborators) {
  if (!cargoName) return { name: null, cargo: null }
  const cargos = getCollection(COLLECTIONS.CARGOS)
  const cargoRecord = cargos.find((item) => item.name === cargoName)
  if (!cargoRecord || cargoRecord.pending !== false) return { name: null, cargo: null }

  const holders = collaborators.filter(
    (collaborator) => Array.isArray(collaborator.cargos) && collaborator.cargos.includes(cargoName),
  )
  const derived = holders.map((holder) => holder.reportaPara).filter(Boolean)
  const extra = cargoRecord.reportaAExtra ?? []
  const liderNome = Array.from(new Set([...derived, ...extra]))[0] ?? null
  if (!liderNome) return { name: null, cargo: null }

  const liderCollaborator = collaborators.find((collaborator) => collaborator.name === liderNome)
  return { name: liderNome, cargo: liderCollaborator?.cargos?.[0] ?? null }
}

// CLT and PJ share this exact screen; PJ just has a plain "Salário" label,
// no Custo para empresa row, and no custoParaEmpresa field on the saved
// record (ColaboradorDetail's Custo total already falls back to
// salário/valor de pagamento whenever custoParaEmpresa isn't set).
function CltInfoStep({ name, cargoName, teamName, contractType, onBack, onClose, onCreate }) {
  const isPJ = contractType === 'PJ'
  const [collaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const [dataAdmissao, setDataAdmissao] = useState(null)
  const [email, setEmail] = useState(null)
  const [reportaParaNome, setReportaParaNome] = useState(
    () => computeReportaParaPrefill(cargoName, collaborators).name,
  )
  const [reportaParaCargo, setReportaParaCargo] = useState(
    () => computeReportaParaPrefill(cargoName, collaborators).cargo,
  )
  const [salario, setSalario] = useState(0)
  const [custoParaEmpresa, setCustoParaEmpresa] = useState(0)

  const handleCreate = () => {
    const record = {
      name,
      contractType,
      cargos: cargoName ? [cargoName] : [],
      times: teamName ? [teamName] : [],
      dataAdmissao,
      email: email ?? buildEmailPrefix(name),
      reportaPara: reportaParaNome,
      salario,
      notas: [],
    }
    if (!isPJ) record.custoParaEmpresa = custoParaEmpresa
    addItem(COLLECTIONS.COLABORADORES, record)
    onCreate()
  }

  return (
    <CltShell
      onClose={onClose}
      progress={100}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button type="button" className="pill-button" onClick={handleCreate}>
          Criar colaborador
        </button>
      }
    >
      <div className="clt-shell__content">
        <h1 className="clt-shell__title">
          Finalize com algumas
          <br />
          informações adicionais.
        </h1>

        <div className="clt-info__list">
          <div className="clt-info__row">
            <span className="clt-info__row-label">Data de admissão</span>
            <AdmissaoField value={dataAdmissao} onChange={setDataAdmissao} />
          </div>

          <div className="clt-info__row">
            <span className="clt-info__row-label">Email</span>
            <EmailField name={name} value={email} onSave={setEmail} />
          </div>

          <div className="clt-info__row">
            <span className="clt-info__row-label">Reportar para</span>
            <ReportarParaField
              value={reportaParaNome}
              displaySuffix={reportaParaCargo}
              collaborators={collaborators.filter((collaborator) => collaborator.name !== name)}
              onSave={(nome, cargo) => {
                setReportaParaNome(nome)
                setReportaParaCargo(cargo)
              }}
            />
          </div>

          <div className="clt-info__row">
            <span className="clt-info__row-label">{isPJ ? 'Salário' : 'Salário bruto'}</span>
            <CurrencyField value={salario} onSave={setSalario} />
          </div>

          {!isPJ && (
            <div className="clt-info__row">
              <span className="clt-info__row-label">Custo para empresa</span>
              <CurrencyField value={custoParaEmpresa} onSave={setCustoParaEmpresa} />
            </div>
          )}

          <div className="clt-info__row">
            <span className="clt-info__row-label">Foto</span>
            <button type="button" className="icon-button clt-info__icon-button" aria-label="Adicionar foto">
              <CameraPlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </CltShell>
  )
}

export default CltInfoStep

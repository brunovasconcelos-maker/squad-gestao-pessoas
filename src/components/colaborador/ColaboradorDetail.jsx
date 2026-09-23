import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { At, CheckCircle, Flag, PiggyBank, NotePencil, Power, FrameCorners, Eye, EyeSlash } from '@phosphor-icons/react'
import closeIcon from '../../assets/icons/Close.svg'
import trashIcon from '../../assets/icons/Trash.svg'
import briefcaseIcon from '../../assets/icons/Briefcase.svg'
import usersFourIcon from '../../assets/icons/UsersFourGray.svg'
import userIcon from '../../assets/icons/User.svg'
import arrowUpRightIcon from '../../assets/icons/ArrowUpRight.svg'
import backToModalIcon from '../../assets/icons/Back-to-Modal.svg'
import IconButton from '../IconButton.jsx'
import ActivityTag from '../ActivityTag.jsx'
import InlineEditField from './InlineEditField.jsx'
import CargoField from './CargoField.jsx'
import TimeField from './TimeField.jsx'
import ReportaParaField from './ReportaParaField.jsx'
import DateField from './DateField.jsx'
import DeleteColaboradorModal from './DeleteColaboradorModal.jsx'
import DesligarColaboradorModal from './DesligarColaboradorModal.jsx'
import { COLLECTIONS, getCollection, setCollection, getCollaboratorActiveSince } from '../../utils/storage.js'
import { resolveBeneficiaryIds } from '../../utils/beneficiarios.js'
import { getBeneficioTypeIcon, getBenefitFilterTipo } from '../../utils/beneficioOptions.js'
import {
  formatDatePt,
  formatDateDMonthYear,
  formatCurrencyBRL,
  formatPaymentValue,
  isValidEmail,
  amountToDigits,
  formatAmountFromDigits,
  centsToAmount,
} from '../../utils/formatters.js'
import './ColaboradorDetail.css'

function computeTenureMonths(collaborator) {
  const iso = getCollaboratorActiveSince(collaborator)
  if (!iso) return null
  const [year, month, day] = iso.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const now = new Date()
  const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(totalMonths, 0)
}

function formatTenure(months) {
  if (months == null) return '—'
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  return `${years}a ${remMonths}m`
}

// Custo total has no currency prefix - just the number.
function formatNumberBRL(value) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const STAT_VALUE_MAX_FONT = 40
const STAT_VALUE_MIN_FONT = 20
const STAT_VALUE_FONT_STEP = 2

// The stat cards have a fixed width (see .colaborador-detail__stat-card) and
// must never grow to fit their value - instead, shrink the value's own
// font-size until it fits the card's fixed width. Re-measures whenever the
// text changes or the card itself is resized (e.g. switching between panel
// and full-screen).
function useFitStatFontSize(text) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const fit = () => {
      let size = STAT_VALUE_MAX_FONT
      el.style.fontSize = `${size}px`
      while (size > STAT_VALUE_MIN_FONT && el.scrollWidth > el.clientWidth) {
        size -= STAT_VALUE_FONT_STEP
        el.style.fontSize = `${size}px`
      }
    }

    fit()

    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])

  return ref
}

function ColaboradorDetail({ id, mode, onClose, onExpand, onCollapse, onDataChanged }) {
  const [collaborators, setCollaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const times = getCollection(COLLECTIONS.TIMES)
  const cargos = getCollection(COLLECTIONS.CARGOS)
  const beneficios = getCollection(COLLECTIONS.BENEFICIOS)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [desligarModalOpen, setDesligarModalOpen] = useState(false)
  const [addingNota, setAddingNota] = useState(false)
  const [notaText, setNotaText] = useState('')
  const notaInputRef = useRef(null)
  const notaSavingRef = useRef(false)
  // Both visibility toggles are independent local state, so they naturally
  // reset to hidden every time this component mounts (i.e. every time the
  // panel/page is opened) - Home only renders ColaboradorDetail while the
  // overlay is open, so closing it unmounts this component entirely.
  const [custoVisible, setCustoVisible] = useState(false)
  const [salarioVisible, setSalarioVisible] = useState(false)

  // Opening straight into full-screen (a direct/shared link) has no natural
  // "closed" state to slide in from, so it starts already entered. Opening
  // as a panel starts un-entered and flips true on the next frame, playing
  // the slide-in-from-the-right transition once. It then stays true across
  // later panel <-> full toggles, which animate via their own layout
  // transition instead (see ColaboradorDetail.css).
  const [entered, setEntered] = useState(() => mode === 'full')

  useEffect(() => {
    if (entered) return
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const collaborator = collaborators.find((item) => item.id === id) ?? null

  const persist = (updatedList) => {
    setCollection(COLLECTIONS.COLABORADORES, updatedList)
    setCollaborators(updatedList)
    onDataChanged?.(updatedList)
  }

  const updateField = (field, value) => {
    if (!collaborator) return
    persist(collaborators.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const isFreelancerOrConsultor =
    collaborator?.contractType === 'Freelancer' || collaborator?.contractType === 'Consultor'

  const beneficiosDoColaborador = beneficios
    .filter((benefit) => Boolean(benefit.tipo))
    .filter((benefit) => resolveBeneficiaryIds(benefit.beneficiarios, collaborators).has(id))
    .map((benefit) => {
      const variantWithValue = benefit.valores?.find(
        (variant) => variant.aplicaATodos || variant.colaboradorIds?.includes(id),
      )
      return {
        benefit,
        filterTipo: getBenefitFilterTipo(benefit),
        Icon: getBeneficioTypeIcon(benefit.tipo),
        assignedValue: variantWithValue ? formatCurrencyBRL(variantWithValue.valor) : '—',
        assignedValueRaw: variantWithValue?.valor ?? 0,
      }
    })

  const salarioValue = collaborator
    ? isFreelancerOrConsultor
      ? collaborator.valorPagamento
      : collaborator.salario
    : null
  const salarioDisplay =
    salarioValue == null
      ? 'Adicionar'
      : isFreelancerOrConsultor
        ? formatPaymentValue(salarioValue, collaborator.tipoPagamento)
        : formatCurrencyBRL(salarioValue)

  // "Custo para empresa" is the intended cost base when set - salário
  // bruto stays purely informational in that case. Falls back to
  // salário/valor de pagamento for records that predate the field (or
  // simply never set it).
  const custoBase = collaborator?.custoParaEmpresa ?? salarioValue ?? 0
  const custoTotal =
    custoBase + beneficiosDoColaborador.reduce((sum, item) => sum + item.assignedValueRaw, 0)
  const tenureMonths = collaborator ? computeTenureMonths(collaborator) : null

  // These two must be called unconditionally, before the early return below,
  // so the same number of hooks runs on every render regardless of whether
  // collaborator was found.
  const custoDisplayText = custoVisible ? formatNumberBRL(custoTotal) : '••••••'
  const tenureDisplayText = formatTenure(tenureMonths)
  const custoValueRef = useFitStatFontSize(custoDisplayText)
  const tenureValueRef = useFitStatFontSize(tenureDisplayText)

  if (!collaborator) return null

  const desligado = Boolean(collaborator.desligado)

  const handleDelete = () => {
    const updated = collaborators.filter((item) => item.id !== id)
    setCollection(COLLECTIONS.COLABORADORES, updated)
    onDataChanged?.(updated)
    onClose()
  }

  const handlePowerClick = () => {
    if (desligado) {
      updateField('desligado', false)
      return
    }
    setDesligarModalOpen(true)
  }

  const handleConfirmDesligar = () => {
    updateField('desligado', true)
    setDesligarModalOpen(false)
  }

  const startAddNota = () => {
    setNotaText('')
    setAddingNota(true)
  }

  const cancelAddNota = () => {
    setAddingNota(false)
    setNotaText('')
  }

  const saveNota = () => {
    const trimmed = notaText.trim()
    if (!trimmed) {
      cancelAddNota()
      return
    }
    notaSavingRef.current = true
    const notas = [...(collaborator.notas ?? []), { text: trimmed, timestamp: new Date().toISOString() }]
    updateField('notas', notas)
    setAddingNota(false)
    setNotaText('')
  }

  const handleNotaBlur = () => {
    if (notaSavingRef.current) {
      notaSavingRef.current = false
      return
    }
    cancelAddNota()
  }

  const profileSection = (
    <div className="colaborador-detail__profile">
      <span className="colaborador-detail__avatar">
        <img src={userIcon} alt="" width={20} height={20} />
      </span>
      <span className="colaborador-detail__name">{collaborator.name}</span>
      <ActivityTag contractType={collaborator.contractType} desligado={desligado} />
    </div>
  )

  const pipoBar = (
    <p className="colaborador-detail__pipo-bar">
      <span>Peça ao Pipo para</span>
      <strong>Resumir perfil,</strong>
      <strong>Redigir mensagem</strong>
      <span>ou</span>
      <strong>Comparar cargo</strong>
    </p>
  )

  const infoList = (
    <div className="colaborador-detail__info-list">
      <div className="colaborador-detail__row">
        <At size={20} className="colaborador-detail__row-icon" />
        <span className="colaborador-detail__row-label">Email</span>
        <InlineEditField
          value={collaborator.email ?? ''}
          displayValue={collaborator.email || 'Adicionar'}
          disabled={desligado}
          validate={(draft) => isValidEmail(draft)}
          onSave={(draft) => updateField('email', draft)}
        />
      </div>

      <div className="colaborador-detail__row">
        <img
          className="colaborador-detail__row-icon"
          src={briefcaseIcon}
          alt=""
          width={20}
          height={20}
        />
        <span className="colaborador-detail__row-label">Cargo</span>
        <CargoField
          value={collaborator.cargos}
          cargos={cargos}
          disabled={desligado}
          onSave={(draft) => updateField('cargos', draft)}
        />
      </div>

      <div className="colaborador-detail__row">
        <img
          className="colaborador-detail__row-icon"
          src={usersFourIcon}
          alt=""
          width={20}
          height={20}
        />
        <span className="colaborador-detail__row-label">Time</span>
        <TimeField
          value={collaborator.times}
          times={times}
          disabled={desligado}
          onSave={(draft) => updateField('times', draft)}
        />
      </div>

      <div className="colaborador-detail__row">
        <img
          className="colaborador-detail__row-icon"
          src={userIcon}
          alt=""
          width={20}
          height={20}
        />
        <span className="colaborador-detail__row-label">Reporta para</span>
        <ReportaParaField
          value={collaborator.reportaPara}
          ownId={id}
          collaborators={collaborators}
          disabled={desligado}
          onSave={(name) => updateField('reportaPara', name)}
        />
      </div>

      {isFreelancerOrConsultor ? (
        <>
          <div className="colaborador-detail__row">
            <CheckCircle size={20} className="colaborador-detail__row-icon" />
            <span className="colaborador-detail__row-label">Início contrato</span>
            <DateField
              value={collaborator.dataInicioContrato}
              disabled={desligado}
              displayValue={
                collaborator.dataInicioContrato
                  ? formatDatePt(collaborator.dataInicioContrato)
                  : 'Adicionar'
              }
              onSave={(value) => updateField('dataInicioContrato', value)}
            />
          </div>
          <div className="colaborador-detail__row">
            <Flag size={20} className="colaborador-detail__row-icon" />
            <span className="colaborador-detail__row-label">Fim contrato</span>
            <DateField
              value={collaborator.dataFimContrato}
              allowNoEnd
              disabled={desligado}
              displayValue={
                collaborator.dataFimContrato === null
                  ? 'Sem data de fim'
                  : collaborator.dataFimContrato
                    ? formatDatePt(collaborator.dataFimContrato)
                    : 'Adicionar'
              }
              onSave={(value) => updateField('dataFimContrato', value)}
            />
          </div>
        </>
      ) : (
        <div className="colaborador-detail__row">
          <CheckCircle size={20} className="colaborador-detail__row-icon" />
          <span className="colaborador-detail__row-label">Ativo desde</span>
          <DateField
            value={collaborator.dataAdmissao}
            disabled={desligado}
            displayValue={
              collaborator.dataAdmissao ? formatDatePt(collaborator.dataAdmissao) : 'Adicionar'
            }
            onSave={(value) => updateField('dataAdmissao', value)}
          />
        </div>
      )}

      <div className="colaborador-detail__row">
        <PiggyBank size={20} className="colaborador-detail__row-icon" />
        <span className="colaborador-detail__row-label">Salário</span>
        <InlineEditField
          value={amountToDigits(salarioValue)}
          displayValue={salarioVisible ? salarioDisplay : '••••••'}
          disabled={desligado}
          formatForInput={(digits) => (digits ? formatAmountFromDigits(digits) : '')}
          parseInput={(text) => text.replace(/\D/g, '')}
          onSave={(digits) =>
            updateField(
              isFreelancerOrConsultor ? 'valorPagamento' : 'salario',
              centsToAmount(digits),
            )
          }
        />
        <button
          type="button"
          className="colaborador-detail__mask-toggle"
          onClick={() => setSalarioVisible((value) => !value)}
          aria-label={salarioVisible ? 'Ocultar salário' : 'Mostrar salário'}
        >
          {salarioVisible ? <EyeSlash size={24} /> : <Eye size={24} />}
        </button>
      </div>
    </div>
  )

  const notesSection = (
    <div className="colaborador-detail__notes">
      {(collaborator.notas ?? []).map((nota, index) => (
        <div className="colaborador-detail__nota" key={index}>
          <span className="colaborador-detail__nota-date">
            {formatDateDMonthYear(nota.timestamp.slice(0, 10))}
          </span>
          <p className="colaborador-detail__nota-text">{nota.text}</p>
        </div>
      ))}

      {addingNota ? (
        <input
          ref={notaInputRef}
          type="text"
          autoFocus
          className="colaborador-detail__add-nota-input"
          placeholder="Escreva uma nota..."
          value={notaText}
          onChange={(event) => setNotaText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              notaSavingRef.current = true
              saveNota()
            }
            if (event.key === 'Escape') cancelAddNota()
          }}
          onBlur={handleNotaBlur}
        />
      ) : (
        <button type="button" className="colaborador-detail__add-nota" onClick={startAddNota}>
          <NotePencil size={20} color="var(--color-text-secondary)" />
          Adicionar nota
        </button>
      )}
    </div>
  )

  const metricsSection = (
    <div className="colaborador-detail__metrics">
      <p className="colaborador-detail__section-label">Métricas</p>
      <div className="colaborador-detail__stats-row">
        <div className="colaborador-detail__stat-card">
          <div className="colaborador-detail__stat-header">
            <span className="colaborador-detail__stat-label colaborador-detail__stat-label--medium">
              Custo total
            </span>
            <button
              type="button"
              className="colaborador-detail__stat-toggle"
              onClick={() => setCustoVisible((value) => !value)}
              aria-label={custoVisible ? 'Ocultar custo total' : 'Mostrar custo total'}
            >
              {custoVisible ? <EyeSlash size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <span ref={custoValueRef} className="colaborador-detail__stat-value">
            {custoDisplayText}
          </span>
        </div>
        <div className="colaborador-detail__stat-card">
          <span className="colaborador-detail__stat-label">Tempo de casa</span>
          <span ref={tenureValueRef} className="colaborador-detail__stat-value">
            {tenureDisplayText}
          </span>
        </div>
      </div>
    </div>
  )

  const beneficiosSection = beneficiosDoColaborador.length > 0 && (
    <div className="colaborador-detail__beneficios">
      <p className="colaborador-detail__section-label">Beneficios</p>
      {beneficiosDoColaborador.map(({ benefit, filterTipo, Icon, assignedValue }) => (
        <div className="colaborador-detail__beneficio-row" key={benefit.id}>
          <span className="colaborador-detail__beneficio-icon">
            <Icon size={18} />
          </span>
          <span className="colaborador-detail__beneficio-info">
            <span className="colaborador-detail__beneficio-tipo">{filterTipo}</span>
            <span className="colaborador-detail__beneficio-name">{benefit.name}</span>
          </span>
          <span className="colaborador-detail__beneficio-value">{assignedValue}</span>
          <img src={arrowUpRightIcon} width={24} height={24} alt="" />
        </div>
      ))}
    </div>
  )

  return (
    <div
      className={[
        'colaborador-detail',
        mode === 'full' ? 'colaborador-detail--full' : 'colaborador-detail--panel',
        entered ? 'colaborador-detail--entered' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="colaborador-detail__header">
        <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
        <span className="colaborador-detail__header-title">Colaborador</span>
        <IconButton icon={trashIcon} alt="Excluir" onClick={() => setDeleteModalOpen(true)} />
        <button
          type="button"
          className={
            desligado
              ? 'icon-button colaborador-detail__power-button colaborador-detail__power-button--active'
              : 'icon-button colaborador-detail__power-button'
          }
          onClick={handlePowerClick}
          aria-label={desligado ? 'Reativar' : 'Desligar'}
        >
          <Power size={24} weight={desligado ? 'fill' : 'regular'} />
        </button>
        {mode === 'full' ? (
          <button
            type="button"
            className="icon-button colaborador-detail__expand-button"
            onClick={onCollapse}
            aria-label="Recolher"
          >
            <img src={backToModalIcon} alt="" width={24} height={24} />
          </button>
        ) : (
          <button
            type="button"
            className="icon-button colaborador-detail__expand-button"
            onClick={onExpand}
            aria-label="Expandir"
          >
            <FrameCorners size={24} />
          </button>
        )}
      </header>

      <div className="colaborador-detail__scroll">
        {mode === 'full' ? (
          <div className="colaborador-detail__columns">
            <div className="colaborador-detail__column colaborador-detail__column--main">
              {profileSection}
              {pipoBar}
              {infoList}
              {metricsSection}
              {beneficiosSection}
            </div>
            <div className="colaborador-detail__column colaborador-detail__column--notes">
              {notesSection}
            </div>
          </div>
        ) : (
          <>
            {profileSection}
            {pipoBar}
            {infoList}
            {notesSection}
            {metricsSection}
            {beneficiosSection}
          </>
        )}
      </div>

      {deleteModalOpen && (
        <DeleteColaboradorModal
          name={collaborator.name}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {desligarModalOpen && (
        <DesligarColaboradorModal
          name={collaborator.name}
          onCancel={() => setDesligarModalOpen(false)}
          onConfirm={handleConfirmDesligar}
        />
      )}
    </div>
  )
}

export default ColaboradorDetail

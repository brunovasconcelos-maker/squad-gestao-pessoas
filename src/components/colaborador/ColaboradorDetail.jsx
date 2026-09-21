import { useState } from 'react'
import { At, CheckCircle, Flag, PiggyBank, NotePencil, Power, FrameCorners } from '@phosphor-icons/react'
import closeIcon from '../../assets/icons/Close.svg'
import trashIcon from '../../assets/icons/Trash.svg'
import briefcaseIcon from '../../assets/icons/Briefcase.svg'
import usersFourIcon from '../../assets/icons/UsersFour.svg'
import userIcon from '../../assets/icons/User.svg'
import arrowUpRightIcon from '../../assets/icons/ArrowUpRight.svg'
import IconButton from '../IconButton.jsx'
import ActivityTag from '../ActivityTag.jsx'
import InlineEditField from './InlineEditField.jsx'
import CargoField from './CargoField.jsx'
import TimeField from './TimeField.jsx'
import ReportaParaField from './ReportaParaField.jsx'
import AdicionarNotaModal from './AdicionarNotaModal.jsx'
import DeleteColaboradorModal from './DeleteColaboradorModal.jsx'
import DateFieldModal from '../addCollaborator/DateFieldModal.jsx'
import EndDateFieldModal from '../addCollaborator/EndDateFieldModal.jsx'
import { COLLECTIONS, getCollection, setCollection } from '../../utils/storage.js'
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

function ColaboradorDetail({ id, mode, onClose, onExpand, onCollapse, onDataChanged }) {
  const [collaborators, setCollaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const times = getCollection(COLLECTIONS.TIMES)
  const cargos = getCollection(COLLECTIONS.CARGOS)
  const beneficios = getCollection(COLLECTIONS.BENEFICIOS)

  const [openDateModal, setOpenDateModal] = useState(null)
  const [notaModalOpen, setNotaModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

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

  if (!collaborator) return null

  const desligado = Boolean(collaborator.desligado)
  const isFreelancerOrConsultor =
    collaborator.contractType === 'Freelancer' || collaborator.contractType === 'Consultor'

  const handleDelete = () => {
    const updated = collaborators.filter((item) => item.id !== id)
    setCollection(COLLECTIONS.COLABORADORES, updated)
    onDataChanged?.(updated)
    onClose()
  }

  const handleAddNota = (text) => {
    const notas = [...(collaborator.notas ?? []), { text, timestamp: new Date().toISOString() }]
    updateField('notas', notas)
    setNotaModalOpen(false)
  }

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
      }
    })

  const salarioValue = isFreelancerOrConsultor ? collaborator.valorPagamento : collaborator.salario
  const salarioDisplay =
    salarioValue == null
      ? 'Adicionar'
      : isFreelancerOrConsultor
        ? formatPaymentValue(salarioValue, collaborator.tipoPagamento)
        : formatCurrencyBRL(salarioValue)

  return (
    <div
      className={
        mode === 'full'
          ? 'colaborador-detail colaborador-detail--full'
          : 'colaborador-detail colaborador-detail--panel'
      }
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
          onClick={() => updateField('desligado', !desligado)}
          aria-label={desligado ? 'Reativar' : 'Desligar'}
        >
          <Power size={24} weight={desligado ? 'fill' : 'regular'} />
        </button>
        <button
          type="button"
          className="icon-button colaborador-detail__expand-button"
          onClick={mode === 'full' ? onCollapse : onExpand}
          aria-label={mode === 'full' ? 'Recolher' : 'Expandir'}
        >
          <FrameCorners size={24} />
        </button>
      </header>

      <div className="colaborador-detail__scroll">
        <div className="colaborador-detail__profile">
          <span className="colaborador-detail__avatar">
            <img src={userIcon} alt="" width={20} height={20} />
          </span>
          <span className="colaborador-detail__name">{collaborator.name}</span>
          <ActivityTag contractType={collaborator.contractType} desligado={desligado} />
        </div>

        <p className="colaborador-detail__pipo-bar">
          Peça ao Pipo para <strong>Resumir perfil,</strong>
          <strong> Redigir mensagem</strong> ou <strong> Comparar cargo</strong>
        </p>

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
                <button
                  type="button"
                  className="colaborador-detail__value-button"
                  disabled={desligado}
                  onClick={() => setOpenDateModal('inicioContrato')}
                >
                  {collaborator.dataInicioContrato
                    ? formatDatePt(collaborator.dataInicioContrato)
                    : 'Adicionar'}
                </button>
              </div>
              <div className="colaborador-detail__row">
                <Flag size={20} className="colaborador-detail__row-icon" />
                <span className="colaborador-detail__row-label">Fim contrato</span>
                <button
                  type="button"
                  className="colaborador-detail__value-button"
                  disabled={desligado}
                  onClick={() => setOpenDateModal('fimContrato')}
                >
                  {collaborator.dataFimContrato === null
                    ? 'Sem data de fim'
                    : collaborator.dataFimContrato
                      ? formatDatePt(collaborator.dataFimContrato)
                      : 'Adicionar'}
                </button>
              </div>
            </>
          ) : (
            <div className="colaborador-detail__row">
              <CheckCircle size={20} className="colaborador-detail__row-icon" />
              <span className="colaborador-detail__row-label">Ativo desde</span>
              <button
                type="button"
                className="colaborador-detail__value-button"
                disabled={desligado}
                onClick={() => setOpenDateModal('ativoDesde')}
              >
                {collaborator.dataAdmissao ? formatDatePt(collaborator.dataAdmissao) : 'Adicionar'}
              </button>
            </div>
          )}

          <div className="colaborador-detail__row">
            <PiggyBank size={20} className="colaborador-detail__row-icon" />
            <span className="colaborador-detail__row-label">Salário</span>
            <InlineEditField
              value={amountToDigits(salarioValue)}
              displayValue={salarioDisplay}
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
          </div>
        </div>

        <div className="colaborador-detail__notes">
          {(collaborator.notas ?? []).map((nota, index) => (
            <div className="colaborador-detail__nota" key={index}>
              <span className="colaborador-detail__nota-date">
                {formatDateDMonthYear(nota.timestamp.slice(0, 10))}
              </span>
              <p className="colaborador-detail__nota-text">{nota.text}</p>
            </div>
          ))}
          <button
            type="button"
            className="colaborador-detail__add-nota"
            onClick={() => setNotaModalOpen(true)}
          >
            <NotePencil size={20} />
            Adicionar nota
          </button>
        </div>

        {beneficiosDoColaborador.length > 0 && (
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
        )}
      </div>

      {openDateModal === 'ativoDesde' && (
        <DateFieldModal
          title="Ativo desde"
          value={collaborator.dataAdmissao}
          onClose={() => setOpenDateModal(null)}
          onSave={(value) => {
            updateField('dataAdmissao', value)
            setOpenDateModal(null)
          }}
        />
      )}

      {openDateModal === 'inicioContrato' && (
        <DateFieldModal
          title="Início contrato"
          value={collaborator.dataInicioContrato}
          onClose={() => setOpenDateModal(null)}
          onSave={(value) => {
            updateField('dataInicioContrato', value)
            setOpenDateModal(null)
          }}
        />
      )}

      {openDateModal === 'fimContrato' && (
        <EndDateFieldModal
          value={collaborator.dataFimContrato}
          onClose={() => setOpenDateModal(null)}
          onSave={(value) => {
            updateField('dataFimContrato', value)
            setOpenDateModal(null)
          }}
        />
      )}

      {notaModalOpen && (
        <AdicionarNotaModal onClose={() => setNotaModalOpen(false)} onSave={handleAddNota} />
      )}

      {deleteModalOpen && (
        <DeleteColaboradorModal
          name={collaborator.name}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export default ColaboradorDetail

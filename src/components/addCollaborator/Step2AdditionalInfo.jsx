import { useState } from 'react'
import caretRightIcon from '../../assets/icons/CaretRight.svg'
import WizardShell from './WizardShell.jsx'
import EmailModal from './EmailModal.jsx'
import MultiSelectFieldModal from './MultiSelectFieldModal.jsx'
import ReportaParaModal from './ReportaParaModal.jsx'
import DataAdmissaoModal from './DataAdmissaoModal.jsx'
import SalarioModal from './SalarioModal.jsx'
import { COLLECTIONS, addItem } from '../../utils/storage.js'
import { formatDatePt, formatCurrencyBRL } from '../../utils/formatters.js'
import './buttons.css'
import './Step2AdditionalInfo.css'

const FIELDS = [
  {
    id: 'email',
    label: 'Email',
    getDisplay: (v) => v.email || null,
  },
  {
    id: 'cargo',
    label: 'Cargo',
    getDisplay: (v) => (v.cargos.length ? v.cargos.join(', ') : null),
  },
  {
    id: 'time',
    label: 'Time',
    getDisplay: (v) => (v.times.length ? v.times.join(', ') : null),
  },
  {
    id: 'reporta-para',
    label: 'Reporta para',
    getDisplay: (v) => v.reportaPara || null,
  },
  {
    id: 'data-admissao',
    label: 'Data de admissão',
    getDisplay: (v) => (v.dataAdmissao ? formatDatePt(v.dataAdmissao) : null),
  },
  {
    id: 'salario',
    label: 'Salário',
    getDisplay: (v) => (v.salario != null ? formatCurrencyBRL(v.salario) : null),
  },
]

function Step2AdditionalInfo({ name, contractType, onBack, onExit, onContinue }) {
  const [values, setValues] = useState({
    email: '',
    cargos: [],
    times: [],
    reportaPara: null,
    dataAdmissao: null,
    salario: null,
  })
  const [openModal, setOpenModal] = useState(null)

  const closeModal = () => setOpenModal(null)

  const handleContinue = () => {
    addItem(COLLECTIONS.COLABORADORES, {
      name,
      contractType,
      email: values.email,
      cargos: values.cargos,
      times: values.times,
      reportaPara: values.reportaPara,
      dataAdmissao: values.dataAdmissao,
      salario: values.salario,
    })
    onContinue()
  }

  return (
    <WizardShell
      onClose={onExit}
      progress={100}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button type="button" className="pill-button" onClick={handleContinue}>
          Continuar
        </button>
      }
    >
      <div className="step2">
        <p className="step2__section-label">Informações</p>
        <div className="step2__list">
          {FIELDS.map((field) => {
            const displayValue = field.getDisplay(values)
            const filled = displayValue !== null
            return (
              <button
                type="button"
                className="step2__row"
                key={field.id}
                onClick={() => setOpenModal(field.id)}
              >
                <span
                  className={
                    filled
                      ? 'step2__row-label step2__row-label--filled'
                      : 'step2__row-label'
                  }
                >
                  {field.label}
                </span>
                <span className="step2__row-action">
                  {filled ? displayValue : 'Adicionar'}
                </span>
                <span className="step2__row-icon">
                  <img src={caretRightIcon} alt="" width={24} height={24} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {openModal === 'email' && (
        <EmailModal
          value={values.email}
          onClose={closeModal}
          onSave={(email) => {
            setValues((prev) => ({ ...prev, email }))
            closeModal()
          }}
        />
      )}

      {openModal === 'cargo' && (
        <MultiSelectFieldModal
          title="Cargo"
          collectionName={COLLECTIONS.CARGOS}
          createLabelPrefix="Criar cargo"
          value={values.cargos}
          onClose={closeModal}
          onSave={(cargos) => {
            setValues((prev) => ({ ...prev, cargos }))
            closeModal()
          }}
        />
      )}

      {openModal === 'time' && (
        <MultiSelectFieldModal
          title="Time"
          collectionName={COLLECTIONS.TIMES}
          createLabelPrefix="Criar time"
          value={values.times}
          onClose={closeModal}
          onSave={(times) => {
            setValues((prev) => ({ ...prev, times }))
            closeModal()
          }}
        />
      )}

      {openModal === 'reporta-para' && (
        <ReportaParaModal
          value={values.reportaPara}
          onClose={closeModal}
          onSave={(reportaPara) => {
            setValues((prev) => ({ ...prev, reportaPara }))
            closeModal()
          }}
        />
      )}

      {openModal === 'data-admissao' && (
        <DataAdmissaoModal
          value={values.dataAdmissao}
          onClose={closeModal}
          onSave={(dataAdmissao) => {
            setValues((prev) => ({ ...prev, dataAdmissao }))
            closeModal()
          }}
        />
      )}

      {openModal === 'salario' && (
        <SalarioModal
          value={values.salario}
          onClose={closeModal}
          onSave={(salario) => {
            setValues((prev) => ({ ...prev, salario }))
            closeModal()
          }}
        />
      )}
    </WizardShell>
  )
}

export default Step2AdditionalInfo

import { useState } from 'react'
import CltShell from '../../addCollaborator/clt/CltShell.jsx'
import LinkModal from '../LinkModal.jsx'
import ContatoFornecedorModal from '../ContatoFornecedorModal.jsx'
import EmailFornecedorModal from '../EmailFornecedorModal.jsx'
import '../../addCollaborator/buttons.css'
import '../../addCollaborator/clt/CltShell.css'
import '../../colaborador/ColaboradorDetail.css'
import '../../addTeam/novoTime/NovoTimeSteps.css'

function BeneficioInfoStep({ infoAdicional, onInfoAdicionalChange, onBack, onClose, onCreate }) {
  const [openModal, setOpenModal] = useState(null)
  const closeModal = () => setOpenModal(null)

  return (
    <>
      <CltShell
        title="Novo Benefício"
        onClose={onClose}
        progress={100}
        footerLeft={
          <button type="button" className="text-button" onClick={onBack}>
            Voltar
          </button>
        }
        footerRight={
          <button type="button" className="pill-button" onClick={onCreate}>
            Criar benefício
          </button>
        }
      >
        <div className="clt-shell__content">
          <h1 className="clt-shell__title">
            Finalize com algumas
            <br />
            informações adicionais.
          </h1>

          <div>
            <div className="time-step__row time-step__row--bordered">
              <span className="time-step__row-label" style={{ flex: 1 }}>
                Link do benefício
              </span>
              <button
                type="button"
                className="colaborador-detail__value-button"
                onClick={() => setOpenModal('link')}
              >
                {infoAdicional.link || 'Adicionar'}
              </button>
            </div>

            <div className="time-step__row time-step__row--bordered">
              <span className="time-step__row-label" style={{ flex: 1 }}>
                Contato do fornecedor
              </span>
              <button
                type="button"
                className="colaborador-detail__value-button"
                onClick={() => setOpenModal('contato')}
              >
                {infoAdicional.contato || 'Adicionar'}
              </button>
            </div>

            <div className="time-step__row time-step__row--bordered">
              <span className="time-step__row-label" style={{ flex: 1 }}>
                Email do fornecedor
              </span>
              <button
                type="button"
                className="colaborador-detail__value-button"
                onClick={() => setOpenModal('email')}
              >
                {infoAdicional.email || 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      </CltShell>

      {openModal === 'link' && (
        <LinkModal
          value={infoAdicional.link}
          onClose={closeModal}
          onSave={(value) => {
            onInfoAdicionalChange('link', value)
            closeModal()
          }}
        />
      )}

      {openModal === 'contato' && (
        <ContatoFornecedorModal
          value={infoAdicional.contato}
          onClose={closeModal}
          onSave={(value) => {
            onInfoAdicionalChange('contato', value)
            closeModal()
          }}
        />
      )}

      {openModal === 'email' && (
        <EmailFornecedorModal
          value={infoAdicional.email}
          onClose={closeModal}
          onSave={(value) => {
            onInfoAdicionalChange('email', value)
            closeModal()
          }}
        />
      )}
    </>
  )
}

export default BeneficioInfoStep

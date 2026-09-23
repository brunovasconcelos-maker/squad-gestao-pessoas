import { useEffect, useState } from 'react'
import { Briefcase } from '@phosphor-icons/react'
import closeIcon from '../../../assets/icons/Close.svg'
import IconButton from '../../IconButton.jsx'
import { COLLECTIONS, addItem } from '../../../utils/storage.js'
import '../buttons.css'
import './SidePanel.css'

function NovoCargoPanel({ name, onClose, onCreated }) {
  const [descricao, setDescricao] = useState('')
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleSave = () => {
    const newCargo = addItem(COLLECTIONS.CARGOS, { name, descricao, pending: true })
    onCreated(newCargo.name)
  }

  return (
    <>
      <div className="clt-side-panel-overlay" onClick={onClose} />
      <div className={entered ? 'clt-side-panel clt-side-panel--entered' : 'clt-side-panel'}>
        <div className="clt-side-panel__header">
          <span className="clt-side-panel__title">Novo cargo</span>
          <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
        </div>

        <div className="clt-side-panel__body">
          <div className="clt-side-panel__profile">
            <span className="clt-side-panel__profile-badge">
              <Briefcase size={24} />
            </span>
            <span className="clt-side-panel__profile-name">{name}</span>
          </div>

          <div className="clt-side-panel__descricao-box">
            <span className="clt-side-panel__descricao-label">Descrição</span>
            <textarea
              className="clt-side-panel__descricao-input"
              placeholder="Descreva o cargo..."
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
            />
          </div>
        </div>

        <div className="clt-side-panel__footer">
          <button type="button" className="text-button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="pill-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </>
  )
}

export default NovoCargoPanel

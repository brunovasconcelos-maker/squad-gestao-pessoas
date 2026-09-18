import { FolderSimplePlus } from '@phosphor-icons/react'
import trashIcon from '../assets/icons/Trash.svg'
import closeIcon from '../assets/icons/Close.svg'
import './BulkActionBar.css'

function BulkActionBar({ count, onAddEmTime, onDelete, onClose }) {
  if (count === 0) return null

  return (
    <div className="bulk-action-bar">
      <span className="bulk-action-bar__count">{count} selecionados</span>

      <div className="bulk-action-bar__actions">
        <button
          type="button"
          className="bulk-action-bar__button"
          onClick={onAddEmTime}
        >
          Add em time
          <FolderSimplePlus size={24} />
        </button>

        <button
          type="button"
          className="bulk-action-bar__icon-button"
          onClick={onDelete}
          aria-label="Deletar selecionados"
        >
          <img src={trashIcon} width={24} height={24} alt="" />
        </button>
      </div>

      <button
        type="button"
        className="bulk-action-bar__close"
        onClick={onClose}
      >
        <img src={closeIcon} width={24} height={24} alt="Fechar seleção" />
      </button>
    </div>
  )
}

export default BulkActionBar

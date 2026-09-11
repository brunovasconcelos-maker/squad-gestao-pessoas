import copySimpleIcon from '../assets/icons/CopySimple.svg'
import trashIcon from '../assets/icons/Trash.svg'
import closeIcon from '../assets/icons/Close.svg'
import './BulkActionBar.css'

function BulkActionBar({ count, onDuplicate, onDelete, onClose }) {
  if (count === 0) return null

  return (
    <div className="bulk-action-bar">
      <span className="bulk-action-bar__count">{count} selecionados</span>

      <button
        type="button"
        className="bulk-action-bar__button"
        onClick={onDuplicate}
      >
        Duplicar
        <img src={copySimpleIcon} width={24} height={24} alt="" />
      </button>

      <button
        type="button"
        className="bulk-action-bar__button bulk-action-bar__button--danger"
        onClick={onDelete}
      >
        Deletar
        <img src={trashIcon} width={24} height={24} alt="" />
      </button>

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

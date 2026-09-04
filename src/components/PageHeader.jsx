import plusIcon from '../assets/icons/Plus.svg'
import './PageHeader.css'

function PageHeader({ title, onNovoClick }) {
  return (
    <div className="page-header">
      <h1 className="page-header__title">{title}</h1>
      <button
        type="button"
        className="page-header__new-button"
        onClick={onNovoClick}
      >
        <img src={plusIcon} width={24} height={24} alt="" />
        Novo
      </button>
    </div>
  )
}

export default PageHeader

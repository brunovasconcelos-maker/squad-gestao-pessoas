import slidersHorizontalIcon from '../assets/icons/SlidersHorizontal.svg'
import squaresFourIcon from '../assets/icons/SquaresFour.svg'
import squaresFourEmptIcon from '../assets/icons/SquaresFourEmpt.svg'
import rowsIcon from '../assets/icons/Rows.svg'
import rowsEmptIcon from '../assets/icons/RowsEmpt.svg'
import searchIcon from '../assets/icons/Search.svg'
import './CollaboradoresToolbar.css'

function CollaboradoresToolbar({ total, view, onViewChange }) {
  return (
    <div className="colaboradores-toolbar">
      <span className="colaboradores-toolbar__total">
        Total: {total} colaboradores
      </span>

      <div className="colaboradores-toolbar__actions">
        <button type="button" className="colaboradores-toolbar__filtros">
          Filtros
          <img src={slidersHorizontalIcon} width={24} height={24} alt="" />
        </button>

        <div className="colaboradores-toolbar__view-toggle">
          <button
            type="button"
            className={
              view === 'grid'
                ? 'colaboradores-toolbar__view-button colaboradores-toolbar__view-button--active'
                : 'colaboradores-toolbar__view-button'
            }
            onClick={() => onViewChange('grid')}
          >
            <img
              src={view === 'grid' ? squaresFourIcon : squaresFourEmptIcon}
              width={20}
              height={20}
              alt="Visualização em grade"
            />
          </button>
          <button
            type="button"
            className={
              view === 'table'
                ? 'colaboradores-toolbar__view-button colaboradores-toolbar__view-button--active'
                : 'colaboradores-toolbar__view-button'
            }
            onClick={() => onViewChange('table')}
          >
            <img
              src={view === 'table' ? rowsIcon : rowsEmptIcon}
              width={20}
              height={20}
              alt="Visualização em tabela"
            />
          </button>
        </div>

        <div className="colaboradores-toolbar__search">
          <img src={searchIcon} width={20} height={20} alt="" />
          <input
            type="text"
            className="colaboradores-toolbar__search-input"
            placeholder="Pesquisar por um colaborador..."
          />
        </div>
      </div>
    </div>
  )
}

export default CollaboradoresToolbar

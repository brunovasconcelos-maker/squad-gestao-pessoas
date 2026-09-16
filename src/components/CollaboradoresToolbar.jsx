import slidersHorizontalIcon from '../assets/icons/SlidersHorizontal.svg'
import squaresFourIcon from '../assets/icons/SquaresFour.svg'
import squaresFourEmptIcon from '../assets/icons/SquaresFourEmpt.svg'
import rowsIcon from '../assets/icons/Rows.svg'
import rowsEmptIcon from '../assets/icons/RowsEmpt.svg'
import closeIcon from '../assets/icons/Close.svg'
import './CollaboradoresToolbar.css'

function CollaboradoresToolbar({
  total,
  view,
  onViewChange,
  onFiltrosClick,
  filtersSummary,
  onClearAllFilters,
}) {
  return (
    <div className="colaboradores-toolbar">
      <span className="colaboradores-toolbar__total">
        Total: {total} colaboradores
      </span>

      <div className="colaboradores-toolbar__actions">
        {filtersSummary && (
          <div className="colaboradores-toolbar__filters-summary">
            <span className="colaboradores-toolbar__filters-summary-text">
              {filtersSummary}
            </span>
            <button
              type="button"
              className="colaboradores-toolbar__filters-summary-clear"
              onClick={onClearAllFilters}
            >
              <img src={closeIcon} width={20} height={20} alt="Limpar filtros" />
            </button>
          </div>
        )}

        <button
          type="button"
          className="colaboradores-toolbar__filtros"
          onClick={onFiltrosClick}
        >
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
      </div>
    </div>
  )
}

export default CollaboradoresToolbar

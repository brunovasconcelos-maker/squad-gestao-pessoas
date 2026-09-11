import userIcon from '../assets/icons/User.svg'
import dotsThreeIcon from '../assets/icons/DotsThree.svg'
import squareIcon from '../assets/icons/Square.svg'
import checkSquareIcon from '../assets/icons/CheckSquare.svg'
import IconButton from './IconButton.jsx'
import ActivityTag from './ActivityTag.jsx'
import './CollaboratorsGrid.css'

function CollaboratorsGrid({ collaborators, selectedIds, onToggleSelect }) {
  return (
    <div className="collaborators-grid">
      {collaborators.map((collaborator) => {
        const isSelected = selectedIds.has(collaborator.id)
        return (
          <div
            className={
              isSelected
                ? 'collaborator-card collaborator-card--selected'
                : 'collaborator-card'
            }
            key={collaborator.id}
          >
            <div className="collaborator-card__top-row">
              <button
                type="button"
                className="collaborator-card__checkbox"
                onClick={() => onToggleSelect(collaborator.id)}
              >
                <img
                  src={isSelected ? checkSquareIcon : squareIcon}
                  width={24}
                  height={24}
                  alt=""
                />
              </button>
              <div className="collaborator-card__avatar">
                <img src={userIcon} width={20} height={20} alt="" />
              </div>
              <IconButton icon={dotsThreeIcon} alt="Mais opções" iconSize={24} />
            </div>

            <div className="collaborator-card__info">
              <span className="collaborator-card__name">
                {collaborator.name}
              </span>
              <span className="collaborator-card__meta">
                {collaborator.cargos.join(', ')}
              </span>
              <span className="collaborator-card__meta">
                {collaborator.times.join(', ')}
              </span>
            </div>

            <ActivityTag contractType={collaborator.contractType} />
          </div>
        )
      })}
    </div>
  )
}

export default CollaboratorsGrid

import userIcon from '../assets/icons/User.svg'
import dotsThreeIcon from '../assets/icons/DotsThree.svg'
import squareIcon from '../assets/icons/Square.svg'
import IconButton from './IconButton.jsx'
import ActivityTag from './ActivityTag.jsx'
import './CollaboratorsGrid.css'

function CollaboratorsGrid({ collaborators }) {
  return (
    <div className="collaborators-grid">
      {collaborators.map((collaborator) => (
        <div className="collaborator-card" key={collaborator.id}>
          <div className="collaborator-card__top-row">
            <div className="collaborator-card__checkbox">
              <img src={squareIcon} width={24} height={24} alt="" />
            </div>
            <div className="collaborator-card__avatar">
              <img src={userIcon} width={20} height={20} alt="" />
            </div>
            <IconButton icon={dotsThreeIcon} alt="Mais opções" iconSize={24} />
          </div>

          <div className="collaborator-card__info">
            <span className="collaborator-card__name">{collaborator.name}</span>
            <span className="collaborator-card__meta">
              {collaborator.cargos.join(', ')}
            </span>
            <span className="collaborator-card__meta">
              {collaborator.times.join(', ')}
            </span>
          </div>

          <ActivityTag contractType={collaborator.contractType} />
        </div>
      ))}
    </div>
  )
}

export default CollaboratorsGrid

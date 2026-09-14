import usersFourIcon from '../assets/icons/UsersFour.svg'
import dotsThreeIcon from '../assets/icons/DotsThree.svg'
import IconButton from './IconButton.jsx'
import './TimesGrid.css'

function TimesGrid({ teams }) {
  return (
    <div className="times-grid">
      {teams.map((team) => (
        <div
          className={
            team.pending ? 'time-card time-card--pending' : 'time-card'
          }
          key={team.id}
        >
          <div className="time-card__top-row">
            {team.pending ? (
              <>
                <div className="time-card__left-group">
                  <div className="time-card__icon-badge">
                    <img src={usersFourIcon} width={24} height={24} alt="" />
                  </div>
                  <span className="time-card__pending-pill">Pendente</span>
                </div>
                <button type="button" className="time-card__criar-time-button">
                  Criar time
                </button>
              </>
            ) : (
              <>
                <div className="time-card__icon-badge">
                  <img src={usersFourIcon} width={24} height={24} alt="" />
                </div>
                <IconButton icon={dotsThreeIcon} alt="Mais opções" iconSize={24} />
              </>
            )}
          </div>
          <div className="time-card__info">
            <span className="time-card__name">{team.name}</span>
            <span className="time-card__count">{team.memberCount} pessoas</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimesGrid

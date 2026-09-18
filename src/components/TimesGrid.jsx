import usersFourGrayIcon from '../assets/icons/UsersFourGray.svg'
import pencilRulerIcon from '../assets/icons/PencilRuler.svg'
import dotsThreeIcon from '../assets/icons/DotsThree.svg'
import IconButton from './IconButton.jsx'
import { getTeamColorTones, getTeamIconComponent } from '../utils/teamOptions.js'
import './TimesGrid.css'

function TimeCard({ team }) {
  const { light, dark } = getTeamColorTones(team.color)
  const IconComponent = getTeamIconComponent(team.icon)
  return (
    <div className="time-card">
      <div className="time-card__top-row">
        <div className="time-card__icon-badge" style={{ background: light }}>
          <IconComponent size={24} color={dark} />
        </div>
        <IconButton icon={dotsThreeIcon} alt="Mais opções" iconSize={24} />
      </div>
      <div className="time-card__info">
        <span className="time-card__name">{team.name}</span>
        <span className="time-card__count">{team.memberCount} pessoas</span>
      </div>
    </div>
  )
}

function TimesGrid({ teams, onCriarTime }) {
  return (
    <div className="times-grid">
      {teams.map((team) =>
        team.pending ? (
          <div className="time-card time-card--pending" key={team.id}>
            <div className="time-card__top-row">
              <div className="time-card__icon-cluster">
                <div className="time-card__sticker time-card__sticker--back">
                  <img src={usersFourGrayIcon} width={24} height={24} alt="" />
                </div>
                <div className="time-card__sticker time-card__sticker--front">
                  <img src={pencilRulerIcon} width={24} height={24} alt="" />
                </div>
              </div>
              <button
                type="button"
                className="time-card__criar-time-button"
                onClick={() => onCriarTime(team.id)}
              >
                Criar time
              </button>
            </div>
            <div className="time-card__bottom-row">
              <span className="time-card__pending-name">{team.name}</span>
              <span className="time-card__count">{team.memberCount} pessoas</span>
            </div>
            <svg className="time-card__dashed-border" aria-hidden="true">
              <rect className="time-card__dashed-border-rect" />
            </svg>
          </div>
        ) : (
          <TimeCard team={team} key={team.id} />
        )
      )}
    </div>
  )
}

export default TimesGrid

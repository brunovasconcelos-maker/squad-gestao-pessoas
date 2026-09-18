import WizardShell from '../addCollaborator/WizardShell.jsx'
import { TEAM_COLORS, TEAM_ICON_OPTIONS } from '../../utils/teamOptions.js'
import '../addCollaborator/buttons.css'
import '../addCollaborator/Step1BasicInfo.css'
import './Step1TeamInfo.css'

function Step1TeamInfo({
  name,
  onNameChange,
  color,
  onColorChange,
  icon,
  onIconChange,
  onExit,
  onContinue,
}) {
  const canContinue = name.trim().length > 0

  return (
    <WizardShell
      title="Novo Time"
      onClose={onExit}
      progress={50}
      footerLeft={
        <button type="button" className="text-button" onClick={onExit}>
          Voltar
        </button>
      }
      footerRight={
        <button
          type="button"
          className="pill-button"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continuar
        </button>
      }
    >
      <div className="step1">
        <input
          type="text"
          className="step1__name-input"
          placeholder="Nome do time"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />

        <div className="team-option-group">
          <p className="team-option-group__label">Cor do time</p>
          <div className="team-option-group__row">
            {TEAM_COLORS.map((swatch) => (
              <button
                type="button"
                key={swatch}
                className={
                  swatch === color
                    ? 'team-color-swatch team-color-swatch--selected'
                    : 'team-color-swatch'
                }
                style={{ background: swatch }}
                onClick={() => onColorChange(swatch)}
                aria-label={swatch}
              />
            ))}
          </div>
        </div>

        <div className="team-option-group">
          <p className="team-option-group__label">Icone do time</p>
          <div className="team-option-group__row">
            {TEAM_ICON_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.id}
                className={
                  option.id === icon
                    ? 'team-icon-swatch team-icon-swatch--selected'
                    : 'team-icon-swatch'
                }
                onClick={() => onIconChange(option.id)}
              >
                <img src={option.src} alt={option.alt} width={24} height={24} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </WizardShell>
  )
}

export default Step1TeamInfo

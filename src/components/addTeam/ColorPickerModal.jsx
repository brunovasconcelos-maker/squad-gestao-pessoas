import closeIcon from '../../assets/icons/Close.svg'
import IconButton from '../IconButton.jsx'
import ModalOverlay from '../addCollaborator/ModalOverlay.jsx'
import { TEAM_COLOR_PALETTE } from '../../utils/teamOptions.js'
import '../addCollaborator/FieldModalShell.css'
import './ColorPickerModal.css'

function ColorPickerModal({ onSelect, onClose, excludedColorIds = [] }) {
  const excludedSet = new Set(excludedColorIds)
  const availableColors = TEAM_COLOR_PALETTE.filter((entry) => !excludedSet.has(entry.id))

  return (
    <ModalOverlay width={360} className="field-modal">
      <div className="field-modal__header">
        <h2 className="field-modal__title">Cor do time</h2>
        <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
      </div>

      <div className="field-modal__body">
        <div className="color-picker__grid">
          {availableColors.map((entry) => (
            <button
              type="button"
              key={entry.id}
              className="color-picker__swatch"
              style={{ background: entry.dark }}
              onClick={() => onSelect(entry.id)}
              aria-label={entry.id}
            />
          ))}
        </div>
      </div>
    </ModalOverlay>
  )
}

export default ColorPickerModal

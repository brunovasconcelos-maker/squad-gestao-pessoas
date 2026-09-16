import { useRef, useState } from 'react'
import magnifyingGlassIcon from '../assets/icons/MagnifyingGlassGray.svg'
import closeIcon from '../assets/icons/Close.svg'
import microphoneIcon from '../assets/icons/Microphone.svg'
import paperPlaneRightIcon from '../assets/icons/PaperPlaneRight.svg'
import pipoAvatarImage from '../assets/illustrations/Pipo.png'
import './BottomSearchBar.css'

const PLACEHOLDERS = {
  colaboradores: 'Buscar uma pessoa...',
  times: 'Buscar um time...',
  cargos: 'Buscar um cargo...',
  beneficios: 'Buscar um benefício...',
}

const PIPO_PLACEHOLDER = 'Pergunte ao Pipo...'

function BottomSearchBar({ activeTab, onSearchChange }) {
  const [mode, setMode] = useState('default')
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const handleChange = (event) => {
    const nextValue = event.target.value
    setValue(nextValue)
    if (mode === 'search') {
      onSearchChange(nextValue)
    }
  }

  const handleFocus = () => {
    setMode((prev) => (prev === 'default' ? 'search' : prev))
  }

  const handleActivatePipo = () => {
    setMode('pipo')
    inputRef.current?.focus()
  }

  const handleClearSearch = () => {
    setValue('')
    setMode('default')
    onSearchChange('')
    inputRef.current?.blur()
  }

  const handleClearPipo = () => {
    setValue('')
    setMode('default')
    inputRef.current?.blur()
  }

  return (
    <div
      className={
        mode === 'pipo'
          ? 'bottom-search-bar bottom-search-bar--pipo'
          : 'bottom-search-bar'
      }
    >
      <div className="bottom-search-bar__icon-frame">
        {mode === 'pipo' ? (
          <img
            className="bottom-search-bar__pipo-avatar"
            src={pipoAvatarImage}
            alt=""
          />
        ) : (
          <img src={magnifyingGlassIcon} width={20} height={20} alt="" />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="bottom-search-bar__input"
        placeholder={mode === 'pipo' ? PIPO_PLACEHOLDER : PLACEHOLDERS[activeTab]}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
      />

      {mode === 'default' && (
        <button
          type="button"
          className="bottom-search-bar__pipo-pill"
          onClick={handleActivatePipo}
        >
          Pergunte ao Pipo
        </button>
      )}

      {mode === 'search' && (
        <button
          type="button"
          className="bottom-search-bar__close"
          onClick={handleClearSearch}
        >
          <img src={closeIcon} width={20} height={20} alt="Fechar busca" />
        </button>
      )}

      {mode === 'pipo' && (
        <>
          <button
            type="button"
            className="bottom-search-bar__pipo-action bottom-search-bar__pipo-action--transparent"
          >
            <img
              src={value ? paperPlaneRightIcon : microphoneIcon}
              width={20}
              height={20}
              alt=""
            />
          </button>
          <button
            type="button"
            className="bottom-search-bar__pipo-action"
            onClick={handleClearPipo}
          >
            <img src={closeIcon} width={20} height={20} alt="Fechar Pipo" />
          </button>
        </>
      )}
    </div>
  )
}

export default BottomSearchBar

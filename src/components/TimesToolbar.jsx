import slidersHorizontalIcon from '../assets/icons/SlidersHorizontal.svg'
import './TimesToolbar.css'

function TimesToolbar({ total }) {
  return (
    <div className="times-toolbar">
      <span className="times-toolbar__total">Total: {total} times</span>

      <button type="button" className="times-toolbar__filtros">
        Filtros
        <img src={slidersHorizontalIcon} width={24} height={24} alt="" />
      </button>
    </div>
  )
}

export default TimesToolbar

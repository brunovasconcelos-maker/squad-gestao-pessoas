import slidersHorizontalIcon from '../assets/icons/SlidersHorizontal.svg'
import './BeneficiosToolbar.css'

function BeneficiosToolbar({ total }) {
  return (
    <div className="beneficios-toolbar">
      <span className="beneficios-toolbar__total">Total: {total} beneficios</span>

      <button type="button" className="beneficios-toolbar__filtros">
        Filtros
        <img src={slidersHorizontalIcon} width={24} height={24} alt="" />
      </button>
    </div>
  )
}

export default BeneficiosToolbar

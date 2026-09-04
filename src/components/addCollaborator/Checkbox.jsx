import squareIcon from '../../assets/icons/Square.svg'
import './SelectListModal.css'

function Checkbox({ checked }) {
  if (!checked) {
    return <img src={squareIcon} alt="" width={24} height={24} />
  }
  return (
    <span className="select-list__checkbox select-list__checkbox--checked">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M13.5 4.5L6 12L2.5 8.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default Checkbox

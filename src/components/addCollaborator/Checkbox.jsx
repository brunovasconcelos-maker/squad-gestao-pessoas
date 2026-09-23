import squareIcon from '../../assets/icons/Square.svg'
import checkSquareIcon from '../../assets/icons/CheckSquare.svg'

function Checkbox({ checked }) {
  if (!checked) {
    return <img src={squareIcon} alt="" width={24} height={24} />
  }
  return <img src={checkSquareIcon} alt="" width={24} height={24} />
}

export default Checkbox

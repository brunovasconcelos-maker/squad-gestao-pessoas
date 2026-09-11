import './IconButton.css'

function IconButton({
  icon,
  alt = '',
  onClick,
  size = 40,
  iconSize = 24,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`.trim()}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <img src={icon} alt={alt} width={iconSize} height={iconSize} />
    </button>
  )
}

export default IconButton

import arrowUpRightIcon from '../assets/icons/ArrowUpRight.svg'
import desktopIcon from '../assets/icons/Desktop.svg'
import vanIcon from '../assets/icons/Van.svg'
import aliceImage from '../assets/images/Frame 2147223814.png'
import cajuImage from '../assets/images/Frame 2147223814-1.png'
import gympassImage from '../assets/images/Frame 2147223814-2.png'
import './BeneficiosGrid.css'

const IMAGE_BY_KEY = {
  alice: aliceImage,
  caju: cajuImage,
  gympass: gympassImage,
}

const ICON_BY_KEY = {
  desktop: desktopIcon,
  van: vanIcon,
}

function BeneficiosGrid({ benefits }) {
  return (
    <div className="beneficios-grid">
      {benefits.map((benefit) => (
        <div className="beneficio-card" key={benefit.id}>
          <div className="beneficio-card__top-row">
            {benefit.iconType === 'image' ? (
              <div className="beneficio-card__icon-container">
                <img
                  className="beneficio-card__image"
                  src={IMAGE_BY_KEY[benefit.image]}
                  alt=""
                />
              </div>
            ) : (
              <div className="beneficio-card__icon-container beneficio-card__icon-container--badge">
                <img src={ICON_BY_KEY[benefit.icon]} width={24} height={24} alt="" />
              </div>
            )}
            <img
              className="beneficio-card__arrow"
              src={arrowUpRightIcon}
              width={24}
              height={24}
              alt=""
            />
          </div>
          <div className="beneficio-card__info">
            <span className="beneficio-card__name">{benefit.name}</span>
            <span className="beneficio-card__count">{benefit.memberCount} pessoas</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BeneficiosGrid

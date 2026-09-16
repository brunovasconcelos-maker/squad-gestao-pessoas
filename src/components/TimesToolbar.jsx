import './TimesToolbar.css'

function TimesToolbar({ total }) {
  return (
    <div className="times-toolbar">
      <span className="times-toolbar__total">Total: {total} times</span>
    </div>
  )
}

export default TimesToolbar

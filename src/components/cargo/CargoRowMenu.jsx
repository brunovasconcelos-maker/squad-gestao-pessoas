import { useEffect, useRef, useState } from 'react'
import { Eye } from '@phosphor-icons/react'
import dotsThreeIcon from '../../assets/icons/DotsThree.svg'
import trashIcon from '../../assets/icons/Trash.svg'
import IconButton from '../IconButton.jsx'
import DeleteCargoModal from './DeleteCargoModal.jsx'
import { COLLECTIONS, getCollection, setCollection } from '../../utils/storage.js'
import './CargoRowMenu.css'

function CargoRowMenu({ row, onView, onDataChanged }) {
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleView = () => {
    setOpen(false)
    onView?.(row.cargoRecordId)
  }

  const handleDeleteConfirm = () => {
    const updatedCargos = getCollection(COLLECTIONS.CARGOS).filter(
      (item) => item.id !== row.cargoRecordId,
    )
    setCollection(COLLECTIONS.CARGOS, updatedCargos)

    const updatedCollaborators = getCollection(COLLECTIONS.COLABORADORES).map((collaborator) =>
      Array.isArray(collaborator.cargos) && collaborator.cargos.includes(row.cargoName)
        ? { ...collaborator, cargos: collaborator.cargos.filter((name) => name !== row.cargoName) }
        : collaborator,
    )
    setCollection(COLLECTIONS.COLABORADORES, updatedCollaborators)
    onDataChanged?.(updatedCollaborators)
    setDeleteModalOpen(false)
  }

  return (
    <div
      className="cargo-row-menu"
      ref={containerRef}
      onClick={(event) => event.stopPropagation()}
    >
      <IconButton
        icon={dotsThreeIcon}
        alt="Mais opções"
        iconSize={24}
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="cargo-row-menu__dropdown">
          <button type="button" className="cargo-row-menu__item" onClick={handleView}>
            <Eye size={20} color="var(--color-text-secondary)" />
            Ver cargo
          </button>
          <button
            type="button"
            className="cargo-row-menu__item"
            onClick={() => {
              setOpen(false)
              setDeleteModalOpen(true)
            }}
          >
            <img src={trashIcon} width={20} height={20} alt="" />
            Excluir
          </button>
        </div>
      )}

      {deleteModalOpen && (
        <DeleteCargoModal
          name={row.cargoName}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}

export default CargoRowMenu

import { useState } from 'react'

export function ConfirmButton({
  label,
  onConfirm,
  disabled = false,
}: {
  label: string
  onConfirm: () => void
  disabled?: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  if (!confirming) {
    return (
      <button type="button" disabled={disabled} onClick={() => setConfirming(true)}>
        {label}
      </button>
    )
  }
  return (
    <span className="button-group">
      <button type="button" disabled={disabled} onClick={onConfirm}>Confirmar</button>
      <button type="button" className="secondary" onClick={() => setConfirming(false)}>Cancelar</button>
    </span>
  )
}

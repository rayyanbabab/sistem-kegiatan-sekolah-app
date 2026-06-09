'use client'

import { Fragment, ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Dialog */}
      <div
        className={`relative w-full ${widths[size]} glass-card rounded-2xl overflow-hidden animate-fade-in-up`}
        style={{ border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--subtle-border)' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Content */}
        <div className="p-5 max-h-[80vh] overflow-y-auto scrollbar-thin">{children}</div>
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  danger?: boolean
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Hapus', loading, danger = true }: ConfirmDialogProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm glass-card rounded-2xl p-6 animate-fade-in-up"
        style={{ border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}>
        <h2 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>Batal</button>
          <button onClick={onConfirm} disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 ${danger ? 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25' : 'bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25'}`}>
            {loading ? <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Memproses...</> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}
export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{hint}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40 ${className || ''}`}
      style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-primary)' }}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}
export function Select({ options, placeholder, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer"
      style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: props.value ? 'var(--text-primary)' : 'var(--text-faint)' }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value} style={{ background: 'hsl(222,47%,9%)' }}>{o.label}</option>)}
    </select>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40 resize-none"
      style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-primary)' }}
    />
  )
}

export function SubmitButton({ loading, label, loadingLabel = 'Menyimpan...' }: { loading: boolean; label: string; loadingLabel?: string }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
      {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {loadingLabel}</> : label}
    </button>
  )
}

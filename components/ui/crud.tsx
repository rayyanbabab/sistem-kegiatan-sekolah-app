'use client'

import React, { Fragment, ReactNode, useEffect, useRef } from 'react'
import { X, Camera, Edit2, Upload, Trash2 } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative w-full ${widths[size]} surface-card rounded-xl border border-border shadow-lg overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/20">
          <h2 id="modal-title" className="font-bold text-sm text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Tutup jendela"
          >
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

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Hapus',
  loading,
  danger = true
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-fade-in-up"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm surface-card rounded-xl border border-border p-6 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-bold text-base text-foreground mb-2">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-xs font-semibold border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
              danger
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : confirmLabel}
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
      <label className="text-xs font-semibold text-foreground tracking-wide block">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2 rounded-lg text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary ${className || ''}`}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}
export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2 rounded-lg text-sm bg-background border border-input text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${className || ''}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-card text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2 rounded-lg text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary resize-none ${className || ''}`}
    />
  )
}

export function SubmitButton({
  loading,
  label,
  loadingLabel = 'Menyimpan...'
}: {
  loading: boolean
  label: string
  loadingLabel?: string
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : label}
    </button>
  )
}

interface ImageUploadProps {
  value: string | null | undefined
  onChange: (base64: string | null) => void
  shape?: 'circle' | 'square'
  size?: number
  placeholder?: string
  maxSizeKB?: number
}

export function ImageUpload({
  value,
  onChange,
  shape = 'circle',
  size = 80,
  placeholder = 'Pilih foto profil atau banner',
  maxSizeKB = 500
}: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const compressImage = (file: File, maxKB: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let w = img.width
          let h = img.height
          const maxDim = 800
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim }
            else { w = Math.round((w * maxDim) / h); h = maxDim }
          }
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, w, h)
          let quality = 0.8
          let dataUrl = canvas.toDataURL('image/jpeg', quality)
          while (dataUrl.length > maxKB * 1024 * 1.37 && quality > 0.3) {
            quality -= 0.1
            dataUrl = canvas.toDataURL('image/jpeg', quality)
          }
          if (dataUrl.length > maxKB * 1024 * 1.37) {
            reject(new Error(`Ukuran gambar terlalu besar setelah kompresi.`))
          } else {
            resolve(dataUrl)
          }
        }
        img.onerror = () => reject(new Error('Gagal membaca format gambar'))
        img.src = e.target!.result as string
      }
      reader.onerror = () => reject(new Error('Gagal membaca file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Format file tidak didukung. Harap pilih gambar (JPG, PNG, WebP)')
      return
    }
    try {
      const compressed = await compressImage(file, maxSizeKB)
      onChange(compressed)
    } catch (err: any) {
      alert(err.message || 'Gagal memproses gambar')
    }
    e.target.value = ''
  }

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg'

  return (
    <div className="flex items-center gap-4">
      <div
        className="shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
        style={{ width: size, height: size }}
        onClick={() => fileRef.current?.click()}
      >
        <div
          className={`w-full h-full ${shapeClass} overflow-hidden bg-muted border border-dashed border-border flex items-center justify-center`}
        >
          {value ? (
            <img src={value} alt="Pratinjau" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div
          className={`absolute inset-0 ${shapeClass} bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white`}
        >
          <Edit2 className="w-4 h-4" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{value ? 'Ganti Foto' : 'Pilih Foto'}</span>
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          {placeholder} • Maksimal {maxSizeKB}KB (JPG, PNG, WebP)
        </p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { removeBackground } from '@imgly/background-removal'
import './App.css'

export default function App() {
  const [original, setOriginal] = useState(null)
  const [result, setResult] = useState(null)
  const [stage, setStage] = useState('')
  const inputRef = useRef(null)

  const mutation = useMutation({
    mutationFn: async (file) => {
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          const pct = Math.round((current / total) * 100)
          setStage(`${key} — ${pct}%`)
        },
      })
      return URL.createObjectURL(blob)
    },
    onSuccess: (url) => {
      setResult(url)
      setStage('')
    },
    onError: () => setStage(''),
  })

  const pickFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    mutation.reset()
    if (original) URL.revokeObjectURL(original.url)
    if (result) URL.revokeObjectURL(result)
    setResult(null)
    setStage('Menyiapkan...')
    setOriginal({ url: URL.createObjectURL(file), name: file.name })
    mutation.mutate(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    pickFile(e.dataTransfer.files && e.dataTransfer.files[0])
  }

  const reset = () => {
    mutation.reset()
    setResult(null)
    setOriginal(null)
    setStage('')
  }

  const busy = mutation.isPending
  const failed = mutation.isError
  const dlName = original ? `nobg-${original.name.replace(/\.[^.]+$/, '')}.png` : 'nobg.png'

  return (
    <div className="page">
      <header>
        <h1>Remove BG</h1>
        <p>Hapus background foto langsung di browser. Gratis, tanpa upload ke server.</p>
      </header>

      {!original && (
        <div
          className="dropzone"
          onClick={() => inputRef.current && inputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="dropzone-icon">🖼️</div>
          <p><strong>Klik</strong> atau <strong>drag &amp; drop</strong> gambar ke sini</p>
          <span>PNG / JPG / WebP</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => pickFile(e.target.files && e.target.files[0])}
      />

      {original && (
        <>
          <div className="panels">
            <figure>
              <figcaption>Asli</figcaption>
              <img src={original.url} alt="asli" />
            </figure>
            <figure>
              <figcaption>Hasil</figcaption>
              {busy && (
                <div className="loading">
                  <div className="spinner" />
                  <p>{stage || 'Memproses...'}</p>
                  <span>Proses pertama kali mengunduh model AI (~40 MB)</span>
                </div>
              )}
              {failed && <div className="error">Gagal memproses gambar. Coba lagi.</div>}
              {result && <img src={result} alt="hasil tanpa background" className="checker" />}
            </figure>
          </div>
          <div className="actions">
            {result && (
              <a className="btn primary" href={result} download={dlName}>
                Unduh PNG
              </a>
            )}
            <button className="btn" onClick={reset} disabled={busy}>
              Gambar lain
            </button>
          </div>
        </>
      )}

      <footer>Jalan 100% di browser pakai model AI — gambarmu tidak dikirim ke mana pun.</footer>
    </div>
  )
}

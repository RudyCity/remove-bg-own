# remove-bg-own

Remove image backgrounds right in the browser. No API key, no uploads, no server — 100% client-side AI.

![stack](https://img.shields.io/badge/react-18-blue) ![license](https://img.shields.io/badge/license-MIT-green)

## Features

- Click or drag & drop an image (PNG / JPG / WebP)
- Side-by-side before / after preview with transparency checkerboard
- One-click PNG download
- Progress indicator (first run downloads the ~40 MB AI model, then it's cached)

## Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query) for async mutation state
- [@imgly/background-removal](https://github.com/imgly/background-removal-js) — runs the segmentation model locally via ONNX Runtime Web

## Quick start

```bash
npm install
npm run dev
```

Then open the printed localhost URL and drop an image in.

## How it works

The uploaded file never leaves your machine. `@imgly/background-removal` downloads a pre-trained segmentation model (from the imgly CDN) on first use and runs inference locally in the browser, returning a PNG with transparency.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

## License

MIT — see [LICENSE](LICENSE).

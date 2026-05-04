import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { Readable } from 'stream'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

const uploadsDir = path.join(__dirname, '..', 'uploads')

export const upload = useCloudinary
  ? multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
  : multer({
      storage: multer.diskStorage({
        destination: uploadsDir,
        filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    })

export async function saveFile(file) {
  if (!file) return null
  if (useCloudinary) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'moreperezmontemayor', resource_type: 'image' },
        (err, res) => (err ? reject(err) : resolve(res))
      )
      Readable.from(file.buffer).pipe(stream)
    })
    return result.secure_url
  }
  return `/uploads/${file.filename}`
}

export async function deleteFile(url) {
  if (!url) return
  if (!useCloudinary || !url.includes('cloudinary.com')) return
  try {
    const uploadIndex = url.indexOf('/upload/')
    if (uploadIndex === -1) return
    const publicId = url
      .slice(uploadIndex + 8)
      .replace(/^v\d+\//, '')
      .replace(/\.[^/.]+$/, '')
    await cloudinary.uploader.destroy(publicId)
  } catch {}
}

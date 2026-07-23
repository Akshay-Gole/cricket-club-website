import { v2 as cloudinary } from 'cloudinary'

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are missing')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export async function uploadImage(buffer: Buffer, folder: string) {
  configureCloudinary()

  return new Promise<{ logoUrl: string; logoPublicId: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload failed'))
            return
          }

          resolve({
            logoUrl: result.secure_url,
            logoPublicId: result.public_id,
          })
        }
      )

      stream.end(buffer)
    }
  )
}

export async function deleteCloudinaryImage(publicId?: string | null) {
  if (!publicId) return

  configureCloudinary()
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

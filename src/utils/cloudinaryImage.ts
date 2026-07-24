export function cloudinaryImage(url: string, transformation: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url
  }

  return url.replace('/image/upload/', `/image/upload/${transformation}/`)
}

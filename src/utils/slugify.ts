export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-']+/g, '') // Keep word chars, dash (-), and apostrophe (')
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

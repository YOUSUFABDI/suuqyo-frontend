// export function slugify(text: string) {
//   return text
//     .toLowerCase()
//     .replace(/\s+/g, '-') // Replace spaces with -
//     .replace(/[^\w\-']+/g, '') // Keep word chars, dash (-), and apostrophe (')
//     .replace(/\-\-+/g, '-') // Replace multiple - with single -
//     .replace(/^-+/, '') // Trim - from start
//     .replace(/-+$/, ''); // Trim - from end
// }

// export function slugify(text: string) {
//   return text
//     .toLowerCase()
//     .replace(/\s+/g, '-') // Replace spaces with -
//     .replace(/[^\w\-'&]+/g, '') // MODIFIED: Keep word chars, dash, apostrophe, AND ampersand
//     .replace(/\-\-+/g, '-') // Replace multiple - with single -
//     .replace(/^-+/, '') // Trim - from start
//     .replace(/-+$/, ''); // Trim - from end
// }

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with _
    .replace(/[^\w\-_'&]+/g, '') // Keep word chars, hyphen, underscore, apostrophe, and ampersand
    .replace(/__+/g, '_') // Replace multiple _ with single _
    .replace(/^_/, '') // Trim _ from start of text
    .replace(/_$/, ''); // Trim _ from end of text
}

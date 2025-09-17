// export function deslugify(slug: string) {
//   return slug.replace(/-/g, ' ');
// }

export function deslugify(slug: string) {
  return slug.replace(/_/g, ' ');
}

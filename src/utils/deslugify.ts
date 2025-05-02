export function deslugify(slug: string) {
  return slug.replace(/-/g, ' ');
}

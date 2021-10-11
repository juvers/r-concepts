const SITE_URL = `https://tishman.netlify.app`;

export default function resolveProductionUrl(document) {
  const slug = document.slug;
  return `${SITE_URL}/${slug}`;
}

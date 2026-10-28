/** Only campaign labels cross into the app: no click ID, cookie, email or fingerprint. */
export function appCampaignLink(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.searchParams.get('utm_source') !== 'instagram' || url.searchParams.get('utm_medium') !== 'paid_social' || url.searchParams.get('utm_campaign') !== 'open-beta') return null;
    if (['utm_source','utm_medium','utm_campaign','utm_content'].some(key=>url.searchParams.getAll(key).length!==1)) return null;
    const creative = url.searchParams.get('utm_content');
    if (creative !== 'meta-poster-a' && creative !== 'meta-hook-a') return null;
    return `standin://campaign?source=instagram&campaign=open-beta&creative=${creative}`;
  } catch { return null; }
}
export function supportsAcquisition(tag: string): boolean {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(tag);
  if (!match) return false;
  const [major,minor,patch] = match.slice(1).map(Number);
  return major>0 || minor>2 || minor===2 && patch>=5;
}

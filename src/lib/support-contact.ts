/** Numéro WhatsApp support (fallback si app_settings inaccessible sans session). */
export const DEFAULT_SUPPORT_WHATSAPP = "+13474952236";

export function whatsAppDigits(number: string): string {
  return number.replace(/[^0-9]/g, "");
}

export function whatsAppHref(number: string): string {
  return `https://wa.me/${whatsAppDigits(number)}`;
}

export function formatWhatsAppDisplay(number: string): string {
  const digits = whatsAppDigits(number);
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return number.startsWith("+") ? number : `+${digits}`;
}

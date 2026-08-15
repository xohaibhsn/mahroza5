export function phoneToTel(phone: string) {
  return phone.replace(/[^\d+]/g, "") || "+923004334065";
}

export function phoneToWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "https://wa.me/923004334065";
  return `https://wa.me/${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

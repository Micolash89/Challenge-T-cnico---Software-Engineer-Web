import { WHATSAPP } from '@/constants/whatsapp.constants';
import Image from 'next/image';

export function WhatsAppFloat() {
  const number = WHATSAPP.NUMBER.replace(/\D/g, '');
  const href = number
    ? `https://wa.me/${number}`
    : 'https://wa.me/';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-10 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-snow shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
    >
      <Image
        src="/images/icons8-whatsapp-144.png" alt="Contactar por WhatsApp" width={0} height={0}  className="size-7" />
    </a>
  );
}

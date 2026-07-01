export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string; // Lucide icon name
}

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/luisfcostec',
    icon: 'Github'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/luisfcostec',
    icon: 'Linkedin'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    url: 'mailto:luisfcostec@gmail.com',
    icon: 'Gmail'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://wa.me/573116463033',
    icon: 'WhatsApp'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com/users/luisfcostec',
    icon: 'Discord'
  }
];
export interface Project {
  id: number;
  titleKey: string;
  descKey: string;
  image: string;
  techs: string[]; // technology ids
  github: string | null;
  demo: string | null;
  isEmpty?: boolean;
  videoUrl?: string;
  roleKey?: string;
  featuresKey?: string;
}

export const projects: Project[] = [
  {
    id: 6,
    titleKey: 'proj-title-6',
    descKey: 'proj-desc-6',
    image: '/images/Proyecto_6.png',
    techs: ['nextjs', 'typescript', 'react', 'tailwindcss', 'shadcn', 'genkit'],
    github: null,
    demo: 'https://ecokraf.vercel.app/',
    videoUrl: '/videos/Proyecto_6.mp4',
    roleKey: 'proj-role-6',
    featuresKey: 'proj-features-6',
  },
  {
    id: 5,
    titleKey: 'proj-title-5',
    descKey: 'proj-desc-5',
    image: '/images/Proyecto_5.png',
    techs: ['angular', 'dotnetcore', 'sqlserver'],
    github: 'https://github.com/LuisFCosteC/Sales_Management_System',
    demo: null,
    videoUrl: '/videos/Proyecto_5.mp4',
    roleKey: 'proj-role-5',
    featuresKey: 'proj-features-5',
  },
  {
    id: 4,
    titleKey: 'proj-title-4',
    descKey: 'proj-desc-4',
    image: '/images/Proyecto_4.png',
    techs: ['nodejs', 'javascript', 'html', 'css', 'socketio', 'sqlite'],
    github: 'https://github.com/LuisFCosteC/LuisFCosteC-WebSocket_Project_Client-Server_Communication',
    demo: null,
    videoUrl: '/videos/Proyecto_4.mp4',
    roleKey: 'proj-role-4',
    featuresKey: 'proj-features-4',
  },
  {
    id: 3,
    titleKey: 'proj-title-3',
    descKey: 'proj-desc-3',
    image: '/images/Proyecto_3.png',
    techs: ['fastapi', 'python', 'html', 'css', 'javascript'],
    github: 'https://github.com/LuisFCosteC/Pokedex-API-Project',
    demo: null,
    videoUrl: '/videos/Proyecto_3.mp4',
    roleKey: 'proj-role-3',
    featuresKey: 'proj-features-3',
  },
  {
    id: 2,
    titleKey: 'proj-title-2',
    descKey: 'proj-desc-2',
    image: '/images/Proyecto_2.png',
    techs: ['react', 'bootstrap', 'nodejs', 'mysql', 'axios', 'sweetalert2'],
    github: 'https://github.com/LuisFCosteC/Form-with-React-MySql-NodeJs-Bootstrap',
    demo: null,
    videoUrl: '/videos/Proyecto_2.mp4',
    roleKey: 'proj-role-2',
    featuresKey: 'proj-features-2',
  },
  {
    id: 1,
    titleKey: 'proj-title-1',
    descKey: 'proj-desc-1',
    image: '/images/Proyecto_1.png',
    techs: ['react', 'html', 'css', 'javascript'],
    github: 'https://github.com/LuisFCosteC/Rick-and-Morty-Api-with-React/tree/main',
    demo: null,
    videoUrl: '/videos/Proyecto_1.mp4',
    roleKey: 'proj-role-1',
    featuresKey: 'proj-features-1',
  },
];
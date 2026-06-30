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
    id: 7,
    titleKey: 'proj-empty-title-2',
    descKey: 'proj-empty-desc-2',
    image: '/images/proyecto_Plataforma_E_learning.png',
    techs: [],
    github: null,
    demo: null,
    isEmpty: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-spinning-globe-and-data-nodes-42777-large.mp4',
    roleKey: 'proj-role-5',
    featuresKey: 'proj-features-5',
  },
  {
    id: 6,
    titleKey: 'proj-empty-title-1',
    descKey: 'proj-empty-desc-1',
    image: '/images/proyecto_App_Domicilios.png',
    techs: [],
    github: null,
    demo: null,
    isEmpty: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-spinning-globe-and-data-nodes-42777-large.mp4',
    roleKey: 'proj-role-5',
    featuresKey: 'proj-features-5',
  },
  {
    id: 5,
    titleKey: 'proj-title-5',
    descKey: 'proj-desc-5',
    image: '/images/proyecto_Sistema_de_gestión_de_Ventas.png',
    techs: ['angular', 'dotnetcore', 'sqlserver'],
    github: 'https://github.com/LuisFCosteC/Sales_Management_System',
    demo: null,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glowing-charts-and-graphs-on-a-monitor-41712-large.mp4',
    roleKey: 'proj-role-5',
    featuresKey: 'proj-features-5',
  },
  {
    id: 4,
    titleKey: 'proj-title-4',
    descKey: 'proj-desc-4',
    image: '/images/proyecto_Plataforma_E_learning.png',
    techs: ['html', 'css', 'javascript', 'nodejs'],
    github: 'https://github.com/LuisFCosteC/LuisFCosteC-WebSocket_Project_Client-Server_Communication',
    demo: null,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-computer-code-on-a-screen-41711-large.mp4',
    roleKey: 'proj-role-4',
    featuresKey: 'proj-features-4',
  },
  {
    id: 3,
    titleKey: 'proj-title-3',
    descKey: 'proj-desc-3',
    image: '/images/proyecto_App_Domicilios.png',
    techs: ['html', 'css', 'javascript', 'fastapi'],
    github: 'https://github.com/LuisFCosteC/Pokedex-API-Project',
    demo: null,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-searching-data-on-a-computer-screen-43232-large.mp4',
    roleKey: 'proj-role-3',
    featuresKey: 'proj-features-3',
  },
  {
    id: 2,
    titleKey: 'proj-title-2',
    descKey: 'proj-desc-2',
    image: '/images/proyecto_Dashboard_Medico.png',
    techs: ['react', 'bootstrap', 'nodejs', 'mysql'],
    github: 'https://github.com/LuisFCosteC/Form-with-React-MySql-NodeJs-Bootstrap',
    demo: null,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-developer-typing-on-a-keyboard-40251-large.mp4',
    roleKey: 'proj-role-2',
    featuresKey: 'proj-features-2',
  },
  {
    id: 1,
    titleKey: 'proj-title-1',
    descKey: 'proj-desc-1',
    image: '/images/proyecto_Gestor_Tareas.png',
    techs: ['react', 'html', 'javascript'],
    github: 'https://github.com/LuisFCosteC/Rick-and-Morty-Api-with-React/tree/main',
    demo: null,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-browsing-the-code-of-a-website-on-a-screen-41713-large.mp4',
    roleKey: 'proj-role-1',
    featuresKey: 'proj-features-1',
  },
];

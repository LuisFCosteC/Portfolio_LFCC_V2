export interface Certificate {
  id: number;
  platformKey: string;
  titleKey: string;
  descKey?: string;
  dateKey: string;
  url: string;
}

export const certificates: Certificate[] = [
  {
    id: 1,
    platformKey: 'badge-meta',
    titleKey: 'cert-titulo-1',
    dateKey: 'fecha-cert-1',
    url: 'https://coursera.org/share/0ecfa4c415c7b22a3a6ef16c2ff10987'
  },
  {
    id: 2,
    platformKey: 'badge-cisco',
    titleKey: 'cert-titulo-2',
    descKey: 'cert-desc-2',
    dateKey: 'fecha-cert-2',
    url: 'https://www.credly.com/badges/c7cc4845-32fa-43da-a558-ab7425f429a1/public_url'
  },
  {
    id: 3,
    platformKey: 'badge-cisco',
    titleKey: 'cert-titulo-3',
    descKey: 'cert-desc-3',
    dateKey: 'fecha-cert-3',
    url: 'https://www.credly.com/badges/f52ebc92-b2f4-4502-91d4-0c4c270e9868/public_url'
  },
  {
    id: 4,
    platformKey: 'badge-cisco',
    titleKey: 'cert-titulo-4',
    descKey: 'cert-desc-4',
    dateKey: 'fecha-cert-4',
    url: 'https://www.credly.com/badges/e16fc1f1-07a8-492e-824b-a716a05b7506/public_url'
  },
  {
    id: 5,
    platformKey: 'badge-udemy',
    titleKey: 'cert-titulo-5',
    dateKey: 'fecha-cert-5',
    url: 'https://www.udemy.com/certificate/UC-1c303618-7f7e-4b8a-bbd8-67adebf3f653/'
  },
  {
    id: 6,
    platformKey: 'badge-linkedin',
    titleKey: 'cert-titulo-6',
    dateKey: 'fecha-cert-6',
    url: 'https://www.linkedin.com/learning/certificates/9a0be56003c2f431a17b128ae833e4fbda32b23b2eb954ed4de3bd4492e8fa5e'
  },
  {
    id: 7,
    platformKey: 'badge-microsoft-linkedin',
    titleKey: 'cert-titulo-7',
    dateKey: 'fecha-cert-7',
    url: 'https://www.linkedin.com/learning/certificates/2c010a994a0f9e236f9c70ce37e31324933bb42f7e874f42f9d602451abe6b23'
  },
  {
    id: 8,
    platformKey: 'badge-microsoft-linkedin',
    titleKey: 'cert-titulo-8',
    dateKey: 'fecha-cert-8',
    url: 'https://www.linkedin.com/learning/certificates/9806fbfe500721a7a81d42c927e18ab977f1a470ddf94997642f15afc29b70a9'
  },
  {
    id: 9,
    platformKey: 'badge-linkedin',
    titleKey: 'cert-titulo-9',
    dateKey: 'fecha-cert-9',
    url: 'https://www.linkedin.com/learning/certificates/73018c00c9f51d274c36e5cb49703ff02b1dd0cc787d6587c1a776719780c059'
  },
  {
    id: 10,
    platformKey: 'badge-linkedin',
    titleKey: 'cert-titulo-10',
    dateKey: 'fecha-cert-10',
    url: 'https://www.linkedin.com/learning/certificates/9cae73169f4170d2714bc9e4a0a84b40dc3a8e46dab24a4d70e66fc3e6509775'
  },
  {
    id: 11,
    platformKey: 'badge-linkedin',
    titleKey: 'cert-titulo-11',
    dateKey: 'fecha-cert-11',
    url: 'https://www.linkedin.com/learning/certificates/fc69c9a37d0cfa199314677ab8e194b0599eb0dcb816ca27f5625d6a143dcf1f'
  },
  {
    id: 12,
    platformKey: 'badge-linkedin',
    titleKey: 'cert-titulo-12',
    dateKey: 'fecha-cert-12',
    url: 'https://www.linkedin.com/learning/certificates/bf4c916cd2804b1b312ad7ce42b220913c284317bf8e87fb43ad53542024adb7'
  },
  {
    id: 13,
    platformKey: 'badge-udemy',
    titleKey: 'cert-titulo-13',
    dateKey: 'fecha-cert-13',
    url: 'https://www.udemy.com/certificate/UC-d3c2f565-ec45-446e-9c1f-a8e86e80ca30/'
  },
  {
    id: 14,
    platformKey: 'badge-compensar',
    titleKey: 'cert-titulo-14',
    dateKey: 'fecha-cert-14',
    url: 'assets/docs/Certificado. Excel intermedio.pdf'
  }
];

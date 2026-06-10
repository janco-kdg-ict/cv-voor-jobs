// =============================================================================
//  📝  JOUW CONTENT — pas ALLEEN dit bestand aan om de site bij te werken.
// =============================================================================
//  Tip: alles tussen "aanhalingstekens" mag je vrij wijzigen.
//  Voeg projecten toe door extra { ... } blokken in de lijst te plakken.
// =============================================================================

export const content = {
  // --- Wie ben je --------------------------------------------------------
  name: 'Janco Sambaer',
  role: 'ICT Support Engineer',
  tagline: 'IT-problemen oplossen én zelf cloud- en automatisatieoplossingen bouwen.',
  location: 'Merksem, Antwerpen',
  email: 'jancosambaer@gmail.com',
  phone: '04 99 43 63 15',
  cvUrl: '', // link naar je PDF-cv, bv. '/cv.pdf' (zet het bestand in /public)

  // Geen GitHub/LinkedIn opgegeven -> leeg gelaten. Vul gerust aan:
  // { label: 'GitHub', url: 'https://github.com/jouwnaam' },
  socials: [],

  // --- Over mij (verschijnt op het bureau-scherm) ------------------------
  about: {
    title: 'Over mij',
    lines: [
      'Gemotiveerde ICT-medewerker met een',
      'achtergrond in Internet of Things en',
      'hands-on ervaring in servicedesk,',
      'systeembeheer en full-stack development.',
      '',
      'Sterk in het analyseren en oplossen van',
      'IT-problemen, on-site én remote. Bouwt',
      'actief aan cloud- en automatisatie-',
      'oplossingen met Azure/Entra ID, Microsoft',
      '365 en Docker. Betrouwbaar, stress-',
      'bestendig en leergierig.',
    ],
  },

  // --- Skills (per categorie als chips) ----------------------------------
  skills: {
    categories: [
      { title: 'Systeembeheer', items: ['Windows Server', 'Windows 11 Enterprise', 'Active Directory', 'Entra ID'] },
      { title: 'Cloud & Identity', items: ['Azure', 'Microsoft 365', 'SharePoint', 'Intune / MDM'] },
      { title: 'Automatisatie', items: ['PowerShell', 'Python', 'bash / CLI'] },
      { title: 'Development', items: ['C#', 'ASP.NET Core', 'Blazor Server', 'Python Flask', 'C++', 'JavaScript'] },
      { title: 'Containerisatie', items: ['Docker', 'Docker Swarm', 'Portainer', 'Harbor Registry'] },
      { title: 'Netwerken', items: ['TCP/IP', 'DNS', 'DHCP', 'VLAN', 'NetScaler'] },
      { title: 'Databases', items: ['JSON persistence', 'SQL', 'MariaDB'] },
      { title: 'Testing & Tools', items: ['xUnit', 'TDD', 'TopDesk', 'Microsoft Graph', 'Canvas API', 'TimeEdit API'] },
      { title: '3D / Design', items: ['AutoCAD', 'Inventor', 'SketchUp'] },
    ],
    soft: [
      'Toegewijd en betrouwbaar',
      'Zelfstandig en proactief',
      'Teamgericht en communicatief',
      'Stressbestendig',
      'Flexibel en leergierig',
      'Hands-on: lost problemen liever op dan door te verwijzen',
    ],
    languages: [
      { name: 'Nederlands', level: 'moedertaal' },
      { name: 'Engels', level: 'professioneel' },
    ],
  },

  // --- Projecten (de gloeiende dozen op de planken) ----------------------
  //  short  = kort label op de 3D-doos
  //  color  = de gloedkleur van de doos in de 3D-scene (hex)
  projects: [
    {
      title: 'TopDesk AVM-tool',
      short: 'TopDesk AVM',
      color: '#5bd1ff',
      context: 'KdG ICT-Servicedesk',
      description:
        'Interne webapplicatie die AVM-checks (Audio/Video/Multimedia) in lokalen versnelt door TopDesk-assets, SharePoint-lijsten en Microsoft 365 SSO in één scherm te brengen. Wat vroeger 15 minuten Excel-werk en meerdere tabs was, is nu één geïntegreerd scherm. Geport van Python/Flask naar .NET met volledige testdekking.',
      stack: ['ASP.NET Core 10', 'Blazor Server', 'Entra ID / M365 SSO', 'Microsoft Graph', 'TopDesk REST API', 'Docker Swarm', 'Harbor Registry', 'xUnit'],
      highlights: [
        'M365 SSO via Microsoft Identity Web met delegated Graph-tokens (per-user, zodat Created/Modified By correct staat)',
        'Multi-stage Docker build, non-root user, uitgerold op Docker Swarm via Portainer',
        'Private Harbor-registry, NetScaler load-balancer met sticky sessions',
        'Volledige xUnit-testdekking (31 tests groen); deploy op QA én PROD via aparte env-vars',
        'Serilog → Graylog (GELF) voor structured logging en audit trail per asset-wijziging',
      ],
      impact: 'Eén tool in plaats van TopDesk-tab + SharePoint-tab + Excel-export; voldoet aan KdG\'s traceability-vereisten.',
      link: '',
    },
    {
      title: 'KassaSD — Asset & Stock Management',
      short: 'KassaSD',
      color: '#7CFFB2',
      context: 'Persoonlijk project',
      description:
        'POS-stijl webapplicatie waarmee de IT-servicedesk in één werkstroom een medewerker scant, items toewijst en automatisch onderscheidt tussen gratis startpakket en betaalde vervanging. Volledig zelfgebouwd zonder UI-framework, inclusief eigen design system geïnspireerd op Shopify Polaris.',
      stack: ['.NET 10', 'Blazor Server', 'C#', 'HTML5 / CSS3 / JS interop', 'JSON persistence', 'Eigen design system'],
      highlights: [
        'Badge-scanner via keyboard-input (geen drivers), multi-item cart flow',
        'Automatisch onderscheid gratis/betaald op basis van vervangingsgeschiedenis',
        'Risicoprofiel per medewerker (groen/geel/rood) op basis van historiek',
        'Management dashboard met KPI\'s, breakdown per afdeling, CSV-export en print-to-PDF',
        'Thread-safe in-memory stores, atomic JSON-writes, debounced disk I/O',
        'Zelf uitgevoerde code-audit: P0/P1 bugs gevonden en gefixt (concurrency, crashes, memory leaks)',
      ],
      impact: 'Structurele tracking van IT-materiaal per medewerker; vervangingskosten meetbaar en teruggedrongen.',
      link: '',
    },
    {
      title: 'Canvas Exam Dashboard',
      short: 'Canvas Dashboard',
      color: '#ff8a5b',
      context: 'KdG Examenmonitoring',
      description:
        'Real-time exam monitoring en fraudedetectie dashboard voor het IT-team van KdG. Een proxy-laag bovenop Canvas LMS met een gecentraliseerd overzicht van alle lopende digitale examens. Origineel in Python Flask, later volledig geport naar C# ASP.NET Core 8 met behoud van dezelfde JSON API-contracten zodat 3.000+ regels frontend-JS ongewijzigd bleven.',
      stack: ['ASP.NET Core 8', 'Python Flask', 'Canvas REST & GraphQL API', 'Docker', 'JavaScript', 'Bootstrap 5', 'ClosedXML', 'SHA-256 auth'],
      highlights: [
        'Automatische fraudedetectie: identieke scores, gelijktijdige indieningen, IP-anomalieën, plak- en navigatie-analyse',
        'Risicoscore per student op basis van meerdere indicatoren',
        'Canvas REST (Link-header paginering) én GraphQL (batched aliased queries — honderden calls bespaard)',
        'Beveiliging: SHA-256 + pepper, rate limiting, IP-whitelisting, audit logging',
        'Excel-exports met kleurcodering; automatisch fraudedossier voor de ombudsdienst',
        '~11.000 regels backend (C#), ~3.000 regels frontend (JS), 30+ API-endpoints',
      ],
      impact: 'Gebruikt door examencoördinatoren voor monitoring van alle digitale examens aan KdG.',
      link: '',
    },
    {
      title: 'Badge-toegangssysteem',
      short: 'Badge-systeem',
      color: '#b18aff',
      context: 'Eindwerk KdG',
      description:
        'Slim badge-toegangssysteem dat via Azure/Entra ID controleert of een student toegang heeft tot een specifiek lokaal, op basis van de real-time TimeEdit-agenda. Combineert cloud-authenticatie, agenda-integratie en fysieke badge-hardware in één end-to-end oplossing.',
      stack: ['Azure', 'Entra ID', 'TimeEdit API', 'IoT / badge hardware'],
      highlights: [
        'Azure/Entra ID als identiteits- en rechtenbeheerplatform',
        'Real-time koppeling met TimeEdit-agenda voor dynamische toegangscontrole per lokaal',
        'End-to-end integratie van badge-hardware, cloud-authenticatie en business logic',
      ],
      impact: '',
      link: '',
    },
    {
      title: 'AI-Helpdesk Assistent',
      short: 'AI-Helpdesk',
      color: '#36d1c4',
      context: 'Persoonlijk project',
      description:
        'Een RAG-gebaseerde IT-helpdesk assistent die supportvragen beantwoordt op basis van een eigen kennisbank, met bronvermelding en automatische triage (categorie, urgentie, ticket nodig). Draait volledig lokaal via Ollama en is provider-onafhankelijk opgezet, zodat je met één instelling naar Claude of OpenAI kan wisselen.',
      stack: ['.NET 10', 'Blazor Server', 'RAG', 'Ollama', 'Embeddings', 'C#'],
      highlights: [
        'Retrieval-Augmented Generation: documenten gechunkt, geëmbed en doorzocht via cosinus-gelijkenis',
        'Antwoorden met bronvermelding per document, inclusief relevantiescore',
        'Automatische triage met gestructureerde JSON-output van het taalmodel',
        'Provider-onafhankelijke ILlmProvider-architectuur (Ollama / Claude / OpenAI)',
        'Volledig lokaal en privé — interne documenten verlaten de machine niet',
      ],
      impact: 'Versnelt eerstelijns IT-support en houdt interne kennis doorzoekbaar én privé.',
      link: '',
    },
    {
      title: 'Crypto CTF-Challengeset',
      short: 'Crypto CTF',
      color: '#ffd166',
      context: 'Persoonlijk project · Security',
      description:
        'Een reeks Capture-The-Flag crypto-challenges in Python met focus op échte, moderne aanvallen tegen verkeerd gebruikte cryptografie. Elke challenge bevat de opdracht, een werkende solver én een writeup die de kwetsbaarheid, de aanval en de verdediging uitlegt.',
      stack: ['Python', 'Cryptografie', 'RSA', 'AES', 'CTF', 'pycryptodome'],
      highlights: [
        'Zes aanvallen: RSA (kleine exponent e=3, common modulus, Fermat-factorisatie) en AES (ECB byte-at-a-time, CBC bit-flipping, padding oracle)',
        'Per challenge een werkende solver én writeup (kwetsbaarheid → aanval → verdediging)',
        'Automatische flag-checker die alle solvers verifieert (6/6 groen)',
        'Behandelt mitigaties zoals OAEP, AES-GCM en Encrypt-then-MAC',
      ],
      impact: 'Demonstreert een security-mindset en diepgaande, toegepaste cryptografie — direct relevant voor CTF en security-rollen.',
      link: '',
    },
    {
      title: 'JWT Security Lab',
      short: 'JWT Lab',
      color: '#ef476f',
      context: 'Persoonlijk project · Security',
      description:
        'Een hands-on lab over de meest voorkomende JWT-kwetsbaarheden, gebouwd met enkel de Python-standaardbibliotheek om te tonen hoe een JWT écht werkt (header.payload.signature). Elke aanval heeft een runnend script en uitleg, plus een kwetsbare én een veilige verifier ter vergelijking.',
      stack: ['Python', 'JWT', 'HMAC', 'Web Security', 'Auth'],
      highlights: [
        'Demonstreert de alg=none-bypass: ongezien admin worden op een kwetsbare verifier',
        'Brute-forcet een zwak HS256-geheim met een woordenlijst en smeedt daarna geldige tokens',
        'Toont waarom een JWT geen encryptie is (payload is gewoon leesbaar)',
        'Eigen JWT-encoder/decoder zonder externe libs (hmac/hashlib/base64)',
      ],
      impact: 'Maakt tastbaar hoe authenticatie-tokens misbruikt worden — en hoe je het correct beveiligt (algoritme pinnen, sterk geheim).',
      link: '',
    },
    {
      title: 'Async Port Scanner',
      short: 'Port Scanner',
      color: '#06b6d4',
      context: 'Persoonlijk project · Security',
      description:
        'Een snelle, asynchrone TCP-poortscanner in Python (asyncio) met service- en bannerdetectie — een mini-nmap die honderden poorten tegelijk scant. Toont netwerk-, socket- en concurrency-kennis.',
      stack: ['Python', 'asyncio', 'Networking', 'Sockets', 'Recon'],
      highlights: [
        'Scant honderden poorten parallel via asyncio met een semafoor voor concurrency-limiet',
        'Servicedetectie voor bekende poorten (ssh, http, mysql, …) en banner-grabbing',
        'Flexibele poortopgave: losse poorten (22,80,443) of bereiken (1-1024)',
        'Inclusief zelftest die lokale testdiensten opzet en detectie verifieert',
      ],
      impact: 'Een praktische recon-tool die aantoont hoe netwerkservices in kaart gebracht worden — de eerste stap in elke security-assessment.',
      link: '',
    },
    {
      title: 'SSH Brute-Force Detector',
      short: 'Log Detector',
      color: '#84cc16',
      context: 'Persoonlijk project · Security',
      description:
        'Een blue-team / SOC-tool die SSH-auth.logs analyseert, brute-force-aanvallen detecteert en mogelijke compromitteringen markeert (veel mislukte logins gevolgd door een geslaagde). Werkt met een schuivend tijdvenster en instelbare drempel.',
      stack: ['Python', 'Log Analysis', 'Regex', 'Blue Team', 'Detection'],
      highlights: [
        'Detecteert brute-force via een two-pointer schuivend venster per IP',
        'Markeert mogelijke compromittering: reeks mislukkingen gevolgd door een geslaagde login',
        'Negeert normaal gedrag (typfout + login) → weinig vals alarm',
        'Inclusief voorbeeldlog en zelftest; uitbreidbaar tot een fail2ban-/SIEM-regel',
      ],
      impact: 'Verschuift de focus van aanval naar verdediging: aanvallen herkennen in logs, zoals in een SOC.',
      link: '',
    },
  ],

  // --- Werkervaring (het prikbord) ---------------------------------------
  experience: [
    {
      period: '2024 — heden',
      role: 'Servicedesk',
      company: 'Karel de Grote Hogeschool · Statutair',
      bullets: [
        'Eerstelijns support aan gebruikers (on-site en remote)',
        'Hardware reparaties en onderhoud (laptops, desktops, iPads)',
        'Hardware- en softwareproblemen analyseren en oplossen',
        'Beheer van accounts en rechten in Active Directory',
        'Python-automatisatie voor toestelbeheer in Active Directory',
      ],
    },
    {
      period: '2017 — 2025',
      role: 'Active Developer (Discord)',
      company: 'Freelance',
      bullets: [
        'Front- en back-end toepassingen ontwikkeld en opgeleverd',
        'Testing, debugging en probleemanalyse binnen bestaande systemen',
      ],
    },
  ],

  // --- Opleiding ---------------------------------------------------------
  education: [
    { period: '2024', title: 'Graduaat Internet of Things (IoT)', school: 'Karel de Grote Hogeschool' },
    { period: '2022', title: 'Graduaat Programmeren', school: 'AP Hogeschool' },
  ],
};

// EnerTchad Group - i18n (Internationalization) Module
// Supports French and English

const i18n = {
    lang: localStorage.getItem('language') || 'fr',

    strings: {
        fr: {
            'nav-subsidiaries': 'Filiales',
            'nav-manifesto': 'Manifeste',
            'nav-figures': 'Chiffres',
            'nav-governance': 'Gouvernance',
            'nav-esg': 'ESG',
            'nav-press': 'Presse',
            'nav-contact': 'Contact',

            'hero-eyebrow': 'Groupe · Holding · Tchad',
            'hero-title': 'Le groupe énergétique qui construit l\'indépendance du Tchad.',
            'hero-subtitle': 'Trois filiales intégrées — de l\'exploration aux stations-service. Une vision : faire du Tchad un acteur pétrolier et gazier souverain, de classe africaine.',
            'hero-cta': 'Explorer nos filiales',

            'kpi-subsidiaries': 'Filiales',
            'kpi-wells': 'Puits gérés',
            'kpi-pipeline': 'km pipeline',
            'kpi-stations': 'Stations',

            'subsidiaries-title': 'Nos Trois Filiales Intégrées',
            'subsidiaries-subtitle': 'Une chaîne de valeur complète : de l\'exploration à la distribution.',

            'amont-title': 'EnerTchad Amont',
            'amont-desc': 'Exploration & Production — Extraction et développement des ressources pétrolières et gazières du Tchad.',
            'midstream-title': 'EnerTchad Midstream',
            'midstream-desc': 'Pipeline & Transport — Infrastructure de transport et stockage à travers le Tchad et au-delà.',
            'aval-title': 'EnerTchad Aval',
            'aval-desc': 'Distribution & Stations — Réseau de stations-service et distribution aux consommateurs finaux.',

            'kpi-kbbl': 'Kbbl/j',
            'kpi-km': 'km',
            'kpi-uptime': 'uptime',
            'kpi-basins': 'bassins',
            'kpi-clients': 'clients',
            'kpi-cities': 'villes',
            'visit-site': 'Visiter le site →',

            'manifesto-title': 'Notre Manifeste',
            'pillar-sovereignty-title': 'Souveraineté',
            'pillar-sovereignty-desc': 'Sortir du schéma d\'extraction pure, construire toute la chaîne de valeur au Tchad. Nos trois filiales intégrées garantissent que chaque étape — exploration, transport, distribution — génère de la valeur pour notre nation.',
            'pillar-expertise-title': 'Expertise Tchadienne',
            'pillar-expertise-desc': '80% de personnel local, école EnerAcademy interne, transfert de savoir générationnel. Nous bâtissons une génération d\'ingénieurs, techniciens et cadres tchadiens leaders en Afrique.',
            'pillar-esg-title': 'Transition Durable',
            'pillar-esg-desc': 'ESG intégré dès la conception de nos projets. Engagement net-zero 2050, riche biodiversité, droits humains. Nous prouvons que énergie moderne et durabilité vont de pair.',

            'tagline': 'Le Tchad, énergie par les Tchadiens.',

            'figures-title': 'Chiffres Clés du Groupe',
            'figure-investment-value': '2,4 Mds USD',
            'figure-investment-label': 'Investissement stratégique',
            'figure-employees-value': '800+',
            'figure-employees-label': 'Employés (3 filiales)',
            'figure-interventions-value': '450+',
            'figure-interventions-label': 'Interventions/an',
            'figure-hse-value': '98.5%',
            'figure-hse-label': 'Taux HSE',
            'figure-local-value': '80%',
            'figure-local-label': 'Personnel tchadien',
            'figure-incidents-value': '0',
            'figure-incidents-label': 'Incident majeur',
            'figure-horizon-value': '2032',
            'figure-horizon-label': 'Horizon stratégique',
            'figure-basins-value': '3',
            'figure-basins-label': 'Bassins sédimentaires',

            'governance-title': 'Gouvernance du Groupe',
            'governance-subtitle': 'Leadership intègre, diversifié et responsable.',

            'governance-ceo-name': 'Hamid Abdelrazak',
            'governance-ceo-title': 'Directeur Général',
            'governance-ceo-bio': '30 ans d\'expérience pétrolière, diplômé Polytechnique. Vision stratégique de l\'intégration verticale au Tchad.',

            'governance-cfo-name': 'Fatigué Alaoui',
            'governance-cfo-title': 'Directeur Administratif & Financier',
            'governance-cfo-bio': 'Expertise finance d\'entreprise, MBA HEC. Pilote la transformation financière du groupe.',

            'governance-strategy-name': 'Aïcha Sow',
            'governance-strategy-title': 'Directrice Stratégie & Développement',
            'governance-strategy-bio': 'Ingénieure pétrolière, doctorante en ESG. Conçoit la feuille de route stratégique 2032.',

            'governance-tech-name': 'Mohamed Daoudi',
            'governance-tech-title': 'Directeur Technique',
            'governance-tech-bio': 'Spécialiste géosciences, 25 ans exploration régionale. Couvre les trois filiales opérationnelles.',

            'governance-hse-name': 'Ismail Maroua',
            'governance-hse-title': 'Directeur HSE',
            'governance-hse-bio': 'Certifications NEBOSH, OPITO. Responsable de la culture sécurité et développement durable.',

            'governance-sg-name': 'Ndeninguele Koné',
            'governance-sg-title': 'Secrétaire Général',
            'governance-sg-bio': 'Juriste, relations institutionnelles. Interface gouvernement et stakeholders clés.',

            'locations-title': 'Nos Implantations',
            'loc-ndjamena': 'N\'Djamena (HQ)',
            'loc-doba': 'Doba (Amont)',
            'loc-kribi': 'Kribi (Corridor)',
            'loc-west': 'Ouest',
            'loc-east': 'Est',
            'legend-hq': 'Siège social groupe',
            'legend-upstream': 'Opérations Amont',
            'legend-midstream': 'Corridor export',

            'history-title': 'Timeline du Groupe',
            'timeline-2018-title': 'Fondation EnerTchad Amont',
            'timeline-2018-desc': 'Lancement opérations exploration et production au Tchad.',
            'timeline-2020-title': 'Création Filiale Midstream',
            'timeline-2020-desc': 'Infrastructure pipeline et transport de gaz vers Cameroun.',
            'timeline-2022-title': 'Lancement Filiale Aval',
            'timeline-2022-desc': 'Réseau stations-service et distribution domestique.',
            'timeline-2024-title': 'Intégration Verticale Complète',
            'timeline-2024-desc': 'Consolidation groupe holding. Souveraineté énergétique confirmée.',
            'timeline-2025-title': 'Programme Stratégique 2,4 Mds USD',
            'timeline-2025-desc': 'Investissements majeurs expansion et modernisation.',
            'timeline-2027-title': 'Expansion Régionale',
            'timeline-2027-desc': 'Nouvelles présences en Afrique de l\'Ouest.',
            'timeline-2030-title': 'Souveraineté Énergétique',
            'timeline-2030-desc': 'Indépendance complète de la chaîne énergétique tchadienne.',
            'timeline-2050-title': 'Net-Zero',
            'timeline-2050-desc': 'Engagement neutralité carbone atteint. Opérations durables.',

            'esg-title': 'ESG & Durabilité',
            'esg-subtitle': 'Commitment environnemental, social et gouvernance intégré.',
            'esg-env-title': 'Environnement',
            'esg-env-m1': 'Net-zero 2050 roadmap',
            'esg-env-m2': 'Gestion biodiversité active',
            'esg-env-m3': 'Zéro rejet significatif',
            'esg-social-title': 'Social',
            'esg-social-m1': '80% personnel local',
            'esg-social-m2': 'EnerAcademy — 500+ étudiants/an',
            'esg-social-m3': 'Droits humains—100% conformité',
            'esg-gov-title': 'Gouvernance',
            'esg-gov-m1': 'Conseil diversifié (40% femmes)',
            'esg-gov-m2': 'Audit & Compliance rigoureux',
            'esg-gov-m3': 'Reporting TCFD, GRI standards',

            'esg-certifications': 'Certifications & Standards',
            'cert-iso9001': 'ISO 9001',
            'cert-iso14001': 'ISO 14001',
            'cert-iso45001': 'ISO 45001',
            'cert-atex': 'ATEX',
            'cert-opito': 'OPITO',
            'cert-nebosh': 'NEBOSH',
            'cert-api': 'API',
            'cert-iadc': 'IADC',
            'cert-spe': 'SPE',
            'cert-bv': 'Bureau Veritas',
            'cert-oiml': 'OIML',
            'cert-nace': 'NACE',

            'press-title': 'Presse & Actualités',
            'press-source-1': 'EnerTchad',
            'press-source-2': 'Midstream',
            'press-source-3': 'Aval',
            'press-source-4': 'Groupe',
            'press-headline-1': 'Partenariat Stratégique avec CNPC',
            'press-teaser-1': 'EnerTchad signe un accord cadre majeur pour extension des opérations Dobá et développement puits supplémentaires.',
            'press-headline-2': 'Pipeline Dobá-Kribi Phase 2',
            'press-teaser-2': 'Lancement construction Phase 2 : augmentation capacité 40%, nouvelles stations pompage et infrastructure sécurité renforcée.',
            'press-headline-3': 'EnerClub 50 000 Clients',
            'press-teaser-3': 'Réseau loyauté atteint cap symbolique : 50 000 clients EnerClub dans 18 villes. Remercianime national.',
            'press-headline-4': 'Engagement Net-Zero Signé',
            'press-teaser-4': 'Signature officielle roadmap net-zero 2050 avec barrières intermédiaires 2030, 2040. Leadership africain en durabilité énergétique.',
            'press-read': 'Lire l\'article →',

            'contact-title': 'Contact & Relations Investisseurs',
            'contact-investors-title': 'Relations Investisseurs',
            'contact-investors-intro': 'Téléchargez nos documents stratégiques et rapports de performance.',
            'investor-annual-report': 'Rapport Annuel 2025',
            'investor-pitch-deck': 'Pitch Deck Stratégique',
            'investor-esg-brief': 'Fiche ESG',
            'investor-financial-model': 'Modèle Financier',

            'contact-hq-title': 'Siège Social',
            'contact-address-label': 'Adresse',
            'contact-address': 'Boulevard de l\'Indépendance, N\'Djamena, Tchad',
            'contact-phone-label': 'Téléphone',
            'contact-phone': '+235 (0)2 35 62 78 00',
            'contact-email-label': 'Email',
            'contact-email': 'contact@enertchad-group.td',

            'contact-form-title': 'Message Rapide',
            'form-name': 'Votre nom',
            'form-email': 'Email',
            'form-message': 'Message...',
            'form-submit': 'Envoyer',

            'footer-group': 'Groupe',
            'footer-home': 'Accueil',
            'footer-subsidiaries': 'Filiales',
            'footer-governance': 'Gouvernance',
            'footer-esg': 'ESG',
            'footer-subsidiaries-title': 'Filiales',
            'footer-amont': 'Amont',
            'footer-midstream': 'Midstream',
            'footer-aval': 'Aval',
            'footer-legal': 'Légal',
            'footer-privacy': 'Politique de Confidentialité',
            'footer-terms': 'Conditions d\'Utilisation',
            'footer-cookies': 'Cookies',
            'footer-contact': 'Contact',
            'footer-email': 'contact@enertchad-group.td',
            'footer-linkedin': 'LinkedIn',
            'footer-tagline': 'Le Tchad, énergie par les Tchadiens.',
            'footer-copyright': '© 2026 EnerTchad Group. Tous droits réservés.',

            'cookie-title': 'Cookies & Confidentialité',
            'cookie-desc': 'Nous utilisons des cookies pour améliorer votre expérience. Consultez notre <a href="/cookies.html">politique cookies</a>.',
            'cookie-decline': 'Refuser',
            'cookie-accept': 'Accepter',
        },

        en: {
            'nav-subsidiaries': 'Subsidiaries',
            'nav-manifesto': 'Manifesto',
            'nav-figures': 'Figures',
            'nav-governance': 'Governance',
            'nav-esg': 'ESG',
            'nav-press': 'Press',
            'nav-contact': 'Contact',

            'hero-eyebrow': 'Group · Holding · Chad',
            'hero-title': 'The energy group building Chad\'s independence.',
            'hero-subtitle': 'Three integrated subsidiaries — from exploration to gas stations. A vision: making Chad a sovereign oil and gas actor, African-class.',
            'hero-cta': 'Explore our subsidiaries',

            'kpi-subsidiaries': 'Subsidiaries',
            'kpi-wells': 'Wells managed',
            'kpi-pipeline': 'km pipeline',
            'kpi-stations': 'Stations',

            'subsidiaries-title': 'Our Three Integrated Subsidiaries',
            'subsidiaries-subtitle': 'Complete value chain: from exploration to distribution.',

            'amont-title': 'EnerTchad Upstream',
            'amont-desc': 'Exploration & Production — Extraction and development of Chad\'s oil and gas resources.',
            'midstream-title': 'EnerTchad Midstream',
            'midstream-desc': 'Pipeline & Transport — Transportation and storage infrastructure across Chad and beyond.',
            'aval-title': 'EnerTchad Downstream',
            'aval-desc': 'Distribution & Stations — Network of gas stations and distribution to end consumers.',

            'kpi-kbbl': 'Kbbl/d',
            'kpi-km': 'km',
            'kpi-uptime': 'uptime',
            'kpi-basins': 'basins',
            'kpi-clients': 'clients',
            'kpi-cities': 'cities',
            'visit-site': 'Visit website →',

            'manifesto-title': 'Our Manifesto',
            'pillar-sovereignty-title': 'Sovereignty',
            'pillar-sovereignty-desc': 'Move beyond pure extraction, build the entire value chain in Chad. Our three integrated subsidiaries ensure that each step — exploration, transport, distribution — generates value for our nation.',
            'pillar-expertise-title': 'Chadian Expertise',
            'pillar-expertise-desc': '80% local workforce, internal EnerAcademy school, generational knowledge transfer. We\'re building a generation of Chadian engineers, technicians and leaders across Africa.',
            'pillar-esg-title': 'Sustainable Transition',
            'pillar-esg-desc': 'ESG integrated from project design. Net-zero 2050 commitment, rich biodiversity, human rights. We prove that modern energy and sustainability go hand in hand.',

            'tagline': 'Chad, energy by Chadians.',

            'figures-title': 'Group Key Figures',
            'figure-investment-value': '$2.4B',
            'figure-investment-label': 'Strategic Investment',
            'figure-employees-value': '800+',
            'figure-employees-label': 'Employees (3 subsidiaries)',
            'figure-interventions-value': '450+',
            'figure-interventions-label': 'Interventions/year',
            'figure-hse-value': '98.5%',
            'figure-hse-label': 'HSE Rate',
            'figure-local-value': '80%',
            'figure-local-label': 'Chadian workforce',
            'figure-incidents-value': '0',
            'figure-incidents-label': 'Major incidents',
            'figure-horizon-value': '2032',
            'figure-horizon-label': 'Strategic horizon',
            'figure-basins-value': '3',
            'figure-basins-label': 'Sedimentary basins',

            'governance-title': 'Group Governance',
            'governance-subtitle': 'Integrity, diversity and responsibility in leadership.',

            'governance-ceo-name': 'Hamid Abdelrazak',
            'governance-ceo-title': 'Chief Executive Officer',
            'governance-ceo-bio': '30 years of oil & gas experience, Polytechnique graduate. Strategic vision for vertical integration in Chad.',

            'governance-cfo-name': 'Fatigué Alaoui',
            'governance-cfo-title': 'Chief Administrative & Financial Officer',
            'governance-cfo-bio': 'Corporate finance expertise, MBA HEC. Drives group financial transformation.',

            'governance-strategy-name': 'Aïcha Sow',
            'governance-strategy-title': 'Chief Strategy & Development Officer',
            'governance-strategy-bio': 'Petroleum engineer, ESG PhD candidate. Designs 2032 strategic roadmap.',

            'governance-tech-name': 'Mohamed Daoudi',
            'governance-tech-title': 'Chief Technical Officer',
            'governance-tech-bio': 'Geoscience specialist, 25 years regional exploration. Oversees all three operational subsidiaries.',

            'governance-hse-name': 'Ismail Maroua',
            'governance-hse-title': 'Chief HSE Officer',
            'governance-hse-bio': 'NEBOSH, OPITO certified. Leads safety culture and sustainable development.',

            'governance-sg-name': 'Ndeninguele Koné',
            'governance-sg-title': 'Secretary General',
            'governance-sg-bio': 'Lawyer, institutional relations. Government and stakeholder interface.',

            'locations-title': 'Our Locations',
            'loc-ndjamena': 'N\'Djamena (HQ)',
            'loc-doba': 'Doba (Upstream)',
            'loc-kribi': 'Kribi (Corridor)',
            'loc-west': 'West',
            'loc-east': 'East',
            'legend-hq': 'Group headquarters',
            'legend-upstream': 'Upstream operations',
            'legend-midstream': 'Export corridor',

            'history-title': 'Group Timeline',
            'timeline-2018-title': 'EnerTchad Upstream Founded',
            'timeline-2018-desc': 'Launch of exploration and production operations in Chad.',
            'timeline-2020-title': 'Midstream Subsidiary Created',
            'timeline-2020-desc': 'Pipeline and gas transportation infrastructure to Cameroon.',
            'timeline-2022-title': 'Downstream Subsidiary Launched',
            'timeline-2022-desc': 'Gas station network and domestic distribution.',
            'timeline-2024-title': 'Full Vertical Integration',
            'timeline-2024-desc': 'Group holding consolidation. Energy sovereignty confirmed.',
            'timeline-2025-title': '$2.4B Strategic Program',
            'timeline-2025-desc': 'Major expansion and modernization investments.',
            'timeline-2027-title': 'Regional Expansion',
            'timeline-2027-desc': 'New presence across West Africa.',
            'timeline-2030-title': 'Energy Sovereignty',
            'timeline-2030-desc': 'Complete independence of Chad\'s energy chain.',
            'timeline-2050-title': 'Net-Zero',
            'timeline-2050-desc': 'Carbon neutrality commitment achieved. Sustainable operations.',

            'esg-title': 'ESG & Sustainability',
            'esg-subtitle': 'Integrated environmental, social and governance commitment.',
            'esg-env-title': 'Environment',
            'esg-env-m1': 'Net-zero 2050 roadmap',
            'esg-env-m2': 'Active biodiversity management',
            'esg-env-m3': 'Zero significant discharges',
            'esg-social-title': 'Social',
            'esg-social-m1': '80% local workforce',
            'esg-social-m2': 'EnerAcademy — 500+ students/year',
            'esg-social-m3': 'Human rights—100% compliance',
            'esg-gov-title': 'Governance',
            'esg-gov-m1': 'Diverse board (40% women)',
            'esg-gov-m2': 'Rigorous Audit & Compliance',
            'esg-gov-m3': 'TCFD, GRI standards reporting',

            'esg-certifications': 'Certifications & Standards',
            'cert-iso9001': 'ISO 9001',
            'cert-iso14001': 'ISO 14001',
            'cert-iso45001': 'ISO 45001',
            'cert-atex': 'ATEX',
            'cert-opito': 'OPITO',
            'cert-nebosh': 'NEBOSH',
            'cert-api': 'API',
            'cert-iadc': 'IADC',
            'cert-spe': 'SPE',
            'cert-bv': 'Bureau Veritas',
            'cert-oiml': 'OIML',
            'cert-nace': 'NACE',

            'press-title': 'Press & News',
            'press-source-1': 'EnerTchad',
            'press-source-2': 'Midstream',
            'press-source-3': 'Downstream',
            'press-source-4': 'Group',
            'press-headline-1': 'Strategic Partnership with CNPC',
            'press-teaser-1': 'EnerTchad signs major framework agreement for Doba operations expansion and additional well development.',
            'press-headline-2': 'Doba-Kribi Pipeline Phase 2',
            'press-teaser-2': 'Phase 2 construction launch: 40% capacity increase, new pumping stations and enhanced security infrastructure.',
            'press-headline-3': 'EnerClub Reaches 50,000 Clients',
            'press-teaser-3': 'Loyalty network hits symbolic milestone: 50,000 EnerClub clients across 18 cities. National celebration.',
            'press-headline-4': 'Net-Zero Commitment Signed',
            'press-teaser-4': 'Official net-zero 2050 roadmap signed with intermediate targets 2030, 2040. African sustainability leadership.',
            'press-read': 'Read article →',

            'contact-title': 'Contact & Investor Relations',
            'contact-investors-title': 'Investor Relations',
            'contact-investors-intro': 'Download our strategic documents and performance reports.',
            'investor-annual-report': 'Annual Report 2025',
            'investor-pitch-deck': 'Strategic Pitch Deck',
            'investor-esg-brief': 'ESG Brief',
            'investor-financial-model': 'Financial Model',

            'contact-hq-title': 'Headquarters',
            'contact-address-label': 'Address',
            'contact-address': 'Boulevard de l\'Indépendance, N\'Djamena, Chad',
            'contact-phone-label': 'Phone',
            'contact-phone': '+235 (0)2 35 62 78 00',
            'contact-email-label': 'Email',
            'contact-email': 'contact@enertchad-group.td',

            'contact-form-title': 'Quick Message',
            'form-name': 'Your name',
            'form-email': 'Email',
            'form-message': 'Message...',
            'form-submit': 'Send',

            'footer-group': 'Group',
            'footer-home': 'Home',
            'footer-subsidiaries': 'Subsidiaries',
            'footer-governance': 'Governance',
            'footer-esg': 'ESG',
            'footer-subsidiaries-title': 'Subsidiaries',
            'footer-amont': 'Upstream',
            'footer-midstream': 'Midstream',
            'footer-aval': 'Downstream',
            'footer-legal': 'Legal',
            'footer-privacy': 'Privacy Policy',
            'footer-terms': 'Terms of Use',
            'footer-cookies': 'Cookies',
            'footer-contact': 'Contact',
            'footer-email': 'contact@enertchad-group.td',
            'footer-linkedin': 'LinkedIn',
            'footer-tagline': 'Chad, energy by Chadians.',
            'footer-copyright': '© 2026 EnerTchad Group. All rights reserved.',

            'cookie-title': 'Cookies & Privacy',
            'cookie-desc': 'We use cookies to improve your experience. See our <a href="/cookies.html">cookie policy</a>.',
            'cookie-decline': 'Decline',
            'cookie-accept': 'Accept',
        }
    },

    init() {
        this.updatePage();
        this.setupListeners();
    },

    updatePage() {
        document.documentElement.lang = this.lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.strings[this.lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = this.strings[this.lang][key];
                } else {
                    el.innerHTML = this.strings[this.lang][key];
                }
            }
        });
    },

    setupListeners() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        this.lang = this.lang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('language', this.lang);
        this.updatePage();

        // Update language toggle button display
        document.querySelectorAll('[data-lang]').forEach(el => {
            if (el.getAttribute('data-lang') === this.lang) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => i18n.init());

# PMQ Services – Showcase Website

Site web vitrine professionnel pour **PMQ Services – Professional Metrology & Qualification** (Constantine, Algérie).
Spécialisé dans la cartographie thermique et hygrométrique (ANPP / FD X 15-140 / OMS TRS 961) et la fourniture d'équipements de métrologie.

---

## 🚀 Caractéristiques & Architecture

- **Stack 100% Légère (Zéro Build Step)** : HTML5 sémantique, CSS moderne (CSS Variables, Grid, clamp(), Logical Properties), Vanilla JavaScript (ES Modules).
- **Internationalisation & Bi-Directionnel Natif** : 3 langues (Français par défaut, Anglais, Arabe avec RTL de premier ordre). Textes externalisés dans `/i18n/`.
- **Réglementation & Métrologie Professionnelle** : Intégration conforme aux exigences normatives et d'audit (FD X 15-140, OMS TRS 961, BPF, ANPP).
- **Simulateur Interactif de Cartographie Thermique** : Modélisation SVG d'une chambre de stockage avec détection en temps réel des points chauds / froids et relevé sonde interactif.
- **Console Télémétrique en Direct** : Écran LCD d'enregistreur avec micro-fluctuations calibrées en temps réel.
- **Règle Thermomètre de Défilement** : Indicateur de progression vertical sur la marge simulant la montée du liquide thermométrique.
- **Contact & Devis Direct** : Pas de formulaire lourd : boutons d'appel direct, intégration WhatsApp avec messages pré-remplis dans la langue active, barre mobile d'action rapide.

---

## 📁 Structure du Projet

```
├── index.html                   # Document HTML5 principal
├── robots.txt                   # Directives moteurs de recherche
├── sitemap.xml                  # Sitemap multilingue
├── README.md                    # Ce guide
├── css/
│   ├── tokens.css               # Charte graphique (Teal #0E7C86, Orange #F28C28, échelle thermique)
│   ├── base.css                 # Reset, typographie fluide, scaffold, thermomètre ruler
│   ├── components.css           # Header, cartes de données, produits, simulateur, contact
│   └── rtl.css                  # Règles typographiques et d'alignement pour l'Arabe (RTL)
├── js/
│   ├── i18n.js                  # Moteur multilingue (FR / EN / AR), synchronisation WhatsApp
│   ├── animations.js            # Défilement thermomètre, révélations GSAP ScrollTrigger
│   ├── simulator.js             # Moteur du simulateur thermique interactif
│   └── main.js                  # Point d'entrée, drawer mobile, télémesure temps réel
├── i18n/
│   ├── fr.json                  # Textes en français (maître)
│   ├── en.json                  # Traduction anglaise
│   └── ar.json                  # Traduction arabe conforme au flyer
└── assets/
    ├── logo.svg                 # Logo vectoriel officiel PMQ Services
    ├── favicon.svg              # Favicon capteur
    ├── icons.svg                # Sprite vectoriel d'icônes
    └── images/                  # Visuels vectoriels haute définition
        ├── product-digital-thermo.svg
        ├── product-probe-logger.svg
        ├── product-usb-logger.svg
        ├── domain-raw-materials.svg
        ├── domain-finished-products.svg
        ├── domain-warehouses.svg
        ├── domain-cold-room.svg
        ├── domain-chambers.svg
        ├── domain-samples.svg
        └── domain-controlled.svg
```

---

## ✏️ Guide de Personnalisation (Ce que vous devez remplacer)

### 1. Logo officiel de l'entreprise
- Le logo officiel PMQ Services est intégré sous `assets/logo.png`, `assets/logo.svg` et `assets/logo-dark.png` (adapté pour fond sombre en pied de page).
- Le favicon vectoriel officiel est configuré dans `assets/favicon.svg`.

### 2. Photos réelles (Domaines & Produits)
- Les emplacements d'images se trouvent dans `assets/images/`.
- Vous pouvez remplacer les SVG par vos photos réelles au format WebP ou PNG (ex: `product-digital-thermo.webp`, `domain-cold-room.webp`) et adapter le chemin dans `index.html`.

### 3. Coordonnées & Numéro WhatsApp
- Numéro configuré : `0564 86 69 40` (Format international dans `js/i18n.js` : `213564866940`).
- Email configuré : `pmqservices1@gmail.com`.
- Pour modifier le numéro, mettez à jour la constante `PHONE_INT` dans `js/i18n.js` et les liens `tel:` dans `index.html`.

### 4. Modifier les textes
- Tous les textes sont centralisés dans `i18n/fr.json`, `i18n/en.json`, et `i18n/ar.json`.
- Modifiez simplement les valeurs dans ces fichiers sans toucher au code HTML.

---

## 🌐 Déploiement

Le site ne nécessite aucun outil de compilation (`npm`, `webpack`, `vite`). Il peut être déployé directement :
- **Netlify** : Glisser-déposer le dossier du projet ou lier votre dépôt GitHub (Build command : laisser vide, Publish directory : `.`).
- **Cloudflare Pages** : Connecter le dépôt, pas de commande de build requise.
- **GitHub Pages** : Activer GitHub Pages sur la branche `main` dans les paramètres du dépôt.

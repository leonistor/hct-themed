---
title: "Services"
description: "Ceci est un exemple de description m ta"
draft: false
hasCustomLineAnimationBg: true

# Override "Services Section" data located in services list page
indexServicesSection:
  enable: true # Control the visibility of this section across all services single
  # title: "Services Complémentaires pour Maximiser le Potentiel de Votre Entreprise"
  # subtitle: "Nos Services"

  creativeShape: # Background shape
    enable: true
    position: "top"

  # cta: "slider-nav" # "link" | "slider-nav" ( Define weather call to action button should be slider control or a link )
  # colorScheme: "light" # "dark" | "light"; (default "dark"); weather to show services in light or dark color scheme
  # showServicesAs: "static" # "slider" | "static"; (default "slider"); weather to show services as slider or static list
  limit: false # number / false (default "3"); Limit the number of services to be displayed (Only work if showServicesAs is static)

  button:
    enable: false
    label: "Voir Tous les Services"
    url: "/services"
    rel: ""
    target: ""
    showIcon: "true"
    variant: "outline" # "fill", "outline", "outline-white", "text"
    hoverEffect: "text-flip" # "text-flip", "creative-fill", "magnetic", "magnetic-text-flip"

# ----------------------------------------------------------------------------------------------------------------
# DATA FOR SERVICE SINGLE PAGES
# ----------------------------------------------------------------------------------------------------------------

# "Service Details" Section located in Services Single Page (Image Moving Animation Settings)
serviceDetailsMarquee:
  marqueeElementWidth: "26.5rem"
  marqueeElementWidthResponsive: "18.75rem"
  marqueeElementWidthAuto: true
  marqueePauseOnHover: true
  marqueeReverse: "" # reverse / ""
  marqueeDuration: "30s"

# "Services" Section located in Services Single Page (Override Default Content of `/sections/services-section.md`)
# Uncomment key values that you wan to override ()
servicesSection:
  enable: true # Control the visibility of this section across all services single
  title: "Services Complémentaires pour Maximiser le Potentiel de Votre Entreprise"
  # subtitle: "Nos Services"

  creativeShape: # Background shape
    enable: false
    position: "bottom"

  # cta: "link" # "link" | "slider-nav" ( Define weather call to action button should be slider control or a link )
  # colorScheme: "light" # "dark" | "light"; (default "dark"); weather to show services in light or dark color scheme
  # showServicesAs: "static" # "slider" | "static"; (default "slider"); weather to show services as slider or static list
  # limit: 3 # number / false (default "3"); Limit the number of services to be displayed (Only work if showServicesAs is static)

  # button:
  #   enable: true
  #   label: "Voir Tous les Services"
  #   url: "/services"
  #   rel: ""
  #   target: ""

# "FAQ" Section located in Services Single Page
faqSection:
  enable: true # Control the visibility of this section across all services single
  title: "Vous Avez des Questions sur l'Identité de Marque ? Nous Sommes Là pour Vous Aider"
  # subtitle: ""
  sectionLayout: "horizontal"
  minimalFaqLayout: true
  faqLayoutOnly: false
  showCategories: false

  button:
    enable: true
    label: "Voir Toutes les FAQ"
    url: "/faq"
    rel: ""
    target: ""
    showIcon: "true"
    variant: "outline" # "fill", "outline", "outline-white", "text"
    hoverEffect: "text-flip" # "text-flip", "creative-fill", "magnetic", "magnetic-text-flip"
---

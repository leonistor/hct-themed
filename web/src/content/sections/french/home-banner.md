---
enable: true # Contrôler la visibilité de cette section sur toutes les pages où elle est utilisée

infoBlock:
  enable: true
  content: |
    Notre équipe de consultants expérimentés fournit des idées pratiques et des stratégies innovantes pour aider votre entreprise à prospérer dans un environnement concurrentiel.

  video:
    src: "rFVpSwgCkCo" # Chemin de la vidéo hébergée localement (ex. : /videos/test-video.mp4), ou identifiant de vidéo YouTube/Vimeo (ex. : identifiant YouTube - , identifiant Vimeo - 1003013057)
    type: "" # Si la vidéo est stockée localement dans `public/videos`, définissez le type de fichier vidéo (ex. : "video/mp4")
    provider: "youtube" # Options : "youtube", "vimeo", ou "html5"
    poster: "/images/video-thumbnail.jpg" # Chemin de l'image miniature pour la vidéo
    autoplay: true # Mettre sur true pour lecture automatique ; false pour démarrage manuel (par défaut : false)
    id: "banner-video"

mainBlock:
  disableSlider: false # if this is true then slider will be disabled and only first slide from below will be shown
  slides:
    - title: "Solutions innovantes pour un succès durable"
      description: "Collaborez avec nous pour des solutions personnalisées qui améliorent vos <br/> performances d'entreprise et assurent un succès à long terme."
      backgroundImage: "/images/banner/1.jpg"
      button:
        enable: true
        label: "Demander une consultation"
        url: "/contact"
        rel: ""
        target: ""
        showIcon: "true"
        variant: "outline-white" # "fill", "outline", "outline-white", "text"
        hoverEffect: "text-flip" # "text-flip", "creative-fill", "magnetic", "magnetic-text-flip"
    - title: "Solutions stratégiques pour une croissance dynamique"
      description: "Collaborez avec nous pour des solutions personnalisées qui améliorent vos <br/> performances d'entreprise et assurent un succès à long terme."
      backgroundImage: "/images/banner/2.jpg"
      button:
        enable: true
        label: "Demander une consultation"
        url: "/contact"
        rel: ""
        target: ""
        showIcon: "true"
        variant: "outline-white" # "fill", "outline", "outline-white", "text"
        hoverEffect: "text-flip" # "text-flip", "creative-fill", "magnetic", "magnetic-text-flip"
    - title: "Transformer les défis en opportunités"
      description: "Collaborez avec nous pour des solutions personnalisées qui améliorent vos <br/> performances d'entreprise et assurent un succès à long terme."
      backgroundImage: "/images/banner/3.jpg"
      button:
        enable: true
        label: "Demander une consultation"
        url: "/contact"
        rel: ""
        target: ""
        showIcon: "true"
        variant: "outline-white" # "fill", "outline", "outline-white", "text"
        hoverEffect: "text-flip" # "text-flip", "creative-fill", "magnetic", "magnetic-text-flip"
---

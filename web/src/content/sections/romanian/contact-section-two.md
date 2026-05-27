---
enable: true # Control the visibility of this section across all pages where it is used
badge: ""
title: ""
description: ""
contactTitle: "Mesajul Dumneavoastră"
list:
  - title: "Mobil / WhatsApp"
    icon: "/images/icons/svg/phone-call.svg"
    settingFieldName: "phone"
  - title: "Email"
    icon: "/images/icons/svg/email.svg"
    settingFieldName: "email"
  - title: "Birouri"
    icon: "/images/icons/svg/location.svg"
    settingFieldName: "address"

# Check config.toml file for form action related settings
# this is also used in the footer of the personal case studies homepage
form:
  emailSubject: "New form submission from taxo website" # Customized email subject (applicable when anyone submit form, form submission may receive by email depend on provider)
  submitButton:
    # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
    enable: true
    label: "Trimite Mesaj"
    # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
    # variant: "" # Optional: fill | outline | text | circle
    # rel: "" # Optional
    # target: "" # Optional

  # This note will show at the end of form
  # note: |
  #   Your data is safe with us. We respect your privacy and never share your information. <br /> Read our [Privacy Policy](/privacy-policy/).
  inputs:
    - label: ""
      placeholder: "Nume *"
      name: "Nume" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: false
      defaultValue: ""
    - label: ""
      placeholder: "Email *"
      name: "Email" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      type: "email"
      halfWidth: false
      defaultValue: ""
    # - label: ""
    #   placeholder: "Subiect *"
    #   name: "Subiect" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: false
    #   halfWidth: false
    #   dropdown:
    #     type: "" # select | search - default is select
    #     search: # if type is search then it will work
    #       placeholder: ""
    #     items:
    #       - label: "General Inquiry"
    #         value: "General Inquiry"
    #         selected: false
    #       - label: "Partnership Opportunity"
    #         value: "Partnership Opportunity"
    #         selected: false
    #       - label: "Investment Opportunity"
    #         value: "Investment Opportunity"
    #         selected: false
    # - label: ""
    #   placeholder: "Subject With Search *"
    #   name: "Subject With Search" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: false
    #   halfWidth: true
    #   dropdown:
    #     type: "search" # select | search - default is select
    #     search: # if type is search then it will work
    #       placeholder: "Subject With Search"
    #     items:
    #       - label: "General Inquiry"
    #         value: "General Inquiry"
    #         selected: false
    #       - label: "Partnership Opportunity"
    #         value: "Partnership Opportunity"
    #         selected: false
    #       - label: "Career Opportunity"
    #         value: "Career Opportunity"
    #         selected: false
    #       - label: "Investment Opportunity"
    #         value: "Investment Opportunity"
    #         selected: false
    #       - label: "Media Inquiry"
    #         value: "Media Inquiry"
    #         selected: false
    - label: ""
      tag: "textarea"
      defaultValue: ""
      rows: "4" # Only work if tag is textarea
      placeholder: "Cum vă putem ajuta? *"
      name: "Message" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: false
    # - label: "Google Search" # only valid for type="checkbox" & type === "radio"
    #   checked: false # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "How did you hear about us?" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    # - label: "Social Media" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    # - label: "Referral" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    # - label: "Other" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    # - label: "I agree to the terms and conditions and [privacy policy](/contact/)." # only valid for type="checkbox" & type === "radio"
    #   id: "privacy-policy"
    #   name: "Agreed Privacy" # This is crucial. Its indicate under which name you want to receive this field data
    #   value: "Agreed" # Value that will be submit (applicable for type="checkbox" & type === "radio")
    #   checked: false # only valid for type="checkbox" & type === "radio"
    #   required: true
    #   type: "checkbox"
    #   halfWidth: false
    #   defaultValue: ""
    - note: success # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message success"
      content: We have received your message! We'll get back to you as soon as possible.
    - note: deprecated # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message error"
      content: Something went wrong! please use this mail - [taxo-astro-theme@gmail.com](mailto:taxo-astro-theme@gmail.com) to submit a ticket!
---

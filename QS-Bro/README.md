# 📊 Seguimiento de Producción Técnica – AppSheet + Google Sheets

Este proyecto automatiza el registro diario de producción técnica, ofreciendo un sistema limpio, seguro y visual para cada empleado. Usa **AppSheet** como interfaz de entrada y **Google Sheets** como base de datos, con vistas individuales y resúmenes automáticos.

🧠 Mapa Conceptual del Proyecto

El siguiente mapa conceptual resume visualmente la estructura del sistema, los componentes clave y los principales retos técnicos abordados durante el desarrollo:

[![Mapa Conceptual del Proyecto](https://raw.githubusercontent.com/Lynphex/Personal-Projects/main/QS-Bro/MindMap_Workflow.png)](https://raw.githubusercontent.com/Lynphex/Personal-Projects/main/QS-Bro/MindMap_Workflow.png)

<details>
<summary>🇪🇸 Español – Resumen General</summary>
  Seguimiento de Producción Técnica – Proyecto con AppSheet & Google Sheets
  
  Este proyecto fue diseñado para digitalizar y automatizar el seguimiento de producción diaria de técnicos mediante la integración de Google Sheets y AppSheet, con una interfaz móvil intuitiva, seguridad por usuario y generación automática de resúmenes mensuales.

  📁 Contenidos del Repositorio

  - README.md: Este archivo, con un resumen general del proyecto.
  - informe.md: Documento técnico completo con detalles sobre la estructura, lógica, problemas encontrados y soluciones aplicadas.
  - Datos Centralizados.xlsx: Este archivo contiene la base de datos completa utilizada por AppSheet, junto con las plantillas individuales de cada técnico. Incluye una pestaña central donde se registran todos los datos (Datos Centralizados) y hojas dinámicas para cada empleado con métricas diarias automatizadas mediante fórmulas QUERY.
  - capturas_app.md: Muestra visual de la app, screenshots desde la interfaz de AppSheet

  ⚙️ Herramientas y Tecnologías Utilizadas

  - Google Sheets: Almacenamiento, fórmulas QUERY y hojas dinámicas por empleado.
  - AppSheet: Interfaz móvil para entrada de datos, resúmenes y filtros por usuario.
  - Automatización: Actualización de registros sin duplicados y cálculos personalizados.

  ✅ Funcionalidades Destacadas

  - Entrada y edición de producción diaria por parte de cada técnico.
  - Visualización personalizada diaria y mensual para cada usuario.
  - Seguridad por email ([Email Empleado] = USEREMAIL()).

    Cálculo de métricas clave: puntos, bonos, salario bruto estimado.
</details>

<details>
<summary>🇬🇧 English – General Summary</summary>
  Technical Production Tracking – AppSheet & Google Sheets Project
  
  This project was designed to digitize and automate the daily production tracking of technicians, integrating Google Sheets and AppSheet to provide a mobile-friendly interface, user-level security, and automatic monthly summaries.

  📁 Repository Contents
  
  - README.md: This file, with a general summary of the project.
  - informe.md: A full technical report detailing the system’s structure, logic, challenges, and solutions.
  - Datos Centralizados.xlsx: This spreadsheet contains the complete production database used by AppSheet, as well as individual templates for each technician. It includes a central sheet (Datos Centralizados) where all records are stored, and dynamic views for each employee showing daily metrics via QUERY formulas.
  - capturas_app.md: Visual showcase of the mobile app, with screenshots of the AppSheet interface.

  ⚙️ Tools and Technologies
  
  - Google Sheets: Storage, QUERY formulas, and employee-specific views.
  - AppSheet: Mobile interface for data input, summaries, and user-based filtering.
  - Automation: Record updates without duplicates and custom metric calculations.

  ✅ Key Features
  
  - Daily production input and editing by technicians.
  - Personalized views (daily/monthly) for each user.
  - Row-level security via [Email Empleado] = USEREMAIL().
  Metrics like points, bonuses, and estimated gross salary.
</details>

<details>
<summary>🇫🇷 Français – Résumé Général</summary>
  Suivi de Production Technique – Projet avec AppSheet & Google Sheets
  
  Ce projet a été conçu pour numériser et automatiser le suivi de production quotidien des techniciens, en combinant Google Sheets et AppSheet, avec une interface mobile conviviale, une sécurité par utilisateur, et un résumé mensuel automatique.

  📁 Contenu du Répertoire
  
  - README.md : Ce fichier, avec un résumé général du projet.
  - informe.md : Rapport technique détaillé sur la structure du système, sa logique, les problèmes rencontrés et leurs solutions.
  - Datos Centralizados.xlsx: Ce fichier Excel contient la base de données complète utilisée par AppSheet, ainsi que des modèles personnalisés pour chaque technicien. Il comprend un onglet central (Datos Centralizados) où sont enregistrées toutes les données, et des feuilles dynamiques par employé affichant leurs indicateurs quotidiens via des formules QUERY.
  - capturas_app.md: Présentation visuelle de l’application mobile, avec captures d’écran de l’interface AppSheet.

  ⚙️ Outils et Technologies
  
  - Google Sheets : Stockage, formules QUERY et vues par employé.
  - AppSheet : Interface mobile pour saisie, résumé et filtrage personnalisé.
  - Automatisation : Mise à jour des enregistrements sans doublons et calculs personnalisés.

  ✅ Fonctionnalités Clés

  - Saisie et modification quotidienne par chaque technicien.
  - Vues personnalisées (journalières/mensuelles).
  - Sécurité par ligne via [Email Empleado] = USEREMAIL().
  Calculs des points, bonus et salaire brut estimé.

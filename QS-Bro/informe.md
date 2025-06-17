# Esquema de la Aplicación AppSheet: Seguimiento de Producción para Técnicos

Este documento describe la configuración y el esquema de la aplicación AppSheet diseñada para el seguimiento de la producción diaria de técnicos, la visualización de resúmenes personalizados y la gestión de datos.

---

<details>
<summary>🇪🇸 Versión en Español</summary>

## 1. Visión General de la Aplicación

La aplicación AppSheet sirve como la interfaz principal para:
* La entrada de datos de producción diarios por parte de los técnicos.
* La visualización personalizada de su rendimiento individual.
* La presentación de un resumen consolidado con cálculos de puntos y salario bruto estimado.
* Garantizar la seguridad y privacidad de los datos, mostrando a cada usuario solo su información relevante.

<details>
<summary>2. Fuentes de Datos</summary>

La aplicación se conecta a una única Hoja de Cálculo de Google, que contiene las siguientes pestañas tratadas como tablas en AppSheet:

* **`Datos Centralizados`**: Tabla principal para el registro de datos brutos de producción.
* **`Resumen Calculado`**: Tabla auxiliar utilizada para generar vistas de resumen agregadas y campos calculados a nivel de empleado.
</details>

<details>
<summary>3. Configuración de Tablas</summary>

### 3.1. Tabla: `Datos Centralizados`

* **Propósito:** Almacenar los registros de producción diarios de todos los técnicos.
* **Fuente:** Pestaña `Datos Centralizados` de Google Sheets.
* **Comportamiento de Entrada de Datos:** Configurada para **actualizar** los registros existentes cuando un técnico envía un formulario para una `FECHA` y `Email Empleado` que ya tiene datos. Esto asegura que no se dupliquen las entradas para el mismo día y empleado.
* **Columnas Clave y Tipos (Ejemplo basado en un posible mapeo):**
    * `FECHA` (Columna A): `Number` (o `Date`, si se prefiere una fecha completa) - **Key** (parte de la clave compuesta con `Email Empleado`)
    * `REUTI` (Columna B): `Number`
    * `COMPLETA` (Columna C): `Number`
    * `AV-POST` (Columna D): `Number`
    * `REP` (Columna E): `Number`
    * `BONOS` (Columna F): `Number`
    * `NOTAS` (Columna G): `LongText`
    * `Email Empleado` (Columna H): `Email` - **Key** (parte de la clave compuesta con `FECHA`)
    * *(Opcional) `Timestamp` (Columna I):* `DateTime` (AppSheet gestionado para auditar la última modificación).

### 3.2. Tabla: `Resumen Calculado`

* **Propósito:** Servir como base para mostrar los totales y cálculos agregados por empleado. Contiene una lista única de todos los emails de los empleados.
* **Fuente:** Pestaña `Resumen Calculado` de Google Sheets.
* **Columna Clave y Tipo:**
    * `Email Empleado` (Columna A): `Email` - **Key**

* **Columnas Virtuales (Campos Calculados):** Estas columnas se calculan dinámicamente en AppSheet y proporcionan las métricas de resumen:

    * **`Total REUTI`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[REUTI], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total COMPLETA`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[COMPLETA], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total AV-POST`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[AV-POST], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total REP`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[REP], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total BONOS`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[BONOS], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`PUNTOS`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            ([Total REUTI] * 2) + ([Total COMPLETA] * 3) + ([Total AV-POST] * 1) + ([Total REP] * 0.5) + ([Total BONOS] * 0.5)
            ```

    * **`PB`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            [Total REUTI] + [Total COMPLETA]
            ```

    * **`SALARIO BRUTO`**
        * **Tipo:** `Number`
        * **Fórmula:**
            ```appsheet
            ([Total REUTI] * 18) + ([Total COMPLETA] * 25) + ([Total AV-POST] * 10) + ([Total REP] * 5) + ([Total BONOS] * 5)
            ```

    * **`ADVERTENCIA_TEXTO`**
        * **Tipo:** `LongText`
        * **Fórmula:**
            ```appsheet
            "La información que se muestra es orientativa y no vinculante, puesto que muestra una producción bruta, no tiene en cuenta ni las visitas en garantía, ni repetidas, ni otros conceptos que pueden hacer que varie por lo que no puede considerarse como la producción definitiva, simplemente es orientativa con la finalidad de ayudar a los técnicos a hacer un seguimiento de su trabajo y a una mejor organización"
            ```
</details>

<details>
<summary>4. Vistas de Usuario (UX Views)</summary>

Las vistas principales de la aplicación incluyen:

* **Vista de Entrada de Producción Diaria:** (Ej. Basada en `Datos Centralizados`, tipo `Form` o `Detail/Deck`) Permite a los técnicos introducir y editar sus registros de producción para cada día.
* **`TOTAL APROXIMADO`:**
    * **Propósito:** Mostrar los totales acumulados de cada métrica, los puntos, el PB y el salario bruto estimado de cada técnico.
    * **Tabla:** `Resumen Calculado`
    * **Tipo de Vista:** Típicamente `Detail` (para que un usuario vea solo su propio resumen) o `Table`/`Deck` (para una vista de administrador).
    * **Elementos Visualizados:** Todas las Columnas Virtuales definidas anteriormente.
</details>

<details>
<summary>5. Configuración de Seguridad</summary>

La aplicación implementa seguridad a nivel de fila para proteger la privacidad de los datos de cada técnico.

* **Ubicación:** `Security > Row filter condition`
* **Tablas Afectadas:** `Datos Centralizados` y `Resumen Calculado`.
* **Condición de Filtro Aplicada:** Para ambas tablas, la expresión utilizada es:
    ```appsheet
    [Email Empleado] = USEREMAIL()
    ```
    * **Efecto:** Esta condición asegura que cada usuario que inicia sesión en la aplicación solo pueda ver y acceder a las filas de datos donde el email en la columna `[Email Empleado]` coincide con su propio email de inicio de sesión (`USEREMAIL()`). Esto se aplica tanto a sus registros diarios como a sus resúmenes calculados, garantizando la confidencialidad de la información de otros usuarios.
    * *(Opcional para Administradores):* Para permitir que un administrador vea todos los datos, la condición podría extenderse a:
        `[Email Empleado] = USEREMAIL() OR USEREMAIL() = "tu.email.admin@dominio.com"` (o utilizando `USERROLE()` si hay roles definidos).
</details>

</details>

---

<details>
<summary>🇬🇧 English Version</summary>

# AppSheet Application Schema: Technician Production Tracking

This document describes the configuration and schema of the AppSheet application designed for daily technician production tracking, personalized summary visualization, and data management.

## 1. Application Overview

The AppSheet application serves as the main interface for:
* Daily production data entry by technicians.
* Personalized visualization of individual performance.
* Presentation of a consolidated summary with calculated points and estimated gross salary.
* Ensuring data security and privacy by showing each user only their relevant information.

<details>
<summary>2. Data Sources</summary>

The application connects to a single Google Sheet, which contains the following tabs treated as tables in AppSheet:

* **`Datos Centralizados` (Centralized Data)**: Main table for raw production data logging.
* **`Resumen Calculado` (Calculated Summary)**: Auxiliary table used to generate aggregated summary views and calculated fields at the employee level.
</details>

<details>
<summary>3. Table Configurations</summary>

### 3.1. Table: `Datos Centralizados` (Centralized Data)

* **Purpose:** To store daily production records for all technicians.
* **Source:** `Datos Centralizados` tab in Google Sheets.
* **Data Entry Behavior:** Configured to **update** existing records when a technician submits a form for a `FECHA` (Date) and `Email Empleado` (Employee Email) that already has data. This ensures no duplicate entries for the same day and employee.
* **Key Columns and Types (Example based on a possible mapping):**
    * `FECHA` (Column A): `Number` (or `Date`, if a full date is preferred) - **Key** (part of composite key with `Email Empleado`)
    * `REUTI` (Column B): `Number`
    * `COMPLETA` (Column C): `Number`
    * `AV-POST` (Column D): `Number`
    * `REP` (Column E): `Number`
    * `BONOS` (Column F): `Number`
    * `NOTAS` (Column G): `LongText`
    * `Email Empleado` (Column H): `Email` - **Key** (part of composite key with `FECHA`)
    * *(Optional) `Timestamp` (Column I):* `DateTime` (AppSheet managed for auditing last modification).

### 3.2. Table: `Resumen Calculado` (Calculated Summary)

* **Purpose:** To serve as the base for displaying aggregated totals and calculations per employee. Contains a unique list of all employee emails.
* **Source:** `Resumen Calculado` tab in Google Sheets.
* **Key Column and Type:**
    * `Email Empleado` (Column A): `Email` - **Key**

* **Virtual Columns (Calculated Fields):** These columns are dynamically calculated in AppSheet and provide the summary metrics:

    * **`Total REUTI`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[REUTI], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total COMPLETA`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[COMPLETA], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total AV-POST`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[AV-POST], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total REP`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[REP], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total BONOS`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            SUM(SELECT(Datos Centralizados[BONOS], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`POINTS`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            ([Total REUTI] * 2) + ([Total COMPLETA] * 3) + ([Total AV-POST] * 1) + ([Total REP] * 0.5) + ([Total BONOS] * 0.5)
            ```

    * **`PB`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            [Total REUTI] + [Total COMPLETA]
            ```

    * **`GROSS SALARY`**
        * **Type:** `Number`
        * **Formula:**
            ```appsheet
            ([Total REUTI] * 18) + ([Total COMPLETA] * 25) + ([Total AV-POST] * 10) + ([Total REP] * 5) + ([Total BONOS] * 5)
            ```

    * **`DISCLAIMER_TEXT`**
        * **Type:** `LongText`
        * **Formula:**
            ```appsheet
            "The information shown is indicative and non-binding, as it represents gross production. It does not account for warranty visits, repeated visits, or other concepts that may cause variations, and therefore cannot be considered as definitive production. It is merely indicative, intended to help technicians track their work and improve organization."
            ```
</details>

<details>
<summary>4. User Views (UX Views)</summary>

The main views of the application include:

* **Daily Production Entry View:** (e.g., Based on `Datos Centralizados`, `Form` or `Detail/Deck` type) Allows technicians to enter and edit their daily production records.
* **`APPROXIMATE TOTAL`:**
    * **Purpose:** To display the accumulated totals for each metric, points, PB, and estimated gross salary for each technician.
    * **Table:** `Resumen Calculado`
    * **View Type:** Typically `Detail` (for a user to see only their own summary) or `Table`/`Deck` (for an administrator's view).
    * **Displayed Elements:** All Virtual Columns defined above.
</details>

<details>
<summary>5. Security Configuration</summary>

The application implements row-level security to protect the privacy of each technician's data.

* **Location:** `Security > Row filter condition`
* **Affected Tables:** `Datos Centralizados` and `Resumen Calculado`.
* **Applied Filter Condition:** For both tables, the expression used is:
    ```appsheet
    [Email Empleado] = USEREMAIL()
    ```
    * **Effect:** This condition ensures that each user logged into the application can only see and access data rows where the email in the `[Email Empleado]` column matches their own login email (`USEREMAIL()`). This applies to both their daily records and calculated summaries, guaranteeing the confidentiality of other users' information.
    * *(Optional for Admins):* To allow an administrator to view all data, the condition could be extended to:
        `[Email Empleado] = USEREMAIL() OR USEREMAIL() = "your.admin.email@domain.com"` (or using `USERROLE()` if roles are defined).
</details>

</details>

---

<details>
<summary>🇫🇷 Version Française</summary>

# Schéma de l'Application AppSheet : Suivi de Production des Techniciens

Ce document décrit la configuration et le schéma de l'application AppSheet conçue pour le suivi quotidien de la production des techniciens, la visualisation personnalisée des résumés et la gestion des données.

## 1. Vue d'Ensemble de l'Application

L'application AppSheet sert d'interface principale pour :
* La saisie quotidienne des données de production par les techniciens.
* La visualisation personnalisée de leurs performances individuelles.
* La présentation d'un résumé consolidé avec des calculs de points et un salaire brut estimé.
* Assurer la sécurité et la confidentialité des données en n'affichant à chaque utilisateur que les informations qui le concernent.

<details>
<summary>2. Sources de Données</summary>

L'application se connecte à une unique feuille de calcul Google, qui contient les onglets suivants traités comme des tables dans AppSheet :

* **`Datos Centralizados` (Données Centralisées)** : Table principale pour l'enregistrement des données de production brutes.
* **`Resumen Calculado` (Résumé Calculé)** : Table auxiliaire utilisée pour générer des vues de résumé agrégées et des champs calculés au niveau de l'employé.
</details>

<details>
<summary>3. Configuration des Tables</summary>

### 3.1. Tableau : `Datos Centralizados` (Données Centralisées)

* **Objectif :** Stocker les enregistrements de production quotidiens de tous les techniciens.
* **Source :** Onglet `Datos Centralizados` de Google Sheets.
* **Comportement de Saisie de Données :** Configuré pour **mettre à jour** les enregistrements existants lorsqu'un technicien soumet un formulaire pour une `FECHA` (Date) et un `Email Empleado` (E-mail de l'Employé) qui a déjà des données. Cela garantit l'absence de doublons pour le même jour et le même employé.
* **Colonnes Clés et Types (Exemple basé sur un mappage possible) :**
    * `FECHA` (Colonne A) : `Number` (ou `Date`, si une date complète est préférée) - **Clé** (partie de la clé composite avec `Email Empleado`)
    * `REUTI` (Colonne B) : `Number`
    * `COMPLETA` (Colonne C) : `Number`
    * `AV-POST` (Colonne D) : `Number`
    * `REP` (Colonne E) : `Number`
    * `BONOS` (Colonne F) : `Number`
    * `NOTAS` (Colonne G) : `LongText`
    * `Email Empleado` (Colonne H) : `Email` - **Clé** (partie de la clé composite avec `FECHA`)
    * *(Optionnel) `Timestamp` (Colonne I) :* `DateTime` (géré par AppSheet pour l'audit de la dernière modification).

### 3.2. Tableau : `Resumen Calculado` (Résumé Calculé)

* **Objectif :** Servir de base pour afficher les totaux agrégés et les calculs par employé. Contient une liste unique de tous les e-mails des employés.
* **Source :** Onglet `Resumen Calculado` de Google Sheets.
* **Colonne Clé et Type :**
    * `Email Empleado` (Colonne A) : `Email` - **Clé**

* **Colonnes Virtuelles (Champs Calculés) :** Ces colonnes sont calculées dynamiquement dans AppSheet et fournissent les métriques de résumé :

    * **`Total REUTI`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            SUM(SELECT(Datos Centralizados[REUTI], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total COMPLETA`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            SUM(SELECT(Datos Centralizados[COMPLETA], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total AV-POST`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            SUM(SELECT(Datos Centralizados[AV-POST], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total REP`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            SUM(SELECT(Datos Centralizados[REP], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`Total BONOS`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            SUM(SELECT(Datos Centralizados[BONOS], [Email Empleado] = [_THISROW].[Email Empleado]))
            ```

    * **`POINTS`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            ([Total REUTI] * 2) + ([Total COMPLETA] * 3) + ([Total AV-POST] * 1) + ([Total REP] * 0.5) + ([Total BONOS] * 0.5)
            ```

    * **`PB`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            [Total REUTI] + [Total COMPLETA]
            ```

    * **`SALAIRE BRUT`**
        * **Type :** `Number`
        * **Formule :**
            ```appsheet
            ([Total REUTI] * 18) + ([Total COMPLETA] * 25) + ([Total AV-POST] * 10) + ([Total REP] * 5) + ([Total BONOS] * 5)
            ```

    * **`TEXTE_AVERTISSEMENT`**
        * **Type :** `LongText`
        * **Formule :**
            ```appsheet
            "Les informations présentées sont indicatives et non contraignantes, car elles représentent une production brute. Elles ne tiennent pas compte des visites sous garantie, des visites répétées ou d'autres concepts pouvant entraîner des variations, et ne peuvent donc pas être considérées comme la production définitive. Elles sont simplement indicatives, destinées à aider les techniciens à suivre leur travail et à améliorer leur organisation."
            ```
</details>

<details>
<summary>4. Vues Utilisateur (UX Views)</summary>

Les vues principales de l'application comprennent :

* **Vue de Saisie de Production Quotidienne :** (Ex. Basée sur `Datos Centralizados`, type `Form` ou `Detail/Deck`) Permet aux techniciens de saisir et de modifier leurs enregistrements de production quotidiens.
* **`TOTAL APPROXIMATIF` :**
    * **Objectif :** Afficher les totaux cumulés pour chaque métrique, les points, le PB et le salaire brut estimé de chaque technicien.
    * **Table :** `Resumen Calculado`
    * **Type de Vue :** Généralement `Detail` (pour qu'un utilisateur ne voie que son propre résumé) ou `Table`/`Deck` (pour une vue administrateur).
    * **Éléments Affichés :** Toutes les colonnes virtuelles définies ci-dessus.
</details>

<details>
<summary>5. Configuration de Sécurité</summary>

L'application met en œuvre une sécurité au niveau des lignes pour protéger la confidentialité des données de chaque technicien.

* **Emplacement :** `Security > Row filter condition`
* **Tables Affectées :** `Datos Centralizados` et `Resumen Calculado`.
* **Condition de Filtre Appliquée :** Pour les deux tables, l'expression utilisée est :
    ```appsheet
    [Email Empleado] = USEREMAIL()
    ```
    * **Effet :** Cette condition garantit que chaque utilisateur connecté à l'application ne peut voir et accéder qu'aux lignes de données où l'e-mail de la colonne `[Email Empleado]` correspond à son propre e-mail de connexion (`USEREMAIL()`). Cela s'applique à la fois à leurs enregistrements quotidiens et à leurs résumés calculés, garantissant la confidentialité des informations des autres utilisateurs.
    * *(Optionnel pour les Administrateurs) :* Pour permettre à un administrateur de voir toutes les données, la condition pourrait être étendue à :
        `[Email Empleado] = USEREMAIL() OR USEREMAIL() = "votre.email.admin@domaine.com"` (ou en utilisant `USERROLE()` si des rôles sont définis).
</details>

</details>

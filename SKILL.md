# StratBaker — Skill de référence Claude Code

Dernière mise à jour : 2026-09-24 (alignement UI sur le vrai User)
À mettre à jour après chaque session de travail significative.

## Concept produit

StratBaker est une plateforme de gestion de stratégies pour équipes esport CS2. Une équipe (coach, IGL, joueurs) y centralise ses strats par map (setups joueurs, plans d'exécution texte), les organise par tags et versions, et peut les consulter hors-ligne (PWA) pendant les scrims/matchs sur PC portable ou tablette. Trois rôles distincts : le Coach gère l'équipe et a tous les droits, l'IGL (In-Game Leader) peut créer/éditer des strats, le Player consulte et peut ajouter des annotations personnelles privées sur chaque section. L'app vise un usage rapide en LAN/tournoi (offline-first) et un export/import de bundles pour partager équipe ou strats sans dépendre d'un serveur.

## Stack technique réelle

- **Nuxt 3.13** en mode SPA (`ssr: false`) — ⚠️ écart : le plan prévoyait Nuxt 4, le projet est en Nuxt 3.
- **Vue 3.5**, Vue Router 4.4
- **Tailwind CSS 3.4** via `@nuxtjs/tailwindcss` 6.12 (pas le module Vite direct)
- **`@vite-pwa/nuxt` 0.10** — PWA configurée (manifest + Workbox), voir section dédiée
- **TypeScript** (tsconfig minimal, pas de `strict` custom visible)
- Pas de Pinia — la gestion d'état passe uniquement par `useState` de Nuxt (composables `useAuth`, `useOffline`)
- Pas de Supabase, pas de Firebase, aucun SDK cloud tiers — conforme au plan initial
- Backend Laravel 13 présent dans le monorepo, repo séparé (voir section Backend)
- Node v22.10 utilisé en local ; aucun champ `engines` dans `package.json`
- Pas de dossier `server/` fonctionnel (juste un `tsconfig.json` qui hérite du tsconfig Nuxt généré — aucune route API Nitro)

## Architecture des dossiers

```
BakerStrat/
├── app.vue                      # shell racine (NuxtLayout + NuxtPage)
├── assets/css/main.css          # Tailwind + design tokens (boutons, cards, badges)
├── components/
│   ├── AppHeader.vue            # header global (logo, équipe, statut online, rôle, logout)
│   ├── PageHeader.vue           # titre de page réutilisable + bouton retour
│   └── TagBadge.vue             # badge tag — composant créé mais NON utilisé actuellement
├── composables/
│   ├── useApi.ts                # wrapper $fetch (GET/POST/PATCH/DELETE), branché sur le backend Sanctum
│   ├── useAuth.ts                # auth réelle (Sanctum), state useState + localStorage, rôles coach/igl/player
│   └── useOffline.ts             # détection online/offline via navigator.onLine
├── layouts/default.vue          # layout unique, minimal
├── middleware/auth.ts            # garde de route globale (token localStorage)
├── pages/
│   ├── index.vue                 # redirection vers /login ou /dashboard
│   ├── login.vue                 # formulaire de connexion (mock)
│   ├── dashboard.vue              # grille des maps
│   ├── team.vue                   # gestion d'équipe (coach only)
│   ├── map/[slug].vue              # liste des strats d'une map, filtres tag/date
│   └── strat/[id]/
│       ├── index.vue               # vue lecture d'une strat + annotations joueur
│       └── edit.vue                 # éditeur de strat (sections, drag & drop)
├── public/                       # favicon + icônes PWA (192/512)
├── server/tsconfig.json          # aucune route API, juste config TS héritée
├── utils/mockData.ts             # toutes les données de démo (maps, strats, team, tags)
├── nuxt.config.ts
├── tailwind.config.js
└── package.json
```

Pas de dossier `plugins/`, `stores/` (Pinia) ni `types/` custom — seuls les types Nuxt auto-générés existent dans `.nuxt/types`.

## Pages existantes

| Route | État | Description |
|---|---|---|
| `/` (`index.vue`) | scaffold | Redirige selon présence du token vers `/login` ou `/dashboard`, spinner le temps du check |
| `/login` | fonctionnel (réel) | Formulaire email/password branché sur `POST /api/auth/login`, affiche le message d'erreur du backend (401 "Identifiants incorrects") |
| `/dashboard` | fonctionnel (mock data) | Grille des 7 maps CS2 avec compteur de strats, statut cache offline |
| `/team` | fonctionnel (mock data) | Liste des membres, changement de rôle, transfert du rôle Coach, invitations, export/import de bundle `.stratbaker` (JSON) — visible coach uniquement |
| `/map/[slug]` | fonctionnel (mock data) | Liste des strats d'une map, filtres par tag et par date, lien "New Strat" (bouton présent mais sans action câblée) |
| `/strat/[id]` | fonctionnel (mock data) | Affichage d'une strat (setup joueurs en tableau + sections texte formatées markdown-like), annotations personnelles (localStorage, joueur uniquement) |
| `/strat/[id]/edit` | fonctionnel (mock data, pas de persistance réelle) | Éditeur de sections (ajout/suppression, drag & drop, tableau setup), preview live, sauvegarde simulée par `setTimeout` (aucun appel réseau) |

## Composables

| Composable | Responsabilité |
|---|---|
| `useAuth` | État utilisateur (`useState`, `{ user, token }`), `login`/`logout` réels contre `/api/auth/login`/`/api/auth/logout`, `init()` recharge depuis `localStorage` puis revalide via `/api/auth/me` (idempotent, ne fetch qu'une fois par session via un flag `useState`) |
| `useApi` | Wrapper `$fetch`, `baseURL` lu depuis `useRuntimeConfig().public.apiUrl` à chaque appel, headers `Authorization: Bearer` + `Accept: application/json`, `credentials: 'include'`. **Utilisé par `useAuth`** (login/logout/me) ; sur un 401 il vide le `localStorage` et redirige vers `/login` via `useRouter()` |
| `useOffline` | État online/offline via `navigator.onLine` + écouteurs `online`/`offline`, horodatage de dernière sync |

## État des fonctionnalités

| Feature | État | Notes |
|---|---|---|
| Auth (login/register) | Fonctionnelle (Sanctum) | `/login` branché sur le vrai backend (`AuthController::login`), token Sanctum stocké et envoyé en Bearer. Register implémenté côté backend (`POST /api/auth/register`, role `player` forcé) mais **aucune page `register.vue` côté frontend** — testé uniquement via curl pour l'instant. |
| Gestion équipes | Scaffold avancé (mock data) | UI complète (invite, changement de rôle, transfert coach) mais toutes les actions ne modifient que l'état local en mémoire, rien n'est persisté ni envoyé à une API |
| Strats (CRUD) | Lecture + édition UI seules | Lecture fonctionnelle sur données mockées (`utils/mockData.ts`). L'éditeur (`edit.vue`) permet d'ajouter/réordonner/supprimer des sections mais ne sauvegarde nulle part (juste un indicateur "Saving..." simulé) |
| Versioning | Affichage seul | Un champ `version` existe sur chaque strat et s'affiche (`v3`, `v4`...), mais rien n'incrémente ni n'historise réellement une nouvelle version |
| Offline / PWA | Configuré, non testé en conditions réelles | `@vite-pwa/nuxt` configuré avec manifest (couleurs correctes) + Workbox (`NetworkFirst` sur `/api/*`, `CacheFirst` sur assets statiques). Le composable `useOffline` reflète l'état réseau mais n'orchestre aucune vraie synchro de données |
| Export PDF/PNG | Absent | Aucune trace de génération PDF/PNG dans le code |
| Bundle `.stratbaker` | Scaffold partiel | Implémenté uniquement pour l'équipe (`team.vue` : export/import JSON `.stratbaker` des membres + invitations). Pas de bundle pour les strats elles-mêmes |
| Annotations joueur | Fonctionnel (local uniquement) | Stockées dans `localStorage` par strat (`stratbaker_annotations_<id>`), visibles seulement pour le rôle `player`, jamais synchronisées avec un backend |

## Backend

- **Le repo existe maintenant** : `/Users/fdg-/Desktop/claude+remo/BakerStrat/BakerStratBack` (le projet est un monorepo `BakerStrat/` avec `BakerStratFront/` = ce repo Nuxt, et `BakerStratBack/` = l'API Laravel).
- Laravel **13.17**, PHP 8.5, MySQL via MAMP (`127.0.0.1:8889`, DB `stratbaker`). Laravel Boost installé (outillage IA officiel).
- Sanctum installé (`auth:sanctum`, tokens Bearer — pas de flux SPA cookie, cohérent avec `useApi.ts` qui envoie déjà `Authorization: Bearer <token>`).
- Schéma DB en place : `users` (+ `role` enum coach/igl/player, `team_id`), `teams`, `strats`, `strat_versions`, `team_invitations`. Models Eloquent créés avec toutes les relations (`User↔Team↔Strat↔StratVersion↔TeamInvitation`).
- **Routes API définies et vérifiées** (`php artisan route:list --path=api`), CORS ouvert vers `http://localhost:3000` :
  - `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` (auth), `GET /api/auth/me` (auth)
  - `GET|PUT /api/team`, `POST /api/team/invite`, `GET /api/team/members`, `DELETE /api/team/members/{user}`, `GET /api/team/export`, `POST /api/team/import` (toutes auth)
  - `GET/POST /api/strats`, `GET/PUT/DELETE /api/strats/{strat}`, `GET /api/strats/{strat}/versions` (toutes auth)
- **`AuthController` est implémenté et testé end-to-end** (register/login/logout/me) — voir détail ci-dessous. `TeamController` et `StratController` restent des stubs `501 Not implemented`.
- Connexion testée et fonctionnelle : `php artisan serve --port=8000` + `GET /api/auth/me` sans token renvoie bien `401 {"message":"Unauthenticated."}`.
- `NUXT_PUBLIC_API_URL` (frontend) doit pointer vers `http://localhost:8000` pour matcher `APP_URL` du backend — déjà la valeur par défaut de `nuxt.config.ts`, aucun changement requis côté frontend pour l'instant.

### AuthController (implémenté, testé via curl)

- `POST /api/auth/register` — valide `name`/`email` (unique)/`password` (min 8, confirmed), crée le user avec **`role` forcé à `player`** (pas de choix de rôle à l'inscription), retourne `201` + `{ token, user }`.
- `POST /api/auth/login` — `Auth::attempt()` (fonctionne tel quel malgré l'absence de middleware `web`/session sur les routes API — vérifié empiriquement, pas de crash), révoque tous les anciens tokens du user (`$user->tokens()->delete()`) puis en émet un nouveau. Retourne `401 {"message":"Identifiants incorrects"}` si échec.
- `POST /api/auth/logout` (auth) — révoque uniquement le token courant (`currentAccessToken()->delete()`), `204 No Content`.
- `GET /api/auth/me` (auth) — retourne `{ id, name, email, role, team_id }`, plus une clé `team` (objet Team) si `team_id` n'est pas `null`.
- Format de réponse uniforme `{ token, user: { id, name, email, role, team_id } }` pour register/login.

## Design tokens

Effectivement appliqués dans `tailwind.config.js` et `assets/css/main.css`, conformes au plan initial :

- Fond : `bg` = `#0f1117` (+ variantes `bg-light #1a1d28`, `bg-lighter #222633`, `bg-card #181b25`)
- Accent : `accent` = `#00ff88` (+ `accent-dark #00cc6f`, `accent-dim #00b359`, `accent-glow rgba(0,255,136,0.15)`)
- Danger `#ff4466`, Warning `#ff9933`, Muted `#6b7080` / `#8b90a0`, Border `#2a2e3a` / `#353a48`
- Police : Inter (Google Fonts, chargée en `@import` dans `main.css`), fallback Geist/system-ui
- Composants utilitaires prêts à l'emploi via `@layer components` : `.btn` (`primary`/`secondary`/`danger`/`ghost`), `.card`, `.input`, `.badge` (+ variantes `coach`/`igl`/`player`/`tag`)
- Couleurs du manifest PWA (`theme_color: #00ff88`, `background_color: #0f1117`) alignées avec les tokens Tailwind

## Décisions techniques prises

- **2026-09-15** — Suppression du dossier `.bolt/` (config StackBlitz/Bolt.new résiduelle), aucune autre trace Bolt trouvée dans le code. Voir [CLEANUP.md](CLEANUP.md).
- **2026-09-15** — Repo Laravel 13 créé dans `BakerStrat/BakerStratBack` (monorepo). Auth via Sanctum en mode tokens Bearer (pas de cookies SPA stateful), MySQL/MAMP en local sur le port `8889`. Schéma DB, models et routes API définis ; controllers laissés en stubs `501` volontairement, à implémenter dans une prochaine session.
- **2026-09-15** — Auth end-to-end implémentée et testée (register/login/logout/me via curl, cf. section Backend). `useAuth`/`useApi` réécrits pour consommer le vrai backend ; `middleware/auth.ts` appelle `useAuth().init()` (revalidation `/api/auth/me` au premier chargement, une seule fois par session grâce à un flag `useState`) avant de vérifier le token. Register forcé à `role: 'player'` côté backend — aucun choix de rôle à l'inscription pour l'instant, une page `register.vue` reste à créer côté frontend.

## Problèmes connus / dettes techniques

- **Auth branchée, le reste non** : seuls `useAuth`/`useApi` (login/logout/me) parlent au vrai backend. Team management, strats, versioning restent sur `utils/mockData.ts` + `localStorage` — `TeamController`/`StratController` sont encore des stubs `501`.
- **Pas de page register côté frontend** : le endpoint `POST /api/auth/register` existe et fonctionne (testé via curl) mais rien dans l'UI ne l'appelle. De plus il force toujours `role: 'player'` — il n'y a aujourd'hui aucun moyen de créer un Coach autrement qu'en modifiant la base manuellement (ex. `php artisan tinker`).
- **`team.vue` toujours sur mock data** : l'identité du user courant y est comparée par `email` (les ids mock `'u-1'` ne matchent pas les ids numériques du backend) ; `AppHeader.vue` utilise `user.team?.name` et les initiales de `user.name`. `TeamMember.pseudo` reste le champ mock des membres, à remplacer quand `TeamController` sera implémenté.
- **Éditeur de strat non persistant** : `edit.vue` simule une sauvegarde (`setTimeout`) sans jamais écrire les changements où que ce soit (pas même dans `mockData.ts` en mémoire partagée) ; recharger la page perd les modifications.
- **Composant `TagBadge.vue` mort** : créé mais jamais importé/utilisé (les pages utilisent des `<span class="badge">` inline à la place).
- **Pas de Nuxt 4** : le plan initial visait Nuxt 4, le projet est sur Nuxt 3.13. À trancher : migrer ou mettre à jour la doc/plan.
- **Pas de `.env.example`** : `NUXT_PUBLIC_API_URL` n'est documentée nulle part pour un nouveau développeur.
- **Versioning cosmétique uniquement** : le champ `version` s'affiche mais rien ne l'incrémente ni ne conserve d'historique.
- **Bundle `.stratbaker`** limité à l'équipe ; pas de bundle pour les strats malgré le nom du fichier généré.
- **Gestion d'erreur réseau minimale** : `useApi` ne gère que le cas 401 (purge + redirect `/login`) ; pas de retry, pas de toast d'erreur générique, pas de gestion des 422 (erreurs de validation) au-delà de `err?.data?.message` affiché brut dans `login.vue`.

## Prochaines étapes

1. **Implémenter `TeamController`** (`show`, `update`, `invite`, `members`, `destroyMember`, `export`, `import`) — c'est le prochain bloc backend à sortir des stubs `501`, pour pouvoir remplacer `utils/mockData.ts` sur `/team`.
2. Câbler `/team` (frontend) sur les endpoints `GET/PUT /api/team`, `POST /api/team/invite`, `GET /api/team/members` une fois `TeamController` implémenté, en gardant `role` (coach uniquement) vérifié côté backend en plus du contrôle frontend actuel.
3. Implémenter `StratController` et rendre l'éditeur de strat persistant : appeler `PUT /api/strats/{strat}` (déjà routé côté backend) au lieu de la simulation `setTimeout`, et écrire dans `strat_versions` à chaque publication pour un vrai historique.
4. Ajouter une page `register.vue` côté frontend pour exposer `POST /api/auth/register` (actuellement testé uniquement via curl) — et décider si/comment un Coach peut être créé (le register force `role: 'player'`).
5. Décider Nuxt 3 (rester) vs migration Nuxt 4, et documenter la décision ici une fois tranchée.
6. Étendre le bundle `.stratbaker` aux strats elles-mêmes (pas seulement à l'équipe, cf. `/api/team/export`+`/api/team/import` déjà routés côté backend), et évaluer l'export PDF/PNG (feature actuellement absente).

## Pièges à éviter

- `useApi`/`useAuth` sont maintenant réellement branchés sur le backend — ne pas réintroduire de mock dedans. Pour tester un rôle autre que `player` (Coach/IGL), il faut changer `role` en base (ex. `php artisan tinker --execute 'User::where("email","...")->update(["role"=>"coach"]);'`), le register force toujours `player`.
- Ne pas dupliquer `TagBadge.vue` : le composant existe déjà mais n'est pas câblé ; vérifier avant de recréer un badge similaire.
- Ne pas supposer que l'objet `user` a les champs `pseudo`/`avatar`/`teamName` : c'était le mock. Le vrai `AuthUser` (`useAuth.ts`) a `id` (number), `name`, `email`, `role`, `team_id`, `team?`. Le header dérive les initiales de `name`.
- Node local = 22.10 : `nuxt dev` exige `NODE_OPTIONS=--experimental-require-module` et le lockfile (généré sur une autre plateforme) manque les bindings natifs darwin-arm64 (`@oxc-parser`, `@oxc-transform`, `@oxc-minify` à installer avec `npm i --no-save`). Mettre Node à jour (>=22.12) règle le premier point.
- `Auth::attempt()` fonctionne côté backend malgré l'absence du middleware `web`/session sur les routes API (vérifié empiriquement) — ne pas le remplacer par `Auth::once()` sans raison, ça a été testé et ça marche tel quel.
- Le design (couleurs, layout) est déjà conforme au plan (`#0f1117` / `#00ff88`) — ne pas re-proposer une refonte de palette sans raison.
- Pas de Pinia dans ce projet : utiliser `useState` (pattern déjà en place dans `useAuth`/`useOffline`) plutôt que d'introduire une nouvelle dépendance de state management.

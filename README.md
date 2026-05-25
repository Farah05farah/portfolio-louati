# Portfolio Dr. Louati Moataz
## Chirurgie Orale & Implantologie

---

## 🚀 Lancer le site

Double-cliquez sur `index.html` — aucune installation requise.
Admin : ouvrez `admin.html` dans le navigateur.

---

## 🗄️ Créer la table Supabase (1 fois seulement)

Allez dans votre dashboard Supabase :
https://supabase.com/dashboard/project/pthptzlydtoioiqguool

Cliquez sur **SQL Editor** → **New query** → Collez ce code et cliquez **Run** :

```sql
CREATE TABLE IF NOT EXISTS appointments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  phone       VARCHAR(30),
  email       VARCHAR(255),
  service     VARCHAR(150),
  appt_date   VARCHAR(20),
  appt_time   VARCHAR(10),
  message     TEXT,
  status      VARCHAR(20) DEFAULT 'pending',
  note_admin  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Permettre l'insertion publique (pour le formulaire)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public select" ON appointments
  FOR SELECT USING (true);

CREATE POLICY "Public update" ON appointments
  FOR UPDATE USING (true);

CREATE POLICY "Public delete" ON appointments
  FOR DELETE USING (true);
```

✅ C'est tout ! Le formulaire du site et l'admin fonctionnent immédiatement.

---

## 🔐 Connexion Admin

- URL : ouvrez `admin.html`
- Identifiant : `admin`
- Mot de passe : `louati2025`

Pour changer le mot de passe, modifiez dans `admin.html` :
```javascript
const ADMIN_PASS = 'louati2025'; // ← changez ici
```

---

## 📸 Comment ajouter vos photos

### Structure recommandée
```
portfolio_louati/
├── index.html
├── admin.html
├── style.css
├── script.js
└── images/
    ├── hero-bg.jpg          ← Photo de fond (1920×1080)
    ├── doctor.jpg           ← Portrait du docteur (600×800)
    ├── about-main.jpg       ← Photo about portrait (600×750)
    ├── clinic.jpg           ← Photo clinique (500×350)
    ├── cabinet.jpg          ← Photo accueil/cabinet (500×320)
    ├── service.jpg          ← Photo soin/équipement (400×300)
    └── gallery/
        ├── cas1-avant.jpg   ← Avant Cas 1
        ├── cas1-apres.jpg   ← Après Cas 1
        ├── cas2-avant.jpg
        ├── cas2-apres.jpg
        ├── cas3-avant.jpg
        ├── cas3-apres.jpg
        ├── cas4-avant.jpg
        └── cas4-apres.jpg
```

### Pour chaque photo

Dans `index.html`, trouvez le commentaire correspondant :
```html
<!-- ✅ <img src="images/doctor.jpg" alt="Dr. Louati Moataz"> -->
```

Supprimez les `<!--` et `-->` → la photo s'affiche automatiquement.

---

## ✏️ Personnaliser

### Numéro de téléphone
Dans `index.html` cherchez :
```html
<a href="tel:+21600000000">+216 XX XXX XXX</a>
```

### Couleurs
Dans `style.css` ligne 15 :
```css
--gold: #B8934A;   ← couleur or principale
--dark: #0C1A18;   ← fond sombre
```

### Ajouter des cas cliniques
Copiez un bloc `<div class="gallery-item">` dans `index.html`
et ajustez les photos + textes.

---

## 🌐 Mettre en ligne (gratuit, 5 minutes)

1. Allez sur **https://netlify.com**
2. Créez un compte gratuit
3. Glissez-déposez votre dossier `portfolio_louati/`
4. Votre site est en ligne ! ✅

---

## 📋 Fonctionnalités Admin

- ✅ Login sécurisé (mot de passe local)
- 📋 Tableau de toutes les demandes de RDV
- 🔍 Recherche par nom, email, service
- 🔽 Filtres par statut et service
- 👁️ Détail de chaque demande (tiroir latéral)
- 🔄 Changer le statut : En attente / Confirmé / Annulé
- 🗑️ Supprimer une demande
- 📊 Statistiques (services, mois, statuts)
- ⬇️ Export CSV

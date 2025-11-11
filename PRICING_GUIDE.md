# 🎯 Guide de Configuration des Prix - Empire Internet

## 🔥 Activer/Désactiver l'Offre de Lancement

### Comment ça marche ?

Tous les prix du site sont contrôlés par **un seul fichier** : 
```
lib/pricing-config.ts
```

### Structure des Prix

#### **Prix PUBLIC (toujours visible) :**
- 💰 Monthly : **1500€/mois** (prix de référence)
- 💰 Weekly : **450€/semaine** (plus cher car engagement court)
- 💰 Quarterly : **1350€/mois** (-10%, soit 4050€ total)
- 💰 Yearly : **1200€/mois** (-20%, soit 14400€ total)

---

### Pour Activer l'Offre de Lancement

Ouvrez `lib/pricing-config.ts` et modifiez cette ligne :

```typescript
export const LAUNCH_OFFER_ACTIVE = true  // ✅ OFFRE ACTIVE
```

**Ce qui s'affiche avec l'offre de lancement :**

```
📅 Weekly
   ~~450€~~ → 300€/semaine
   Badge: 🔥 LAUNCH OFFER
   Économie: 150€/semaine

📅 Monthly  
   ~~1500€~~ → 1000€/mois
   Badge: 🔥 LAUNCH OFFER
   Économie: 500€/mois

📅 Quarterly (70% CHOISISSENT)
   ~~1350€~~ → 900€/mois (2700€ total)
   Économie: 1800€ sur 3 mois

📅 Yearly (BEST VALUE)
   ~~1200€~~ → 800€/mois (9600€ total)
   Économie: 8400€ sur l'année
```

**Affichage visuel :**
- ✅ Prix normal barré (~~1500€~~)
- ✅ Nouveau prix en vert empire (1000€)
- ✅ Badge "🔥 LAUNCH OFFER" sur tous les plans
- ✅ Économies affichées

---

### Pour Désactiver l'Offre de Lancement

Ouvrez `lib/pricing-config.ts` et modifiez cette ligne :

```typescript
export const LAUNCH_OFFER_ACTIVE = false  // ❌ OFFRE DÉSACTIVÉE
```

**Ce qui s'affiche sans offre de lancement :**

```
📅 Weekly
   450€/semaine
   (Pas de réduction)

📅 Monthly  
   1500€/mois
   (Pas de réduction)

📅 Quarterly (70% CHOISISSENT)
   1350€/mois (4050€ total)
   Économie: 450€ vs mensuel

📅 Yearly (BEST VALUE)
   1200€/mois (14400€ total)
   Économie: 3600€ vs mensuel
```

**Affichage visuel :**
- ✅ Prix normaux sans barré
- ❌ Pas de badge "LAUNCH OFFER"
- ✅ Économies vs le prix mensuel (pour quarterly/yearly)

---

## 📊 Où les Prix Sont Affichés

Les prix sont automatiquement mis à jour sur :

1. ✅ **Page d'accueil** (`/`)
   - Section "Ready to become omnipresent?"
   
2. ✅ **Page Pricing** (`/pricing`)
   - Tableau de comparaison
   - Plans tarifaires (Weekly/Monthly/Quarterly/Yearly)
   
3. ✅ **Toutes les sections**
   - PricingSection
   - PricingPlansSection
   - PriceComparisonSection
   - OfferSection

4. ✅ **Traductions (FR + EN)**
   - Toutes les mentions de prix dans les textes

---

## ⚠️ Fichiers NON Modifiés

Le fichier suivant n'est **PAS** affecté par ce système :
- ❌ `upsell-coaching.html` (page coaching standalone - son propre système)

---

## 🎨 Personnalisation Avancée

Si vous voulez modifier les prix de base, éditez ces valeurs dans `lib/pricing-config.ts` :

```typescript
// Prix public normal (toujours 1500€/mois de base)
const NORMAL_MONTHLY = 1500
const NORMAL_WEEKLY = 450   // Plus cher car engagement court
const NORMAL_QUARTERLY = 1350  // -10%
const NORMAL_YEARLY = 1200     // -20%

// Prix offre de lancement (1000€/mois de base)
const LAUNCH_MONTHLY = 1000
const LAUNCH_WEEKLY = 300      // Proportionnel
const LAUNCH_QUARTERLY = 900   // -10%
const LAUNCH_YEARLY = 800      // -20%
```

---

## 📈 Logique des Réductions

### **Mode Normal (sans lancement) :**
- Base : 1500€/mois
- Quarterly : -10% = 1350€/mois
- Yearly : -20% = 1200€/mois
- Weekly : +50% = 450€/semaine (pénalité engagement court)

### **Mode Lancement :**
- Base : ~~1500€~~ → 1000€/mois (-33%)
- Quarterly : ~~1350€~~ → 900€/mois (-33%)
- Yearly : ~~1200€~~ → 800€/mois (-33%)
- Weekly : ~~450€~~ → 300€/semaine (-33%)

**Les réductions trimestriel/annuel sont maintenues proportionnellement !**

---

## ✅ Checklist de Vérification

Après avoir changé `LAUNCH_OFFER_ACTIVE`, vérifiez :

1. [ ] Les prix sont barrés en mode lancement
2. [ ] Les badges "🔥 LAUNCH OFFER" apparaissent
3. [ ] Les économies sont affichées correctement
4. [ ] Page d'accueil `/` affiche les bons prix
5. [ ] Page pricing `/pricing` affiche les bons plans
6. [ ] Version FR et EN sont cohérentes

---

## 🚀 Déploiement

Après modification :

```bash
# 1. Vérifiez que tout compile
npm run build

# 2. Testez localement
npm run dev

# 3. Déployez
git add .
git commit -m "Update pricing: launch offer [ON/OFF]"
git push
```

---

## 💰 Résumé Visuel

### **AVEC Offre de Lancement (ACTIVE = true) :**
```
┌─────────────────────────────────┐
│  🔥 LAUNCH OFFER               │
│                                 │
│  ~~1500€~~ → 1000€/mois        │
│  Économisez 500€               │
└─────────────────────────────────┘
```

### **SANS Offre de Lancement (ACTIVE = false) :**
```
┌─────────────────────────────────┐
│  1500€/mois                    │
│                                 │
└─────────────────────────────────┘
```

---

## 🎁 Astuce Pro

Pour une expiration automatique de l'offre à une date donnée :

```typescript
const LAUNCH_OFFER_END_DATE = new Date('2025-12-31')
export const LAUNCH_OFFER_ACTIVE = new Date() < LAUNCH_OFFER_END_DATE
```

L'offre se désactivera automatiquement le 31 décembre 2025 !

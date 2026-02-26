# Regulatory Division Form

A form submission system for the Regulatory Division with separate user and admin portals.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js (Express for production serve)
- **Database:** Firebase (Firestore + Auth)
- **Font:** Poppins
- **Icons:** [Iconify](https://icon-sets.iconify.design/) (Material Design Icons - mdi)
- **Theme:** NASA-inspired color palette

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | User form - fill and submit |
| `/admin` | Redirects to login | Admin portal entry |
| `/admin/login` | Public | Admin login |
| `/admin/register` | Public | Admin registration |
| `/admin/dashboard` | Admin only | View all submitted forms |

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Firebase config is in `src/firebase.js`
   - Enable **Email/Password** sign-in in Firebase Console → Authentication → Sign-in method
   - Deploy Firestore rules:
     ```bash
     firebase deploy --only firestore:rules
     ```
   - Or copy `firestore.rules` contents to Firebase Console → Firestore → Rules

3. **Run development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run server
   ```

## Form Fields

- Office Address
- First Name, Last Name
- Middle Initial, Name Extension
- Designation (MAYOR, MAD, PA, BRO, MVO, PVO, GOVERNOR)
- Contact #
- Email Address
- Province, Municipality

## Firestore Rules

Update your Firestore rules in Firebase Console with the contents of `firestore.rules`. Current rules allow:
- **forms** collection: Anyone can create; only authenticated users can read
- **admins** collection: Authenticated users can read/write their own document

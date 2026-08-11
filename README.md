# MyVault 🛡️

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg?style=flat-square)

> **Your digital life, secured.**
> A modern, zero-knowledge password manager built for the desktop with a focus on privacy, security, and high-end aesthetics.

---

##  Features

* ** Zero-Knowledge Architecture:** We don't know your master password. Your data is encrypted locally on your device using military-grade standards before it ever hits the disk.
* ** Midnight Luxury UI:** A fully custom, frameless interface designed with a focus on deep aesthetics, micro-interactions, and visual hierarchy.
* ** Smart Grouping:** Automatically organizes multiple accounts under a single service card (e.g., multiple Gmails in one "Google" card).
* ** AES-256-GCM Encryption:** Every password is encrypted with a unique Initialization Vector (IV) and Authentication Tag to prevent tampering.
* ** Local SQLite Database:** High-performance local storage. No cloud dependencies. You own your data.
* ** Secure Authentication:** Argon2/PBKDF2 hashing for master password verification.

---

##  Tech Stack

Built with a modern, type-safe stack for maximum performance and security:

* **Core:** [Electron](https://www.electronjs.org/) (v28+)
* **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v3) + Custom Scrollbars
* **Database:** [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (WAL Mode enabled)
* **Cryptography:** Node.js native `crypto` module (No third-party crypto dependencies)
* **Icons:** [Lucide React](https://lucide.dev/)

---

##  Security Architecture

MyVault uses a **Master Password** architecture to secure your secrets.

1.  **Key Derivation:** When you log in, your master password is run through **PBKDF2** (100,000 iterations) with a unique random **Salt** to derive a 256-bit cryptographic key.
2.  **Memory-Only Key:** This derived key exists **only in RAM**. It is never written to the disk. When the app closes, the key vanishes.
3.  **Encryption:** When you save an entry:
    * A random 12-byte **IV** (Initialization Vector) is generated.
    * The password is encrypted using **AES-256-GCM**.
    * An **Auth Tag** is generated to ensure integrity.
4.  **Storage:** The database stores only the `encrypted_payload`, `iv`, and `auth_tag`. Without the master password, this data is mathematically impossible to read.

---

##  Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/tu-usuario/myvault-desktop.git](https://github.com/tu-usuario/myvault-desktop.git)
    cd myvault-desktop
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

    *Note: If you are on Windows and encounter errors with SQLite, you may need to install build tools or run:*
    ```bash
    npm install -D @electron/rebuild
    npx electron-rebuild
    ```

3.  Start Development Mode:
    ```bash
    npm run dev
    ```

### Building for Production

To create an executable (`.exe`, `.dmg`, `.AppImage`) for your operating system:

```bash
npm run build:win  # For Windows
# or
npm run build:mac  # For macOS
# or
npm run build:linux # For Linux


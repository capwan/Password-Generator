# Password-Generator (`v3.0.0`)

![Version](https://img.shields.io/badge/version-3.1.0-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Hosted](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-9cf)
![Security](https://img.shields.io/badge/security-Crypto--Secure-brightgreen)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)



## ✨ Features :

### 🔐 Security & Privacy
- **🔒 Cryptographically Secure:** Uses the Web Crypto API (`crypto.getRandomValues()`) instead of standard `Math.random()`, ensuring passwords cannot be predicted.
- **🎯 No Modulo Bias:** The random number generator uses rejection sampling to guarantee a mathematically uniform distribution of characters.
- **🛡️ Zero-Knowledge Architecture:** 100% client-side execution. No data is ever sent to any server. No analytics, no tracking, no cookies.
- **🔄 Uniqueness Guarantee:** Automatically checks against the last 10 generated passwords and regenerates if a duplicate is detected, ensuring practical uniqueness for daily use.

### 🧠 Smart Logic
- **🎚️ Dynamic Slider Limits:** The maximum password length automatically adjusts when "Exclude duplicates" is enabled, preventing logical errors and browser freezes.
- **🛡️ Intelligent Slider Protection:** Advanced failsafe mechanism prevents the slider from breaking when the character pool is smaller than the minimum length. The slider temporarily adapts and instantly recovers when more options are added.
- **⚡ Auto-Generation:** Password automatically regenerates when toggling checkboxes, not just when clicking the "Generate" button.
- **💾 Persistent Preferences:** Automatically remembers your favorite settings (length, character types) using `localStorage`. Set it once, and it's ready for your next session.

### 🎨 UI/UX
- **📱 Fully Responsive:** Clean, modern UI that adapts perfectly to desktop, tablet, and mobile screens.
- **♿ Accessible (a11y):** Full keyboard navigation support, ARIA labels, and screen-reader friendly outputs.
- **🎯 Visual Feedback:** Clear placeholder messages and disabled states when no character types are selected.
- **🌈 Strength Indicator:** Visual bar showing password strength with color-coded ranges (Red ≤8, Yellow 9-15, Blue ≥16).

### ⚡ Technical Excellence
- **Zero Dependencies:** Pure Vanilla JS. No React, no Vue, no jQuery. Just clean, fast, and maintainable code.
- **Edge Case Protection:** Comprehensive handling of all edge cases (empty pools, duplicate exclusion limits, slider conflicts).
- **International Code Standards:** All code comments and documentation in English for global accessibility.

## 🛡️ Security Architecture

As a system administration and security-focused tool, this generator is built with a **Zero-Knowledge** architecture:

1. **100% Client-Side:** All password generation happens locally in your browser using the Web Crypto API.
2. **No Network Requests:** Zero data is sent to any server. No analytics, no tracking, no cookies.
3. **No Modulo Bias:** The random number generator uses rejection sampling to guarantee a mathematically uniform distribution of characters.
4. **History Protection:** The last 10 passwords are stored locally in `localStorage` and checked against new generations to prevent accidental duplicates.
5. **No Persistent Storage of Passwords:** Only the settings and a hash of recent passwords are stored. Actual passwords are never logged or transmitted.

## 🛠️ Tech Stack

- **HTML5** (Semantic markup, ARIA attributes, accessibility)
- **CSS3** (Flexbox, CSS Variables, Transitions, responsive design)
- **JavaScript (ES6+)** (Web Crypto API, LocalStorage, DOM Manipulation, modular functions)

## 🚀 Usage

### Online
Simply visit the [Live Demo](https://capwan.github.io/password-generator/) and start generating secure passwords instantly.

### Local Installation
If you want to host it yourself or run it locally:

1. Clone the repository:
  ```bash
   git clone https://github.com/capwan/password-generator.git
  ```
2. Navigate to the project folder:
  ```bash
  cd password-generator
  ```
3. Open `index.html` in any web browser.

----------------------------------------

**Report issues:** [Github Issues](https://github.com/capwan/password-generator/issues)

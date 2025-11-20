# Alex Perry – Personal Website (alexperry.blog)

This repository contains the source code for alexperry.blog, a custom personal website and portfolio.  
The site is hosted through GitHub Pages and mapped to a dedicated domain. It represents my academic background, technical projects, and ongoing work as a Computer Science student at East Carolina University.

---

## Live Website

https://alexperry.blog

The domain connects directly to the GitHub Pages repository `alexbperry.github.io`.

---

## Overview of the Site

The website is composed of four primary pages:

index.html  
Homepage introducing my background, current focus areas, and an interactive mini-game.

projects.html  
A structured section highlighting coursework, programming projects, and independent builds.

about.html  
Detailed background information, academic path, interests, and goals.

contact.html  
Contact methods and linked professional profiles.

The website maintains a consistent header, navigation bar, and footer across all pages.

---

## Leaderboard Backend (MockAPI)

The built-in mini-game includes a leaderboard supported by a REST API backend using MockAPI.

The site communicates with the API through the following operations:

- GET /scores — retrieves all leaderboard entries  
- POST /scores — submits a new score  

Scores are stored remotely in JSON format, enabling persistent results even though the frontend is static. All backend communication is handled in `game.js`.

MockAPI was selected for its ease of integration and full CORS compatibility with GitHub Pages.

---

## Features

- Custom-designed static website  
- Custom domain (alexperry.blog) integrated with GitHub Pages  
- Shared footer dynamically loaded through `footer.js`  
- Interactive mini-game with a persistent, API-backed leaderboard  
- Font Awesome icons for social links  
- Google Fonts typography  
- Organized file structure prepared for future expansion

---

## Technology Stack

- HTML5  
- CSS3 (style.css)  
- JavaScript (game.js, footer.js)  
- Font Awesome 6  
- Google Fonts  
- GitHub Pages  
- MockAPI (leaderboard backend)

---

## File Structure

alexperry.blog (repo: alexbperry.github.io)  
├── index.html  
├── projects.html  
├── about.html  
├── contact.html  
├── style.css  
├── game.js  
├── footer.js  
├── navbar.js  
├── favicon.png  
└── README.md  

---

## Running the Site Locally

Clone the repository:

git clone https://github.com/alexbperry/alexbperry.github.io.git

Open `index.html` in any browser, or use the Live Server extension in VS Code.

---

## Future Development

- Expanding the Projects section with additional software and analytics work  
- Enhancing responsive behavior for mobile devices  
- Adding new interactive or game-related features  
- Incorporating data visualization content and technical write-ups  


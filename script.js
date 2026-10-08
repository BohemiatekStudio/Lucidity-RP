// Přepínání stránek a správa podsvícení aktivního tlačítka v menu
function showSection(sectionId, element) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.style.animation = 'none'; // Reset animace
  });
  
  const targetSection = document.getElementById(sectionId);
  targetSection.style.animation = ''; // Obnovení animace
  targetSection.classList.add('active');

  const navButtons = document.querySelectorAll('nav > a, .dropbtn');
  navButtons.forEach(btn => btn.classList.remove('active'));

  if (element) {
    element.classList.add('active');
  }

  document.getElementById('rules-dropdown').classList.remove('show');
}

// Přepnutí na podsekci pravidel a rozsvícení hlavního tlačítka "Pravidla"
function showRuleSection(sectionId, event) {
  event.stopPropagation();
  
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.style.animation = 'none';
  });
  
  const targetSection = document.getElementById(sectionId);
  targetSection.style.animation = '';
  targetSection.classList.add('active');

  const navButtons = document.querySelectorAll('nav > a, .dropbtn');
  navButtons.forEach(btn => btn.classList.remove('active'));

  const rulesBtn = document.querySelector('.dropbtn');
  if (rulesBtn) {
    rulesBtn.classList.add('active');
  }

  document.getElementById('rules-dropdown').classList.remove('show');
}

// Otevírání/zavírání dropdown menu
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('rules-dropdown');
  dropdown.classList.toggle('show');
}

// Zavření dropdownu při kliknutí mimo
window.addEventListener('click', () => {
  const dropdown = document.getElementById('rules-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
});

// Načtení novinek ze souboru news.js do okna na webu
function loadNews() {
  const newsContainer = document.getElementById('news-container');
  if (!newsContainer || typeof serverNews === 'undefined') return;

  newsContainer.innerHTML = '';

  serverNews.forEach(item => {
    const newsItem = document.createElement('div');
    newsItem.style.marginBottom = '15px';
    newsItem.style.borderBottom = '1px solid #2a2f4c';
    newsItem.style.paddingBottom = '12px';

    newsItem.innerHTML = `
      <span style="font-size: 0.75rem; color: var(--retro-blue);">${item.date}</span>
      <h3 style="font-size: 1rem; color: #fff; margin: 3px 0;">${item.title}</h3>
      <p style="font-size: 0.85rem; color: #aaa; line-height: 1.4;">${item.text}</p>
    `;
    newsContainer.appendChild(newsItem);
  });
}

// Načítání stavu serveru z Cfx.re API
async function loadServerStatus() {
  const serverBox = document.getElementById('server-box');
  if (!serverBox) return;
  
  const cfxCode = serverBox.getAttribute('data-cfx');
  if (!cfxCode || cfxCode === 'SEM_VLOZ_CFX_KOD') {
    document.getElementById('server-state').innerText = 'Chybí CFX kód serveru';
    return;
  }

  try {
    const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${cfxCode}`);
    if (!response.ok) throw new Error('Server nedostupný');
    
    const data = await response.json();
    const serverData = data.Data;

    if (serverData) {
      document.getElementById('server-state').innerHTML = 'Stav: <span style="color: #4ade80;">Online</span>';
      document.getElementById('server-players').innerText = `Hráči: ${serverData.clients} / ${serverData.sv_maxclients}`;
      document.getElementById('quick-connect').href = `fivem://connect/cfx.re/join/${cfxCode}`;
    }
  } catch (error) {
    document.getElementById('server-state').innerHTML = 'Stav: <span style="color: #f87171;">Offline / Údržba</span>';
    document.getElementById('server-players').innerText = 'Hráči: -- / --';
  }
}

// Kopírovating IP do schránky
function copyCfxIp() {
  const serverBox = document.getElementById('server-box');
  const cfxCode = serverBox.getAttribute('data-cfx');
  
  navigator.clipboard.writeText(`cfx.re/join/${cfxCode}`).then(() => {
    alert('IP / kód serveru zkopírován do schránky!');
  });
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
  loadServerStatus();
  loadNews();
  setInterval(loadServerStatus, 60000);
});
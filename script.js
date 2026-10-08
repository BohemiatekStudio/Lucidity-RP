// Přepínání stránek
function showSection(sectionId, element) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.remove('active'));
  
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => btn.classList.remove('active'));

  if (element && element.classList.contains('nav-btn')) {
    element.classList.add('active');
  }

  // Zavřít dropdown, pokud je otevřený
  const dropdown = document.getElementById('rules-dropdown');
  if (dropdown) dropdown.classList.remove('show');
}

// Přepínání podsekcí pravidel z dropdownu
function showRuleSection(sectionId, event) {
  event.preventDefault();
  showSection(sectionId);
}

// Ovládání rozevíracího menu
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('rules-dropdown');
  if (dropdown) dropdown.classList.toggle('show');
}

// Zavření dropdownu při kliknutí kamkoliv jinam
window.addEventListener('click', () => {
  const dropdown = document.getElementById('rules-dropdown');
  if (dropdown) dropdown.classList.remove('show');
});

// Načítání stavu serveru z Cfx.re API
async function loadServerStatus() {
  const serverBox = document.getElementById('server-box');
  if (!serverBox) return;
  
  const cfxCode = serverBox.getAttribute('data-cfx');
  if (!cfxCode || cfxCode === 'SEM_VLOZ_CFX_KOD') {
    const stateEl = document.getElementById('server-state');
    if (stateEl) stateEl.innerText = 'Chybí CFX kód serveru';
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

// Kopírování připojovacího kódu
function copyCfxIp() {
  const serverBox = document.getElementById('server-box');
  if (!serverBox) return;
  const cfxCode = serverBox.getAttribute('data-cfx');
  
  navigator.clipboard.writeText(`cfx.re/join/${cfxCode}`).then(() => {
    alert('IP / kód serveru zkopírován do schránky!');
  });
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
  loadServerStatus();
  setInterval(loadServerStatus, 60000);
});
// Načítání pravidel z JSON souborů
async function loadRules(filename, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(filename);
    if (!response.ok) throw new Error('Chyba při načítání pravidel');
    
    const data = await response.json();
    
    let htmlContent = `<h2>${data.title}</h2>`;
    
    data.sections.forEach(section => {
      htmlContent += `<h3 style="color: var(--retro-blue); font-size: 1.05rem; margin-top: 15px; margin-bottom: 5px;">${section.category}</h3>`;
      
      if (section.text) {
        htmlContent += `<p style="margin-bottom: 15px;">${section.text}</p>`;
      } else if (section.items) {
        htmlContent += `<ul style="color: #aaa; padding-left: 20px; font-size: 0.95rem; margin-bottom: 15px;">`;
        section.items.forEach(item => {
          htmlContent += `<li>${item}</li>`;
        });
        htmlContent += `</ul>`;
      }
    });

    container.innerHTML = `<div class="box">${htmlContent}</div>`;
  } catch (error) {
    container.innerHTML = `<div class="box"><h2>Chyba</h2><p>Nepodařilo se načíst pravidla.</p></div>`;
  }
}

// Spuštění načítání pravidel při startu
document.addEventListener('DOMContentLoaded', () => {
  loadRules('community.json', 'rules-community');
  loadRules('rp.json', 'rules-rp');
  loadRules('illegal.json', 'rules-illegal');
});
// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  ADMIN_SETTINGS,
  AVAILABLE_SOCKETS,
  AVAILABLE_RAM_TYPES,
  CATEGORIES,
  INITIAL_COMPONENTS,
  INITIAL_PREBUILTS
} from './initialData';
import './App.css';

// =========================================================
// CZYTELNY SCHEMAT 2D KOMPUTERA (SVG)
// =========================================================
function CleanPcSchematic({ selectedObjects, activeCat, onSelectCat }) {
  const isAio = selectedObjects.cooler?.coolerType !== 'air';
  const moboSocket = selectedObjects.mobo?.socket || 'AM5';
  const ramType = selectedObjects.mobo?.ramType || 'DDR5';
  const psuWatts = selectedObjects.psu?.watts || 650;
  const gpuFans = selectedObjects.gpu?.fans || 2;

  const isSel = (key) => activeCat === key;

  return (
    <div className="schematic-box">
      <svg
        viewBox="0 0 680 560"
        className="clean-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="subtleGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#161f30" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Tło schematu */}
        <rect width="680" height="560" rx="12" fill="#0b101b" />
        <rect width="680" height="560" rx="12" fill="url(#subtleGrid)" />

        {/* Nagłówek techniczny wewnątrz schematu */}
        <text x="24" y="30" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="600">
          SCHEMAT ARCHITEKTURY PC • PLATFORMA: {moboSocket} ({ramType})
        </text>

        {/* 1. OBUDOWA PC */}
        <g
          className={isSel('case') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('case')}
        >
          <rect
            x="90"
            y="48"
            width="500"
            height="472"
            rx="12"
            fill="#0f172a"
            stroke={isSel('case') ? '#3b82f6' : '#334155'}
            strokeWidth={isSel('case') ? '2.5' : '1.5'}
          />
          {/* Nóżki obudowy */}
          <rect x="130" y="520" width="54" height="12" rx="3" fill="#1e293b" />
          <rect x="496" y="520" width="54" height="12" rx="3" fill="#1e293b" />

          {/* Komora główna */}
          <rect x="108" y="64" width="464" height="346" rx="8" fill="#090e1a" stroke="#1e293b" />

          {/* Wentylatory boczne/frontowe */}
          {[175, 255, 335].map((cy, i) => (
            <g key={i} transform={'translate(524, ' + cy + ')'}>
              <rect x="-32" y="-32" width="64" height="64" rx="8" fill="#111827" stroke="#26334d" />
              <circle r="24" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="5 3" />
              <circle r="7" fill="#1e293b" />
            </g>
          ))}

          <text x="558" y="84" textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
            CASE: ATX
          </text>
        </g>

        {/* 2. CHŁODZENIE PROCESORA (Górna chłodnica AIO lub Wieża) */}
        <g
          className={isSel('cooler') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('cooler')}
        >
          {isAio ? (
            <g>
              <rect
                x="150"
                y="74"
                width="320"
                height="46"
                rx="6"
                fill="#152036"
                stroke={isSel('cooler') ? '#3b82f6' : '#475569'}
                strokeWidth={isSel('cooler') ? '2.5' : '1.5'}
              />
              {[205, 310, 415].map((cx, i) => (
                <rect key={i} x={cx - 44} y="82" width="88" height="30" rx="4" fill="#0f172a" stroke="#334155" />
              ))}
              <text x="310" y="101" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">
                CHŁODZENIE WODNE AIO 360MM
              </text>
              {/* Węże AIO do procesora */}
              <path
                d="M 295 205 C 345 195, 385 160, 405 120"
                fill="none"
                stroke="#334155"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 295 218 C 355 210, 400 170, 422 120"
                fill="none"
                stroke="#475569"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              <rect
                x="150"
                y="76"
                width="220"
                height="38"
                rx="6"
                fill="#152036"
                stroke={isSel('cooler') ? '#3b82f6' : '#475569'}
                strokeWidth={isSel('cooler') ? '2.5' : '1.5'}
              />
              <text x="260" y="99" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">
                CHŁODZENIE POWIETRZNE CPU
              </text>
            </g>
          )}
        </g>

        {/* 3. PŁYTA GŁÓWNA (MOBO) */}
        <g
          className={isSel('mobo') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('mobo')}
        >
          <rect
            x="150"
            y="138"
            width="255"
            height="256"
            rx="8"
            fill="#131c2e"
            stroke={isSel('mobo') ? '#3b82f6' : '#475569'}
            strokeWidth={isSel('mobo') ? '2.5' : '1.5'}
          />
          {/* Radiatory VRM */}
          <rect x="162" y="152" width="32" height="92" rx="4" fill="#1e293b" stroke="#475569" />
          <rect x="202" y="148" width="96" height="22" rx="4" fill="#1e293b" stroke="#475569" />

          {/* Chipset na dole płyty */}
          <rect x="315" y="330" width="74" height="50" rx="5" fill="#1e293b" stroke="#475569" />
          <text x="352" y="353" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="700" fontFamily="monospace">
            {moboSocket}
          </text>
          <text x="352" y="368" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            {ramType}
          </text>
        </g>

        {/* 4. PROCESOR (CPU) */}
        <g
          className={isSel('cpu') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('cpu')}
        >
          <rect
            x="212"
            y="180"
            width="78"
            height="74"
            rx="6"
            fill="#172554"
            stroke={isSel('cpu') ? '#60a5fa' : '#3b82f6'}
            strokeWidth={isSel('cpu') ? '2.5' : '1.5'}
          />
          <rect x="222" y="190" width="58" height="54" rx="4" fill="#1e293b" stroke="#64748b" />
          <text x="251" y="214" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
            CPU
          </text>
          <text x="251" y="230" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="700">
            {moboSocket}
          </text>
        </g>

        {/* 5. PAMIĘĆ RAM */}
        <g
          className={isSel('ram') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('ram')}
        >
          <rect
            x="312"
            y="174"
            width="72"
            height="84"
            rx="6"
            fill="#0f172a"
            stroke={isSel('ram') ? '#3b82f6' : '#475569'}
            strokeWidth={isSel('ram') ? '2.5' : '1.5'}
          />
          {[0, 1, 2, 3].map((slot) => (
            <rect
              key={slot}
              x={322 + slot * 13}
              y="184"
              width="7"
              height="48"
              rx="2"
              fill={slot === 1 || slot === 3 ? '#3b82f6' : '#1e293b'}
            />
          ))}
          <text x="348" y="248" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace" fontWeight="700">
            RAM {ramType}
          </text>
        </g>

        {/* 6. DYSK SSD M.2 NVMe */}
        <g
          className={isSel('ssd') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('ssd')}
        >
          <rect
            x="202"
            y="268"
            width="132"
            height="28"
            rx="5"
            fill="#1e293b"
            stroke={isSel('ssd') ? '#3b82f6' : '#64748b'}
            strokeWidth={isSel('ssd') ? '2.5' : '1.5'}
          />
          <circle cx="322" cy="282" r="3.5" fill="#10b981" />
          <text x="262" y="286" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="600">
            SSD M.2 NVMe
          </text>
        </g>

        {/* 7. KARTA GRAFICZNA (GPU) */}
        <g
          className={isSel('gpu') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('gpu')}
        >
          <rect
            x="138"
            y="310"
            width={gpuFans === 3 ? '325' : '275'}
            height="64"
            rx="8"
            fill="#172033"
            stroke={isSel('gpu') ? '#3b82f6' : '#64748b'}
            strokeWidth={isSel('gpu') ? '2.5' : '1.5'}
          />
          <rect
            x="144"
            y="310"
            width={gpuFans === 3 ? '313' : '263'}
            height="6"
            rx="2"
            fill="#3b82f6"
          />
          {Array.from({ length: gpuFans }).map((_, idx) => (
            <g key={idx}>
              <circle cx={190 + idx * 85} cy="346" r="19" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <circle cx={190 + idx * 85} cy="346" r="6" fill="#1e293b" />
            </g>
          ))}
          <text
            x={gpuFans === 3 ? '448' : '398'}
            y="328"
            textAnchor="end"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
          >
            GPU PCIe x16
          </text>
        </g>

        {/* 8. ZASILACZ (PSU) */}
        <g
          className={isSel('psu') ? 'svg-node selected' : 'svg-node'}
          onClick={() => onSelectCat('psu')}
        >
          <rect
            x="108"
            y="420"
            width="464"
            height="84"
            rx="8"
            fill="#0b111e"
            stroke="#1e293b"
          />
          <rect
            x="124"
            y="430"
            width="240"
            height="64"
            rx="6"
            fill="#151f32"
            stroke={isSel('psu') ? '#3b82f6' : '#475569'}
            strokeWidth={isSel('psu') ? '2.5' : '1.5'}
          />
          <rect x="138" y="440" width="86" height="44" rx="4" fill="#0b101b" stroke="#334155" />
          <text x="181" y="463" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="700" fontFamily="monospace">
            {psuWatts}W
          </text>
          <text x="181" y="476" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
            ZASILACZ ATX
          </text>
          {/* Linie grilla PSU */}
          <line x1="242" y1="446" x2="342" y2="446" stroke="#334155" strokeWidth="2.5" />
          <line x1="242" y1="458" x2="342" y2="458" stroke="#334155" strokeWidth="2.5" />
          <line x1="242" y1="470" x2="342" y2="470" stroke="#334155" strokeWidth="2.5" />
          <line x1="242" y1="482" x2="342" y2="482" stroke="#334155" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

// =========================================================
// GŁÓWNY KOMPONENT APLIKACJI
// =========================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('configurator'); // 'configurator' | 'prebuilts' | 'admin'
  const [activeCat, setActiveCat] = useState('mobo');

  // Ukryty dostęp do Panelu Admina
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState(false);
  const logoClicks = useRef({ count: 0, timer: null });

  // Baza komponentów i gotowych zestawów
  const [componentsDB, setComponentsDB] = useState(() => {
    const saved = localStorage.getItem('coreforge_clean_components_v3');
    return saved ? JSON.parse(saved) : INITIAL_COMPONENTS;
  });

  const [prebuiltsDB, setPrebuiltsDB] = useState(() => {
    const saved = localStorage.getItem('coreforge_clean_prebuilts_v3');
    return saved ? JSON.parse(saved) : INITIAL_PREBUILTS;
  });

  const [socketsList, setSocketsList] = useState(() => {
    const saved = localStorage.getItem('coreforge_clean_sockets_v3');
    return saved ? JSON.parse(saved) : AVAILABLE_SOCKETS;
  });

  const [discordWebhook, setDiscordWebhook] = useState(() => {
    return localStorage.getItem('coreforge_clean_webhook') || ADMIN_SETTINGS.discordWebhook;
  });

  // Aktualny wybór użytkownika
  const [selection, setSelection] = useState({
    mobo: 'mobo-am5-1',
    cpu: 'cpu-am5-1',
    cooler: 'cool-1',
    gpu: 'gpu-1',
    ram: 'ram-d5-1',
    ssd: 'ssd-1',
    case: 'case-1',
    psu: 'psu-1',
    service: 'srv-0'
  });

  // Stany modala zamówienia
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  // Stany formularza w Panelu Admina (z modułem zależności)
  const [adminCat, setAdminCat] = useState('cpu');
  const [adminName, setAdminName] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminSpec, setAdminSpec] = useState('');
  const [adminSocket, setAdminSocket] = useState('AM5');
  const [adminRamType, setAdminRamType] = useState('DDR5');
  const [adminWatts, setAdminWatts] = useState('650');
  const [adminCoolerType, setAdminCoolerType] = useState('aio');
  const [newSocketInput, setNewSocketInput] = useState('');

  const [presetName, setPresetName] = useState('');
  const [presetBadge, setPresetBadge] = useState('POLECANY ZESTAW');
  const [presetDesc, setPresetDesc] = useState('');

  // Zapis do localStorage
  useEffect(() => {
    localStorage.setItem('coreforge_clean_components_v3', JSON.stringify(componentsDB));
  }, [componentsDB]);

  useEffect(() => {
    localStorage.setItem('coreforge_clean_prebuilts_v3', JSON.stringify(prebuiltsDB));
  }, [prebuiltsDB]);

  useEffect(() => {
    localStorage.setItem('coreforge_clean_sockets_v3', JSON.stringify(socketsList));
  }, [socketsList]);

  useEffect(() => {
    localStorage.setItem('coreforge_clean_webhook', discordWebhook);
  }, [discordWebhook]);

  // Skrót klawiszowy dla właściciela: Ctrl + Shift + A
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminUnlocked) setActiveTab('admin');
        else setShowAdminModal(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAdminUnlocked]);

  const handleLogoSecretClick = () => {
    logoClicks.current.count += 1;
    clearTimeout(logoClicks.current.timer);
    if (logoClicks.current.count >= 3) {
      logoClicks.current.count = 0;
      if (isAdminUnlocked) setActiveTab('admin');
      else setShowAdminModal(true);
    } else {
      logoClicks.current.timer = setTimeout(() => {
        logoClicks.current.count = 0;
      }, 600);
    }
  };

  // =========================================================
  // SILNIK ZALEŻNOŚCI SPRZĘTOWYCH (Płyta ⇄ CPU ⇄ RAM ⇄ PSU)
  // =========================================================
  const currentMobo =
    (componentsDB.mobo || []).find((m) => m.id === selection.mobo) ||
    (componentsDB.mobo || [])[0];

  const activeSocket = currentMobo?.socket || 'AM5';
  const activeRamType = currentMobo?.ramType || 'DDR5';

  const currentGpu =
    (componentsDB.gpu || []).find((g) => g.id === selection.gpu) ||
    (componentsDB.gpu || [])[0];

  const requiredPsuWatts = currentGpu?.minPsu || 500;

  // Funkcja zwracająca tylko kompatybilne części dla danej kategorii
  const getCompatibleOptions = (catKey) => {
    const allItems = componentsDB[catKey] || [];
    if (catKey === 'cpu') {
      const filtered = allItems.filter((item) => !item.socket || item.socket === activeSocket);
      return filtered.length > 0 ? filtered : allItems;
    }
    if (catKey === 'ram') {
      const filtered = allItems.filter((item) => !item.ramType || item.ramType === activeRamType);
      return filtered.length > 0 ? filtered : allItems;
    }
    if (catKey === 'psu') {
      const filtered = allItems.filter((item) => !item.watts || item.watts >= requiredPsuWatts);
      return filtered.length > 0 ? filtered : allItems;
    }
    return allItems;
  };

  // Automatyczna korekta wybranych części po zmianie płyty głównej lub GPU
  useEffect(() => {
    setSelection((prev) => {
      const next = { ...prev };
      let changed = false;

      const validCpus = getCompatibleOptions('cpu');
      if (!validCpus.some((c) => c.id === prev.cpu) && validCpus[0]) {
        next.cpu = validCpus[0].id;
        changed = true;
      }

      const validRams = getCompatibleOptions('ram');
      if (!validRams.some((r) => r.id === prev.ram) && validRams[0]) {
        next.ram = validRams[0].id;
        changed = true;
      }

      const validPsus = getCompatibleOptions('psu');
      if (!validPsus.some((p) => p.id === prev.psu) && validPsus[0]) {
        next.psu = validPsus[0].id;
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [selection.mobo, selection.gpu, componentsDB]);

  // Szybkie przełączenie całej platformy (np. AM5 -> AM4 -> LGA1700)
  const handleSwitchPlatform = (targetSocket) => {
    const matchingMobo = (componentsDB.mobo || []).find((m) => m.socket === targetSocket);
    if (matchingMobo) {
      setSelection((prev) => ({
        ...prev,
        mobo: matchingMobo.id
      }));
    }
  };

  // Wyliczenie wybranych obiektów, sumy i mocy
  const selectedObjects = {};
  let totalPrice = 0;
  let totalTdp = 90;

  CATEGORIES.forEach((cat) => {
    const compatList = getCompatibleOptions(cat.key);
    const found =
      compatList.find((item) => item.id === selection[cat.key]) ||
      compatList[0] ||
      (componentsDB[cat.key] || [])[0];
    selectedObjects[cat.key] = found;
    if (found) {
      totalPrice += Number(found.price || 0);
      if (found.tdp) totalTdp += Number(found.tdp);
    }
  });

  const calcPresetPrice = (partsMap) => {
    let sum = 0;
    Object.keys(partsMap).forEach((k) => {
      const found = (componentsDB[k] || []).find((p) => p.id === partsMap[k]);
      if (found) sum += Number(found.price || 0);
    });
    return sum;
  };

  // =========================================================
  // AKCJE PANELU ADMINA (Dodawanie i edycja zależności)
  // =========================================================
  const handleAdminAddPart = (e) => {
    e.preventDefault();
    if (!adminName || !adminPrice) return;

    const newPart = {
      id: adminCat + '-' + Date.now(),
      name: adminName,
      price: parseFloat(adminPrice) || 0,
      spec: adminSpec || 'Komponent przetestowany i kompatybilny'
    };

    if (adminCat === 'mobo') {
      newPart.socket = adminSocket;
      newPart.ramType = adminRamType;
      if (!adminSpec) {
        newPart.spec = 'Socket ' + adminSocket + ' • Obsługa ' + adminRamType;
      }
    } else if (adminCat === 'cpu') {
      newPart.socket = adminSocket;
      newPart.tdp = 105;
      if (!adminSpec) {
        newPart.spec = 'Socket ' + adminSocket + ' • Procesor kompatybilny z płytami ' + adminSocket;
      }
    } else if (adminCat === 'ram') {
      newPart.ramType = adminRamType;
      newPart.sticks = 2;
      if (!adminSpec) {
        newPart.spec = 'Standard ' + adminRamType + ' • Pamięć operacyjna';
      }
    } else if (adminCat === 'gpu') {
      newPart.minPsu = parseInt(adminWatts, 10) || 600;
      newPart.tdp = 200;
      newPart.fans = 3;
      if (!adminSpec) {
        newPart.spec = 'Karta graficzna • Wymagany zasilacz min. ' + newPart.minPsu + 'W';
      }
    } else if (adminCat === 'psu') {
      newPart.watts = parseInt(adminWatts, 10) || 650;
      if (!adminSpec) {
        newPart.spec = 'Moc ' + newPart.watts + 'W • Certyfikat 80 Plus';
      }
    } else if (adminCat === 'cooler') {
      newPart.coolerType = adminCoolerType;
    }

    setComponentsDB((prev) => ({
      ...prev,
      [adminCat]: [...(prev[adminCat] || []), newPart]
    }));

    setAdminName('');
    setAdminPrice('');
    setAdminSpec('');
  };

  // Zmiana pola dowolnego komponentu w Panelu Admina (cena, socket, typ RAM, moc)
  const handleAdminUpdateField = (catKey, id, field, value) => {
    setComponentsDB((prev) => ({
      ...prev,
      [catKey]: prev[catKey].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAdminDeletePart = (catKey, id) => {
    if ((componentsDB[catKey] || []).length <= 1) {
      alert('W tej kategorii musi pozostać przynajmniej 1 element.');
      return;
    }
    setComponentsDB((prev) => ({
      ...prev,
      [catKey]: prev[catKey].filter((item) => item.id !== id)
    }));
  };

  const handleAddNewSocket = (e) => {
    e.preventDefault();
    const cleaned = newSocketInput.trim().toUpperCase();
    if (!cleaned || socketsList.includes(cleaned)) return;
    setSocketsList((prev) => [...prev, cleaned]);
    setAdminSocket(cleaned);
    setNewSocketInput('');
  };

  const handleSavePrebuilt = (e) => {
    e.preventDefault();
    if (!presetName) return;
    const created = {
      id: 'preset-' + Date.now(),
      name: presetName,
      badge: 'PLATFORM: ' + activeSocket + ' / ' + activeRamType,
      description: presetDesc || 'Zestaw skonfigurowany i zweryfikowany pod kątem kompatybilności.',
      parts: { ...selection }
    };
    setPrebuiltsDB((prev) => [created, ...prev]);
    setPresetName('');
    setPresetDesc('');
    alert('Dodano nowy Gotowy Zestaw PC.');
  };

  const handleExportInitialData = () => {
    const content = [
      '// src/initialData.js - Wygenerowano w Panelu Admina CoreForge',
      'export const ADMIN_SETTINGS = ' + JSON.stringify({ ...ADMIN_SETTINGS, discordWebhook }, null, 2) + ';',
      '',
      'export const AVAILABLE_SOCKETS = ' + JSON.stringify(socketsList, null, 2) + ';',
      'export const AVAILABLE_RAM_TYPES = ' + JSON.stringify(AVAILABLE_RAM_TYPES, null, 2) + ';',
      '',
      'export const CATEGORIES = ' + JSON.stringify(CATEGORIES, null, 2) + ';',
      '',
      'export const INITIAL_COMPONENTS = ' + JSON.stringify(componentsDB, null, 2) + ';',
      '',
      'export const INITIAL_PREBUILTS = ' + JSON.stringify(prebuiltsDB, null, 2) + ';'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendOrder = async (e) => {
    e.preventDefault();
    const lines = CATEGORIES.map((c) => {
      const part = selectedObjects[c.key];
      return '- ' + c.label + ': ' + (part ? part.name : '') + ' (' + (part ? part.price.toFixed(2) : '0.00') + ' zł)';
    }).join('\n');

    const cName = clientName ? clientName : 'Klient OLX';
    const cContact = clientContact ? clientContact : 'Brak';
    const cNotes = clientNotes ? clientNotes : 'Brak uwag';

    const messageText = [
      '=== ZAMÓWIENIE KONFIGURATOR COREFORGE ===',
      'Platforma: ' + activeSocket + ' / ' + activeRamType,
      'Klient: ' + cName,
      'Kontakt: ' + cContact,
      'Uwagi: ' + cNotes,
      '',
      'SPECYFIKACJA:',
      lines,
      '',
      'RAZEM DO ZAPŁATY: ' + totalPrice.toFixed(2) + ' zł'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(messageText);
    } catch {
      // Ignoruj błąd schowka
    }

    if (discordWebhook && discordWebhook.indexOf('https://discord.com/api/webhooks/') === 0) {
      try {
        await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: '```\n' + messageText + '\n```' })
        });
        setOrderSuccess('Wysłano zgłoszenie na Discord oraz skopiowano specyfikację do schowka!');
      } catch {
        setOrderSuccess('Skopiowano specyfikację do schowka! Możesz wkleić ją w wiadomości na OLX.');
      }
    } else {
      setOrderSuccess('Gotowe! Specyfikacja została skopiowana do schowka – wklej ją w wiadomości na OLX.');
    }
  };

  const leftCategories = CATEGORIES.filter((c) => c.side === 'left');
  const rightCategories = CATEGORIES.filter((c) => c.side === 'right');
  const activeCatMeta = CATEGORIES.find((c) => c.key === activeCat) || CATEGORIES[0];

  // Komponent pojedynczej karty wyboru podzespołu
  const renderPartCard = (cat) => {
    const current = selectedObjects[cat.key];
    const compatOptions = getCompatibleOptions(cat.key);
    const isSelected = activeCat === cat.key;

    return (
      <div
        key={cat.key}
        className={isSelected ? 'part-card active' : 'part-card'}
        onClick={() => setActiveCat(cat.key)}
      >
        <div className="part-card-top">
          <div className="part-title-wrap">
            <span className="part-code">{cat.code}</span>
            <span className="part-label">{cat.label}</span>
          </div>
          <strong className="part-price">
            {current ? current.price.toFixed(2) : '0.00'} zł
          </strong>
        </div>

        {/* Znaczniki aktywnej zależności sprzętowej */}
        <div className="dependency-badges">
          {cat.key === 'mobo' && (
            <>
              <span className="dep-pill blue">Socket: {current?.socket}</span>
              <span className="dep-pill emerald">Pamięć: {current?.ramType}</span>
            </>
          )}
          {cat.key === 'cpu' && (
            <span className="dep-pill blue">
              Kompatybilne z płytą ({activeSocket}) • Dostępne: {compatOptions.length}
            </span>
          )}
          {cat.key === 'ram' && (
            <span className="dep-pill emerald">
              Wymagany standard płyty: {activeRamType} • Dostępne: {compatOptions.length}
            </span>
          )}
          {cat.key === 'gpu' && current?.minPsu && (
            <span className="dep-pill slate">Wymagany zasilacz: min. {current.minPsu}W</span>
          )}
          {cat.key === 'psu' && (
            <span className="dep-pill slate">
              Filtr mocy pod GPU (min. {requiredPsuWatts}W)
            </span>
          )}
        </div>

        <select
          className="part-select"
          value={current ? current.id : ''}
          onChange={(e) => {
            setSelection({ ...selection, [cat.key]: e.target.value });
            setActiveCat(cat.key);
          }}
        >
          {compatOptions.map((item) => {
            const prefix =
              cat.key === 'mobo' && item.socket
                ? '[' + item.socket + '/' + item.ramType + '] '
                : '';
            return (
              <option key={item.id} value={item.id}>
                {prefix}{item.name} — {item.price.toFixed(2)} zł
              </option>
            );
          })}
        </select>

        <div className="part-spec">{current?.spec}</div>
      </div>
    );
  };

  return (
    <div className="clean-app">
      {/* ===================================================== */}
      {/* NAGŁÓWEK GŁÓWNY                                       */}
      {/* ===================================================== */}
      <header className="clean-navbar">
        <div className="navbar-brand">
          <button
            type="button"
            className="logo-mark"
            onClick={handleLogoSecretClick}
            title="CoreForge"
          >
            ⚡
          </button>
          <div onClick={() => setActiveTab('configurator')} style={{ cursor: 'pointer' }}>
            <div className="brand-title">CORE<span>FORGE</span></div>
            <div className="brand-caption">KONFIGURATOR I MONTAŻ PC</div>
          </div>
        </div>

        <nav className="navbar-tabs">
          <button
            type="button"
            className={activeTab === 'configurator' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('configurator')}
          >
            Konfigurator 2D
          </button>
          <button
            type="button"
            className={activeTab === 'prebuilts' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('prebuilts')}
          >
            Gotowe Zestawy ({prebuiltsDB.length})
          </button>
          {isAdminUnlocked && (
            <button
              type="button"
              className={activeTab === 'admin' ? 'tab-btn admin active' : 'tab-btn admin'}
              onClick={() => setActiveTab('admin')}
            >
              Panel Admina
            </button>
          )}
        </nav>

        <div className="navbar-summary">
          <div className="summary-stat">
            <span>Zapotrzebowanie:</span>
            <strong>~{totalTdp}W / {selectedObjects.psu?.watts || 650}W</strong>
          </div>
          <div className="summary-stat price">
            <span>Razem:</span>
            <strong>{totalPrice.toFixed(2)} zł</strong>
          </div>
          <button
            type="button"
            className="primary-cta"
            onClick={() => setShowOrderModal(true)}
          >
            Zamów zestaw
          </button>
        </div>
      </header>

      {/* ===================================================== */}
      {/* WIDOK 1: KONFIGURATOR 2D Z ZALEŻNOŚCIAMI              */}
      {/* ===================================================== */}
      {activeTab === 'configurator' && (
        <main className="main-container fade-in">
          {/* PASEK SZYBKIEGO WYBORU PLATFORMY (ZALEŻNOŚCI) */}
          <div className="platform-bar">
            <div className="platform-info">
              <span className="compat-check">✓</span>
              <div>
                <strong>Aktywna kontrola kompatybilności:</strong> Wybrana płyta główna (
                <span className="highlight-txt">{activeSocket} / {activeRamType}</span>) automatycznie filtruje pasujące procesory oraz pamięci RAM.
              </div>
            </div>

            <div className="platform-switcher">
              <span>Szybka zmiana platformy:</span>
              {socketsList.map((sock) => {
                const hasMobo = (componentsDB.mobo || []).some((m) => m.socket === sock);
                if (!hasMobo) return null;
                return (
                  <button
                    key={sock}
                    type="button"
                    className={activeSocket === sock ? 'plat-btn active' : 'plat-btn'}
                    onClick={() => handleSwitchPlatform(sock)}
                  >
                    {sock}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIATKA 3-KOLUMNOWA: LEWE KARTY + SCHEMAT 2D + PRAWE KARTY */}
          <div className="configurator-grid">
            <div className="cards-column">
              {leftCategories.map((cat) => renderPartCard(cat))}
            </div>

            <div className="schematic-column">
              <CleanPcSchematic
                selectedObjects={selectedObjects}
                activeCat={activeCat}
                onSelectCat={(k) => setActiveCat(k)}
              />

              {/* Dolny karta wyboru montażu */}
              <div className="service-bar">
                <div className="service-left">
                  <span className="part-code">SERWIS</span>
                  <strong>Usługa montażu i konfiguracji:</strong>
                </div>
                <select
                  className="part-select"
                  value={selection.service}
                  onChange={(e) => setSelection({ ...selection, service: e.target.value })}
                >
                  {(componentsDB.service || []).map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} (+{srv.price.toFixed(2)} zł)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cards-column">
              {rightCategories.map((cat) => renderPartCard(cat))}
            </div>
          </div>

          {/* DOLNA LISTA WSZYSTKICH KOMPATYBILNYCH OPCJI DLA WYBRANEGO ELEMENTU */}
          <section className="options-panel">
            <div className="options-panel-header">
              <div>
                <span className="section-eyebrow">SZCZEGÓŁOWY WYBÓR ({activeCatMeta.code})</span>
                <h2>{activeCatMeta.label} — kompatybilne modele ({getCompatibleOptions(activeCat).length})</h2>
                <p>{activeCatMeta.desc}</p>
              </div>
              <button
                type="button"
                className="primary-cta"
                onClick={() => setShowOrderModal(true)}
              >
                Podsumowanie zestawu ({totalPrice.toFixed(2)} zł)
              </button>
            </div>

            <div className="options-cards-grid">
              {getCompatibleOptions(activeCat).map((item) => {
                const isPicked = selectedObjects[activeCat]?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={isPicked ? 'option-item selected' : 'option-item'}
                    onClick={() => setSelection({ ...selection, [activeCat]: item.id })}
                  >
                    <div className="option-item-head">
                      <strong>{item.name}</strong>
                      <span className="option-item-price">{item.price.toFixed(2)} zł</span>
                    </div>
                    <div className="option-item-tags">
                      {item.socket && <span className="dep-pill blue">Socket {item.socket}</span>}
                      {item.ramType && <span className="dep-pill emerald">{item.ramType}</span>}
                      {item.minPsu && <span className="dep-pill slate">Min. PSU {item.minPsu}W</span>}
                      {item.watts && <span className="dep-pill slate">Moc {item.watts}W</span>}
                    </div>
                    <p>{item.spec}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* ===================================================== */}
      {/* WIDOK 2: GOTOWE ZESTAWY PC                            */}
      {/* ===================================================== */}
      {activeTab === 'prebuilts' && (
        <main className="main-container fade-in">
          <div className="page-header-box">
            <div>
              <span className="section-eyebrow">SPRAWDZONE KONFIGURACJE</span>
              <h1>Gotowe Zestawy PC (AMD AM5, AM4 oraz Intel)</h1>
              <p>Wybierz dowolny zestaw, aby wczytać go na schemat 2D i dostosować poszczególne części.</p>
            </div>
          </div>

          <div className="prebuilts-grid">
            {prebuiltsDB.map((preset) => {
              const price = calcPresetPrice(preset.parts);
              return (
                <div key={preset.id} className="prebuilt-card">
                  <div className="prebuilt-top">
                    <span className="dep-pill blue">{preset.badge}</span>
                    <strong className="prebuilt-price">{price.toFixed(2)} zł</strong>
                  </div>
                  <h2>{preset.name}</h2>
                  <p className="prebuilt-desc">{preset.description}</p>

                  <div className="prebuilt-specs">
                    {CATEGORIES.map((cat) => {
                      const part = (componentsDB[cat.key] || []).find(
                        (item) => item.id === preset.parts[cat.key]
                      );
                      if (!part) return null;
                      return (
                        <div key={cat.key} className="prebuilt-spec-row">
                          <span>{cat.label}:</span>
                          <strong>{part.name}</strong>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="primary-cta full-width"
                    onClick={() => {
                      setSelection({ ...preset.parts });
                      setActiveTab('configurator');
                    }}
                  >
                    Wczytaj zestaw do Konfiguratora 2D
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ===================================================== */}
      {/* WIDOK 3: PANEL ADMINA Z MODUŁEM ZALEŻNOŚCI            */}
      {/* ===================================================== */}
      {activeTab === 'admin' && isAdminUnlocked && (
        <main className="main-container fade-in">
          <div className="admin-header-card">
            <div>
              <span className="section-eyebrow">PANEL WŁAŚCICIELA (UKRYTY PRZED KLIENTAMI)</span>
              <h1>Zarządzanie Komponentami i Zależnościami Sprzętowymi</h1>
              <p>Przypisuj sockety (AM4, AM5, Intel), standardy RAM (DDR4, DDR5) oraz wymogi zasilania.</p>
            </div>
            <div className="admin-btn-group">
              <button type="button" className="primary-cta" onClick={handleExportInitialData}>
                Pobierz plik initialData.js
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  if (window.confirm('Przywrócić domyślne części i zależności?')) {
                    setComponentsDB(INITIAL_COMPONENTS);
                    setPrebuiltsDB(INITIAL_PREBUILTS);
                    setSocketsList(AVAILABLE_SOCKETS);
                  }
                }}
              >
                Resetuj bazę
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setIsAdminUnlocked(false);
                  setActiveTab('configurator');
                }}
              >
                Wyloguj
              </button>
            </div>
          </div>

          <div className="admin-grid">
            {/* LEWA KOLUMNA: Dodawanie komponentu z regułami kompatybilności */}
            <div className="admin-box">
              <h2>1. Dodaj nowy komponent z regułą zależności</h2>
              <form onSubmit={handleAdminAddPart} className="admin-form">
                <label>Kategoria komponentu</label>
                <select value={adminCat} onChange={(e) => setAdminCat(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>

                {/* DYNAMICZNE POLA ZALEŻNOŚCI W ZALEŻNOŚCI OD KATEGORII */}
                {(adminCat === 'mobo' || adminCat === 'cpu') && (
                  <div className="dependency-form-box">
                    <label>Powiązany Socket procesora / płyty (Zależność CPU ⇄ MOBO)</label>
                    <select value={adminSocket} onChange={(e) => setAdminSocket(e.target.value)}>
                      {socketsList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {(adminCat === 'mobo' || adminCat === 'ram') && (
                  <div className="dependency-form-box">
                    <label>Powiązany standard pamięci RAM (Zależność MOBO ⇄ RAM)</label>
                    <select value={adminRamType} onChange={(e) => setAdminRamType(e.target.value)}>
                      {AVAILABLE_RAM_TYPES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}

                {(adminCat === 'gpu' || adminCat === 'psu') && (
                  <div className="dependency-form-box">
                    <label>
                      {adminCat === 'gpu'
                        ? 'Minimalna wymagana moc zasilacza (W)'
                        : 'Moc znamionowa zasilacza (W)'}
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={adminWatts}
                      onChange={(e) => setAdminWatts(e.target.value)}
                    />
                  </div>
                )}

                {adminCat === 'cooler' && (
                  <div className="dependency-form-box">
                    <label>Typ chłodzenia na schemacie 2D</label>
                    <select value={adminCoolerType} onChange={(e) => setAdminCoolerType(e.target.value)}>
                      <option value="aio">Chłodzenie wodne AIO (Chłodnica u góry)</option>
                      <option value="air">Chłodzenie powietrzne wieżowe</option>
                    </select>
                  </div>
                )}

                <label>Pełna nazwa modelu</label>
                <input
                  type="text"
                  placeholder="np. AMD Ryzen 5 5600X lub ASUS B550 TUF Gaming"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />

                <label>Cena (PLN)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="np. 599.00"
                  value={adminPrice}
                  onChange={(e) => setAdminPrice(e.target.value)}
                  required
                />

                <label>Krótki opis techniczny (opcjonalnie)</label>
                <input
                  type="text"
                  placeholder="Zostaw puste, aby wygenerować automatycznie z zależności"
                  value={adminSpec}
                  onChange={(e) => setAdminSpec(e.target.value)}
                />

                <button type="submit" className="primary-cta full-width">
                  Dodaj komponent do bazy
                </button>
              </form>

              <hr className="clean-divider" />

              <h2>2. Dodaj nowy Socket / Platformę (np. AM6, LGA1851)</h2>
              <form onSubmit={handleAddNewSocket} className="inline-form">
                <input
                  type="text"
                  placeholder="Nazwa podstawki, np. LGA1200"
                  value={newSocketInput}
                  onChange={(e) => setNewSocketInput(e.target.value)}
                />
                <button type="submit" className="secondary-btn">Dodaj Socket</button>
              </form>

              <hr className="clean-divider" />

              <h2>3. Zapisz aktualny wybór z Konfiguratora jako Gotowy Zestaw</h2>
              <form onSubmit={handleSavePrebuilt} className="admin-form">
                <input
                  type="text"
                  placeholder="Nazwa zestawu (np. Zestaw Gaming AM4)"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  required
                />
                <textarea
                  rows="2"
                  placeholder="Opis zestawu..."
                  value={presetDesc}
                  onChange={(e) => setPresetDesc(e.target.value)}
                />
                <button type="submit" className="secondary-btn full-width">
                  Utwórz Gotowy Zestaw ({totalPrice.toFixed(2)} zł)
                </button>
              </form>

              <hr className="clean-divider" />

              <h2>4. Powiadomienia Discord Webhook</h2>
              <input
                type="text"
                className="full-input"
                placeholder="https://discord.com/api/webhooks/..."
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
              />
            </div>

            {/* PRAWA KOLUMNA: Tabela edycji cen oraz reguł zależności na żywo */}
            <div className="admin-box">
              <h2>Edycja cen i powiązań sprzętu na żywo</h2>
              <div className="admin-parts-scroll">
                {CATEGORIES.map((cat) => (
                  <div key={cat.key} className="admin-cat-group">
                    <h3>{cat.code} — {cat.label}</h3>
                    {(componentsDB[cat.key] || []).map((item) => (
                      <div key={item.id} className="admin-item-row">
                        <div className="admin-item-main">
                          <strong>{item.name}</strong>
                          <span>{item.spec}</span>
                        </div>

                        <div className="admin-item-controls">
                          {/* Edycja Socketu na żywo dla Płyt i Procesorów */}
                          {(cat.key === 'mobo' || cat.key === 'cpu') && (
                            <select
                              value={item.socket || 'AM5'}
                              onChange={(e) =>
                                handleAdminUpdateField(cat.key, item.id, 'socket', e.target.value)
                              }
                              title="Przypisany Socket"
                            >
                              {socketsList.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}

                          {/* Edycja typu RAM na żywo dla Płyt i Pamięci RAM */}
                          {(cat.key === 'mobo' || cat.key === 'ram') && (
                            <select
                              value={item.ramType || 'DDR5'}
                              onChange={(e) =>
                                handleAdminUpdateField(cat.key, item.id, 'ramType', e.target.value)
                              }
                              title="Standard pamięci RAM"
                            >
                              {AVAILABLE_RAM_TYPES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          )}

                          {/* Edycja ceny */}
                          <input
                            type="number"
                            step="1"
                            value={item.price}
                            onChange={(e) =>
                              handleAdminUpdateField(
                                cat.key,
                                item.id,
                                'price',
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                          <span className="unit-lbl">zł</span>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleAdminDeletePart(cat.key, item.id)}
                            title="Usuń komponent"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ===================================================== */}
      {/* MODAL ZAMÓWIENIA                                      */}
      {/* ===================================================== */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Podsumowanie zestawu ({activeSocket} / {activeRamType})</h2>
              <button type="button" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <div className="modal-summary-list">
              {CATEGORIES.map((cat) => {
                const part = selectedObjects[cat.key];
                return (
                  <div key={cat.key} className="modal-summary-row">
                    <span>{cat.label}:</span>
                    <strong>{part?.name} ({part?.price.toFixed(2)} zł)</strong>
                  </div>
                );
              })}
              <div className="modal-summary-total">
                <span>Łączny koszt:</span>
                <strong>{totalPrice.toFixed(2)} zł</strong>
              </div>
            </div>

            <form onSubmit={handleSendOrder} className="admin-form">
              <input
                type="text"
                placeholder="Twoje imię lub nick z OLX"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Telefon lub adres e-mail"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                required
              />
              <textarea
                rows="2"
                placeholder="Dodatkowe informacje (np. odbiór osobisty / wysyłka kurierem)..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
              />

              {orderSuccess && <div className="success-box">{orderSuccess}</div>}

              <button type="submit" className="primary-cta full-width">
                Skopiuj specyfikację i wyślij zgłoszenie
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* MODAL LOGOWANIA ADMINA (Ctrl + Shift + A lub 3x ⚡)    */}
      {/* ===================================================== */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-card small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Autoryzacja Administratora</h2>
              <button type="button" onClick={() => setShowAdminModal(false)}>✕</button>
            </div>
            <p className="modal-hint">Wpisz hasło właściciela (domyślnie: <strong>admin123</strong>):</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (adminPass === ADMIN_SETTINGS.password) {
                  setIsAdminUnlocked(true);
                  setShowAdminModal(false);
                  setAdminPass('');
                  setAdminError(false);
                  setActiveTab('admin');
                } else {
                  setAdminError(true);
                }
              }}
              className="admin-form"
            >
              <input
                type="password"
                placeholder="Hasło..."
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                autoFocus
              />
              {adminError && <div className="error-txt">Nieprawidłowe hasło.</div>}
              <button type="submit" className="primary-cta full-width">Zaloguj</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
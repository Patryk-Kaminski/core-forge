// src/initialData.js

export const ADMIN_SETTINGS = {
  password: 'admin123',
  discordWebhook: ''
};

export const AVAILABLE_SOCKETS = ['AM5', 'AM4', 'LGA1700', 'LGA1851'];
export const AVAILABLE_RAM_TYPES = ['DDR5', 'DDR4'];

export const CATEGORIES = [
  { key: 'mobo', label: 'Płyta główna', code: 'MOBO', side: 'left', desc: 'Określa socket procesora oraz standard pamięci RAM' },
  { key: 'cpu', label: 'Procesor (CPU)', code: 'CPU', side: 'left', desc: 'Filtrowany automatycznie pod socket płyty głównej' },
  { key: 'cooler', label: 'Chłodzenie procesora', code: 'COOLER', side: 'left', desc: 'Kompatybilne z wybraną podstawką' },
  { key: 'gpu', label: 'Karta graficzna (GPU)', code: 'GPU', side: 'left', desc: 'Określa minimalną wymaganą moc zasilacza' },
  { key: 'ram', label: 'Pamięć operacyjna RAM', code: 'RAM', side: 'right', desc: 'Filtrowana automatycznie pod standard płyty (DDR4 / DDR5)' },
  { key: 'ssd', label: 'Dysk SSD NVMe M.2', code: 'SSD', side: 'right', desc: 'Montowany w złączu M.2 PCIe na płycie głównej' },
  { key: 'case', label: 'Obudowa komputerowa', code: 'CASE', side: 'right', desc: 'Dopasowana do formatu płyty głównej i chłodzenia' },
  { key: 'psu', label: 'Zasilacz (PSU)', code: 'PSU', side: 'right', desc: 'Filtrowany pod zapotrzebowanie energetyczne karty i CPU' },
  { key: 'service', label: 'Usługa montażu i testów', code: 'SERWIS', side: 'bottom', desc: 'Opcje złożenia, aktualizacji BIOS i testów' }
];

export const INITIAL_COMPONENTS = {
  mobo: [
    {
      id: 'mobo-am5-1',
      name: 'Gigabyte B650 EAGLE AX (Wi-Fi 6E)',
      price: 509.00,
      socket: 'AM5',
      ramType: 'DDR5',
      spec: 'Socket AM5 • Obsługa DDR5 • 3x M.2 PCIe • Wi-Fi 6E'
    },
    {
      id: 'mobo-am5-2',
      name: 'MSI MAG B650 TOMAHAWK WIFI',
      price: 799.00,
      socket: 'AM5',
      ramType: 'DDR5',
      spec: 'Socket AM5 • Obsługa DDR5 • Sekcja 14+2+1 • 2.5G LAN'
    },
    {
      id: 'mobo-am4-1',
      name: 'MSI B550-A PRO',
      price: 429.00,
      socket: 'AM4',
      ramType: 'DDR4',
      spec: 'Socket AM4 • Obsługa DDR4 • 2x M.2 • PCIe 4.0'
    },
    {
      id: 'mobo-am4-2',
      name: 'Gigabyte B550 GAMING X V2',
      price: 419.00,
      socket: 'AM4',
      ramType: 'DDR4',
      spec: 'Socket AM4 • Obsługa DDR4 • Sekcja 10+3 Digital VRM'
    },
    {
      id: 'mobo-intel-d5',
      name: 'Gigabyte Z790 EAGLE AX (Wi-Fi 6E)',
      price: 849.00,
      socket: 'LGA1700',
      ramType: 'DDR5',
      spec: 'Intel LGA1700 • Obsługa DDR5 • PCIe 5.0 • 3x M.2'
    },
    {
      id: 'mobo-intel-d4',
      name: 'MSI PRO B760-P WIFI DDR4',
      price: 579.00,
      socket: 'LGA1700',
      ramType: 'DDR4',
      spec: 'Intel LGA1700 • Obsługa DDR4 • Wi-Fi 6E • 2.5G LAN'
    }
  ],
  cpu: [
    {
      id: 'cpu-am5-1',
      name: 'AMD Ryzen 7 7800X3D Tray',
      price: 1299.00,
      socket: 'AM5',
      tdp: 120,
      spec: 'Socket AM5 • 8 rdzeni / 16 wątków • 96MB 3D V-Cache'
    },
    {
      id: 'cpu-am5-2',
      name: 'AMD Ryzen 5 7600 Tray',
      price: 799.00,
      socket: 'AM5',
      tdp: 65,
      spec: 'Socket AM5 • 6 rdzeni / 12 wątków • Taktowanie do 5.1 GHz'
    },
    {
      id: 'cpu-am5-3',
      name: 'AMD Ryzen 7 9800X3D BOX',
      price: 2399.00,
      socket: 'AM5',
      tdp: 120,
      spec: 'Socket AM5 • 8 rdzeni / 16 wątków • 2. Gen 3D V-Cache'
    },
    {
      id: 'cpu-am4-1',
      name: 'AMD Ryzen 7 5700X3D Tray',
      price: 889.00,
      socket: 'AM4',
      tdp: 105,
      spec: 'Socket AM4 • 8 rdzeni / 16 wątków • 96MB 3D V-Cache'
    },
    {
      id: 'cpu-am4-2',
      name: 'AMD Ryzen 5 5600 BOX',
      price: 459.00,
      socket: 'AM4',
      tdp: 65,
      spec: 'Socket AM4 • 6 rdzeni / 12 wątków • Taktowanie do 4.4 GHz'
    },
    {
      id: 'cpu-intel-1',
      name: 'Intel Core i5-14600KF',
      price: 999.00,
      socket: 'LGA1700',
      tdp: 150,
      spec: 'Intel LGA1700 • 14 rdzeni (6P+8E) / 20 wątków • Do 5.3 GHz'
    },
    {
      id: 'cpu-intel-2',
      name: 'Intel Core i5-12400F',
      price: 449.00,
      socket: 'LGA1700',
      tdp: 65,
      spec: 'Intel LGA1700 • 6 rdzeni / 12 wątków • Do 4.4 GHz'
    },
    {
      id: 'cpu-intel-3',
      name: 'Intel Core i7-14700KF',
      price: 1589.00,
      socket: 'LGA1700',
      tdp: 190,
      spec: 'Intel LGA1700 • 20 rdzeni (8P+12E) / 28 wątków • Do 5.6 GHz'
    }
  ],
  ram: [
    {
      id: 'ram-d5-1',
      name: 'GOODRAM 32GB (2x16GB) 6000MHz CL30 IRDM BLACK V SILVER',
      price: 2499.00,
      ramType: 'DDR5',
      sticks: 2,
      spec: 'Standard DDR5 • 6000 MHz • Opóźnienia CL30 • Profil EXPO/XMP'
    },
    {
      id: 'ram-d5-2',
      name: 'Kingston FURY 32GB (2x16GB) 6000MHz CL30 Beast Black',
      price: 549.00,
      ramType: 'DDR5',
      sticks: 2,
      spec: 'Standard DDR5 • 6000 MHz • Opóźnienia CL30 • Niski profil'
    },
    {
      id: 'ram-d5-3',
      name: 'Corsair Vengeance 64GB (2x32GB) 6000MHz CL30',
      price: 1099.00,
      ramType: 'DDR5',
      sticks: 2,
      spec: 'Standard DDR5 • 64GB • 6000 MHz • CL30'
    },
    {
      id: 'ram-d4-1',
      name: 'Kingston FURY 32GB (2x16GB) 3600MHz CL18 Beast Black',
      price: 319.00,
      ramType: 'DDR4',
      sticks: 2,
      spec: 'Standard DDR4 • 3600 MHz • Opóźnienia CL18 • XMP 2.0'
    },
    {
      id: 'ram-d4-2',
      name: 'GOODRAM 16GB (2x8GB) 3600MHz CL18 IRDM PRO',
      price: 169.00,
      ramType: 'DDR4',
      sticks: 2,
      spec: 'Standard DDR4 • 16GB • 3600 MHz • CL18'
    }
  ],
  cooler: [
    {
      id: 'cool-1',
      name: 'SMX Hayate 360 ARGB (Wodne AIO 360mm)',
      price: 296.10,
      coolerType: 'aio',
      spec: 'Chłodzenie wodne AIO 360mm • 3x 120mm PWM • AM4 / AM5 / Intel'
    },
    {
      id: 'cool-2',
      name: 'ENDORFY Fortis 5 Dual Fan (Wieżowe)',
      price: 239.00,
      coolerType: 'air',
      spec: 'Chłodzenie powietrzne • 6 ciepłowodów • 2x wentylator Fluctus'
    },
    {
      id: 'cool-3',
      name: 'Arctic Liquid Freezer III 360 Black',
      price: 399.00,
      coolerType: 'aio',
      spec: 'Chłodzenie wodne AIO 360mm • Chłodnica 38mm • AM4 / AM5 / Intel'
    }
  ],
  gpu: [
    {
      id: 'gpu-1',
      name: 'ASUS GeForce RTX 5060 Ti Dual OC 16GB GDDR7 DLSS5',
      price: 3699.00,
      minPsu: 600,
      tdp: 190,
      fans: 2,
      spec: '16GB GDDR7 • DLSS 5 • Wymagany zasilacz min. 600W'
    },
    {
      id: 'gpu-2',
      name: 'Gigabyte GeForce RTX 4060 Eagle OC 8GB GDDR6',
      price: 1399.00,
      minPsu: 500,
      tdp: 115,
      fans: 3,
      spec: '8GB GDDR6 • DLSS 3.5 • Wymagany zasilacz min. 500W'
    },
    {
      id: 'gpu-3',
      name: 'MSI GeForce RTX 5080 GAMING TRIO OC 16GB GDDR7',
      price: 5899.00,
      minPsu: 750,
      tdp: 360,
      fans: 3,
      spec: '16GB GDDR7 • 4K Ultra • Wymagany zasilacz min. 750W'
    }
  ],
  ssd: [
    {
      id: 'ssd-1',
      name: 'Kingston 1TB M.2 PCIe Gen4 NVMe NV3',
      price: 629.00,
      spec: 'Pojemność 1TB • M.2 PCIe 4.0 • Odczyt 6000 MB/s'
    },
    {
      id: 'ssd-2',
      name: 'Lexar 2TB M.2 PCIe Gen4 NVMe NM790',
      price: 699.00,
      spec: 'Pojemność 2TB • M.2 PCIe 4.0 • Odczyt 7400 MB/s'
    }
  ],
  case: [
    {
      id: 'case-1',
      name: 'SMX Capsule Panoramic',
      price: 249.00,
      spec: 'Format ATX / mATX • Dwukomorowa • Przeszklony front i bok'
    },
    {
      id: 'case-2',
      name: 'ENDORFY Arx 700 Air / ARGB',
      price: 479.00,
      spec: 'Format ATX • Przewiewny panel Mesh • Miejsce na AIO 360mm'
    },
    {
      id: 'case-3',
      name: 'NZXT H9 Flow Dual-Chamber',
      price: 699.00,
      spec: 'Format ATX • Dwukomorowa konstrukcja Premium'
    }
  ],
  psu: [
    {
      id: 'psu-1',
      name: 'ENDORFY Vero L5 650W 80 Plus Bronze',
      price: 275.00,
      watts: 650,
      spec: 'Moc 650W • Certyfikat 80 Plus Bronze • Konwertery DC-DC'
    },
    {
      id: 'psu-2',
      name: 'MSI MAG A750GL PCIE5 750W 80 Plus Gold ATX 3.0',
      price: 449.00,
      watts: 750,
      spec: 'Moc 750W • Modularny • Przewód 12VHPWR PCIe 5.0'
    },
    {
      id: 'psu-3',
      name: 'be quiet! Pure Power 12 M 850W 80 Plus Gold',
      price: 599.00,
      watts: 850,
      spec: 'Moc 850W • Standard ATX 3.1 • Modularny'
    }
  ],
  service: [
    {
      id: 'srv-0',
      name: 'Samodzielny montaż (Wysyłka podzespołów)',
      price: 0.00,
      spec: 'Podzespoły w fabrycznych opakowaniach'
    },
    {
      id: 'srv-1',
      name: 'Złożenie PC + Aktualizacja BIOS + Ułożenie kabli + Testy OCCT',
      price: 249.00,
      spec: 'Komputer gotowy do podłączenia z pełnym raportem stabilności'
    }
  ]
};

export const INITIAL_PREBUILTS = [
  {
    id: 'preset-xkom',
    name: 'Zestaw X-KOM (AM5 + RTX 5060 Ti 16GB)',
    badge: 'PLATFORM: AMD AM5 / DDR5',
    description: 'Konfiguracja z Twojego koszyka (9 455,10 zł): Ryzen 7 7800X3D, Gigabyte B650 Eagle AX, 32GB DDR5, RTX 5060 Ti 16GB oraz chłodzenie wodne 360mm.',
    parts: {
      mobo: 'mobo-am5-1',
      cpu: 'cpu-am5-1',
      cooler: 'cool-1',
      gpu: 'gpu-1',
      ram: 'ram-d5-1',
      ssd: 'ssd-1',
      case: 'case-1',
      psu: 'psu-1',
      service: 'srv-0'
    }
  },
  {
    id: 'preset-am4',
    name: 'Zestaw Budżetowy Esport (AM4 + DDR4)',
    badge: 'PLATFORM: AMD AM4 / DDR4',
    description: 'Opłacalny zestaw do gier e-sportowych (CS2, Valorant, Fortnite) na bazie podstawki AM4 i pamięci DDR4 3600MHz.',
    parts: {
      mobo: 'mobo-am4-1',
      cpu: 'cpu-am4-1',
      cooler: 'cool-2',
      gpu: 'gpu-2',
      ram: 'ram-d4-1',
      ssd: 'ssd-1',
      case: 'case-1',
      psu: 'psu-1',
      service: 'srv-1'
    }
  },
  {
    id: 'preset-intel',
    name: 'Zestaw Intel Core Ultra Gaming (LGA1700 + RTX 5080)',
    badge: 'PLATFORM: INTEL LGA1700 / DDR5',
    description: 'Wydajna stacja robocza i gamingowa 4K z procesorem Intel Core i7-14700KF, płytą Z790 DDR5 oraz kartą RTX 5080 16GB.',
    parts: {
      mobo: 'mobo-intel-d5',
      cpu: 'cpu-intel-3',
      cooler: 'cool-3',
      gpu: 'gpu-3',
      ram: 'ram-d5-2',
      ssd: 'ssd-2',
      case: 'case-3',
      psu: 'psu-3',
      service: 'srv-1'
    }
  }
];
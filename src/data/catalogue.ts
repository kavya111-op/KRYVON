import { Product } from '../types';

export const INITIAL_CATALOGUE: Product[] = [
  {
    id: 'kry-aud-01',
    name: 'Titan Pro Hybrid ANC Wireless Headphones',
    category: 'audio',
    priceINR: 4799,
    originalPriceINR: 7999,
    rating: 4.7,
    reviewCount: 3840,
    inStock: true,
    image: '/src/assets/images/headphones_anc_black_1793726638571.jpg',
    summary: 'High-fidelity over-ear headphones engineered with dual-chamber 40mm titanium drivers and 38dB hybrid active noise cancellation.',
    specs: {
      brand: 'Titan Audio',
      model: 'TH-900 Pro',
      batteryLife: '65 Hours (ANC Off) / 45 Hours (ANC On)',
      connectivity: 'Bluetooth 5.3 + 3.5mm Low-Latency AUX',
      noiseCancellation: 'Hybrid Active Noise Cancellation (up to -38dB)',
      weight: '248g (Ultra-Light Memory Foam)',
      warranty: '1 Year Brand Replacement',
      driverSize: '40mm Custom Titanium Diaphragm',
      charging: 'USB Type-C Quick Charge (10 min = 5 hrs)',
      color: 'Matte Obsidian Black'
    },
    strengths: [
      'Sub-₹5,000 price point with flagship-grade 38dB hybrid ANC',
      'Massive 65-hour playback with rapid USB-C charging',
      'Plush memory foam earcups with multi-point device pairing'
    ],
    weaknesses: [
      'No companion mobile EQ app',
      'Earcup hinge is reinforced polycarbonate rather than solid steel'
    ]
  },
  {
    id: 'kry-aud-02',
    name: 'AeroBuds Pro 2 True Wireless ANC Earbuds',
    category: 'audio',
    priceINR: 3499,
    originalPriceINR: 5499,
    rating: 4.6,
    reviewCount: 5210,
    inStock: true,
    image: '/src/assets/images/wireless_earbuds_anc_1793726640331.jpg',
    summary: 'Compact aerospace-grade true wireless earbuds equipped with quad ENC beamforming microphones and deep 11mm bass drivers.',
    specs: {
      brand: 'AeroSound Labs',
      model: 'AB-Pro-2',
      batteryLife: '36 Hours Total with Wireless Charging Case',
      connectivity: 'Bluetooth 5.4 with AAC & LDAC Support',
      noiseCancellation: 'Adaptive Active Noise Cancellation (-42dB)',
      weight: '4.2g per earbud (Ergonomic In-Ear)',
      waterResistance: 'IPX5 Sweat & Water Resistance',
      warranty: '1 Year Manufacturer Warranty',
      driverSize: '11mm Liquid Crystal Polymer Drivers',
      color: 'Graphite Black'
    },
    strengths: [
      'LDAC high-resolution audio streaming under ₹4,000',
      'Featherweight 4.2g fit ideal for running and extended calls',
      'Qi wireless charging supported in the case'
    ],
    weaknesses: [
      'Touch controls can be overly sensitive during workouts',
      'Gloss interior finish attracts fingerprint smudges'
    ]
  },
  {
    id: 'kry-kb-01',
    name: 'Vortex K75 Wireless Gasket Mechanical Keyboard',
    category: 'peripherals',
    priceINR: 6890,
    originalPriceINR: 9999,
    rating: 4.8,
    reviewCount: 1980,
    inStock: true,
    image: '/src/assets/images/mechanical_keyboard_wireless_1793726640049.jpg',
    summary: 'Tri-mode 75% compact mechanical keyboard featuring gasket-mounted acoustic dampening, hot-swappable tactile switches, and an aluminum rotary knob.',
    specs: {
      brand: 'Vortex Dynamics',
      model: 'VK-75 Pro',
      batteryLife: '4000mAh Battery (Up to 200 Hours RGB Off)',
      connectivity: '2.4GHz Wireless Dongle + Bluetooth 5.1 + Type-C Cable',
      switchType: 'Factory-Lubed Linear Gateron Yellow Pro 2.0 (Hot-swappable 5-pin)',
      weight: '920g (Heavy CNC Anodized Frame)',
      warranty: '2 Year Direct Hardware Warranty',
      refreshRate: '1000Hz Polling Rate (Wired & 2.4GHz)',
      color: 'Slate Grey & Cyan Accents'
    },
    strengths: [
      'True silicone gasket mount creates a deep, satisfying acoustic thock',
      'Tri-mode connectivity with instant 3-device Bluetooth toggle',
      'Machined aluminum multi-function volume knob'
    ],
    weaknesses: [
      '920g weight makes it better suited for desk setups than portable travel',
      'Keycap legends are non-shine-through PBT'
    ]
  },
  {
    id: 'kry-wear-01',
    name: 'Chronos Horizon AMOLED Titanium Smartwatch',
    category: 'wearables',
    priceINR: 4299,
    originalPriceINR: 6999,
    rating: 4.5,
    reviewCount: 4120,
    inStock: true,
    image: '/src/assets/images/smartwatch_amoled_matte_1793726640001.jpg',
    summary: 'Sleek brushed titanium smart wearable with 1.85-inch 60Hz curved AMOLED display, dual-band GPS, and continuous health telemetry.',
    specs: {
      brand: 'Chronos Tech',
      model: 'CH-Horizon',
      batteryLife: '10 Days Typical Use / 18 Days Battery Saver',
      connectivity: 'Bluetooth 5.3 Low Energy + Standalone GPS',
      displayType: '1.85-inch Super AMOLED (454x454, 600 nits, Always-On)',
      weight: '38g without strap',
      waterResistance: '5ATM Water Resistant (Up to 50 meters)',
      warranty: '1 Year Replacement Warranty',
      color: 'Titanium Grey with Fluororubber Strap'
    },
    strengths: [
      'Stunning 60Hz Always-On AMOLED screen with exceptional outdoor visibility',
      'Realistic 10-day battery life without daily recharging hassle',
      'Precise SpO2, HRV, and sleep phase monitoring'
    ],
    weaknesses: [
      'Proprietary magnetic charging puck instead of standard Qi wireless',
      'Third-party app ecosystem is basic compared to WearOS'
    ]
  },
  {
    id: 'kry-aud-03',
    name: 'SoundPulse Studio 50W Bluetooth Bookshelf Speakers',
    category: 'audio',
    priceINR: 5990,
    originalPriceINR: 8990,
    rating: 4.6,
    reviewCount: 1420,
    inStock: true,
    image: '/src/assets/images/headphones_anc_black_1793726638571.jpg', // fallback image
    summary: 'Acoustically tuned wooden desktop speakers featuring silk dome tweeters and dedicated optical/Bluetooth inputs for home studios.',
    specs: {
      brand: 'SoundPulse',
      model: 'SP-Studio-50',
      batteryLife: 'AC Mains Powered (50W RMS Total Output)',
      connectivity: 'Bluetooth 5.2 + Optical TOSLINK + Dual RCA Line-In',
      driverSize: '4-inch Kevlar Woofers + 19mm Silk Dome Tweeters',
      weight: '4.8kg (Pair in MDF Acoustic Cabinet)',
      warranty: '1 Year Domestic Warranty',
      color: 'Dark Walnut Finish'
    },
    strengths: [
      'Clean uncolored sound reproduction for music and content editing',
      'Subwoofer output line allows adding a powered sub later',
      'Included infrared wireless remote control'
    ],
    weaknesses: [
      'No battery power (requires wall outlet)',
      'Large footprint requires dedicated desk space'
    ]
  },
  {
    id: 'kry-periph-02',
    name: 'HyperGlide Ergo Master Wireless Mouse',
    category: 'peripherals',
    priceINR: 3290,
    originalPriceINR: 4999,
    rating: 4.7,
    reviewCount: 2890,
    inStock: true,
    image: '/src/assets/images/mechanical_keyboard_wireless_1793726640049.jpg', // fallback image
    summary: 'Ergonomic sculptured productivity mouse with MagSpeed electromagnetic scroll wheel, thumb gesture buttons, and silent mechanical switches.',
    specs: {
      brand: 'HyperGlide',
      model: 'HG-Master-Ergo',
      batteryLife: '70 Days on Full Charge (Type-C Rechargeable)',
      connectivity: 'Bluetooth 5.2 + 2.4GHz Wireless (Multi-Host 3 Devices)',
      driverSize: '4000 DPI Darkfield Laser Sensor (Tracks on Glass)',
      weight: '115g Ergonomic Contoured Grip',
      warranty: '2 Year Direct Replacement',
      color: 'Space Graphite'
    },
    strengths: [
      'Virtually silent click switches (90% noise reduction for quiet offices)',
      'Tracks flawlessly even on transparent glass surfaces',
      'Dual-mode hyper-fast scroll wheel for lengthy documents'
    ],
    weaknesses: [
      'Right-handed ergonomic shape only',
      'Larger size not suited for small hands or claw grip'
    ]
  },
  {
    id: 'kry-work-01',
    name: 'LuminaBar Ultra Curved Screen Lightbar',
    category: 'workspace',
    priceINR: 3799,
    originalPriceINR: 5999,
    rating: 4.8,
    reviewCount: 1650,
    inStock: true,
    image: '/src/assets/images/smartwatch_amoled_matte_1793726640001.jpg', // fallback
    summary: 'Asymmetric optical monitor lamp designed for zero screen glare, with wireless rotary dial and Ra97 color accuracy.',
    specs: {
      brand: 'Lumina Tech',
      model: 'LB-Ultra-97',
      batteryLife: 'USB-C Powered (5V 2A)',
      connectivity: '2.4GHz Wireless Desktop Touch Controller',
      weight: '520g Weighted Gravity Clip',
      warranty: '1 Year Warranty',
      color: 'Anodized Deep Slate'
    },
    strengths: [
      'Patented asymmetric light beam completely eliminates screen reflections',
      'Included wireless desktop dial controls stepless brightness & color temp',
      'Museum-grade Ra97 CRI for accurate photo/video color grading'
    ],
    weaknesses: [
      'Gravity pivot requires monitors thicker than 1cm at top bezel',
      'Requires steady 2A USB power source'
    ]
  },
  {
    id: 'kry-wear-02',
    name: 'PulseTrack Pro 5 Advanced Health Tracker',
    category: 'wearables',
    priceINR: 2499,
    originalPriceINR: 3999,
    rating: 4.4,
    reviewCount: 6800,
    inStock: true,
    image: '/src/assets/images/smartwatch_amoled_matte_1793726640001.jpg',
    summary: 'Ultra-slim activity band with 1.62-inch AMOLED touch display, continuous heart rate, sleep apnea screening, and 120 sports modes.',
    specs: {
      brand: 'PulseTrack',
      model: 'PT-Band-5',
      batteryLife: '14 Days Regular Use',
      connectivity: 'Bluetooth 5.2 Low Energy',
      displayType: '1.62-inch Color AMOLED (500 nits)',
      weight: '13.5g (Extremely Lightweight)',
      waterResistance: '5ATM (Swim-proof)',
      warranty: '1 Year Warranty',
      color: 'Midnight Obsidian'
    },
    strengths: [
      'Outstanding value at ₹2,499 with genuine continuous SpO2 & sleep tracking',
      'Weighs only 13.5 grams—imperceptible while sleeping',
      'Solid 2-week battery life'
    ],
    weaknesses: [
      'Relies on connected phone GPS for outdoor route mapping',
      'No speaker or microphone for voice calls'
    ]
  }
];

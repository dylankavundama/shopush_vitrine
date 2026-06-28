// WooCommerce and Mock API Service

const CREDENTIALS_KEY = 'ShopUshindi_wc_credentials';

const DEFAULT_CREDENTIALS = {
  url: 'https://ShopUshindi.com',
  consumerKey: 'ck_30ec07f5c759aa430f41715156f306626141b737',
  consumerSecret: 'cs_e0b0c19012e996695a09d767e4a50bf0c254ec57'
};

const ensureHttps = (url) => {
  if (!url) return '';
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

const decodeHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'");
};

export const getWCCredentials = () => {
  try {
    const saved = localStorage.getItem(CREDENTIALS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CREDENTIALS;
  } catch (e) {
    return DEFAULT_CREDENTIALS;
  }
};

export const saveWCCredentials = (credentials) => {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
};

export const deleteWCCredentials = () => {
  localStorage.removeItem(CREDENTIALS_KEY);
};

// Premium Mock Data to wow the user out of the box
const MOCK_CATEGORIES = [
  { id: 'all', name: 'Tout', slug: 'all', count: 10, icon: 'Grid' },
  { id: 'vehicles', name: 'Véhicules', slug: 'vehicles', count: 2, icon: 'Car' },
  { id: 'sneakers', name: 'Sneakers', slug: 'sneakers', count: 3, icon: 'Footprints' },
  { id: 'watches', name: 'Montres', slug: 'watches', count: 2, icon: 'Clock' },
  { id: 'audio', name: 'Audio', slug: 'audio', count: 2, icon: 'Headphones' },
  { id: 'accessories', name: 'Accessoires', slug: 'accessories', count: 1, icon: 'Sparkles' }
];

const MOCK_PRODUCTS = [
  {
    id: 101,
    name: 'AeroMax Pro V2 - Noir Graphite',
    slug: 'aeromax-pro-v2',
    price: 189,
    regular_price: 249,
    on_sale: true,
    description: 'Une sneaker révolutionnaire alliant confort suprême et design futuriste. Conçue avec des matériaux recyclés haut de gamme et notre semelle brevetée AeroCushion, elle offre un retour d\'énergie exceptionnel à chaque pas.',
    short_description: 'Sneakers futuristes ultra-confortables avec semelle AeroCushion.',
    categories: [{ id: 'sneakers', name: 'Sneakers' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.8,
    reviews_count: 124,
    stock_status: 'instock',
    brand: 'AeroLabs',
    specs: [
      { label: 'Matériau', value: 'PrimeKnit Premium & TPU Recyclé' },
      { label: 'Semelle', value: 'AeroCushion V2 Réactive' },
      { label: 'Poids', value: '290g (Taille 42)' },
      { label: 'Utilisation', value: 'Running & Style Quotidien' }
    ]
  },
  {
    id: 102,
    name: 'Chronograph Vanguard Elite',
    slug: 'chrono-vanguard-elite',
    price: 349,
    regular_price: 349,
    on_sale: false,
    description: 'Un garde-temps d\'exception alliant la précision d\'un mouvement automatique suisse à un boîtier robuste en titane brossé de grade 5. Son cadran squelette laisse entrevoir la beauté de sa mécanique interne.',
    short_description: 'Montre chronographe automatique haut de gamme en titane brossé.',
    categories: [{ id: 'watches', name: 'Montres' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.9,
    reviews_count: 58,
    stock_status: 'instock',
    brand: 'Vanguard',
    specs: [
      { label: 'Boîtier', value: 'Titane Grade 5 Brossé' },
      { label: 'Diamètre', value: '42 mm' },
      { label: 'Verre', value: 'Saphir Inrayable Antireflet' },
      { label: 'Étanchéité', value: '100 mètres (10 ATM)' }
    ]
  },
  {
    id: 103,
    name: 'SoundHorizon Studio ANC',
    slug: 'soundhorizon-studio-anc',
    price: 279,
    regular_price: 299,
    on_sale: true,
    description: 'Plongez dans un silence absolu grâce à notre réduction de bruit active hybride de pointe. Les transducteurs de 40mm offrent une clarté sonore époustouflante, des basses percutantes et des aigus d\'une pureté cristalline.',
    short_description: 'Casque audio circum-auriculaire sans fil avec réduction active hybride.',
    categories: [{ id: 'audio', name: 'Audio' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.7,
    reviews_count: 215,
    stock_status: 'instock',
    brand: 'Acoustics',
    specs: [
      { label: 'Autonomie', value: 'Jusqu\'à 45 heures (ANC désactivé)' },
      { label: 'Bluetooth', value: 'Version 5.3 Multipoint' },
      { label: 'Codecs', value: 'LDAC, AAC, SBC' },
      { label: 'Charge', value: 'Rapide USB-C (5 min = 4 heures)' }
    ]
  },
  {
    id: 104,
    name: 'Runners Apex Wave-X',
    slug: 'runners-apex-wave-x',
    price: 145,
    regular_price: 145,
    on_sale: false,
    description: 'Spécialement conçue pour les athlètes exigeants, la Apex Wave-X dispose d\'une plaque de carbone intégrée pour maximiser la propulsion. Sa tige respirante en Mesh 3D épouse parfaitement la forme du pied.',
    short_description: 'Chaussure de running haute performance avec plaque de carbone intégrée.',
    categories: [{ id: 'sneakers', name: 'Sneakers' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.6,
    reviews_count: 87,
    stock_status: 'instock',
    brand: 'AeroLabs',
    specs: [
      { label: 'Propulsion', value: 'Plaque Carbone ApexWave' },
      { label: 'Semelle', value: 'Eva Ultra-Light & Gomme Grippy' },
      { label: 'Drop', value: '8 mm' },
      { label: 'Amorti', value: 'Ferme et Dynamique' }
    ]
  },
  {
    id: 105,
    name: 'Nebula Smart Band Pro',
    slug: 'nebula-smart-band-pro',
    price: 89,
    regular_price: 119,
    on_sale: true,
    description: 'Votre compagnon bien-être ultime. Suivez votre fréquence cardiaque en continu, analysez la qualité de votre sommeil et gardez le contrôle avec son écran AMOLED incurvé de 1.47 pouces, ultra-lumineux même en plein soleil.',
    short_description: 'Bracelet connecté AMOLED avec suivi santé avancé et étanche 5ATM.',
    categories: [{ id: 'watches', name: 'Montres' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.5,
    reviews_count: 92,
    stock_status: 'instock',
    brand: 'Vanguard',
    specs: [
      { label: 'Écran', value: 'AMOLED 1.47" Tactile Incurvé' },
      { label: 'Capteurs', value: 'Cardiofréquencemètre, SpO2, Accéléromètre' },
      { label: 'Autonomie', value: 'Jusqu\'à 14 jours' },
      { label: 'Compatibilité', value: 'iOS & Android' }
    ]
  },
  {
    id: 106,
    name: 'Sonic Buds Pro Wireless',
    slug: 'sonic-buds-pro-wireless',
    price: 129,
    regular_price: 129,
    on_sale: false,
    description: 'Des écouteurs True Wireless d\'une légèreté incroyable qui s\'oublient à vos oreilles. Équipés de la réduction de bruit adaptative et de micros à faisceau pour des appels limpides dans toutes les situations.',
    short_description: 'Écouteurs True Wireless ANC légers avec autonomie longue durée.',
    categories: [{ id: 'audio', name: 'Audio' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1588444839799-eaa432b87359?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.7,
    reviews_count: 148,
    stock_status: 'instock',
    brand: 'Acoustics',
    specs: [
      { label: 'Contrôle', value: 'Tactile Intelligent Adaptatif' },
      { label: 'Étanchéité', value: 'IPX4 Résistant à la sueur' },
      { label: 'Charge sans fil', value: 'Compatible Qi' },
      { label: 'Autonomie totale', value: '30 heures avec boîtier' }
    ]
  },
  {
    id: 107,
    name: 'Sac à Dos Explorer Urbain',
    slug: 'sac-a-dos-explorer-urbain',
    price: 99,
    regular_price: 129,
    on_sale: true,
    description: 'Le sac ultime pour les nomades urbains. Conçu en tissu Cordura imperméable, il comprend un compartiment matelassé pour ordinateur 16 pouces, des poches secrètes RFID, et un port de charge USB externe.',
    short_description: 'Sac à dos étanche Cordura de 25L avec compartiment PC 16" et chargeur.',
    categories: [{ id: 'accessories', name: 'Accessoires' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.8,
    reviews_count: 67,
    stock_status: 'instock',
    brand: 'Explorer',
    specs: [
      { label: 'Capacité', value: '25 Litres' },
      { label: 'Matériau', value: 'Nylon Cordura 1000D Résistant' },
      { label: 'Compartiment PC', value: 'Jusqu\'à 16" Haute Densité' },
      { label: 'Sécurité', value: 'Fermetures YKK & Poche RFID' }
    ]
  },
  {
    id: 108,
    name: 'Street Stealth Black Edition',
    slug: 'street-stealth-black-edition',
    price: 155,
    regular_price: 155,
    on_sale: false,
    description: 'Entièrement revêtue d\'un noir mat profond, cette édition limitée de notre modèle phare allie discrétion absolue et élégance intemporelle. Semelle antidérapante renforcée et confort enveloppant.',
    short_description: 'Édition limitée monochrome noire avec amorti renforcé.',
    categories: [{ id: 'sneakers', name: 'Sneakers' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=600' },
      { src: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.9,
    reviews_count: 42,
    stock_status: 'instock',
    brand: 'AeroLabs',
    specs: [
      { label: 'Couleur', value: 'Stealth Matte Black' },
      { label: 'Semelle', value: 'GripMax All-Conditions' },
      { label: 'Tige', value: 'Cuir Vegan Premium Hydrophobe' },
      { label: 'Production', value: 'Édition Limitée (500 ex)' }
    ]
  },
  {
    id: 109,
    name: 'Toyota Land Cruiser Prado TXL',
    slug: 'toyota-land-cruiser-prado-txl',
    price: 45000,
    regular_price: 48000,
    on_sale: true,
    description: 'Le SUV tout-terrain légendaire de Toyota. Confort exceptionnel, motorisation robuste et fiabilité à toute épreuve pour toutes vos routes.',
    short_description: 'SUV tout-terrain robuste avec intérieur cuir et boîte automatique.',
    categories: [{ id: 'vehicles', name: 'Véhicules' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 4.9,
    reviews_count: 36,
    stock_status: 'instock',
    brand: 'Toyota',
    specs: [
      { label: 'Moteur', value: '3.0L D-4D Diesel' },
      { label: 'Transmission', value: 'Automatique 6 rapports' },
      { label: 'Année', value: '2020' },
      { label: 'Kilométrage', value: '45,000 km' }
    ]
  },
  {
    id: 110,
    name: 'Mercedes-Benz G-Class AMG G63',
    slug: 'mercedes-benz-g-class-amg-g63',
    price: 0,
    regular_price: 0,
    on_sale: false,
    description: 'Le 4x4 de luxe ultime, combinant puissance brute, design cubique emblématique et intérieur ultra-luxueux pour une présence inégalée sur route et hors-route.',
    short_description: 'Véhicule tout-terrain de luxe emblématique AMG G63.',
    categories: [{ id: 'vehicles', name: 'Véhicules' }],
    images: [
      { src: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=600' }
    ],
    rating: 5.0,
    reviews_count: 14,
    stock_status: 'instock',
    brand: 'Mercedes-Benz',
    specs: [
      { label: 'Moteur', value: 'V8 4.0L BiTurbo 585 ch' },
      { label: 'Transmission', value: 'Automatique 9G-TRONIC' },
      { label: 'Année', value: '2022' },
      { label: 'Vitesse max', value: '220 km/h' }
    ]
  }
];

// Helper to check if credentials work / connect
const testWooCommerceConnection = async (url, consumerKey, consumerSecret) => {
  try {
    const formattedUrl = url.endsWith('/') ? url : `${url}/`;
    const endpoint = `${formattedUrl}wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=1`;
    const response = await fetch(endpoint);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// Main WooCommerce Client Layer
export const wooCommerceService = {
  isDemoMode: () => {
    return false;
  },

  testConnection: testWooCommerceConnection,

  // Fetch all categories
  getCategories: async () => {
    const creds = getWCCredentials();

    try {
      const formattedUrl = creds.url.endsWith('/') ? creds.url : `${creds.url}/`;
      const endpoint = `${formattedUrl}wp-json/wc/v3/products/categories?consumer_key=${creds.consumerKey}&consumer_secret=${creds.consumerSecret}&per_page=50`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('WooCommerce API error');
      
      const wcCategories = await response.json();
      
      // Map to standardized category format
      const formatted = wcCategories
        .filter(c => c.count > 0 && c.slug !== 'uncategorized')
        .map(c => ({
          id: c.id.toString(),
          name: decodeHtml(c.name),
          slug: c.slug,
          count: c.count,
          icon: 'Grid' // default icon
        }));

      return [{ id: 'all', name: 'Tout', slug: 'all', count: formatted.reduce((acc, c) => acc + c.count, 0), icon: 'Grid' }, ...formatted];
    } catch (e) {
      console.error('WooCommerce API failed:', e);
      return [];
    }
  },

  // Fetch products with support for filter, search, category
  getProducts: async ({ category = 'all', search = '', page = 1, perPage = 20, sort = 'default' } = {}) => {
    const creds = getWCCredentials();

    const filterProducts = (list) => {
      return list;
    };

    try {
      const formattedUrl = creds.url.endsWith('/') ? creds.url : `${creds.url}/`;
      let endpoint = `${formattedUrl}wp-json/wc/v3/products?consumer_key=${creds.consumerKey}&consumer_secret=${creds.consumerSecret}&page=${page}&per_page=${perPage}&status=publish`;

      if (category && category !== 'all') {
        endpoint += `&category=${category}`;
      }

      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }

      if (sort === 'price-low') {
        endpoint += `&orderby=price&order=asc`;
      } else if (sort === 'price-high') {
        endpoint += `&orderby=price&order=desc`;
      } else if (sort === 'rating') {
        endpoint += `&orderby=rating&order=desc`;
      } else {
        // Default sorting: recently added products first
        endpoint += `&orderby=id&order=desc`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('WooCommerce API error');
      
      const wcProducts = await response.json();

      // Standardize products structure
      const mapped = wcProducts.map(p => ({
        id: p.id,
        name: decodeHtml(p.name),
        slug: p.slug,
        price: parseFloat(p.price || 0),
        regular_price: parseFloat(p.regular_price || p.price || 0),
        on_sale: p.on_sale,
        description: decodeHtml(p.description.replace(/<[^>]*>?/gm, '')), // strip tags and decode
        short_description: decodeHtml(p.short_description.replace(/<[^>]*>?/gm, '')),
        categories: p.categories.map(c => ({ id: c.id.toString(), name: decodeHtml(c.name) })),
        images: p.images.length > 0 ? p.images.map(img => ({ src: ensureHttps(img.src) })) : [{ src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600' }],
        rating: parseFloat(p.average_rating || 0) || 4.5,
        reviews_count: p.rating_count || 10,
        stock_status: p.stock_status,
        brand: decodeHtml(p.attributes.find(a => a.name.toLowerCase() === 'brand' || a.name.toLowerCase() === 'marque')?.options[0] || ''),
        specs: p.attributes.map(a => ({ label: decodeHtml(a.name), value: decodeHtml(a.options.join(', ')) }))
      }));

      // Double-check client-side sorting by ID descending for default sort
      if (sort === 'default') {
        mapped.sort((a, b) => b.id - a.id);
      }

      return filterProducts(mapped);
    } catch (e) {
      console.error('WooCommerce API failed:', e);
      return [];
    }
  },

  // Create order
  createOrder: async (orderData) => {
    const creds = getWCCredentials();

    try {
      const formattedUrl = creds.url.endsWith('/') ? creds.url : `${creds.url}/`;
      const endpoint = `${formattedUrl}wp-json/wc/v3/orders?consumer_key=${creds.consumerKey}&consumer_secret=${creds.consumerSecret}`;

      // Format to WooCommerce API payload
      const payload = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: false,
        billing: {
          first_name: orderData.customer.name,
          last_name: '',
          address_1: orderData.customer.address,
          city: orderData.customer.city || 'Nairobi',
          phone: orderData.customer.phone,
          email: orderData.customer.email || 'customer@example.com'
        },
        line_items: orderData.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create WooCommerce order');
      return await response.json();
    } catch (e) {
      console.error('WooCommerce order creation failed:', e);
      throw e;
    }
  }
};

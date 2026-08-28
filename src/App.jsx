import { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Home,
  Grid,
  Settings,
  ChevronRight,
  ChevronDown,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Share2,
  Compass,
  Tag,
  ShoppingCart,
  Menu,
  MessageSquare,
  Laptop,
  Phone,
  Wifi,
  WifiOff,
  SlidersHorizontal,
  Info,
  ExternalLink,
  Footprints,
  Clock,
  Headphones,
  Sparkles,
  User,
  ShoppingBagIcon,
  Sun,
  Moon,
  X,
  Mail,
  MapPin,
  Smartphone,
  Tv,
  Tablet,
  Car,
  BookOpen,
  Camera
} from 'lucide-react';
import { wooCommerceService, getWCCredentials, saveWCCredentials, deleteWCCredentials, compareProductsByRecency } from './services/woocommerce';

import appleLogo from './assets/marque/apple.png';
import djiLogo from './assets/marque/dji.jpg';
import howoLogo from './assets/marque/howo.avif';
import mercedesLogo from './assets/marque/mercedes.png';
import subariLogo from './assets/marque/subari.jpg';
import toyotaLogo from './assets/marque/toyota.webp';
import audiLogo from './assets/marque/audi.svg';
import bmwLogo from './assets/marque/bmw.svg';
import fordLogo from './assets/marque/ford.svg';
import hummerLogo from './assets/marque/hummer.svg';
import hyundaiLogo from './assets/marque/hyundai.svg';
import landroverLogo from './assets/marque/landrover.svg';
import mazdaLogo from './assets/marque/mazda.svg';
import mitsubishiLogo from './assets/marque/mitsubishi.svg';
import nissanLogo from './assets/marque/nissan.svg';
import suzukiLogo from './assets/marque/suzuki.svg';

// Top Brands configuration list
const TOP_BRANDS = [
  { name: 'Apple', logo: appleLogo },
  { name: 'DJI', logo: djiLogo },
  { name: 'HOWO', logo: howoLogo },
  { name: 'Mercedes-Benz', logo: mercedesLogo, query: 'Mercedes' },
  { name: 'Subaru', logo: subariLogo, query: 'Subari' },
  { name: 'Toyota', logo: toyotaLogo },
  { name: 'Audi', logo: audiLogo },
  { name: 'BMW', logo: bmwLogo },
  { name: 'Ford', logo: fordLogo },
  { name: 'Hummer', logo: hummerLogo },
  { name: 'Hyundai', logo: hyundaiLogo },
  { name: 'Land Rover', logo: landroverLogo },
  { name: 'Mazda', logo: mazdaLogo },
  { name: 'Mitsubishi', logo: mitsubishiLogo },
  { name: 'Nissan', logo: nissanLogo },
  { name: 'Suzuki', logo: suzukiLogo },
];

// Helper to check if a product is a vehicle
const isVehicleProduct = (p) => {
  if (!p) return false;
  const inCategory = p.categories?.some(cat => {
    const name = cat.name?.toLowerCase() || '';
    const slug = cat.slug?.toLowerCase() || '';
    return name.includes('vehicule') || name.includes('véhicule') || name.includes('voiture') || name.includes('moto') || name.includes('engin') || name.includes('auto') ||
      slug.includes('vehicule') || slug.includes('véhicule') || slug.includes('voiture') || slug.includes('moto') || slug.includes('engin') || slug.includes('auto');
  });
  const byBrand = ['mercedes', 'toyota', 'subaru', 'subari', 'howo', 'audi', 'bmw', 'ford', 'hummer', 'hyundai', 'land rover', 'mazda', 'mitsubishi', 'nissan', 'suzuki'].some(brand =>
    p.brand?.toLowerCase().includes(brand) ||
    p.name?.toLowerCase().includes(brand)
  );
  return !!(inCategory || byBrand);
};

/** Sections catégorie affichées sur l'accueil (masquées si aucun produit). */
const HOME_CATEGORY_SECTIONS = [
  {
    id: 'accessoires',
    title: 'Accessoires',
    Icon: Sparkles,
    match: (text) =>
      text.includes('accessoire') || text.includes('accessory'),
  },
  {
    id: 'audios',
    title: 'Audios',
    Icon: Headphones,
    match: (text) =>
      text.includes('audio') ||
      text.includes('casque') ||
      text.includes('écouteur') ||
      text.includes('ecouteur') ||
      text.includes('headphone') ||
      text.includes('earbud'),
  },
  {
    id: 'cameras',
    title: 'Cameras',
    Icon: Camera,
    match: (text) =>
      text.includes('camera') ||
      text.includes('caméra') ||
      text.includes('photo') ||
      text.includes('vidéo') ||
      text.includes('video') ||
      text.includes('optique'),
  },
  {
    id: 'ordinateurs-telephone',
    title: 'Ordinateurs & téléphone',
    Icon: Laptop,
    match: (text) =>
      text.includes('ordinateur') ||
      text.includes('laptop') ||
      text.includes('computer') ||
      /\bpc\b/.test(text) ||
      text.includes('téléphone') ||
      text.includes('telephone') ||
      text.includes('smartphone') ||
      text.includes('iphone') ||
      text.includes('android'),
  },
  {
    id: 'tablette-tv',
    title: 'Tablette & TV',
    Icon: Tv,
    match: (text) => {
      if (text.includes('tablette') || text.includes('tablet')) return true;
      if (text.includes('television') || text.includes('télévision')) return true;
      if (/\btv\b/.test(text)) return true;
      if (text.includes('télé') && !text.includes('téléphone') && !text.includes('telephone')) return true;
      return false;
    },
  },
];

const productMatchesHomeSection = (product, section) =>
  product.categories?.some((cat) => {
    const text = `${cat.name || ''} ${cat.slug || ''}`.toLowerCase();
    return section.match(text);
  });

// Category Icon Helper Mapping
const CategoryIcon = ({ name, className, ...props }) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('phone') || normalized.includes('téléphone') || normalized.includes('smartphone')) return <Smartphone className={className} {...props} />;
  if (normalized.includes('tv') || normalized.includes('télé') || normalized.includes('television')) return <Tv className={className} {...props} />;
  if (normalized.includes('pc') || normalized.includes('ordinateur') || normalized.includes('laptop')) return <Laptop className={className} {...props} />;
  if (normalized.includes('tablet') || normalized.includes('tablette') || normalized.includes('comprimé') || normalized.includes('comprimes')) return <Tablet className={className} {...props} />;
  if (normalized.includes('sneaker') || normalized.includes('chaussure')) return <Footprints className={className} {...props} />;
  if (normalized.includes('montre') || normalized.includes('watch')) return <Clock className={className} {...props} />;
  if (normalized.includes('audio') || normalized.includes('casque') || normalized.includes('écouteur')) return <Headphones className={className} {...props} />;
  if (normalized.includes('accessoire') || normalized.includes('sac')) return <Sparkles className={className} {...props} />;
  if (normalized.includes('camera') || normalized.includes('caméra') || normalized.includes('photo') || normalized.includes('vidéo') || normalized.includes('optique')) return <Camera className={className} {...props} />;
  if (normalized.includes('vehicule') || normalized.includes('véhicule') || normalized.includes('voiture') || normalized.includes('moto') || normalized.includes('engin') || normalized.includes('auto')) return <Car className={className} {...props} />;
  if (normalized.includes('non classé') || normalized.includes('uncategorized') || normalized.includes('divers')) return <Tag className={className} {...props} />;
  return <Grid className={className} {...props} />;
};

// Facebook Logo SVG Component
const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
);

// Instagram Logo SVG Component
const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// WhatsApp Logo SVG Component
const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964C16.59 1.93 14.122.907 11.492.907c-5.44 0-9.866 4.425-9.87 9.87-.001 1.716.452 3.39 1.31 4.869l-.999 3.65 3.734-.977zm11.418-7.316c-.3-.15-1.772-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.951 1.174-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.77-1.665-2.07-.175-.3-.019-.463.13-.612.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.633-.927-2.233-.24-.58-.48-.5-.677-.51-.19-.01-.408-.01-.626-.01-.217 0-.57.082-.87.408-.3.327-1.15 1.12-1.15 2.729s1.17 3.17 1.33 3.39c.16.22 2.3 3.51 5.57 4.92.78.33 1.39.53 1.86.68.78.25 1.49.21 2.05.13.62-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.175-1.42-.075-.12-.275-.2-.575-.35z" />
  </svg>
);

function App() {
  // Onboarding Modal state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('shopushindi_onboarding_completed') !== 'true';
  });
  const [onboardingStep, setOnboardingStep] = useState(1);

  // Selected Language state ('fr' or 'en')
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('shopushindi_language') || 'fr';
  });

  // Language Dropdown open state & refs
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const desktopLangDropdownRef = useRef(null);
  const mobileLangDropdownRef = useRef(null);

  // Helper to change language programmatically via Google Translate widget
  const changeLanguage = (langCode) => {
    localStorage.setItem('shopushindi_language', langCode);
    setSelectedLang(langCode);
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // Fallback cookies
      document.cookie = `googtrans=/fr/${langCode}; path=/;`;
      document.cookie = `googtrans=/fr/${langCode}; path=/; domain=.localhost`;
    }
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!isLangDropdownOpen) return;
      const insideDesktop = desktopLangDropdownRef.current && desktopLangDropdownRef.current.contains(e.target);
      const insideMobile = mobileLangDropdownRef.current && mobileLangDropdownRef.current.contains(e.target);
      if (!insideDesktop && !insideMobile) {
        setIsLangDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isLangDropdownOpen]);

  // Load language preference on startup
  useEffect(() => {
    const savedLang = localStorage.getItem('shopushindi_language');
    if (savedLang && savedLang !== 'fr') {
      const interval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = savedLang;
          select.dispatchEvent(new Event('change'));
          clearInterval(interval);
        }
      }, 300);
      setTimeout(() => clearInterval(interval), 6000);
    }
  }, []);

  // Theme State (Dark or Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shopushindi_theme') || 'light';
  });

  // Search input refs
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shopushindi_theme', theme);
  }, [theme]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'categories', 'cart', 'favorites', 'settings'
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [expandedHomeSections, setExpandedHomeSections] = useState({});
  const [showAllGridProducts, setShowAllGridProducts] = useState(false);
  const [showDevMode, setShowDevMode] = useState(() => {
    return localStorage.getItem('shopushindi_dev_mode') === 'true';
  });

  // Category dropdown state & ref
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const handleLogoClick = (e) => {
    if (e) e.stopPropagation();
    window.location.href = window.location.origin + window.location.pathname;
  };

  // Products & Categories States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [homeProductTab, setHomeProductTab] = useState('arrivage'); // 'arrivage', 'populaire', 'recent'

  // Global Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopushindi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Global Favorites State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('shopushindi_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('shopushindi_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync Recently Viewed on product details navigation
  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((p) => p.id !== selectedProduct.id);
        const updated = [selectedProduct, ...filtered].slice(0, 10);
        localStorage.setItem('shopushindi_recently_viewed', JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedProduct]);

  // WooCommerce Configuration State
  const [credentials, setCredentials] = useState(() => localStorage.getItem('ShopUshindi_wc_credentials') ? JSON.parse(localStorage.getItem('ShopUshindi_wc_credentials')) : null);
  const [wcUrl, setWcUrl] = useState(credentials?.url || '');
  const [wcKey, setWcKey] = useState(credentials?.consumerKey || '');
  const [wcSecret, setWcSecret] = useState(credentials?.consumerSecret || '');
  const [connectionStatus, setConnectionStatus] = useState(null); // 'success', 'error', 'testing', null

  // Checkout flow state
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'billing', 'complete'
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    whatsappNumber: '+243896666630', // Default merchant whatsapp number
    email: '',
    promoCode: ''
  });
  const [orderSummary, setOrderSummary] = useState(null);

  // PWA Offline Monitoring
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Toast System
  const [toasts, setToasts] = useState([]);

  // Detail view images index slider state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Cart & Pricing calculations
  const subTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = billingDetails.promoCode.toLowerCase() === 'ushindi10' ? subTotal * 0.1 : 0;
  const total = subTotal - discount;
  const hasFreeItem = cart.some(item => Number(item.product.price) === 0);

  // Auto debouncer for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search popup state for icon-triggered search field
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchPopupRef = useRef(null);

  // Focus popup input when opened and handle outside clicks
  useEffect(() => {
    if (showSearchPopup) {
      const input = document.getElementById('search-popup-input');
      input?.focus();
    }

    const onDocClick = (e) => {
      if (!showSearchPopup) return;
      if (searchPopupRef.current && !searchPopupRef.current.contains(e.target)) {
        setShowSearchPopup(false);
      }
    };

    window.addEventListener('click', onDocClick);
    return () => window.removeEventListener('click', onDocClick);
  }, [showSearchPopup]);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!isCategoryDropdownOpen) return;
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isCategoryDropdownOpen]);

  // Keyboard shortcut: focus search with Ctrl/Cmd+K or '/'
  useEffect(() => {
    const onKey = (e) => {
      const active = document.activeElement;
      // ignore when typing in inputs or contenteditable
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('search-popup-input') || document.getElementById('search-input-desktop') || document.getElementById('search-input-mobile');
        // If popup input exists, open popup then focus
        if (document.getElementById('search-popup-input')) {
          setShowSearchPopup(true);
        }
        el?.focus();
      }

      if (e.key === '/') {
        e.preventDefault();
        const el = document.getElementById('search-popup-input') || document.getElementById('search-input-desktop') || document.getElementById('search-input-mobile');
        if (document.getElementById('search-popup-input')) {
          setShowSearchPopup(true);
        }
        el?.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('shopushindi_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Favorites to LocalStorage
  useEffect(() => {
    localStorage.setItem('shopushindi_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Listen to network status
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      showToast('Connexion rétablie ! Application en ligne.', 'success');
    };
    const goOffline = () => {
      setIsOnline(false);
      showToast('Vous êtes hors-ligne. Mode consultation activé.', 'warning');
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Reset "voir plus" grille quand les filtres changent
  useEffect(() => {
    setShowAllGridProducts(false);
  }, [selectedCategory, debouncedSearch, homeProductTab, sortBy]);

  // Fetch products and categories when filter params change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          wooCommerceService.getProducts({
            category: selectedCategory,
            search: debouncedSearch,
            sort: sortBy,
            perPage: 100,
            fetchAll: true
          }),
          wooCommerceService.getCategories()
        ]);

        const reorderedCategories = (() => {
          const allCategory = fetchedCategories.find(c => c.id === 'all');
          const otherCategories = fetchedCategories.filter(c => c.id !== 'all');

          const vehicleIndex = otherCategories.findIndex(c =>
            c.name.toLowerCase().includes('vehicule') ||
            c.name.toLowerCase().includes('véhicule') ||
            c.name.toLowerCase().includes('voiture')
          );

          if (vehicleIndex > -1) {
            const vehicleCat = otherCategories[vehicleIndex];
            otherCategories.splice(vehicleIndex, 1);
            otherCategories.unshift(vehicleCat);
          }

          return allCategory ? [allCategory, ...otherCategories] : otherCategories;
        })();

        setProducts(fetchedProducts);
        setCategories(reorderedCategories);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Impossible de charger les données. Veuillez vérifier votre connexion ou vos identifiants.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, debouncedSearch, sortBy, credentials]);

  // Synchronize URL query parameter with selectedProduct state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedProduct) {
      if (params.get('product') !== selectedProduct.id.toString()) {
        params.set('product', selectedProduct.id.toString());
        window.history.pushState(null, '', `?${params.toString()}`);
      }
    } else {
      if (params.has('product')) {
        params.delete('product');
        const search = params.toString();
        const newUrl = search ? `?${search}` : window.location.pathname;
        window.history.pushState(null, '', newUrl);
      }
    }
  }, [selectedProduct]);

  // Initialize selected product from URL query param once products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId) {
        const found = products.find(p => p.id.toString() === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentTab('detail');
        }
      }
    }
  }, [products]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId && products.length > 0) {
        const found = products.find(p => p.id.toString() === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentTab('detail');
          window.scrollTo({ top: 0 });
          return;
        }
      }
      setSelectedProduct(null);
      setCurrentTab('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);



  // Toast Toast Handler
  const showToast = (message, type = 'success', product = null) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, product }]);
    const duration = type === 'cart-success' ? 4000 : 3000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        showToast(`Article mis à jour dans le panier`, 'cart-success', product);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showToast(`Article ajouté au panier`, 'cart-success', product);
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId, change) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId, name) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(`${name} retiré du panier`, 'info');
  };

  // Favorite operations
  const toggleFavorite = (product) => {
    const isFav = favorites.some((fav) => fav.id === product.id);
    if (isFav) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
      showToast(`${product.name} retiré des favoris`, 'info');
    } else {
      setFavorites((prev) => [...prev, product]);
      showToast(`${product.name} ajouté aux favoris`, 'success');
    }
  };

  // Test and Connect WooCommerce credentials
  const handleConnectWooCommerce = async (e) => {
    e.preventDefault();
    setConnectionStatus('testing');

    if (!wcUrl || !wcKey || !wcSecret) {
      setConnectionStatus('error');
      showToast('Veuillez remplir tous les champs.', 'danger');
      return;
    }

    const works = await wooCommerceService.testConnection(wcUrl, wcKey, wcSecret);

    if (works) {
      const newCreds = { url: wcUrl, consumerKey: wcKey, consumerSecret: wcSecret };
      saveWCCredentials(newCreds);
      setCredentials(newCreds);
      setConnectionStatus('success');
      showToast('WooCommerce connecté avec succès !', 'success');
      setCurrentTab('home');
    } else {
      setConnectionStatus('error');
      showToast('Échec de connexion. Vérifiez l\'URL et les clés API.', 'danger');
    }
  };

  // Disconnect WooCommerce / Switch back to default store
  const handleDisconnectWC = () => {
    deleteWCCredentials();
    setCredentials(null);
    setWcUrl('');
    setWcKey('');
    setWcSecret('');
    setConnectionStatus(null);
    showToast('Identifiants personnalisés réinitialisés. Boutique par défaut active.', 'info');
    setCurrentTab('home');
  };

  // Order Placement handling (WhatsApp Direct Checkout)
  const handlePlaceOrder = async () => {
    const subTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = billingDetails.promoCode.toLowerCase() === 'ushindi10' ? subTotal * 0.1 : 0;
    const total = subTotal - discount;
    const hasFreeItem = cart.some(item => Number(item.product.price) === 0);

    setLoading(true);

    try {
      // WhatsApp checkout flow message formatting
      let messageText = `*NOUVELLE COMMANDE - SHOPUSHINDI*\n\n`;
      messageText += `*Articles commandés :*\n`;

      cart.forEach((item, index) => {
        const itemPrice = Number(item.product.price) === 0
          ? (isVehicleProduct(item.product) ? "Prix disponible sur demande" : "Sur demande")
          : `$${item.product.price} / u`;
        messageText += `${index + 1}. *${item.product.name}* (x${item.quantity}) - ${itemPrice}\n`;
      });

      messageText += `\n*Sous-total :* ${hasFreeItem ? "Sur demande" : `$${subTotal.toFixed(2)}`}\n`;
      if (discount > 0) messageText += `*Code Promo (-10%) :* -$${discount.toFixed(2)}\n`;
      messageText += `*Total à payer :* *${hasFreeItem ? "Sur demande" : `$${total.toFixed(2)}`}*\n\n`;
      messageText += `Je souhaite finaliser ma commande avec vous sur WhatsApp.`;

      const encodedMsg = encodeURIComponent(messageText);
      // Clean up merchant whatsapp number formatting
      const cleanPhone = billingDetails.whatsappNumber.replace('+', '').replace(/\s/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

      // Set order summary local display
      setOrderSummary({
        id: Math.floor(Math.random() * 900000) + 100000,
        total: total,
        method: 'WhatsApp',
        date: new Date().toLocaleDateString()
      });

      // Trigger Redirect
      window.open(whatsappUrl, '_blank');
      setCart([]);
      setCheckoutStep('complete');
      showToast('Redirection vers WhatsApp...', 'success');
    } catch (e) {
      showToast('Une erreur est survenue lors de la commande.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Nav actions
  const navigateToProduct = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setDetailQty(1);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrandClick = (brand) => {
    const query = brand.query || brand.name;
    setSearchQuery(query);
    const productsSection = document.getElementById('products-section');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Compute displayed products based on selected home product tab
  const displayedProducts = (() => {
    let list = [];
    if (homeProductTab === 'recent') {
      list = recentlyViewed;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.short_description && p.short_description.toLowerCase().includes(q))
        );
      }
    } else if (homeProductTab === 'populaire') {
      list = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews_count || 0) - (a.reviews_count || 0));
    } else {
      // Default: 'arrivage' (new arrivals), newest published first
      list = [...products].sort(compareProductsByRecency);
    }

    // Filter by selected category locally as well for absolute precision
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p =>
        p.categories?.some(cat =>
          String(cat.id) === String(selectedCategory) ||
          cat.slug === selectedCategory ||
          cat.name?.toLowerCase() === String(selectedCategory).toLowerCase()
        )
      );
    }

    // Filter out vehicles for the homepage grid only when browsing all categories and when non-vehicle products exist
    const hasNonVehicles = list.some((p) => !isVehicleProduct(p));

    const filtered = list.filter((p) => {
      if (selectedCategory !== 'all' || !hasNonVehicles) return true;
      return !isVehicleProduct(p);
    });

    // Limit to the 5 most recently added products for the arrivals tab (only when browsing all categories)
    if (homeProductTab === 'arrivage' && selectedCategory === 'all') {
      return filtered.slice(0, 5);
    }
    return filtered;
  })();

  // Grille principale : Si une catégorie spécifique est sélectionnée, afficher tous ses produits
  const visibleGridProducts = (() => {
    if (selectedCategory !== 'all') {
      return displayedProducts;
    }
    if (homeProductTab === 'arrivage') {
      return displayedProducts;
    }
    if (showAllGridProducts) return displayedProducts;
    return displayedProducts.slice(0, 10);
  })();

  const canExpandGrid =
    selectedCategory === 'all' &&
    homeProductTab !== 'arrivage' &&
    displayedProducts.length > 10;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global SVG Gradients */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="cart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>

      {/* Onboarding Language & Theme Choice Modal */}
      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-card">
            {/* Logo brand */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-48 overflow-hidden flex items-center justify-center p-0">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ShopUshindi" className="w-full h-full object-contain" />
              </div>
            </div>

            <h3 className={`font-bold text-lg mb-3 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
              {selectedLang === 'fr' ? 'Bienvenue sur ShopUshindi' : 'Welcome to ShopUshindi'}
            </h3>
            <p className={`text-xs mb-6 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {selectedLang === 'fr'
                ? 'Veuillez configurer vos préférences pour commencer l\'expérience de shopping haut de gamme.'
                : 'Please configure your preferences to begin the premium shopping experience.'}
            </p>

            {/* Language Step */}
            {onboardingStep === 1 && (
              <div className="text-left space-y-2 mb-6">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedLang === 'fr' ? '1. Choisissez la langue' : '1. Choose language'}
                </label>
                <div className="onboarding-grid">
                  <button
                    type="button"
                    onClick={() => { changeLanguage('fr'); setOnboardingStep(2); }}
                    className={`onboarding-choice-btn ${selectedLang === 'fr' ? 'active' : ''}`}
                  >
                    <span className="onboarding-flag">🇫🇷</span>
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Français</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { changeLanguage('en'); setOnboardingStep(2); }}
                    className={`onboarding-choice-btn ${selectedLang === 'en' ? 'active' : ''}`}
                  >
                    <span className="onboarding-flag">🇬🇧</span>
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>English</span>
                  </button>
                </div>
              </div>
            )}

            {/* Theme Step */}
            {onboardingStep === 2 && (
              <div className="text-left space-y-2 mb-8">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedLang === 'fr' ? '2. Choisissez le thème' : '2. Choose theme'}
                </label>
                <div className="onboarding-grid">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      localStorage.setItem('shopushindi_onboarding_completed', 'true');
                      setShowOnboarding(false);
                    }}
                    className={`onboarding-choice-btn ${theme === 'light' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-sun text-2xl text-amber-500"></i>
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedLang === 'fr' ? 'Clair' : 'Light'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      localStorage.setItem('shopushindi_onboarding_completed', 'true');
                      setShowOnboarding(false);
                    }}
                    className={`onboarding-choice-btn ${theme === 'dark' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-moon text-2xl text-indigo-400"></i>
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedLang === 'fr' ? 'Sombre' : 'Dark'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background radial effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-950/20 blur-[120px] pulse-bg" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/25 blur-[120px] pulse-bg" />
      </div>

      {/* (Removed global header video wrapper — video will be placed inside the hero card) */}

      {/* Top Banner Warning Offline & WooCommerce mode info */}
      <div className="relative z-50">
        {!isOnline && (
          <div className="bg-red-500/90 backdrop-blur text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2">
            <WifiOff size={14} /> Mode hors-ligne actif. Consultation des pages mises en cache.
          </div>
        )}
        {wooCommerceService.isDemoMode() && currentTab === 'home' && (
          <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20 backdrop-blur-md border-b border-emerald-500/20 py-2 px-4 text-center text-xs font-medium text-emerald-400 flex items-center justify-center gap-2">
            <Info size={14} /> Mode Démo actif.
            {showDevMode && (
              <button
                onClick={() => setCurrentTab('settings')}
                className="underline text-white font-semibold hover:text-emerald-300 ml-1 transition"
              >
                Gérer l'API WooCommerce →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Top Sticky Bar */}
      {windowWidth < 1024 && (
        <header className="mobile-header sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="self-center text-slate-200 hover:text-emerald-400 active:scale-90 transition-all duration-200"
              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Ouvrir le menu"
            >
              <Menu size={28} strokeWidth={2.2} />
            </button>
            <div
              onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentTab('home'); setSelectedProduct(null); } }}
              role="button"
              tabIndex={0}
              aria-label="Aller à l'accueil"
              className="flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <button onClick={(e) => { e.stopPropagation(); handleLogoClick(e); }} aria-label="Logo — activer le mode développeur" className="h-10 w-28 overflow-hidden flex items-center justify-center bg-transparent border-none p-0">
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ShopUshindi" className="w-full h-full object-contain object-center" />
              </button>
              <span className="text-emerald-500 font-bold text-[7px] tracking-wide -mt-1">La victoire de la qualité et du service!</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Button & Dropdown */}
            <div className="lang-dropdown-wrapper" ref={mobileLangDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-slate-200 hover:text-emerald-400 active:scale-90 transition-all duration-200"
                style={{ background: 'none', border: 'none', padding: '4px', lineHeight: 0, cursor: 'pointer' }}
                aria-label="Changer de langue / Change language"
                title="Langue / Language"
              >
                <i className="fa-solid fa-globe" style={{ fontSize: '20px' }}></i>
              </button>

              {isLangDropdownOpen && (
                <div className="lang-dropdown-menu mt-1 right-0">
                  <button
                    onClick={() => { changeLanguage('fr'); setIsLangDropdownOpen(false); }}
                    className={`lang-dropdown-item ${selectedLang === 'fr' ? 'active' : ''}`}
                  >
                    <span className="text-base">🇫🇷</span>
                    <span>Français</span>
                  </button>
                  <button
                    onClick={() => { changeLanguage('en'); setIsLangDropdownOpen(false); }}
                    className={`lang-dropdown-item ${selectedLang === 'en' ? 'active' : ''}`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-slate-200 hover:text-emerald-400 active:scale-90 transition-all duration-200"
              style={{ background: 'none', border: 'none', padding: '4px', lineHeight: 0, cursor: 'pointer' }}
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={() => { setCurrentTab('cart'); setSelectedProduct(null); }}
              className="relative text-slate-200 hover:text-emerald-400 active:scale-90 transition-all duration-200"
              style={{ background: 'none', border: 'none', padding: '4px', lineHeight: 0, cursor: 'pointer' }}
              aria-label="Ouvrir le panier"
            >
              <ShoppingCart size={22} stroke="url(#cart-gradient)" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Fullscreen Mobile Menu Overlay */}
      {isMobileMenuOpen && windowWidth < 1024 && (
        <div className={`fixed inset-0 flex flex-col mobile-menu-overlay ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
          {/* Header */}
          <div className={`mobile-menu-header ${theme === 'light' ? 'border-slate-100' : 'border-slate-800'}`}>
            <div className="h-10 w-32 overflow-hidden flex items-center justify-start">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ShopUshindi" className="w-full h-full object-contain object-left" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-menu-close-btn ${theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}`}
              aria-label="Fermer le menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="mobile-menu-content">
            <button
              onClick={() => handleLogoClick()}
              className={`mobile-menu-btn ${currentTab === 'home' ? 'active' : ''}`}
            >
              <div className="mobile-menu-btn-inner">
                <Home size={22} />
                <span>Accueil</span>
              </div>
            </button>

            <button
              onClick={() => { setCurrentTab('categories'); setSelectedProduct(null); setIsMobileMenuOpen(false); }}
              className={`mobile-menu-btn ${currentTab === 'categories' ? 'active' : ''}`}
            >
              <div className="mobile-menu-btn-inner">
                <Grid size={22} />
                <span>Catégories</span>
              </div>
            </button>

            <button
              onClick={() => { setCurrentTab('search'); setSelectedProduct(null); setIsMobileMenuOpen(false); }}
              className={`mobile-menu-btn ${currentTab === 'search' ? 'active' : ''}`}
            >
              <div className="mobile-menu-btn-inner">
                <Search size={22} />
                <span>Recherche</span>
              </div>
            </button>

            <button
              onClick={() => { setCurrentTab('favorites'); setSelectedProduct(null); setIsMobileMenuOpen(false); }}
              className={`mobile-menu-btn ${currentTab === 'favorites' ? 'active' : ''}`}
            >
              <div className="mobile-menu-btn-inner">
                <Heart size={22} />
                <span>Favoris</span>
              </div>
              {favorites.length > 0 && (
                <span className="mobile-menu-badge badge-rose">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentTab('cart'); setSelectedProduct(null); setIsMobileMenuOpen(false); }}
              className={`mobile-menu-btn ${currentTab === 'cart' ? 'active' : ''}`}
            >
              <div className="mobile-menu-btn-inner">
                <ShoppingCart size={22} />
                <span>Panier</span>
              </div>
              {cart.length > 0 && (
                <span className="mobile-menu-badge badge-emerald">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Social Media */}
            <div className="mobile-menu-social">
              <p className="mobile-menu-social-title">Nous suivre</p>
              <div className="mobile-menu-social-icons">
                <a
                  href="https://www.facebook.com/share/19eGMW818A/"
                  target="_blank"
                  rel="noreferrer"
                  className="mobile-menu-social-link"
                  aria-label="Suivez-nous sur Facebook"
                  title="Facebook"
                >
                  <i className="fa-brands fa-facebook-f text-lg" />
                </a>
                <a
                  href="https://www.instagram.com/ushindi_shopping?igsh=cGM4eTZ6dWJnNnJ2"
                  target="_blank"
                  rel="noreferrer"
                  className="mobile-menu-social-link"
                  aria-label="Suivez-nous sur Instagram"
                  title="Instagram"
                >
                  <i className="fa-brands fa-instagram text-lg" />
                </a>
                <a
                  href="https://wa.me/243896666630"
                  target="_blank"
                  rel="noreferrer"
                  className="mobile-menu-social-link"
                  aria-label="Contactez-nous sur WhatsApp"
                  title="WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp text-lg" />
                </a>
                <a
                  href="https://wa.me/message/Q67LCSEWCQJWF1"
                  target="_blank"
                  rel="noreferrer"
                  className="mobile-menu-social-link"
                  aria-label="Consultez notre catalogue"
                  title="Catalogue"
                >
                  <i className="fa-solid fa-book-open text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Premium Desktop Header */}
      {windowWidth >= 1024 && (
        <header className="desktop-header sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-5 md:py-6">
          <div className="container flex items-center justify-between gap-4">
            <div className="flex items-center gap-12 lg:gap-20">
              {/* Logo brand */}
              <div
                onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentTab('home'); setSelectedProduct(null); } }}
                role="button"
                tabIndex={0}
                aria-label="Aller à l'accueil"
                className="flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <button onClick={(e) => { e.stopPropagation(); handleLogoClick(e); }} aria-label="Logo — activer le mode développeur" className="h-14 w-48 overflow-hidden flex items-center justify-center transition duration-300 group-hover:scale-105 bg-transparent border-none p-0">
                  <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ShopUshindi" className="w-full h-full object-contain object-center" />
                </button>
                <span className="text-emerald-500 font-bold text-[10px] tracking-wide mt-1">La victoire de la qualité et du service!</span>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center gap-6 text-sm font-semibold">
                <button
                  onClick={() => handleLogoClick()}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${currentTab === 'home'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Accueil
                </button>
                <button
                  onClick={() => { setCurrentTab('categories'); setSelectedProduct(null); }}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${currentTab === 'categories'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Catégories
                </button>
                <button
                  onClick={() => { setCurrentTab('favorites'); setSelectedProduct(null); }}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 relative ${currentTab === 'favorites'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Favoris
                  {favorites.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-md">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Cart Icon & CTA */}
            <div className="flex items-center gap-3">
              {/* Vertical divider */}
              <div className="h-8 w-px bg-white/10 mx-1" />

              {/* Social Media Links — Distinct & Separated */}
              <div className="flex items-center gap-3 mx-4">
                <a
                  href="https://www.facebook.com/share/19eGMW818A/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-blue-400 hover:border-blue-400/30 transition duration-300 shadow-sm hover:-translate-y-1"
                  title="Facebook"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <i className="fa-brands fa-facebook-f text-sm"></i>
                </a>
                <a
                  href="https://www.instagram.com/ushindi_shopping?igsh=cGM4eTZ6dWJnNnJ2"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-pink-400 hover:border-pink-400/30 transition duration-300 shadow-sm hover:-translate-y-1"
                  title="Instagram"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <i className="fa-brands fa-instagram text-sm"></i>
                </a>
                <a
                  href="https://wa.me/243896666630"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-green-400 hover:border-green-400/30 transition duration-300 shadow-sm hover:-translate-y-1"
                  title="WhatsApp"
                  aria-label="Contactez-nous sur WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                </a>
                <a
                  href="https://wa.me/message/Q67LCSEWCQJWF1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30 transition duration-300 shadow-sm hover:-translate-y-1"
                  title="Catalogue"
                  aria-label="Consultez notre catalogue"
                >
                  <i className="fa-solid fa-book-open text-sm"></i>
                </a>
              </div>

              {/* Vertical divider */}
              <div className="h-8 w-px bg-white/10 mx-1" />

              {/* Language Selector Button & Dropdown */}
              <div className="lang-dropdown-wrapper" ref={desktopLangDropdownRef}>
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-white transition duration-300 shadow-md"
                  aria-label="Changer de langue / Change language"
                  title="Langue / Language"
                >
                  <i className="fa-solid fa-globe text-xl"></i>
                </button>

                {isLangDropdownOpen && (
                  <div className="lang-dropdown-menu mt-2 right-0">
                    <button
                      onClick={() => { changeLanguage('fr'); setIsLangDropdownOpen(false); }}
                      className={`lang-dropdown-item ${selectedLang === 'fr' ? 'active' : ''}`}
                    >
                      <span className="text-base">🇫🇷</span>
                      <span>Français</span>
                    </button>
                    <button
                      onClick={() => { changeLanguage('en'); setIsLangDropdownOpen(false); }}
                      className={`lang-dropdown-item ${selectedLang === 'en' ? 'active' : ''}`}
                    >
                      <span className="text-base">🇬🇧</span>
                      <span>English</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-white transition duration-300 shadow-md"
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? <i className="fa-solid fa-sun text-xl"></i> : <i className="fa-solid fa-moon text-xl"></i>}
              </button>

              <button
                onClick={() => { setCurrentTab('cart'); setSelectedProduct(null); }}
                className="relative w-11 h-11 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-white transition duration-300 shadow-md"
                aria-label="Ouvrir le panier"
              >
                <i className="fa-solid fa-shopping-cart text-xl text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-purple-600"></i>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="container">

          {/* TOAST SYSTEM POPUP (STANDARD) */}
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2.5 pointer-events-none w-full max-w-[90%] sm:max-w-sm">
            {toasts.filter(t => t.type !== 'cart-success').map((toast) => (
              <div
                key={toast.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm shadow-2xl transition duration-300 pointer-events-auto animate-fade-in ${toast.type === 'success' ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-400' :
                  toast.type === 'warning' ? 'bg-slate-900/95 border-amber-500/30 text-amber-400' :
                    toast.type === 'info' ? 'bg-slate-900/95 border-blue-500/30 text-blue-400' :
                      'bg-slate-900/95 border-red-500/30 text-red-400'
                  }`}
              >
                {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span className="font-medium text-slate-200">{toast.message}</span>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="ml-2 text-slate-500 hover:text-slate-300 transition p-0.5 rounded"
                  aria-label="Fermer"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* CART SUCCESS CENTERED MODAL */}
          {toasts.filter(t => t.type === 'cart-success').map((toast) => {
            if (!toast.product) return null;
            const isFree = Number(toast.product.price) === 0 || !toast.product.price;
            return (
              <div
                key={toast.id}
                className="cart-modal-backdrop animate-modal-backdrop"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              >
                <div
                  className="cart-modal-card animate-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decorative Glow */}
                  <div className="cart-modal-glow" />

                  {/* Close button */}
                  <button
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="cart-modal-close"
                    aria-label="Fermer"
                  >
                    <X size={16} />
                  </button>

                  {/* Header */}
                  <div className="cart-modal-header">
                    <div className="cart-modal-icon-wrapper">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="cart-modal-title">Produit ajouté !</h3>
                    <p className="cart-modal-subtitle">Cet article a bien été ajouté à votre panier d'achat.</p>
                  </div>

                  {/* Product Preview Panel */}
                  <div className="cart-modal-preview">
                    <div className="cart-modal-img-container">
                      <img
                        src={toast.product.images?.[0]?.src}
                        alt={toast.product.name}
                        className="cart-modal-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>
                    <div className="cart-modal-info">
                      <h4 className="cart-modal-prod-name">{toast.product.name}</h4>
                      <p className="cart-modal-prod-qty">Quantité: 1</p>
                      <p className="cart-modal-prod-price">
                        {isFree ? (isVehicleProduct(toast.product) ? "Prix disponible sur demande" : "Sur demande") : `$${toast.product.price}`}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="cart-modal-actions">
                    <button
                      onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                      className="cart-modal-btn-continue"
                    >
                      Continuer mes achats
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('cart');
                        setSelectedProduct(null);
                        setToasts(prev => prev.filter(t => t.id !== toast.id));
                      }}
                      className="cart-modal-btn-view"
                    >
                      <ShoppingCart size={15} stroke="url(#cart-gradient)" />
                      Voir le panier
                    </button>
                  </div>

                  {/* Bottom animated progress indicator */}
                  <div className="cart-modal-progress animate-progress" />
                </div>
              </div>
            );
          })}


          {/* VIEW: HOME */}
          {currentTab === 'home' && (
            <div className="space-y-12 animate-fade-in">
              {/* Search block above categories */}
              <div className="block mobile-search-container mt-6 md:mt-8">
                <Search className="search-icon" size={18} />
                <input
                  id="search-input-mobile"
                  ref={mobileSearchRef}
                  type="text"
                  placeholder="Rechercher un produit, une marque, une catégorie..."
                  value={searchQuery}
                  onKeyDown={(e) => { if (e.key === 'Escape') { setSearchQuery(''); e.currentTarget.blur(); } }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    aria-label="Effacer la recherche"
                    onClick={() => { setSearchQuery(''); mobileSearchRef.current?.focus(); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {/* Categories Showcase Panel (replacing Hero Banner) */}
              {!searchQuery && (
                <div
                  className="w-full glass rounded-3xl px-6 md:px-10 shadow-lg mt-6 md:mt-8"
                  style={{ paddingTop: '80px', paddingBottom: '60px' }}
                >
                  {(() => {
                    const displayList = categories.filter(c => c.id !== 'all');
                    const visibleCategories = displayList;

                    const renderCustomIcon = (name) => {
                      const norm = name.toLowerCase();
                      const gradId = "cat-grad-" + norm.replace(/\s+/g, '-');
                      const gradientDef = (
                        <defs>
                          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#9333ea" />
                          </linearGradient>
                        </defs>
                      );
                      const className = "w-10 h-10 md:w-12 md:h-12";
                      if (norm.includes('smartphone')) {
                        return (
                          <svg className={className} viewBox="0 0 24 24" fill={`url(#${gradId})`}>
                            {gradientDef}
                            <rect x="5" y="2" width="14" height="20" rx="2.5" />
                            <rect x="10" y="19.5" width="4" height="1" rx="0.5" fill="white" />
                          </svg>
                        );
                      }
                      if (norm.includes('téléviseur') || norm.includes('tv')) {
                        return (
                          <svg className={className} viewBox="0 0 24 24" fill={`url(#${gradId})`}>
                            {gradientDef}
                            <rect x="2" y="6" width="20" height="14" rx="2" />
                            <path d="M7 2 L12 6 L17 2" stroke={`url(#${gradId})`} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                          </svg>
                        );
                      }
                      if (norm.includes('ordinateur')) {
                        return (
                          <svg className={className} viewBox="0 0 24 24" fill={`url(#${gradId})`}>
                            {gradientDef}
                            <rect x="3" y="4" width="18" height="13" rx="1" />
                            <path d="M1 18.5 C1 18.5 2 20.5 12 20.5 C22 20.5 23 18.5 23 18.5 Z" />
                          </svg>
                        );
                      }
                      if (norm.includes('comprimé') || norm.includes('tablet')) {
                        return (
                          <svg className={className} viewBox="0 0 24 24" fill={`url(#${gradId})`}>
                            {gradientDef}
                            <rect x="3.5" y="1.5" width="17" height="21" rx="2" />
                            <circle cx="12" cy="20" r="1.2" fill="white" />
                          </svg>
                        );
                      }
                      if (norm.includes('montre')) {
                        return (
                          <svg className={className} viewBox="0 0 24 24" fill={`url(#${gradId})`}>
                            {gradientDef}
                            <path d="M7.5 2 h9 v4 h-9 z" />
                            <path d="M7.5 18 h9 v4 h-9 z" />
                            <circle cx="12" cy="12" r="7.5" />
                            <path d="M12 8 v4.5 h3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        );
                      }
                      return (
                        <>
                          <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }} className="pointer-events-none">
                            {gradientDef}
                          </svg>
                          <CategoryIcon name={name} className="w-10 h-10 md:w-12 md:h-12" stroke={`url(#${gradId})`} strokeWidth={2} />
                        </>
                      );
                    };

                    return (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-6 justify-items-center pt-2 md:pt-4">
                          {visibleCategories.map((cat) => {
                            const handleCategoryClick = () => {
                              setSelectedCategory(cat.id);
                              setSearchQuery('');
                              setHomeProductTab('arrivage');
                              setShowAllGridProducts(true);
                              setTimeout(() => {
                                const el = document.getElementById('products-section');
                                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 100);
                            };

                            return (
                              <div
                                key={cat.id || cat.name}
                                onClick={handleCategoryClick}
                                className="flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-300 group hover:-translate-y-1 w-full max-w-[150px]"
                              >
                                <div className="mb-3 transition duration-300 group-hover:scale-105">
                                  {renderCustomIcon(cat.name)}
                                </div>
                                <span className="text-[13px] font-semibold text-black dark:text-white text-center mb-0.5 line-clamp-1">
                                  {cat.name}
                                </span>
                                <div className="flex items-center">
                                  <span className="text-[14px] font-bold text-black dark:text-slate-200">
                                    {cat.count}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Category Dropdown Selector */}
              <div id="categories-section" className="space-y-4 pt-16 md:pt-24">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="text-emerald-400" size={20} /> Parcourir les catégories
                  </h2>
                  <button
                    onClick={() => setCurrentTab('categories')}
                    className="text-xs text-emerald-400 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    Tout voir ({categories.filter(c => c.id !== 'all').length})
                  </button>
                </div>

                <div className="relative w-full md:w-80" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl glass border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 text-slate-900 dark:text-white font-bold transition duration-300 text-left shadow-lg bg-white dark:bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CategoryIcon
                          name={categories.find(c => c.id === selectedCategory)?.name || 'Toutes'}
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-500 block">Catégorie active</span>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {categories.find(c => c.id === selectedCategory)?.name || 'Toutes les catégories'}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-full rounded-2xl bg-white dark:bg-slate-950/95 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-2xl p-2 z-30 animate-fade-in space-y-1">
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSearchQuery('');
                              setIsCategoryDropdownOpen(false);
                              setSelectedProduct(null);
                              setCurrentTab('home');
                              setHomeProductTab('arrivage');
                              setShowAllGridProducts(false);
                              setTimeout(() => {
                                const el = document.getElementById('products-section');
                                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 100);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition duration-200 text-left group ${isActive
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-emerald-500 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                                }`}>
                                <CategoryIcon name={cat.name} className="w-4 h-4" />
                              </div>
                              <div>
                                <span className={`text-sm font-bold block ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-500 block">
                                  {cat.count} {cat.count > 1 ? 'articles' : 'article'}
                                </span>
                              </div>
                            </div>
                            {isActive && <CheckCircle2 size={16} className="text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Véhicules */}
              {(() => {
                if (selectedCategory !== 'all') return null;

                const vehicleProducts = products
                  .filter(p => isVehicleProduct(p))
                  .sort(compareProductsByRecency);

                if (vehicleProducts.length === 0) return null;

                const visibleVehicles = showAllVehicles
                  ? vehicleProducts
                  : vehicleProducts.slice(0, 10);

                return (
                  <div className="space-y-6 pt-16 md:pt-24 border-b border-white/5 pb-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                      <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                        <Car className="text-emerald-400 animate-pulse" size={20} />
                        Véhicules
                      </h2>
                      <span className="text-slate-500 text-xs">
                        {vehicleProducts.length} {vehicleProducts.length > 1 ? 'véhicules disponibles' : 'véhicule disponible'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 product-grid-container mt-6">
                      {visibleVehicles.map((product) => {
                        const isFav = favorites.some((fav) => fav.id === product.id);
                        const isFree = Number(product.price) === 0 || !product.price;
                        return (
                          <div
                            key={product.id}
                            className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                          >
                            <div className="product-image-container relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(product);
                                }}
                                className={`favorite-btn ${isFav ? 'active text-rose-500' : 'text-slate-400 hover:text-white'}`}
                              >
                                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                              </button>
                              {product.on_sale && <span className="sale-badge">Promo</span>}
                              <img
                                src={product.images[0]?.src}
                                alt={product.name}
                                onClick={() => navigateToProduct(product)}
                                className="product-image cursor-pointer"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                                }}
                              />
                              {product.brand && (
                                <span className="absolute bottom-3 left-3 text-[9px] bg-slate-950/70 backdrop-blur-md text-slate-300 font-bold px-2 py-1 rounded-md">
                                  {product.brand}
                                </span>
                              )}
                            </div>
                            <div className="product-card-details">
                              <div className="product-card-info">
                                <div className="product-card-rating">
                                  <Star className="rating-star fill-amber-400" size={10} />
                                  <span className="rating-value">{product.rating}</span>
                                </div>
                                <h3 onClick={() => navigateToProduct(product)} className="product-card-title">
                                  {product.name}
                                </h3>
                                <p className="product-card-description">
                                  {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                                </p>
                              </div>
                              <div className="card-footer">
                                <div className="card-price-group">
                                  <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                    {isFree ? (isVehicleProduct(product) ? "Prix disponible sur demande" : "Sur demande") : `$${product.price}`}
                                  </span>
                                  {product.on_sale && <span className="card-price-old">${product.regular_price}</span>}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, 1);
                                  }}
                                  className="card-buy-btn"
                                  aria-label="Ajouter au panier"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {vehicleProducts.length > 10 && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={() => setShowAllVehicles(!showAllVehicles)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02]"
                        >
                          <span>
                            {showAllVehicles
                              ? 'Voir moins'
                              : `Voir plus (${vehicleProducts.length - 10})`}
                          </span>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${showAllVehicles ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Filter Tabs Panel */}
              <div id="products-section" className="space-y-10 md:space-y-12 pt-20 md:pt-28">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-white/5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                      {selectedCategory !== 'all' ? (
                        <>
                          <Compass className="text-emerald-400 animate-pulse" size={20} />
                          {categories.find(c => String(c.id) === String(selectedCategory))?.name || 'Collection'}
                        </>
                      ) : (
                        <>
                          {homeProductTab === 'arrivage' && (
                            <>
                              <Sparkles className="text-emerald-400 animate-pulse" size={20} />
                              Arrivages
                            </>
                          )}
                          {homeProductTab === 'populaire' && (
                            <>
                              <Star className="text-amber-400 fill-amber-400/20" size={20} />
                              Articles Populaires
                            </>
                          )}
                          {homeProductTab === 'recent' && (
                            <>
                              <Clock className="text-purple-400" size={20} />
                              Récemment Vus
                            </>
                          )}
                        </>
                      )}
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                      {homeProductTab === 'recent'
                        ? `${displayedProducts.length} ${displayedProducts.length > 1 ? 'articles consultés' : 'article consulté'}`
                        : `${displayedProducts.length} ${displayedProducts.length > 1 ? 'articles disponibles' : 'article disponible'}`
                      }
                    </p>
                  </div>

                  {/* Tabs control */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md self-start xl:self-auto shadow-inner">
                    <button
                      onClick={() => setHomeProductTab('arrivage')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${homeProductTab === 'arrivage'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg font-extrabold scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Arrivage
                    </button>
                    <button
                      onClick={() => setHomeProductTab('populaire')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${homeProductTab === 'populaire'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg font-extrabold scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Populaire
                    </button>
                    <button
                      onClick={() => setHomeProductTab('recent')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${homeProductTab === 'recent'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 shadow-lg font-extrabold scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Récemment vues
                    </button>
                  </div>

                  {/* Toggle Filters & Sort */}
                  <div className="flex items-center gap-3 justify-end">
                    {homeProductTab !== 'recent' && (
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn btn-secondary py-2 px-4 text-xs flex items-center gap-2 ${showFilters ? 'bg-white/10 border-emerald-500/40 text-emerald-400' : ''
                          }`}
                      >
                        <SlidersHorizontal size={14} /> Filtres
                      </button>
                    )}

                    {homeProductTab === 'arrivage' && (
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="default">Tri par défaut</option>
                        <option value="price-low">Prix : croissant</option>
                        <option value="price-high">Prix : décroissant</option>
                        <option value="rating">Mieux notés</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Drawer collapsible Filters */}
                {showFilters && (
                  <div className="glass rounded-2xl p-5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Marques populaires</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(products.map(p => p.brand).filter(Boolean))).slice(0, 5).map((brand) => (
                          <button
                            key={brand}
                            onClick={() => setSearchQuery(brand)}
                            className="text-xs bg-slate-950 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/30 px-3 py-2 rounded-xl text-slate-300"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Promotions</h4>
                      <button
                        onClick={() => {
                          // Toggle filter by on-sale
                          const saleProducts = products.filter(p => p.on_sale);
                          if (saleProducts.length > 0) {
                            setProducts(saleProducts);
                            showToast('Filtre : En promotion', 'info');
                          }
                        }}
                        className="w-full text-left text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 px-4 py-2.5 rounded-xl font-medium"
                      >
                        🔥 Afficher uniquement les articles en solde
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Réinitialisation</h4>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSortBy('default');
                          setShowFilters(false);
                          showToast('Filtres réinitialisés', 'info');
                        }}
                        className="btn btn-secondary py-2 px-4 text-xs w-full justify-center"
                      >
                        Réinitialiser tous les filtres
                      </button>
                    </div>
                  </div>
                )}

                {/* LOADING SKELETONS */}
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 product-grid-container">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                      <div key={item} className="glass rounded-2xl p-3 border border-white/5 space-y-3">
                        <div className="skeleton w-full aspect-square rounded-xl" />
                        <div className="skeleton h-4 w-2/3" />
                        <div className="skeleton h-3 w-1/2" />
                        <div className="flex justify-between items-center pt-2">
                          <div className="skeleton h-5 w-1/3" />
                          <div className="skeleton h-8 w-8 rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-16 glass rounded-3xl border border-rose-500/20 max-w-xl mx-auto space-y-4">
                    <AlertCircle size={48} className="text-rose-500 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Erreur de Chargement</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto px-4">
                      {error}
                    </p>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="btn btn-primary"
                    >
                      Retour au mode Démo
                    </button>
                  </div>
                ) : displayedProducts.length === 0 ? (
                  homeProductTab === 'recent' ? (
                    <div className="text-center py-20 bg-slate-900/20 glass rounded-3xl border border-white/5 max-w-xl mx-auto space-y-4 animate-fade-in">
                      <Clock size={48} className="text-purple-400 mx-auto animate-pulse" />
                      <h3 className="text-lg font-bold text-white">Aucun produit vu récemment</h3>
                      <p className="text-slate-400 text-sm px-6">
                        Vous n'avez pas encore consulté de produits sur cette session. Explorez nos nouveautés pour commencer votre expérience shopping !
                      </p>
                      <button
                        onClick={() => setHomeProductTab('arrivage')}
                        className="btn bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold hover:opacity-90 transition duration-300 py-2.5 px-6 rounded-xl text-xs cursor-pointer"
                      >
                        Découvrir les Nouveautés
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-900/20 glass rounded-3xl border border-white/5 max-w-xl mx-auto space-y-4">
                      <Search size={48} className="text-slate-600 mx-auto" />
                      <h3 className="text-lg font-bold text-white">Aucun produit trouvé</h3>
                      <p className="text-slate-400 text-sm px-6">
                        Désolé, aucun article ne correspond à votre recherche "{searchQuery}".
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSortBy('default');
                        }}
                        className="btn btn-secondary py-2 px-4 text-xs"
                      >
                        Réinitialiser la recherche
                      </button>
                    </div>
                  )
                ) : (
                  <>
                  {/* GORGEOUS PRODUCT GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 product-grid-container mt-8 md:mt-10">
                    {visibleGridProducts.map((product) => {
                      const isFav = favorites.some((fav) => fav.id === product.id);
                      const isFree = Number(product.price) === 0 || !product.price;
                      return (
                        <div
                          key={product.id}
                          className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                        >
                          {/* Image area */}
                          <div className="product-image-container relative">
                            {/* Favorite action icon overlay */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product);
                              }}
                              className={`favorite-btn ${isFav ? 'active text-rose-500' : 'text-slate-400 hover:text-white'}`}
                            >
                              <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                            </button>

                            {product.on_sale && (
                              <span className="sale-badge">Promo</span>
                            )}

                            <img
                              src={product.images[0]?.src}
                              alt={product.name}
                              onClick={() => navigateToProduct(product)}
                              className="product-image cursor-pointer"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                              }}
                            />

                            {/* Elegant brand tag overlay */}
                            {product.brand && (
                              <span className="absolute bottom-3 left-3 text-[9px] bg-slate-950/70 backdrop-blur-md text-slate-300 font-bold px-2 py-1 rounded-md">
                                {product.brand}
                              </span>
                            )}
                          </div>

                          {/* Details area */}
                          <div className="product-card-details">
                            <div className="product-card-info">
                              {/* Ratings */}
                              <div className="product-card-rating">
                                <Star className="rating-star fill-amber-400" size={10} />
                                <span className="rating-value">{product.rating}</span>
                              </div>

                              <h3
                                onClick={() => navigateToProduct(product)}
                                className="product-card-title"
                              >
                                {product.name}
                              </h3>
                              <p className="product-card-description">
                                {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                              </p>
                            </div>

                            {/* Price / Cart trigger actions */}
                            <div className="card-footer">
                              <div className="card-price-group">
                                <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                  {isFree ? (isVehicleProduct(product) ? "Prix disponible sur demande" : "Sur demande") : `$${product.price}`}
                                </span>
                                {product.on_sale && (
                                  <span className="card-price-old">
                                    ${product.regular_price}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product, 1);
                                }}
                                className="card-buy-btn"
                                aria-label="Ajouter au panier"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {canExpandGrid && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setShowAllGridProducts(!showAllGridProducts)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02]"
                      >
                        <span>
                          {showAllGridProducts
                            ? 'Voir moins'
                            : `Voir plus (${displayedProducts.length - 10})`}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${showAllGridProducts ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  )}
                  </>
                )}
              </div>

              {/* Sections catégories (masquées si aucun produit) */}
              {selectedCategory === 'all' && HOME_CATEGORY_SECTIONS.map((section) => {
                const sectionProducts = products
                  .filter((p) => productMatchesHomeSection(p, section))
                  .sort(compareProductsByRecency);

                if (sectionProducts.length === 0) return null;

                const isExpanded = !!expandedHomeSections[section.id];
                const visibleProducts = isExpanded
                  ? sectionProducts
                  : sectionProducts.slice(0, 10);
                const SectionIcon = section.Icon;

                return (
                  <div
                    key={section.id}
                    className="space-y-6 !mt-32 md:!mt-40 pt-20 border-t border-white/5 animate-fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                      <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                        <SectionIcon className="text-emerald-400" size={20} />
                        {section.title}
                      </h2>
                      <span className="text-slate-500 text-xs">
                        {sectionProducts.length}{' '}
                        {sectionProducts.length > 1 ? 'articles disponibles' : 'article disponible'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 product-grid-container mt-6">
                      {visibleProducts.map((product) => {
                        const isFav = favorites.some((fav) => fav.id === product.id);
                        const isFree = Number(product.price) === 0 || !product.price;
                        return (
                          <div
                            key={product.id}
                            className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                          >
                            <div className="product-image-container relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(product);
                                }}
                                className={`favorite-btn ${isFav ? 'active text-rose-500' : 'text-slate-400 hover:text-white'}`}
                              >
                                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                              </button>
                              {product.on_sale && <span className="sale-badge">Promo</span>}
                              <img
                                src={product.images[0]?.src}
                                alt={product.name}
                                onClick={() => navigateToProduct(product)}
                                className="product-image cursor-pointer"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                                }}
                              />
                              {product.brand && (
                                <span className="absolute bottom-3 left-3 text-[9px] bg-slate-950/70 backdrop-blur-md text-slate-300 font-bold px-2 py-1 rounded-md">
                                  {product.brand}
                                </span>
                              )}
                            </div>
                            <div className="product-card-details">
                              <div className="product-card-info">
                                <div className="product-card-rating">
                                  <Star className="rating-star fill-amber-400" size={10} />
                                  <span className="rating-value">{product.rating}</span>
                                </div>
                                <h3 onClick={() => navigateToProduct(product)} className="product-card-title">
                                  {product.name}
                                </h3>
                                <p className="product-card-description">
                                  {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                                </p>
                              </div>
                              <div className="card-footer">
                                <div className="card-price-group">
                                  <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                    {isFree ? (isVehicleProduct(product) ? 'Prix disponible sur demande' : 'Sur demande') : `$${product.price}`}
                                  </span>
                                  {product.on_sale && <span className="card-price-old">${product.regular_price}</span>}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, 1);
                                  }}
                                  className="card-buy-btn"
                                  aria-label="Ajouter au panier"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {sectionProducts.length > 10 && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={() =>
                            setExpandedHomeSections((prev) => ({
                              ...prev,
                              [section.id]: !prev[section.id],
                            }))
                          }
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02]"
                        >
                          <span>
                            {isExpanded
                              ? 'Voir moins'
                              : `Voir plus (${sectionProducts.length - 10})`}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Section: Récemment Vues */}
              {recentlyViewed.length > 0 && (
                <div className="space-y-6 !mt-32 md:!mt-40 pt-20 border-t border-white/5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                      <Clock className="text-emerald-400" size={20} />
                      Récemment Vues
                    </h2>
                    <button
                      onClick={() => {
                        setRecentlyViewed([]);
                        localStorage.removeItem('shopushindi_recently_viewed');
                        showToast('Historique effacé', 'info');
                      }}
                      className="text-xs text-slate-500 hover:text-rose-400 transition"
                    >
                      Effacer l'historique
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 product-grid-container mt-6">
                    {recentlyViewed.slice(0, 5).map((product) => {
                      const isFav = favorites.some((fav) => fav.id === product.id);
                      const isFree = Number(product.price) === 0 || !product.price;
                      return (
                        <div
                          key={product.id}
                          className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="product-image-container relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product);
                              }}
                              className={`favorite-btn ${isFav ? 'active text-rose-500' : 'text-slate-400 hover:text-white'}`}
                            >
                              <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                            </button>
                            {product.on_sale && <span className="sale-badge">Promo</span>}
                            <img
                              src={product.images[0]?.src}
                              alt={product.name}
                              onClick={() => navigateToProduct(product)}
                              className="product-image cursor-pointer"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                              }}
                            />
                            {product.brand && (
                              <span className="absolute bottom-3 left-3 text-[9px] bg-slate-950/70 backdrop-blur-md text-slate-300 font-bold px-2 py-1 rounded-md">
                                {product.brand}
                              </span>
                            )}
                          </div>
                          <div className="product-card-details">
                            <div className="product-card-info">
                              <div className="product-card-rating">
                                <Star className="rating-star fill-amber-400" size={10} />
                                <span className="rating-value">{product.rating}</span>
                              </div>
                              <h3 onClick={() => navigateToProduct(product)} className="product-card-title">
                                {product.name}
                              </h3>
                              <p className="product-card-description">
                                {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                              </p>
                            </div>
                            <div className="card-footer">
                              <div className="card-price-group">
                                <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                  {isFree ? (isVehicleProduct(product) ? "Prix disponible sur demande" : "Sur demande") : `$${product.price}`}
                                </span>
                                {product.on_sale && <span className="card-price-old">${product.regular_price}</span>}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product, 1);
                                }}
                                className="card-buy-btn"
                                aria-label="Ajouter au panier"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section "Top Marque" */}
              <div className="space-y-6 !mt-32 md:!mt-48 pt-28 md:pt-36 pb-12 md:pb-16 border-t border-white/5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8 md:mb-12">
                  <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="text-emerald-400 animate-pulse" size={20} />
                    Top Marques
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {(showAllBrands ? TOP_BRANDS : TOP_BRANDS.slice(0, 6)).map((brand, index) => (
                    <div
                      key={index}
                      onClick={() => handleBrandClick(brand)}
                      className="group relative flex flex-col items-center justify-center p-6 h-28 rounded-2xl glass border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/5"
                    >
                      <div className="w-full h-12 flex items-center justify-center">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-emerald-400 transition duration-300 mt-3 block text-center">
                        {brand.name}
                      </span>
                    </div>
                  ))}
                </div>

                {TOP_BRANDS.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300 shadow-md cursor-pointer hover:scale-[1.02]"
                    >
                      <span>{showAllBrands ? 'Voir moins de marques' : 'Voir toutes les marques'}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${showAllBrands ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}
              </div>

              {/* Section: Demander un Devis */}
              <div className="relative !mt-16 md:!mt-24 mb-4 animate-fade-in group/quote pt-12 md:pt-16 pb-4 md:pb-6 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-14 max-w-4xl mx-auto">
                <div className="space-y-6 text-center md:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Car size={13} /> Service d'Importation &amp; Devis
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    Demandez un devis véhicule sur mesure.
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto md:mx-0">
                    Un modèle spécifique ? Nous préparons un devis simple et rapide pour l'achat et l'importation de votre véhicule.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto flex justify-center">
                  <button
                    onClick={() => {
                      const brand = window.prompt('Marque du véhicule ?');
                      if (!brand) {
                        showToast('La marque est requise pour demander un devis.', 'danger');
                        return;
                      }

                      const model = window.prompt('Modèle du véhicule ?');
                      if (!model) {
                        showToast('Le modèle est requis pour demander un devis.', 'danger');
                        return;
                      }

                      const messageText = `*DEMANDE DE DEVIS - SHOPUSHINDI*\n\n` +
                        `Bonjour, je souhaite un devis pour un véhicule.\n` +
                        `- Marque : ${brand}\n` +
                        `- Modèle : ${model}\n` +
                        `- Année souhaitée :\n` +
                        `- Budget :\n` +
                        `- Commentaire :\n\n` +
                        `Merci de me contacter pour finaliser la demande.`;
                      const encodedMsg = encodeURIComponent(messageText);
                      const cleanPhone = billingDetails.whatsappNumber.replace('+', '').replace(/\s/g, '');
                      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
                      window.open(whatsappUrl, '_blank');
                      showToast('Demande de devis initiée...', 'success');
                    }}
                    className="w-full md:w-auto btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-12 py-5 rounded-2xl font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-base"
                  >
                    <WhatsAppIcon className="w-5 h-5" /> Demander un devis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SEARCH */}
          {currentTab === 'search' && (
            <div className="space-y-10 animate-fade-in">
              {/* Header */}
              <div className="text-center max-w-xl mx-auto space-y-4 mt-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
                  <Search size={26} className="text-emerald-400" />
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  Rechercher un produit
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trouvez instantanément vos sneakers, montres ou accessoires premium.
                </p>
              </div>

              {/* Premium Search Input */}
              <div className="max-w-xl mx-auto relative">
                <Search
                  style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#34d399', pointerEvents: 'none' }}
                  size={22}
                />
                <input
                  id="search-page-field"
                  type="text"
                  placeholder="Rechercher des articles, des marques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '3.25rem',
                    paddingRight: searchQuery ? '3rem' : '1.25rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid rgba(52, 211, 153, 0.35)',
                    borderRadius: '1rem',
                    fontSize: '1rem',
                    color: '#f1f5f9',
                    outline: 'none',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(52, 211, 153, 0.8)'; e.target.style.boxShadow = '0 0 0 4px rgba(52,211,153,0.12), 0 4px 24px rgba(0,0,0,0.3)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(52, 211, 153, 0.35)'; e.target.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Effacer la recherche"
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', lineHeight: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Search Results header */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous nos articles disponibles'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {products.length} {products.length > 1 ? 'articles trouvés' : 'article trouvé'}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                      <div key={item} className="glass rounded-2xl p-3 border border-white/5 space-y-3">
                        <div className="skeleton w-full aspect-square rounded-xl" />
                        <div className="skeleton h-4 w-2/3" />
                        <div className="skeleton h-3 w-1/2" />
                        <div className="flex justify-between items-center pt-2">
                          <div className="skeleton h-5 w-1/3" />
                          <div className="skeleton h-8 w-8 rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/20 glass rounded-3xl border border-white/5 max-w-xl mx-auto space-y-4">
                    <Search size={48} className="text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Aucun produit trouvé</h3>
                    <p className="text-slate-400 text-sm px-6">
                      Désolé, aucun article ne correspond à votre recherche. Essayez avec d'autres mots-clés.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="btn btn-secondary py-2 px-4 text-xs"
                    >
                      Effacer la recherche
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {products.map((product) => {
                      const isFav = favorites.some((fav) => fav.id === product.id);
                      const isFree = Number(product.price) === 0 || !product.price;
                      return (
                        <div
                          key={product.id}
                          className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="product-image-container relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product);
                              }}
                              className={`favorite-btn ${isFav ? 'active text-rose-500' : 'text-slate-400 hover:text-white'}`}
                            >
                              <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                            </button>

                            {product.on_sale && (
                              <span className="sale-badge">Promo</span>
                            )}

                            <img
                              src={product.images[0]?.src}
                              alt={product.name}
                              onClick={() => navigateToProduct(product)}
                              className="product-image cursor-pointer"
                            />

                            {product.brand && (
                              <span className="absolute bottom-3 left-3 text-[9px] bg-slate-950/70 backdrop-blur-md text-slate-300 font-bold px-2 py-1 rounded-md">
                                {product.brand}
                              </span>
                            )}
                          </div>

                          <div className="product-card-details">
                            <div className="product-card-info">
                              <div className="product-card-rating">
                                <Star className="rating-star fill-amber-400" size={10} />
                                <span className="rating-value">{product.rating}</span>
                              </div>

                              <h3
                                onClick={() => navigateToProduct(product)}
                                className="product-card-title"
                              >
                                {product.name}
                              </h3>
                              <p className="product-card-description">
                                {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                              </p>
                            </div>

                            <div className="card-footer">
                              <div className="card-price-group">
                                <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                  {isFree ? (isVehicleProduct(product) ? "Prix disponible sur demande" : "Sur demande") : `$${product.price}`}
                                </span>
                                {product.on_sale && (
                                  <span className="card-price-old">
                                    ${product.regular_price}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product, 1);
                                }}
                                className="card-buy-btn"
                                aria-label="Ajouter au panier"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: CATEGORIES */}
          {currentTab === 'categories' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Catégories de Produits</h1>
                <p className="text-slate-400 text-sm">Découvrez nos collections d'articles premium soigneusement sélectionnés.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.filter(c => c.id !== 'all').map((cat) => {
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSearchQuery('');
                        setHomeProductTab('arrivage');
                        setShowAllGridProducts(true);
                        setCurrentTab('home');
                        setTimeout(() => {
                          const el = document.getElementById('products-section');
                          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="group relative h-48 rounded-3xl cursor-pointer glass border border-white/5 hover:border-emerald-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/60 hover:shadow-emerald-500/5 flex flex-col items-center justify-center p-6"
                    >
                      {/* Big Category Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 mb-4 shadow-inner">
                        <CategoryIcon name={cat.name} className="w-7 h-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      </div>

                      {/* Category Info */}
                      <div className="text-center space-y-1">
                        <h3 className="font-extrabold text-base md:text-lg text-white tracking-tight group-hover:text-emerald-400 transition duration-300">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {cat.count} {cat.count > 1 ? 'articles' : 'article'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: PRODUCT DETAIL */}
          {currentTab === 'detail' && selectedProduct && (
            <div className="space-y-10 animate-fade-in">
              {/* Back CTA & Share Row */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
                <button
                  onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft size={16} /> Retour aux produits
                </button>

                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`;
                    const shareData = {
                      title: selectedProduct.name,
                      text: selectedProduct.short_description || selectedProduct.description,
                      url: shareUrl
                    };
                    if (navigator.share) {
                      navigator.share(shareData)
                        .then(() => showToast('Produit partagé !', 'success'))
                        .catch((err) => {
                          console.log('Error sharing:', err);
                          navigator.clipboard.writeText(shareUrl)
                            .then(() => showToast('Lien du produit copié ! 📋', 'success'))
                            .catch(() => showToast('Impossible de copier le lien automatiquement.', 'error'));
                        });
                    } else {
                      navigator.clipboard.writeText(shareUrl)
                        .then(() => showToast('Lien du produit copié ! 📋', 'success'))
                        .catch(() => showToast('Impossible de copier le lien automatiquement.', 'error'));
                    }
                  }}
                  className="group/share inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:scale-110 active:scale-95 shadow-lg shadow-emerald-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                  aria-label="Partager le produit"
                  title="Partager ce produit"
                >
                  <Share2 size={20} className="text-slate-950 group-hover/share:rotate-12 group-hover/share:scale-110 transition duration-300" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                {/* Images slide panel - Left col */}
                <div className="md:col-span-6 space-y-6">
                  <div className="glass rounded-3xl overflow-hidden aspect-square relative border border-white/5 flex items-center justify-center group">
                    <img
                      src={selectedProduct.images[activeImageIndex]?.src}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                      }}
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {selectedProduct.on_sale && (
                        <span className="bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-lg">
                          En Solde
                        </span>
                      )}
                      {selectedProduct.stock_status === 'instock' && (
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider">
                          En Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail gallery */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto mt-6 md:mt-8 pb-2 scrollbar-none">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-300 ${activeImageIndex === idx
                            ? 'border-emerald-500 bg-emerald-500/5 scale-95 shadow-md shadow-emerald-500/10'
                            : 'border-white/5 opacity-60 hover:opacity-100 hover:scale-95'
                            }`}
                        >
                          <img
                            src={img.src}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product spec detail panel - Right col */}
                <div className="md:col-span-6 space-y-10 md:space-y-12">
                  <div className="space-y-4 md:space-y-5">
                    <div className="flex items-center justify-between">
                      {selectedProduct.brand && (
                        <span className="text-xs bg-slate-900 border border-white/5 text-emerald-400 font-bold px-3 py-1.5 rounded-full">
                          {selectedProduct.brand}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Star className="text-amber-400 fill-amber-400" size={14} />
                        <span className="text-sm font-bold text-slate-300">{selectedProduct.rating} / 5</span>
                        <span className="text-xs text-slate-500">({selectedProduct.reviews_count} avis)</span>
                      </div>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight pt-1.5 md:pt-2">
                      {selectedProduct.name}
                    </h1>

                    <div className="flex items-center gap-3.5 pt-4 md:pt-6 flex-wrap">
                      <span className="text-3xl md:text-4xl font-black text-emerald-400">
                        {isVehicleProduct(selectedProduct) && (Number(selectedProduct.price) === 0 || !selectedProduct.price) ? (
                          "Prix disponible sur demande"
                        ) : Number(selectedProduct.price) === 0 || !selectedProduct.price ? (
                          "Sur demande"
                        ) : (
                          `$${selectedProduct.price}`
                        )}
                      </span>
                      {selectedProduct.on_sale && Number(selectedProduct.price) > 0 && (
                        <>
                          <span className="text-lg text-slate-500 line-through font-semibold">
                            ${selectedProduct.regular_price}
                          </span>
                          {selectedProduct.regular_price > selectedProduct.price && (
                            <span className="text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              -{Math.round(((selectedProduct.regular_price - selectedProduct.price) / selectedProduct.regular_price) * 100)}% de réduction
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8 divide-y divide-white/5">
                    <section className="space-y-4 pt-14 pb-8 !mt-12">
                      <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest">Description</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </section>

                    <section className="space-y-4 !pt-2 pb-8 !mt-6">
                      <span className="text-xs font-extrabold text-slate-300 uppercase tracking-widest">Quantité</span>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-900 border border-white/5 rounded-2xl p-1 shrink-0">
                            <button
                              onClick={() => setDetailQty(prev => Math.max(1, prev - 1))}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center text-sm font-extrabold text-white">{detailQty}</span>
                            <button
                              onClick={() => setDetailQty(prev => prev + 1)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="text-xs text-slate-500 font-semibold">
                            {selectedProduct.stock_status === 'instock' ? 'Prêt à être livré rapidement' : 'Disponibilité limitée'}
                          </span>
                        </div>
                      </div>
                    </section>

                    {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                      <section className="space-y-3 py-8">
                        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest">Spécifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {selectedProduct.specs.map((spec, i) => (
                            <div key={i} className="flex flex-col p-3.5 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-emerald-500/15 hover:bg-slate-900/50 transition duration-300">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{spec.label}</span>
                              <span className="text-xs font-bold text-slate-200 mt-1">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="space-y-4 !pt-2 pb-8 !mt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => addToCart(selectedProduct, detailQty)}
                          className="btn btn-primary flex-1 py-3.5 rounded-2xl text-base shadow-emerald-500/25 font-extrabold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition duration-300"
                        >
                          <ShoppingCart size={18} /> Ajouter au panier
                        </button>

                        <button
                          onClick={() => {
                            const detailPrice = (Number(selectedProduct.price) === 0 || !selectedProduct.price)
                              ? (isVehicleProduct(selectedProduct) ? "Prix disponible sur demande" : "Sur demande")
                              : `$${selectedProduct.price}`;
                            const messageText = `*NOUVELLE COMMANDE DIRECTE - SHOPUSHINDI*\n\n` +
                              `Je souhaite commander le produit suivant :\n` +
                              `- *${selectedProduct.name}* (x${detailQty}) - ${detailPrice}\n\n` +
                              `Merci de m'indiquer la disponibilité et les modalités de livraison !`;
                            const encodedMsg = encodeURIComponent(messageText);
                            const cleanPhone = billingDetails.whatsappNumber.replace('+', '').replace(' ', '');
                            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
                            window.open(whatsappUrl, '_blank');
                            showToast('Redirection vers WhatsApp...', 'success');
                          }}
                          className="btn bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 flex-1 py-3.5 rounded-2xl text-base shadow-lg shadow-[#25D366]/20 font-extrabold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 animate-pulse-subtle"
                        >
                          <WhatsAppIcon className="w-5 h-5" /> Commander sur WhatsApp
                        </button>

                        <button
                          onClick={() => toggleFavorite(selectedProduct)}
                          className={`group/fav w-14 h-14 rounded-2xl border flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 shrink-0 ${favorites.some(fav => fav.id === selectedProduct.id)
                            ? 'border-rose-500 bg-rose-500/15 text-rose-500 shadow-lg shadow-rose-500/25'
                            : 'border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:border-white/10 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-950/20'
                            }`}
                          title={favorites.some(fav => fav.id === selectedProduct.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Heart
                            size={22}
                            className={`transition-all duration-300 ${favorites.some(fav => fav.id === selectedProduct.id)
                              ? "text-rose-500 scale-110 animate-pulse"
                              : "text-slate-400 group-hover/fav:text-rose-400 group-hover/fav:scale-110"
                              }`}
                            fill={favorites.some(fav => fav.id === selectedProduct.id) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Related Products Section */}
              {products.filter(p => p.id !== selectedProduct.id).length > 0 && (
                <div className="mt-20 md:mt-24 pt-16 md:pt-20 border-t border-white/5 space-y-6 md:space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                      <Sparkles className="text-emerald-400" size={18} /> Autres produits qui pourraient vous plaire
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                    {products
                      .filter(p => p.id !== selectedProduct.id)
                      .slice(0, 4)
                      .map((product) => {
                        const hasDiscount = product.regular_price && product.regular_price > product.price;
                        const mainImage = product.images?.[0]?.src || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                        const isFav = favorites.some(f => f.id === product.id);
                        const isFree = Number(product.price) === 0 || !product.price;

                        return (
                          <div
                            key={product.id}
                            className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                          >
                            {/* Image area */}
                            <div className="product-image-container relative">
                              {/* Favorite action icon overlay */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(product);
                                }}
                                className={`favorite-btn ${isFav ? 'active text-rose-500' : 'text-slate-400 hover:text-white'}`}
                              >
                                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                              </button>

                              {product.on_sale && (
                                <span className="sale-badge">Promo</span>
                              )}

                              <img
                                src={mainImage}
                                alt={product.name}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setDetailQty(1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="product-image cursor-pointer"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                                }}
                              />

                              {/* Elegant brand tag overlay */}
                              {product.brand && (
                                <span className="absolute bottom-3 left-3 text-[9px] bg-slate-950/70 backdrop-blur-md text-slate-300 font-bold px-2 py-1 rounded-md">
                                  {product.brand}
                                </span>
                              )}
                            </div>

                            {/* Details area */}
                            <div className="product-card-details">
                              <div className="product-card-info">
                                {/* Ratings */}
                                <div className="product-card-rating">
                                  <Star className="rating-star fill-amber-400" size={10} />
                                  <span className="rating-value">{product.rating || '4.5'}</span>
                                </div>

                                <h3
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setDetailQty(1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="product-card-title text-xs"
                                >
                                  {product.name}
                                </h3>
                                <p className="product-card-description text-[10px]">
                                  {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                                </p>
                              </div>

                              {/* Price / Cart trigger actions */}
                              <div className="card-footer">
                                <div className="card-price-group">
                                  <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                    {isFree ? (isVehicleProduct(product) ? "Prix disponible sur demande" : "Sur demande") : `$${product.price}`}
                                  </span>
                                  {hasDiscount && (
                                    <span className="card-price-old">
                                      ${product.regular_price}
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, 1);
                                  }}
                                  className="card-buy-btn"
                                  aria-label="Ajouter au panier"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: CART */}
          {currentTab === 'cart' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <ShoppingBag className="text-emerald-400" size={28} />
                    Panier d'achat
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Gérez vos articles et procédez au paiement en toute sécurité.</p>
                </div>
              </div>

              {/* VIEW: CART CONTENT */}
              {checkoutStep !== 'complete' && cart.length === 0 ? (
                <div className="text-center py-24 glass rounded-3xl border border-white/5 max-w-xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                  <div className="w-20 h-20 bg-slate-900/80 border border-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <ShoppingBag size={36} className="text-slate-500 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white">Votre panier est vide</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto px-6">
                      Découvrez nos collections exclusives et trouvez des articles premium adaptés à vos besoins.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="btn btn-primary px-8 py-3.5 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/10"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Step 1: Cart list items - Left col */}
                  {checkoutStep === 'cart' && (
                    <div className="lg:col-span-8 space-y-4">
                      <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/5 bg-slate-900/20 flex justify-between items-center">
                          <h3 className="font-extrabold text-white text-base">Articles sélectionnés ({cart.length})</h3>
                          <button
                            onClick={() => setCurrentTab('home')}
                            className="text-xs text-emerald-400 hover:underline font-bold"
                          >
                            Ajouter d'autres produits
                          </button>
                        </div>

                        <div className="divide-y divide-white/5">
                          {cart.map((item) => (
                            <div key={item.product.id} className="cart-item-row border-b border-white/5">
                              {/* Image Container */}
                              <div
                                className="cart-item-img-container"
                                onClick={() => navigateToProduct(item.product)}
                              >
                                <img
                                  src={item.product.images[0]?.src}
                                  alt={item.product.name}
                                  className="cart-item-img"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200';
                                  }}
                                />
                              </div>

                              {/* Details Info Container */}
                              <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                {/* Title and delete button */}
                                <div className="flex justify-between items-start gap-4">
                                  <div className="min-w-0">
                                    <h4
                                      className="cart-item-title"
                                      onClick={() => navigateToProduct(item.product)}
                                    >
                                      {item.product.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <span className="cart-item-brand">
                                        {item.product.brand || 'Premium'}
                                      </span>
                                      <span className="cart-item-unit-price">
                                        {Number(item.product.price) === 0 ? (isVehicleProduct(item.product) ? "Prix disponible sur demande" : "Prix sur demande") : `$${item.product.price} / u`}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(item.product.id, item.product.name)}
                                    className="text-slate-500 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl transition-all duration-300 shrink-0"
                                    title="Supprimer"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                {/* Qty and total price row */}
                                <div className="flex justify-between items-center pt-4">
                                  {/* Qty Counter */}
                                  <div className="cart-qty-picker">
                                    <button
                                      onClick={() => updateCartQuantity(item.product.id, -1)}
                                      className="cart-qty-btn btn-minus"
                                      aria-label="Diminuer la quantité"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="cart-qty-num">{item.quantity}</span>
                                    <button
                                      onClick={() => updateCartQuantity(item.product.id, 1)}
                                      className="cart-qty-btn btn-plus"
                                      aria-label="Augmenter la quantité"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>

                                  {/* Item Total Price */}
                                  <span className="cart-item-total-price">
                                    {Number(item.product.price) === 0
                                      ? (isVehicleProduct(item.product) ? "Prix disponible sur demande" : "Sur demande")
                                      : `$${(item.product.price * item.quantity).toFixed(2)}`
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary order total block - Right col */}
                  {checkoutStep !== 'complete' && (
                    <div className="lg:col-span-4 space-y-4 w-full">
                      <div className="glass rounded-3xl border border-white/5 p-6 space-y-5 shadow-xl">
                        <h3 className="font-extrabold text-white text-base border-b border-white/5 pb-3">Récapitulatif</h3>

                        <div className="space-y-3.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sous-total</span>
                            <span className="text-white font-bold">
                              {hasFreeItem ? "Sur demande" : `$${subTotal.toFixed(2)}`}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Livraison</span>
                            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Gratuite</span>
                          </div>

                          {/* Promo code block */}
                          <div className="pt-2">
                            <div className="promo-input-wrapper">
                              <span className="promo-input-icon">
                                <Tag size={14} />
                              </span>
                              <input
                                type="text"
                                placeholder="Code Promo (ex: USHINDI10)"
                                value={billingDetails.promoCode}
                                onChange={(e) => setBillingDetails({ ...billingDetails, promoCode: e.target.value })}
                                className="promo-input-field"
                              />
                            </div>
                            {billingDetails.promoCode.toLowerCase() === 'ushindi10' && (
                              <div className="text-[11px] text-emerald-400 mt-2 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={12} /> Code promo appliqué ! Réduction de 10% activée.
                              </div>
                            )}
                          </div>

                          {billingDetails.promoCode.toLowerCase() === 'ushindi10' && (
                            <div className="flex justify-between text-xs text-rose-400 font-semibold pt-1">
                              <span>Réduction (-10%)</span>
                              <span>
                                -${(subTotal * 0.1).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        <hr className="border-white/5" />

                        <div className="flex justify-between items-baseline pt-1">
                          <span className="font-extrabold text-white text-base">Total</span>
                          <span className="text-2xl font-black text-emerald-400">
                            {hasFreeItem ? "Sur demande" : `$${total.toFixed(2)}`}
                          </span>
                        </div>

                        {checkoutStep === 'cart' && (
                          <button
                            onClick={handlePlaceOrder}
                            className="w-full btn bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 font-extrabold transition-all duration-300 hover:scale-[1.01]"
                          >
                            <WhatsAppIcon className="w-5 h-5" /> Commander sur WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Complete screen success */}
                  {checkoutStep === 'complete' && orderSummary && (
                    <div className="lg:col-span-12 max-w-xl mx-auto text-center glass rounded-3xl border border-emerald-500/20 p-8 md:p-12 space-y-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-scale-up">
                        <CheckCircle2 size={36} />
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Merci pour votre commande !</h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                          Votre commande a bien été reçue et est en cours de traitement.
                        </p>
                      </div>

                      <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-6 text-left text-xs md:text-sm space-y-3.5 shadow-inner">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Numéro de Commande</span>
                          <span className="text-white font-bold">#{orderSummary.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Date de commande</span>
                          <span className="text-white font-bold">{orderSummary.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Mode de validation</span>
                          <span className="text-emerald-400 font-bold">{orderSummary.method}</span>
                        </div>
                        <hr className="border-white/5" />
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-slate-400 font-bold">Montant Total</span>
                          <span className="text-xl font-black text-emerald-400">
                            {Number(orderSummary.total) === 0 ? "Sur demande" : `$${orderSummary.total.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => {
                            setCheckoutStep('cart');
                            setOrderSummary(null);
                            setCurrentTab('home');
                          }}
                          className="btn btn-primary flex-1 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/10 hover:scale-[1.01] transition-all duration-300"
                        >
                          Continuer mes achats
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* VIEW: FAVORITES */}
          {currentTab === 'favorites' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Mes Favoris</h1>
                <p className="text-slate-400 text-sm">Retrouvez les articles que vous avez aimés.</p>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border border-white/5 max-w-xl mx-auto space-y-4">
                  <Heart size={48} className="text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Aucun favori enregistré</h3>
                  <p className="text-slate-400 text-sm">
                    Parcourez la boutique et cliquez sur l'icône de cœur pour ajouter des articles à vos favoris.
                  </p>
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="btn btn-primary"
                  >
                    Découvrir des produits
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {favorites.map((product) => {
                    const isFree = Number(product.price) === 0 || !product.price;
                    return (
                      <div
                        key={product.id}
                        className="product-card group glass border border-white/5 hover:border-emerald-500/20 hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="product-image-container relative">
                          <button
                            onClick={() => toggleFavorite(product)}
                            className="favorite-btn active text-rose-500"
                          >
                            <Heart size={16} fill="currentColor" />
                          </button>

                          {product.on_sale && (
                            <span className="sale-badge">Promo</span>
                          )}

                          <img
                            src={product.images[0]?.src}
                            alt={product.name}
                            onClick={() => navigateToProduct(product)}
                            className="product-image cursor-pointer"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                        </div>

                        <div className="product-card-details">
                          <div className="product-card-info">
                            {/* Ratings */}
                            <div className="product-card-rating">
                              <Star className="rating-star fill-amber-400" size={10} />
                              <span className="rating-value">{product.rating || '4.8'}</span>
                            </div>

                            <h3
                              onClick={() => navigateToProduct(product)}
                              className="product-card-title"
                            >
                              {product.name}
                            </h3>
                            <p className="product-card-description">
                              {product.short_description ? product.short_description.replace(/<[^>]*>/g, '') : <>&nbsp;</>}
                            </p>
                          </div>

                          <div className="card-footer">
                            <div className="card-price-group">
                              <span className={`card-price-current ${isFree ? 'price-request' : ''}`}>
                                {isFree ? (isVehicleProduct(product) ? "Prix disponible sur demande" : "Sur demande") : `$${product.price}`}
                              </span>
                              {product.on_sale && (
                                <span className="card-price-old">
                                  ${product.regular_price}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product, 1);
                              }}
                              className="card-buy-btn"
                              aria-label="Ajouter au panier"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SETTINGS / WOOCOMMERCE CONNECTION */}
          {currentTab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Configuration WooCommerce</h1>
                <p className="text-slate-400 text-sm">Connectez l'application directement à la base de données de votre boutique WooCommerce.</p>
              </div>

              {/* Status information block */}
              {credentials ? (
                <div className="glass rounded-3xl border border-emerald-500/20 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <Wifi size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">WooCommerce connecté</h4>
                      <p className="text-xs text-emerald-400">Statut : Liaison API active</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Adresse du site</span>
                      <span className="text-white font-mono break-all">{credentials.url}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Clé client (Consumer Key)</span>
                      <span className="text-white font-mono">ck_••••••••••••••••••••</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDisconnectWC}
                    className="btn btn-danger w-full py-2.5 rounded-xl font-bold text-xs"
                  >
                    Déconnecter l'API WooCommerce (Retourner à la boutique par défaut)
                  </button>
                </div>
              ) : (
                /* Connection form credentials */
                <form onSubmit={handleConnectWooCommerce} className="glass rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">URL de votre boutique WooCommerce *</label>
                      <input
                        type="url"
                        placeholder="https://maboutique.com"
                        value={wcUrl}
                        onChange={(e) => setWcUrl(e.target.value)}
                        className="input-field"
                        required
                      />
                      <p className="text-[10px] text-slate-500">
                        Entrez l'adresse de votre site web contenant l'installation WordPress & WooCommerce.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clé Client WooCommerce (Consumer Key) *</label>
                      <input
                        type="text"
                        placeholder="ck_abc123..."
                        value={wcKey}
                        onChange={(e) => setWcKey(e.target.value)}
                        className="input-field font-mono text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secret Client WooCommerce (Consumer Secret) *</label>
                      <input
                        type="password"
                        placeholder="cs_abc123..."
                        value={wcSecret}
                        onChange={(e) => setWcSecret(e.target.value)}
                        className="input-field font-mono text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Actions / Instructions */}
                  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-[11px] text-slate-400 space-y-2">
                    <h5 className="font-bold text-white uppercase tracking-wider">Comment obtenir ces clés ?</h5>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Rendez-vous dans le panneau d'administration WordPress.</li>
                      <li>Allez dans <strong>WooCommerce &gt; Réglages &gt; Avancé &gt; API REST</strong>.</li>
                      <li>Cliquez sur <strong>Ajouter une clé</strong>, nommez-la et donnez les droits <strong>Lecture/Écriture</strong>.</li>
                      <li>Générez les clés et copiez-les ici.</li>
                    </ol>
                  </div>

                  <button
                    type="submit"
                    disabled={connectionStatus === 'testing'}
                    className="w-full btn btn-primary py-3 rounded-2xl flex items-center justify-center font-extrabold shadow-emerald-500/20"
                  >
                    {connectionStatus === 'testing' ? 'Test de la connexion...' : 'Sauvegarder & Connecter l\'API'}
                  </button>

                  {connectionStatus === 'error' && (
                    <div className="text-xs text-red-400 text-center font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                      <AlertCircle size={14} /> Échec de la connexion. Vérifiez l'URL de votre boutique, assurez-vous que les permaliens sont configurés sur autre chose que "Simple" et que HTTPS est actif.
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Premium PWA Mobile Navigation Bar */}
      <nav className="mobile-nav">
        <button
          onClick={() => handleLogoClick()}
          className={`mobile-nav-item ${currentTab === 'home' || currentTab === 'detail' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Accueil"
        >
          <div className="mobile-icon-wrapper">
            <Home size={20} />
          </div>
          <span>Accueil</span>
        </button>

        <button
          onClick={() => { setCurrentTab('search'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`mobile-nav-item ${currentTab === 'search' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Recherche"
        >
          <div className="mobile-icon-wrapper">
            <Search size={20} />
          </div>
          <span>Recherche</span>
        </button>

        <button
          onClick={() => { setCurrentTab('favorites'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`mobile-nav-item ${currentTab === 'favorites' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Favoris"
        >
          <div className="mobile-icon-wrapper">
            <Heart size={20} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md">
                {favorites.length}
              </span>
            )}
          </div>
          <span>Favoris</span>
        </button>

        <button
          onClick={() => { setCurrentTab('cart'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`mobile-nav-item relative ${currentTab === 'cart' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Panier"
        >
          <div className="mobile-icon-wrapper">
            <ShoppingCart size={20} stroke="url(#cart-gradient)" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <span>Panier</span>
        </button>
      </nav>

      {/* Elegant Footer */}
      <footer className="bg-slate-950 border-t border-white/5 pt-10 pb-24 lg:pt-16 lg:pb-16 mt-8 lg:mt-12 mb-16 lg:mb-0 relative z-20 transition duration-300">
        <div className="container space-y-20 lg:space-y-32 pb-24 lg:pb-0">
          {/* Main Footer Links Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Column 1: Brand Info, Description and App Store links */}
            <div className="col-span-1 lg:col-span-4 space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <div
                  onClick={() => { setCurrentTab('home'); setSelectedProduct(null); }}
                  className="flex flex-col items-center lg:items-start gap-2 cursor-pointer group justify-center lg:justify-start"
                >
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    SHOP<span className="text-emerald-400">USHINDI</span>
                  </span>
                </div>
                <p className="text-emerald-500 font-semibold text-[11px] tracking-wide text-center lg:text-left">
                  La victoire de la qualité et du service!
                </p>
              </div>
              <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Fondée en 2022 par M. Ush Kavakwa, ShopUshindi est l’un des acteurs de référence dans l’importation et la vente de véhicules de qualité. Nous proposons également une sélection de produits technologiques et d’équipements performants, avec un engagement constant envers la satisfaction de nos clients.
              </p>
            </div>

            {/* Column 2: Nos Services */}
            <div className="col-span-1 lg:col-span-4 space-y-6 text-left">
              <h4 className="font-bold text-white uppercase tracking-wider text-[12px] mb-2">Nos Services</h4>
              <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="leading-relaxed">Conseil et médiation pour l'achat de véhicules d'occasion fiables et de qualité.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="leading-relaxed">Assistance dans l'achat de produits électroniques performants</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="leading-relaxed">Organisation de solutions de transport simplifiées et efficaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="leading-relaxed">Accompagnement dans la recherche et la négociation des meilleures offres.</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Detailed Contacts with Icons (Faithful to Model) */}
            <div className="col-span-1 lg:col-span-4 space-y-6 text-left">
              <ul className="flex flex-col gap-8 text-xs text-slate-400">
                <li className="flex items-start gap-4 justify-start">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-md">
                    <i className="fa-solid fa-location-dot text-sm"></i>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Adresse</h5>
                    <p className="text-slate-400 leading-relaxed font-medium">C3 Appart., Cetraca Bldg, Av. du Centre Butembo, D.R.Congo</p>
                  </div>
                </li>

                <li className="flex items-start gap-4 justify-start">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-md">
                    <i className="fa-solid fa-phone text-sm"></i>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Téléphone</h5>
                    <a href="tel:+243896666630" className="block text-slate-400 hover:text-emerald-400 transition font-medium">+243 896 666 630</a>
                  </div>
                </li>

                <li className="flex items-start gap-4 justify-start">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-md">
                    <i className="fa-solid fa-envelope text-sm"></i>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">E-mail</h5>
                    <a href="mailto:info@shopushindi.com" className="block text-slate-400 hover:text-emerald-400 transition font-medium">info@shopushindi.com - Support Client</a>
                  </div>
                </li>

                <li className="flex items-start gap-4 justify-start">
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-md">
                    <i className="fa-solid fa-clock text-sm"></i>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Horaires d'ouverture</h5>
                    <p className="text-slate-400 leading-relaxed font-medium">Du lundi au vendredi, de 9h à 17h</p>
                    <p className="text-slate-500 text-[11px] font-medium">Fermé le dimanche</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Row with separator and custom navigation links */}
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[11px] text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} ShopUshindi. Tous droits réservés.
              </p>
            </div>

            {/* Bottom Links (Faithful to Model) */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-bold">
              <button onClick={() => handleLogoClick()} className="hover:text-emerald-400 transition">Accueil</button>
              <button onClick={() => { setCurrentTab('categories'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition">Catégories</button>
              <button onClick={() => { setCurrentTab('favorites'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition">Mes Favoris</button>
              <button onClick={() => { setCurrentTab('cart'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition">Panier</button>
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </footer>

      {/* ── Floating WhatsApp Button ── */}
      <a
        href={`https://wa.me/${billingDetails.whatsappNumber.replace('+', '').replace(/\s/g, '')}?text=${encodeURIComponent('Bonjour ! Je suis intéressé(e) par vos produits sur ShopUshindi.')}`}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float-btn"
        aria-label="Contacter sur WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 4px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0,0,0,0.25)',
          textDecoration: 'none',
          transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.13)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.6), 0 2px 8px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0,0,0,0.25)';
        }}
      >
        {/* Pulse ring */}
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(37, 211, 102, 0.35)',
          animation: 'whatsapp-pulse 2s ease-out infinite',
          pointerEvents: 'none',
        }} />
        <WhatsAppIcon className="w-7 h-7" style={{ color: '#fff', position: 'relative', zIndex: 1 }} />
      </a>

      {/* WhatsApp pulse animation keyframes */}
      <style>{`
        @keyframes whatsapp-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        /* On mobile: lift above the bottom nav bar (80px height) */
        @media (max-width: 1023px) {
          #whatsapp-float-btn {
            bottom: 110px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;

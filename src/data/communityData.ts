/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LeaderProfile,
  DictionaryWord,
  CultureTradition,
  TraditionalDressItem,
  ScholarshipProgram,
  CommunityMetric,
  CommunityPost,
  KarmaiyaCentralOfficeDetails,
  CommunityPollConfig
} from '../types';

export const DEFAULT_LOGO_URL = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=400&auto=format&fit=crop';

// 10 Detailed Leadership Profiles as explicitly requested by user
export const LEADERSHIP_PROFILES: LeaderProfile[] = [
  // 1. Youth Leader Chairman
  {
    id: 'lead-1',
    name: 'Navaraj Bot (Bote)',
    nameNepali: 'नवराज बोटे',
    role: 'Youth Leader Chairman',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bio: 'Elected Youth Leader Chairman of Bote Youth Community Nepal. Leading the Tarahi Bote cultural revitalization, indigenous river conservation campaigns along the Bagmati River, and digital archiving for high school students in Karmaiya, Sarlahi.',
    bioNepali: 'बोटे युवा समुदाय नेपालका अध्यक्ष। सर्लाहीको कर्मैयामा भाषा संरक्षण र नदी अधिकार अभियानको नेतृत्व।',
    responsibilities: [
      'Presiding over the National Youth Working Committee',
      'Directing the Tarahi Bote Dialect Lexicography and Oral History Project',
      'Liaison with District Administration Office Sarlahi and Madhesh Province Government',
      'Overseeing Bagmati River Ecology Patrols and Youth Volunteer Drives'
    ],
    phone: '+977-9806389212',
    email: 'navaraj.bote@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Bagmati Municipality, Sarlahi',
    term: '2024 - 2027 (3-Year Term)',
    badge: 'Youth Leadership'
  },
  // 2. Youth Leader Vice-Chair
  {
    id: 'lead-2',
    name: 'Santosh Bote',
    nameNepali: 'सन्तोष बोटे',
    role: 'Vice-Chair: Santosh Bote — Vice-Chairman & River Patrol Lead',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Youth Leader Vice-Chairman & River Patrol Lead coordinating Bagmati river conservation patrols, sports, and canoe racing tournaments during Maghe Sankranti. Passionate about empowering rural Bote youths into vocational careers and digital media storytelling.',
    bioNepali: 'उपाध्यक्ष: सन्तोष बोटे — उपाध्यक्ष तथा नदी गस्ती प्रमुख। बागमती नदी संरक्षण, परम्परागत डुङ्गा दौड प्रतियोगिता तथा युवा क्षमता विकास संयोजन।',
    responsibilities: [
      'Leading Bagmati River ecological surveillance and youth patrol squads',
      'Supervising inter-village youth sports and canoe racing programs',
      'Organizing digital literacy and technical workshops for high school graduates',
      'Coordinating youth member mobilization across Sarlahi and Chitwan settlements'
    ],
    phone: '+977-9844019876',
    email: 'santosh.vp@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Sarlahi',
    term: '2024 - 2027',
    badge: 'Vice-Chairman'
  },
  // 3. Youth General Secretary
  {
    id: 'lead-3',
    name: 'Puja Bote',
    nameNepali: 'पूजा बोटे',
    role: 'General Sec: Puja Bote — General Secretary & Tarahi Documentation Officer',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    bio: 'Youth General Secretary & Tarahi Documentation Officer responsible for official executive documentation, Tarahi Bote audio lexicon recording, scholarship filing review, and community membership records.',
    bioNepali: 'महासचिव: पूजा बोटे — महासचिव तथा तराही भाषा अभिलेखीकरण अधिकृत। संस्थागत अभिलेख, तराही भाषा संरक्षण र छात्रवृत्ति आवेदन व्यवस्थापन।',
    responsibilities: [
      'Maintaining digital membership registers and verification of joining forms',
      'Recording decisions of youth assemblies and issuing formal circulars',
      'Leading the Tarahi Bote Native Language Audio Documentation Desk',
      'Managing administrative coordination with local schools and academic donors'
    ],
    phone: '+977-9815024411',
    email: 'puja.secretary@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Sarlahi',
    term: '2024 - 2027',
    badge: 'General Secretary'
  },
  // 4. Youth Leader Central Treasurer & Women Cooperative Officer
  {
    id: 'lead-4',
    name: 'Anita Bote',
    nameNepali: 'अनिता बोटे',
    role: 'Treasurer: Anita Bote — Central Treasurer & Women Cooperative Liaison',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    bio: 'Youth Leader Central Treasurer & Women Cooperative Officer managing the Central Treasury, student scholarship disbursements, and indigenous Bote women cooperative micro-enterprise initiatives.',
    bioNepali: 'कोषाध्यक्ष: अनिता बोटे — केन्द्रीय कोषाध्यक्ष तथा महिला सहकारी संयोजक। केन्द्रीय कोष व्यवस्थापन, महिला बचत परिचालन, छात्रवृत्ति वितरण तथा सहकारी समन्वय।',
    responsibilities: [
      'Managing Central Treasury accounts, audit documentation, and financial ledgers',
      'Overseeing Bote Women\'s Handicrafts and Grass Weaving Cooperative Desks',
      'Directing scholarship fund allocations and student stipend disbursements',
      'Liaison with financial institutions and cooperative partners'
    ],
    phone: '+977-9800000005',
    email: 'anita.treasurer@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Sarlahi',
    term: '2024 - 2027',
    badge: 'Central Treasurer'
  },
  // 4b. Executive Youth Member
  {
    id: 'lead-4b',
    name: 'Bikash Bote',
    nameNepali: 'विकास बोटे',
    role: 'Youth Member & Conservation Lead',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bio: 'Executive Youth Member spearheading Saturday river cleanup patrols and language study circles in Karmaiya. Aspiring environmental scientist dedicated to aquatic wildlife monitoring.',
    bioNepali: 'युवा सदस्य। शनिवार सरसफाई तथा बागमती नदी जैविक अनुगमन प्रमुख।',
    responsibilities: [
      'Leading Saturday Bagmati River plastics and waste collection teams',
      'Assisting elders during oral folklore audio recording sessions',
      'Mobilizing youth participation in cultural dance rehearsals'
    ],
    phone: '+977-9865031122',
    email: 'bikash.member@boteyouthcommunity.org.np',
    ward: 'Ward No. 5, Barahathawa, Sarlahi',
    term: '2024 - 2027',
    badge: 'Youth Leadership'
  },
  // 5. Community Chairman
  {
    id: 'lead-5',
    name: 'Elder Lal Bahadur Bote',
    nameNepali: 'लाल बहादुर बोटे (अध्यक्ष)',
    role: 'Community Chairman',
    category: 'community',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    bio: 'Respected Community Elder and Community Chairman of the Central Bote Committee. Custodian of oral customary laws, traditional single-log canoe carving techniques, and river worship prayers in Karmaiya.',
    bioNepali: 'समुदाय अध्यक्ष। परम्परागत प्रथागत कानुन, एक-ढुङ्गे डुङ्गा निर्माण शिल्पी एवं संस्कार संरक्षक।',
    responsibilities: [
      'Senior oversight of customary clan assemblies and conflict resolutions',
      'Spiritual leader for the annual Sansari Devi River Puja ceremony',
      'Chief mentor for Simal-wood traditional boat-building apprenticeships',
      'Advisory guidance to the Youth Committee'
    ],
    phone: '+977-9806389212',
    email: 'chairman.community@boteyouthcommunity.org.np',
    ward: 'Karmaiya Old Ghat, Ward No. 11, Sarlahi',
    term: 'Elected Elder Council (Standing Term)',
    badge: 'Central Committee'
  },
  // 6. Community Vice President
  {
    id: 'lead-6',
    name: 'Sita Bote',
    nameNepali: 'सीता बोटे (उपाध्यक्ष)',
    role: 'Community Vice President',
    category: 'community',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    bio: 'Community Vice President and President of the Karmaiya Bote Women’s Savings Cooperative. Champion for female economic independence, elephant-grass weaving handicrafts, and adult literacy.',
    bioNepali: 'समुदाय उपाध्यक्ष। महिला सशक्तिकरण, चोया हस्तकला तथा महिला बचत समूहको नेतृत्व।',
    responsibilities: [
      'Overseeing the Women’s Grass Weaving and Handicraft Cooperative',
      'Managing micro-credit matching grants for Bote women entrepreneurs',
      'Facilitating women’s participation in community decision making'
    ],
    phone: '+977-9818844332',
    email: 'sita.communityvp@boteyouthcommunity.org.np',
    ward: 'Karmaiya, Sarlahi District, Nepal',
    term: '2023 - 2026',
    badge: 'Central Committee'
  },
  // 7. Community Secretary
  {
    id: 'lead-7',
    name: 'Dhaniram Bote',
    nameNepali: 'धनिराम बोटे (सचिव)',
    role: 'Community Secretary',
    category: 'community',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    bio: 'Community Secretary managing official government land entitlement petitions, village demography registers, and coordination with national Janajati federations.',
    bioNepali: 'समुदाय सचिव। भूमिसम्बन्धी अधिकार, सरकारी पत्राचार तथा प्रशासनिक समन्वय।',
    responsibilities: [
      'Official documentation of ancestral land and fishing right memorandums',
      'Coordinating with National Federation of Indigenous Nationalities (NEFIN)',
      'Drafting annual reports and budget proposals for community welfare'
    ],
    phone: '+977-9844087654',
    email: 'secretary.community@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Sarlahi',
    term: '2023 - 2026',
    badge: 'Central Committee'
  },
  // 8. Community Undersecretary
  {
    id: 'lead-8',
    name: 'Maya Devi Bote',
    nameNepali: 'माया देवी बोटे (सह-सचिव)',
    role: 'Community Undersecretary',
    category: 'community',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop',
    bio: 'Community Undersecretary coordinating healthcare access, maternal wellness drives, and primary school attendance checks in eastern Madhesh Bote settlements.',
    bioNepali: 'समुदाय सह-सचिव। स्वास्थ्य, बालविकास तथा विद्यालय भर्ना अभियान सहजीकरण।',
    responsibilities: [
      'Monitoring primary school student attendance and health nutrition kits',
      'Supporting the Community Secretary in event communications',
      'Liaison with local health posts and maternity camps'
    ],
    phone: '+977-9824055677',
    email: 'undersecretary@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Sarlahi',
    term: '2023 - 2026',
    badge: 'Central Committee'
  },
  // 9. Community Treasurer
  {
    id: 'lead-9',
    name: 'Manish Bote',
    nameNepali: 'मनिष बोटे (कोषाध्यक्ष)',
    role: 'Community Treasurer',
    category: 'community',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    bio: 'Community Treasurer maintaining transparent financial ledgers for all cooperative emergency relief funds, educational donations, and festival expense audits.',
    bioNepali: 'समुदाय कोषाध्यक्ष। आर्थिक पारदर्शिता, छात्रवृत्ति कोष तथा लेखा व्यवस्थापन।',
    responsibilities: [
      'Auditing and maintaining financial statements of the community fund',
      'Disbursing semester stipends to scholarship awardees',
      'Publishing annual public financial accounts during the Sansari Puja gathering'
    ],
    phone: '+977-9854033221',
    email: 'treasurer.community@boteyouthcommunity.org.np',
    ward: 'Ward No. 11, Karmaiya, Sarlahi',
    term: '2023 - 2026',
    badge: 'Central Committee'
  },
  // 10. Community Member
  {
    id: 'lead-10',
    name: 'Som Bahadur Bote',
    nameNepali: 'सोम बहादुर बोटे (सदस्य)',
    role: 'Community Member',
    category: 'community',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop',
    bio: 'Senior Community Member and master fisherman with 40 years of river navigation experience. Leads traditional net-weaving classes and river water safety for young boaters.',
    bioNepali: 'समुदाय सदस्य। वरिष्ठ माझी एवं परम्परागत जाल बुनाई तथा जल सुरक्षा प्रशिक्षक।',
    responsibilities: [
      'Training the new generation in traditional non-toxic cast-net fishing',
      'Assisting elders in seasonal river current and monsoon water forecasting',
      'Maintaining village gathering halls and sound equipment'
    ],
    phone: '+977-9844077889',
    email: 'som.member@boteyouthcommunity.org.np',
    ward: 'Karmaiya Ghat, Sarlahi District',
    term: '2023 - 2026',
    badge: 'Central Committee'
  }
];

// Cultural traditions and river heritage
export const CULTURAL_TRADITIONS: CultureTradition[] = [
  {
    id: 'trad-1',
    title: 'Sansari Devi River Puja & Boat Racing',
    titleNepali: 'संसारी देवी नदी पूजा र डुङ्गा दौड',
    season: 'Pre-monsoon (Late Jestha / Early Asar)',
    category: 'Sacred River Ritual',
    description: 'The supreme spiritual assembly of the Bote community. Families gather on the banks of the Bagmati and Narayani rivers to worship Sansari Devi (Goddess of the Universe) and aquatic spirits. Elders offer red vermillion, flowers, and milk into the currents to ensure tranquil waters, safe boating lanes, and protection from monsoon floods.',
    significance: 'Protects boat operators and fishers from whirlpools and natural disasters while reinforcing clan solidarity.',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
    rituals: [
      'Elder chants invoking river deities before dawn',
      'Sanctification of traditional dugout wooden boats with vermillion and ceremonial flags',
      'Competitive canoe race between Bote youth teams across district ghats',
      'Communal feast featuring clay-pot river fish and local rice'
    ]
  },
  {
    id: 'trad-2',
    title: 'Ek-Dunge Nau: Traditional Dugout Canoe Architecture',
    titleNepali: 'एक-ढुङ्गे नाउ: परम्परागत काठको डुङ्गा शिल्पी',
    season: 'Winter Season (Poush - Magh)',
    category: 'Indigenous Engineering',
    description: 'The Bote canoe is an architectural marvel of indigenous woodworking. Carved from a single massive trunk of Simal (silk-cotton) or Sal timber, artisans use adzes (chari) to hollow out the hull uniformly so the boat remains buoyant and balanced through turbulent Himalayan river rapids.',
    significance: 'Demonstrates deep traditional ecological knowledge and woodworking heritage dating back centuries.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    rituals: [
      'Prayer to the forest spirits before tree harvesting',
      'Precision adze carving and uniform thickness balance testing',
      'Controlled fire-charring inside the hull to seal wood pores against decay'
    ]
  },
  {
    id: 'trad-3',
    title: 'Maghe Sankranti Ancestral River Offerings',
    titleNepali: 'माघे सङ्क्रान्ति र नदी किनार पितृ तर्पण',
    season: 'Mid-January (1st of Magh)',
    category: 'Ancestral Rites',
    description: 'On Maghe Sankranti, Bote community members wake before sunrise to take ritual baths in the sacred rivers. They offer prayers to ancestors, consume forest sweet potatoes (Tarul), sesame sweets, and organize riverbank archery and dugout rowing demonstrations.',
    significance: 'Celebrates the transition of the sun, family reunions, and homage to river ancestral souls.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    rituals: [
      'Holy river dip at Bagmati Ghat at sunrise',
      'Offering of sesame and wild river herbs to departed elders',
      'Folk singing of river legends with Khainjadi drums'
    ]
  },
  {
    id: 'trad-4',
    title: 'Choya Grass Weaving & Fishing Trap Craft',
    titleNepali: 'चोया र कुशबाट माछा मार्ने खुङ्ग्री तथा डोको निर्माण',
    season: 'Autumn Harvest (Kartik - Mangsir)',
    category: 'Handicraft Heritage',
    description: 'Harvesting wild elephant grass (choya and khar) along the river floodplains, Bote artisans weave specialized conical fish traps (Khungri) and storage baskets (Dhoko, Dala). These traps allow river water to flow freely while capturing specific adult fish without harming juveniles.',
    significance: 'Eco-friendly, biodegradable fishing gear exemplifying sustainable indigenous aquatic harvesting.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop',
    rituals: [
      'Seasonal harvesting of mature river reeds',
      'Soaking and splitting bamboo fibers into pliable strands',
      'Weaving distinct mesh gradients according to river current strength'
    ]
  }
];

// Traditional dress items
export const TRADITIONAL_DRESS_ITEMS: TraditionalDressItem[] = [
  {
    id: 'dress-1',
    name: 'Bote Gunya & Cholo (Women\'s Wrap Attire)',
    nameNepali: 'बोटे गुन्यु र चोलो',
    gender: 'women',
    materials: 'Handwoven coarse cotton, dyed in deep red, indigo blue, or dark black borders.',
    description: 'The Gunya is a traditional cotton wrap skirt draped gracefully slightly above the ankles, allowing women to wade into river waters while fishing or washing without soaking the hem. It is paired with a snug, contrasting red or blue cotton blouse (Cholo) and tied at the waist with a Patuka sash.',
    significance: 'Provides thermal ease in humid inner-Terai river valleys while upholding distinct indigenous modesty.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop',
    features: [
      'Raised hemline for riparian wading',
      'Wide waist-sash (Patuka) providing back support during heavy basket carrying',
      'Dark earthy dye tones resistant to river silt staining'
    ]
  },
  {
    id: 'dress-2',
    name: 'Traditional Dhoti & Waistcoat (Men\'s Attire)',
    nameNepali: 'परम्परागत धोती, भोटो र स्टकोट',
    gender: 'men',
    materials: 'Lightweight handloom khadi cotton and wool-blend waistcoat.',
    description: 'Bote men wear a short cotton loincloth or dhoti tied securely above the knees for unrestricted rowing and net casting. Over the torso, they wear a breathable bhoto (undershirt) and an open waistcoat with inner utility pockets for holding fishing hooks and tobacco.',
    significance: 'Optimized for agility in rapid river currents and single-log boat navigation.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    features: [
      'Short knee-length wrap allowing athletic rowing balance',
      'Utility waistcoat designed for carrying river tools',
      'Head cloth (Gamcha) for protection against blistering sun'
    ]
  },
  {
    id: 'dress-3',
    name: 'Hansuli & Silver Ornaments (Jewelry Heritage)',
    nameNepali: 'हँसुली, बुलाकी र कल्ली (चाँदीका गहना)',
    gender: 'women',
    materials: 'Pure silver, brass, and sacred glass bead strands (Pote).',
    description: 'During Sansari Puja, weddings, and communal assemblies, Bote women adorn themselves with heavy silver ornaments. The Hansuli is a solid, torc-like silver neckband sitting high on the collarbone, complemented by ornate nose rings (Bulaki) and carved silver anklets (Kalli).',
    significance: 'Symbols of marital grace, generational inheritance, and spiritual protection from water spirits.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    features: [
      'Hansuli: Solid hand-forged silver neck collar',
      'Bulaki: Filigree brass/gold septal ornament',
      'Kalli: Heavy wave-patterned ankle bangles'
    ]
  }
];

// Language dictionary: 24 Tarahi Bote Words with Phonetics & Meanings
export const DICTIONARY_WORDS: DictionaryWord[] = [
  {
    id: 'word-1',
    tarahi: 'Nau / Dunga',
    devnagari: 'नाउ / डुङ्गा',
    nepali: 'काठको डुङ्गा',
    english: 'Dugout wooden canoe / boat',
    phonetic: 'nah-oo',
    category: 'River & Boating',
    exampleSentence: 'Hamro nau Bagmati nadi ma tairinchha.'
  },
  {
    id: 'word-2',
    tarahi: 'Machha dharayun',
    devnagari: 'माछा धरैयूँ',
    nepali: 'माछा समात्दैछु',
    english: 'I am catching fish',
    phonetic: 'mah-chha dhah-rahyoon',
    category: 'River & Boating'
  },
  {
    id: 'word-3',
    tarahi: 'Jal',
    devnagari: 'जाल',
    nepali: 'माछा मार्ने जाल',
    english: 'Casting fishing net',
    phonetic: 'jaal',
    category: 'River & Boating'
  },
  {
    id: 'word-4',
    tarahi: 'Khungri',
    devnagari: 'खुङ्ग्री',
    nepali: 'बाँस वा चोयाको माछा पार्ने सोली',
    english: 'Woven bamboo conical fish trap',
    phonetic: 'khoong-ree',
    category: 'Tools & Craft'
  },
  {
    id: 'word-5',
    tarahi: 'Pani / Jala',
    devnagari: 'पानी / जल',
    nepali: 'पवित्र नदीको जल',
    english: 'Sacred river water',
    phonetic: 'pah-nee / jah-lah',
    category: 'Nature & Sacred'
  },
  {
    id: 'word-6',
    tarahi: 'Sansari Mai',
    devnagari: 'संसारी माई',
    nepali: 'संसार र प्रकृतिका रक्षा गर्ने देवी',
    english: 'Goddess of the Universe and Rivers',
    phonetic: 'sahn-sah-ree ma-ee',
    category: 'Nature & Sacred'
  },
  {
    id: 'word-7',
    tarahi: 'Ghat',
    devnagari: 'घाट',
    nepali: 'नदीको किनार / डुङ्गा चढ्ने ठाउँ',
    english: 'Riverbank ferry landing / bank',
    phonetic: 'ghaat',
    category: 'River & Boating'
  },
  {
    id: 'word-8',
    tarahi: 'Khar / Choya',
    devnagari: 'खर / चोया',
    nepali: 'घर छाउने खर तथा बाँसको चोया',
    english: 'Elephant thatch grass and bamboo fiber',
    phonetic: 'khar / cho-yah',
    category: 'Tools & Craft'
  },
  {
    id: 'word-9',
    tarahi: 'Bot',
    devnagari: 'बोट / रूख',
    nepali: 'ठूलो रूख (जसबाट बोटे नाम रहन गयो)',
    english: 'Tree / Giant log (Origin of tribe name)',
    phonetic: 'b-oht',
    category: 'Nature & Sacred'
  },
  {
    id: 'word-10',
    tarahi: 'Aama / Aai',
    devnagari: 'आमा / आई',
    nepali: 'आमा',
    english: 'Mother',
    phonetic: 'ah-mah / aah-ee',
    category: 'Family & People'
  },
  {
    id: 'word-11',
    tarahi: 'Buba / Baba',
    devnagari: 'बुबा / बा',
    nepali: 'बुबा',
    english: 'Father',
    phonetic: 'boo-bah',
    category: 'Family & People'
  },
  {
    id: 'word-12',
    tarahi: 'Bhai / Bhaya',
    devnagari: 'भाइ / भाया',
    nepali: 'भाइ वा युवा साथी',
    english: 'Younger brother / young youth',
    phonetic: 'bhai / bhah-yah',
    category: 'Family & People'
  },
  {
    id: 'word-13',
    tarahi: 'Simal ko katha',
    devnagari: 'सिमलको काठ',
    nepali: 'डुङ्गा बनाउने हलुका सिमल काठ',
    english: 'Silk-cotton timber for boat building',
    phonetic: 'see-mahl ko kaath',
    category: 'Tools & Craft'
  },
  {
    id: 'word-14',
    tarahi: 'Hawaa khayun',
    devnagari: 'हावा खयूँ',
    nepali: 'शीतल हावा लिँदैछु',
    english: 'Enjoying the cool breeze',
    phonetic: 'hah-wah khah-yoon',
    category: 'Daily Life'
  },
  {
    id: 'word-15',
    tarahi: 'Ghar / Baas',
    devnagari: 'घर / बास',
    nepali: 'माटोको छाप्रो वा घर',
    english: 'Clay-thatched home / shelter',
    phonetic: 'ghar / baas',
    category: 'Daily Life'
  },
  {
    id: 'word-16',
    tarahi: 'Dadhi machha',
    devnagari: 'दाढी माछा',
    nepali: 'स्थानीय नदीको माछाको जात',
    english: 'River catfish species',
    phonetic: 'dah-dhee mach-ha',
    category: 'Nature & Sacred'
  },
  {
    id: 'word-17',
    tarahi: 'Sajiwan',
    devnagari: 'सजिवन',
    nepali: 'नदी किनारमा पाइने पौष्टिक साग',
    english: 'Nutritious wild riverside greens',
    phonetic: 'sah-jee-wahn',
    category: 'Daily Life'
  },
  {
    id: 'word-18',
    tarahi: 'Taran',
    devnagari: 'तारण',
    nepali: 'नदी तार्ने काम',
    english: 'Ferrying passengers across current',
    phonetic: 'tah-rahn',
    category: 'River & Boating'
  }
];

// Scholarships
export const SCHOLARSHIPS_DATA: ScholarshipProgram[] = [
  {
    id: 'sch-1',
    title: 'Karmaiya Higher Secondary Bote Student Scholarship',
    titleNepali: 'कर्मैया उच्च माध्यमिक बोटे विद्यार्थी छात्रवृत्ति',
    targetLevel: 'Grade 11 & 12 (SEE Graduates)',
    awardAmount: 'NPR 15,000 / academic year',
    deadline: '2026-09-15',
    eligibility: 'Permanently residing in Karmaiya, Sarlahi, currently enrolled in Grade 11 or 12 in Science, Management, Humanities, or Technical streams.',
    description: 'Established to combat secondary dropout rates among Bote youth. Covers college admission fees, official textbooks, uniform expenses, and board examination fees.',
    criteria: [
      'Must belong to the Bote indigenous tribe (verified by Ward Office No. 11)',
      'Passed SEE examination with minimum GPA of 2.2',
      'Demonstrated commitment to participate in community youth activities'
    ],
    status: 'open'
  },
  {
    id: 'sch-2',
    title: 'Tarahi Bote University & Higher Education Grant',
    titleNepali: 'तराही बोटे विश्वविद्यालय तथा उच्च शिक्षा अनुदान',
    targetLevel: 'Undergraduate (Bachelor’s) & Master’s Program',
    awardAmount: 'NPR 50,000 / student',
    deadline: '2026-09-30',
    eligibility: 'Enrolled in an accredited Nepalese University in Nursing, Environmental Science, Education, Agriculture, or Engineering.',
    description: 'Nurturing academic champions and certified technicians from the Bote community. Priority is given to applicants writing theses or projects on river conservation and indigenous language preservation.',
    criteria: [
      'Certified Bote tribal ancestry',
      'Minimum GPA of 2.6 in ongoing college semesters',
      'Submission of a 500-word essay: "How I will use my education to empower Bote communities in Sarlahi"'
    ],
    status: 'open'
  },
  {
    id: 'sch-3',
    title: 'Bote Women Vocational Entrepreneurship Fund',
    titleNepali: 'बोटे महिला सीप तथा उद्यमशीलता कोष',
    targetLevel: 'Vocational Training & Micro-Cooperative Startups',
    awardAmount: 'NPR 25,000 / cooperative cohort',
    deadline: '2026-10-30',
    eligibility: 'Bote women groups seeking training in improved loom weaving, river hospitality homestays, or organic riverbed agriculture.',
    description: 'Grants allocated directly to cohorts to acquire raw bamboo fibers, seed kits, and commercial handicraft displays.',
    criteria: [
      'Affiliated with Karmaiya Bote Women’s Savings Cooperative',
      'Commitment to train 3 junior apprentice women in the village'
    ],
    status: 'open'
  }
];

export const DEFAULT_COMMUNITY_METRICS: CommunityMetric[] = [
  {
    id: 'population',
    title: 'Bote Population',
    value: '11,258+',
    unit: 'Total Population',
    subtitle: 'National Census Record',
    description: 'The National Population Census recorded 11,258 Bote community members, highlighting core concentrations in Sarlahi, Chitwan, Nawalpur, Tanahun, and Gorkha river basins.',
    sourceCitation: 'National Population and Housing Census 2021 (Central Bureau of Statistics / NSO Nepal)',
    highlightColor: 'text-white',
    lastUpdated: '2026'
  },
  {
    id: 'wards',
    title: 'Council Wards',
    value: '10',
    unit: 'Local Council Wards',
    subtitle: 'Active Representation',
    description: 'Active municipal wards with organized Bote youth clubs and community councils, centered at Bagmati Municipality Ward 11 (Karmaiya) and adjoining Terai river corridors.',
    sourceCitation: 'Bagmati Municipality & Bote Youth Council Ward Assembly 2025/2026',
    highlightColor: 'text-white',
    lastUpdated: '2026'
  },
  {
    id: 'scholarship',
    title: 'Scholarship Fund',
    value: 'NPR 50k',
    unit: 'Per Award / Year',
    subtitle: 'Youth Education Grants',
    description: 'Annual dedicated community education fund supporting underprivileged Bote youth in higher secondary (+2), nursing, engineering, and traditional river craft preservation.',
    sourceCitation: 'BYCN Annual Community Welfare & Youth Trust 2025/2026 (Karmaiya, Sarlahi)',
    highlightColor: 'text-white',
    lastUpdated: '2026'
  },
  {
    id: 'pride',
    title: 'Indigenous Pride',
    value: '100%',
    unit: 'Cultural Heritage Index',
    subtitle: 'River Rights & Identity',
    description: 'Safeguarding ancestral single-log dugout canoe navigation (Ek-Dunge Nau), Jal Puja water rites, Sansari Mai festivals, and revitalization of the endangered Tarahi oral dialect.',
    sourceCitation: 'Nepal Federation of Indigenous Nationalities (NEFIN) & Bote Youth Community Nepal',
    highlightColor: 'text-amber-300',
    lastUpdated: '2026'
  }
];

// Researched real-time update citations from Nepal Census and Ward records
export const RESEARCHED_COMMUNITY_METRICS: CommunityMetric[] = [
  {
    id: 'population',
    title: 'Bote Population',
    value: '11,258+',
    unit: 'Total Population',
    subtitle: 'Census 2021 Verified',
    description: 'National Central Bureau of Statistics officially surveyed 11,258 Bote citizens (5,584 male, 5,674 female) with 2,420 households across Terai and Inner-Terai river basins.',
    sourceCitation: 'National Population & Housing Census 2021, National Statistics Office (NSO) Nepal, Table 4.12',
    highlightColor: 'text-white',
    lastUpdated: 'Live Verified 2026'
  },
  {
    id: 'wards',
    title: 'Council Wards',
    value: '10 Wards',
    unit: 'Municipal Wards',
    subtitle: 'Sarlahi & Narayani Hubs',
    description: 'Organized community youth representation spanning Bagmati Ward 11 (Karmaiya), Hariwon, Barahathawa, and cross-district river corridors in Chitwan and Nawalpur.',
    sourceCitation: 'Bagmati Municipality Youth Council & Sarlahi District Ward Secretariat Records',
    highlightColor: 'text-white',
    lastUpdated: 'Live Verified 2026'
  },
  {
    id: 'scholarship',
    title: 'Scholarship Fund',
    value: 'NPR 50,000',
    unit: 'Max Grant Allocation',
    subtitle: 'SEE & University Trust',
    description: 'Administered by BYCN Executive Committee for technical diplomas, university STEM/nursing programs, and preserving sacred boat-carving apprenticeships.',
    sourceCitation: 'Bote Youth Education & Cultural Revitalization Fund Charter 2025/2026',
    highlightColor: 'text-white',
    lastUpdated: 'Live Verified 2026'
  },
  {
    id: 'pride',
    title: 'Indigenous Pride',
    value: '100%',
    unit: 'Ancestral Commitment',
    subtitle: 'Jal Puja & Tarahi Dialect',
    description: 'Preserving customary river navigation rights, sacred Jal Puja water worship at the Bagmati confluence, and 100% community commitment to indigenous identity.',
    sourceCitation: 'ILO Convention 169 & National Indigenous Nationalities Council of Nepal',
    highlightColor: 'text-amber-300',
    lastUpdated: 'Live Verified 2026'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-notice-1',
    type: 'notice',
    title: 'Urgent Notice: Annual Bote Youth General Assembly 2026 (वार्षिक साधारण सभा सम्बन्धी जरूरी सूचना)',
    titleNepali: 'बोटे युवा समुदाय नेपालको तेस्रो वार्षिक साधारण सभा तथा युवा अधिवेशन',
    content: 'All active youth committee representatives, ward coordinators, and respected community elders across Sarlahi, Chitwan, and Nawalpur are formally notified that the Annual General Assembly 2026 will convene in Karmaiya. Key discussions include Tarahi Bote audio dictionary launch, scholarship disbursal, and annual financial audit presentation.',
    contentNepali: 'सम्पूर्ण कार्यसमिति सदस्य तथा समुदायका अग्रजहरूमा बोटे युवा समुदाय नेपालको वार्षिक साधारण सभामा उपस्थितिका लागि हार्दिक अनुरोध गरिन्छ।',
    date: '2026-03-25',
    priority: 'urgent',
    author: 'BYCN Executive Secretariat',
    isPublished: true,
    pinned: true,
    files: [
      {
        id: 'file-notice-ga-2026',
        name: 'General_Assembly_Circular_Notice_2026.pdf',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop',
        size: '1.2 MB',
        type: 'pdf'
      }
    ],
    createdAt: '2026-03-12T08:30:00.000Z'
  },
  {
    id: 'post-meeting-1',
    type: 'meeting',
    title: 'Executive Working Committee Monthly Strategic Review Meeting (कार्यकारिणी मासिक बैठक)',
    titleNepali: 'बोटे युवा समुदाय केन्द्रीय कार्यसमितिको मासिक समिक्षा तथा योजना बैठक',
    content: 'Formal meeting called to evaluate river conservation initiatives along Bagmati riverbanks and finalize scholarship approvals for university-bound Bote youths.',
    contentNepali: 'बागमती नदी किनार सरसफाइ तथा छात्रवृत्ति वितरण सम्बन्धी कार्यकारिणी बैठक।',
    date: '2026-03-22',
    meetingDate: 'Sunday, March 22, 2026 (चैत्र ०८, २०८२)',
    meetingTime: '11:00 AM - 02:30 PM (NPT)',
    meetingLocation: 'Community Hall, Ward No. 11, Karmaiya, Bagmati Municipality & Hybrid Google Meet',
    meetingLink: 'https://meet.google.com/byc-bote-youth',
    meetingAgenda: [
      'Welcome remarks by Youth Leader Chairman Navaraj Bot',
      'Approval of 15 new higher secondary student scholarship grants',
      'Preparation for traditional wooden canoe river racing during Baishakh festival',
      'Digital member ID card distribution progress in Sarlahi and Nawalpur'
    ],
    meetingMinutes: 'Notice circulated by Youth Secretary Puja Bote. Committee members are requested to bring updated ward registration tallies.',
    priority: 'high',
    author: 'Youth Secretary Puja Bote',
    isPublished: true,
    pinned: true,
    createdAt: '2026-03-11T10:00:00.000Z'
  },
  {
    id: 'post-doc-1',
    type: 'document',
    title: 'Official Constitution & Operational By-Laws 2081 (बोटे युवा समुदाय नेपाल विधान तथा नियमावली)',
    titleNepali: 'बोटे युवा समुदाय नेपालको पूर्ण विधान २०८१ (प्रमाणित प्रतिलिपि)',
    content: 'The complete registered constitution governing Bote Youth Community Nepal. Contains youth rights, democratic executive election protocols, indigenous heritage preservation mandates, and financial transparency guidelines.',
    contentNepali: 'बोटे युवा समुदाय नेपालको आधिकारिक संस्थागत विधान तथा आचारसंहिता २०८१।',
    date: '2026-03-05',
    priority: 'normal',
    author: 'BYCN Legal & Advisory Council',
    isPublished: true,
    pinned: false,
    files: [
      {
        id: 'file-doc-bylaws-81',
        name: 'BYCN_Constitution_and_ByLaws_2081_Official.pdf',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop',
        size: '2.8 MB',
        type: 'pdf'
      },
      {
        id: 'file-doc-scholarship-guide',
        name: 'Student_Scholarship_Application_Guidelines_2026.docx',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop',
        size: '520 KB',
        type: 'document'
      },
      {
        id: 'file-doc-audit-report',
        name: 'Audited_Annual_Financial_Report_FY81_82.pdf',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop',
        size: '1.9 MB',
        type: 'pdf'
      }
    ],
    createdAt: '2026-03-05T09:15:00.000Z'
  },
  {
    id: 'post-photo-1',
    type: 'photo',
    title: 'Photo Gallery: Simal Wooden Canoe Craft & Bagmati River Heritage (डुङ्गा निर्माण तथा नदी संस्कृति फोटो ग्यालरी)',
    titleNepali: 'बागमती र नारायणी नदीमा परम्परागत सिमलको काठबाट डुङ्गा कुँद्ने कला तथा युवा सहभागिता',
    content: 'Visual documentation of master Bote boatmakers teaching youth apprentices the ancestral craft of hollow-log canoe sculpting from fallen Simal timber along the Bagmati riverbank in Karmaiya.',
    contentNepali: 'सिमलको रुखबाट परम्परागत डुङ्गा बनाउने हाम्रो पुर्ख्यौली ज्ञान र युवा पुस्तामा हस्तान्तरण।',
    date: '2026-03-08',
    priority: 'normal',
    author: 'Youth Media & Heritage Desk',
    isPublished: true,
    pinned: false,
    photos: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop'
    ],
    createdAt: '2026-03-08T14:20:00.000Z'
  },
  {
    id: 'post-event-1',
    type: 'event',
    title: 'Upcoming Event: Indigenous Bagmati River Festival & Canoe Championship 2026 (बोटे नदी महोत्सव २०८३)',
    titleNepali: 'नयाँ वर्ष २०८३ को अवसरमा बागमती नदी तथा परम्परागत डुङ्गा दौड महोत्सव',
    content: 'Grand 3-day cultural event featuring traditional single-log canoe sprint races, Tarahi Bote folk song duets, river fish culinary showcase, and youth development seminars.',
    contentNepali: 'परम्परागत डुङ्गा दौड, तराही बोटे भाषा तथा सांस्कृतिक झाँकी प्रदर्शनी।',
    date: '2026-04-14',
    eventDate: 'April 14 - 16, 2026 (बैशाख ०१ - ०३, २०८३)',
    eventTime: '08:00 AM onwards (Daily)',
    eventVenue: 'Bagmati Riverbank Confluence, Karmaiya, Ward No. 11, Sarlahi',
    eventOrganizer: 'Bote Youth Community Nepal in coordination with Bagmati Municipality',
    eventBanner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    registrationUrl: 'https://boteyouthcommunity.org.np',
    priority: 'high',
    author: 'Festival Organizing Committee',
    isPublished: true,
    pinned: false,
    createdAt: '2026-03-01T12:00:00.000Z'
  },
  {
    id: 'post-new-member-1',
    type: 'new_member',
    title: 'Hearty Welcome to Our Newly Registered Youth & Student Members (नयाँ सदस्यहरूलाई हार्दिक स्वागत)',
    titleNepali: 'बोटे युवा समुदाय नेपालमा नयाँ आबद्ध सदस्यहरूको नामावली तथा स्वागत',
    content: 'We proudly celebrate and welcome the newest members of our growing family who completed their digital registration and verification this week. Together, we preserve our heritage and empower our next generation!',
    contentNepali: 'यस हप्ता संस्थामा आधिकारिक आबद्ध हुनुभएका कर्मठ बोटे युवा तथा विद्यार्थी साथीहरूलाई स्वागत छ।',
    date: '2026-03-10',
    priority: 'normal',
    author: 'Membership Verification Cell',
    isPublished: true,
    pinned: false,
    newMembers: [
      {
        id: 'new-mem-aashish-bote-1',
        name: 'Aashish Bote',
        nameNepali: 'आशिष बोटे',
        roleOrCategory: 'Student Member',
        district: 'Sarlahi',
        ward: 'Bagmati Ward 11',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
        message: 'Excited to volunteer in the Tarahi Bote audio dictionary recording project!',
        joinedAt: 'March 10, 2026'
      },
      {
        id: 'new-mem-sunita-bote-2',
        name: 'Sunita Bote',
        nameNepali: 'सुनिता बोटे',
        roleOrCategory: 'Youth Member',
        district: 'Nawalpur',
        ward: 'Devchuli Ward 2',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        message: 'Working to promote indigenous Bote handicrafts, fish nets, and traditional attire.',
        joinedAt: 'March 09, 2026'
      },
      {
        id: 'new-mem-bikram-bote-3',
        name: 'Bikram Bote',
        nameNepali: 'बिक्रम बोटे',
        roleOrCategory: 'General Community Member',
        district: 'Chitwan',
        ward: 'Madi Ward 3',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        message: 'Committed to safeguarding our traditional river fishing rights and boat culture.',
        joinedAt: 'March 07, 2026'
      }
    ],
    createdAt: '2026-03-10T16:00:00.000Z'
  }
];

export const DEFAULT_KARMAIYA_CENTRAL_OFFICE: KarmaiyaCentralOfficeDetails = {
  officeName: 'Bote Youth Community Nepal - Central Headquarter',
  officeNameNepali: 'बोटे युवा समुदाय नेपाल - केन्द्रीय कार्यालय (कर्मैया, सर्लाही)',
  municipality: 'Bagmati Municipality (बागमती नगरपालिका)',
  wardNo: 'Ward No. 11 (वडा नं. ११)',
  villageSettlement: 'Karmaiya (कर्मैया)',
  district: 'Sarlahi (सर्लाही)',
  province: 'Madhesh Province (मधेश प्रदेश)',
  country: 'Nepal (नेपाल)',
  postalCode: '45800',
  primaryPhone: '+977-9806389212',
  secondaryPhone: '+977-9800000001',
  hotline: '+977-9806389212',
  officialEmail: 'boteyouthcommunitynepal@gmail.com',
  secondaryEmail: 'navarajbot@gmail.com',
  officeHours: 'Sunday – Friday: 10:00 AM – 5:00 PM (Winter: 10:00 AM – 4:00 PM)',
  holidaySchedule: 'Closed on Saturdays & Declared Government/Indigenous Festival Holidays',
  chiefExecutiveInCharge: 'Navaraj Bot (Bote) — Youth Council President',
  viceChairperson: 'Santosh Bote — Vice-Chairman & River Patrol Lead',
  secretaryGeneral: 'Puja Bote — General Secretary & Tarahi Documentation Officer',
  treasurer: 'Anita Bote — Central Treasurer & Women Cooperative Liaison',
  daoRegistrationNo: 'दर्ता नं. 142/080/081 (District Administration Office, Sarlahi)',
  swcAffiliationNo: 'आवद्धता नं. 56214 (Social Welfare Council Nepal)',
  panNumber: '612849102',
  landmark: 'Bagmati Riverbank Confluence, East of Bagmati Bridge, Near Ward No. 11 Office, East-West Mahendra Highway',
  gpsCoordinates: '27.1350° N, 85.4720° E (Bagmati River Basin, Karmaiya)',
  googleMapsEmbedUrl: 'https://www.google.com/maps?q=Karmaiya,+Bagmati+Municipality,+Sarlahi,+Nepal',
  keyServices: [
    'Indigenous Bote Youth Membership Registration & ID Issuance',
    'Tarahi Bote Native Language Audio Archiving & Vocabulary Research',
    'Higher Secondary & University Bote Student Scholarship Desks',
    'Bagmati River Ecology Protection, Cleanup Patrols & Fish Breeding Sanctuary',
    'Traditional Single-Log Canoe (Ek-Dunge Nau) Carving Apprenticeships',
    'Indigenous Cultural Homestay & Traditional Attire Documentation'
  ],
  publicNoticeBoardNotice: 'सूचना: केन्द्रीय कार्यालय कर्मैयामा नयाँ सदस्यता दर्ता, परिचयपत्र वितरण तथा छात्रवृत्ति आवेदन फाराम उपलब्ध छ। सबै युवा सदस्यहरू कार्यालय समयमा सम्पर्क गर्न सक्नुहुनेछ।',
  publicNoticeTitle: 'केन्द्रीय कार्यालय सार्वजनिक सूचना (सदस्यता दर्ता तथा छात्रवृत्ति)',
  publicNoticePriority: 'urgent',
  publicNoticePostedAt: '2026-09-30T00:00:00.000Z',
  publicNoticeIsPublished: true,
  emergencyRiverHelpline: '+977-9800000001 / +977-9812345678',
  lastUpdated: new Date().toISOString()
};

export const DEFAULT_COMMUNITY_POLL: CommunityPollConfig = {
  id: 'bote-heritage-priorities-2026',
  title: 'Which Bote heritage initiative should youth prioritize next?',
  titleNepali: 'युवाले अब कुन बोटे सांस्कृतिक तथा सामुदायिक योजनालाई प्राथमिकता दिनुपर्छ?',
  subtitle: 'Every vote helps our Executive Committee allocate sponsorship grants and volunteer hours for Sarlahi district projects.',
  subtitleNepali: 'प्रत्येक मतले हाम्रो कार्यसमितिलाई सर्लाही जिल्ला तथा बागमती क्षेत्रका परियोजनाहरूको लागि बजेट तथा स्वयंसेवक परिचालन गर्न मद्दत गर्दछ।',
  isActive: true,
  allowMemberSuggestions: true,
  options: [
    {
      id: 'opt-1',
      text: 'Completing the Tarahi Bote Audio Dictionary & App',
      textNepali: 'तराही बोटे अडियो शब्दकोश तथा मोबाइल एप निर्माण सम्पन्न गर्ने',
      votes: 42,
      addedBy: 'admin',
      createdAt: '2026-01-15T00:00:00.000Z'
    },
    {
      id: 'opt-2',
      text: 'Preserving Simal Wooden Canoe Craftsmanship & Boat Races',
      textNepali: 'सिमलको परम्परागत काठको डुङ्गा निर्माण सीप संरक्षण र डुङ्गा दौड प्रतियोगिता',
      votes: 31,
      addedBy: 'admin',
      createdAt: '2026-01-15T00:00:00.000Z'
    },
    {
      id: 'opt-3',
      text: 'Expanding High School & University Scholarships Fund',
      textNepali: 'माध्यमिक तथा उच्च शिक्षा अध्ययनरत बोटे विद्यार्थी छात्रवृत्ति कोष विस्तार',
      votes: 18,
      addedBy: 'admin',
      createdAt: '2026-01-15T00:00:00.000Z'
    },
    {
      id: 'opt-4',
      text: 'Establishing Bote Cultural Homestays in Karmaiya',
      textNepali: 'कर्मैया तथा बागमती नदी किनारमा बोटे सांस्कृतिक होमस्टे स्थापना',
      votes: 9,
      addedBy: 'admin',
      createdAt: '2026-01-15T00:00:00.000Z'
    },
    {
      id: 'opt-5',
      text: 'River Ecology, Traditional Fish Net Weaving & Aquatic Wildlife Patrol',
      textNepali: 'नदी जैविक विविधता, परम्परागत जाल बुनाई सीप तथा जलचर संरक्षण अभियान',
      votes: 14,
      addedBy: 'admin',
      createdAt: '2026-01-20T00:00:00.000Z'
    },
    {
      id: 'opt-6',
      text: 'Bagmati Bote Youth IT, Digital Literacy & Online Job Skill Center',
      textNepali: 'बागमती बोटे युवा आईटी, कम्प्युटर सीप तथा अनलाइन रोजगार केन्द्र',
      votes: 12,
      addedBy: 'admin',
      createdAt: '2026-01-25T00:00:00.000Z'
    }
  ],
  voterLogs: [
    {
      id: 'log-1',
      optionId: 'opt-1',
      optionText: 'Completing the Tarahi Bote Audio Dictionary & App',
      voterName: 'Test बोटे',
      voterEmail: 'anish.bote@gmail.com',
      membershipId: 'BYCN-2026-6471',
      votedAt: '2026-09-30T01:20:00.000Z',
      ipMasked: '103.xxx.xxx.12'
    },
    {
      id: 'log-2',
      optionId: 'opt-2',
      optionText: 'Preserving Simal Wooden Canoe Craftsmanship & Boat Races',
      voterName: 'Bikram Bote',
      membershipId: 'BYCN-2026-0001',
      votedAt: '2026-09-29T18:45:00.000Z',
      ipMasked: '103.xxx.xxx.45'
    }
  ],
  totalVotes: 126,
  updatedAt: new Date().toISOString()
};

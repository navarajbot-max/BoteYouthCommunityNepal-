/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CostumeItem } from '../types';

export const INITIAL_COSTUMES_DATA: CostumeItem[] = [
  {
    id: 'costume-1',
    name: 'Traditional Riverman Attire (Dhoti, Kachhad & Bhewa)',
    nameNepali: 'परम्परागत पुरुष कछाड, धोती र भेषभुषा',
    category: 'daily',
    wearer: 'men',
    fabric: 'Unbleached handloom organic cotton (Khadi/Suti)',
    description: 'The ancient everyday riverine attire worn by Bote boatmen and fishermen along the Bagmati, Narayani, and Kali Gandaki rivers. The Kachhad is wrapped securely above the knees to allow unrestricted motion when navigating swift river rapids and poling dugout canoes (Ek-Dunge Nau).',
    culturalSignificance: 'Symbol of river mastery and ecological harmony. Designed specifically over centuries for aquatic livelihoods and tropical Terai climate.',
    accessories: ['Bhewa (Cotton Headwrap)', 'Simal Wood Amulet', 'Bamboo Belt Ring', 'Nylon-Cotton Net Bag'],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'costume-2',
    name: 'Traditional Female Gunya, Cholo & Patuka Ensemble',
    nameNepali: 'बोटे महिलाको गुन्यू, चोलो र पटुका पहिरन',
    category: 'daily',
    wearer: 'women',
    fabric: 'Coarse hand-dyed cotton with dark crimson & indigo borders',
    description: 'A deeply revered traditional Bote feminine attire featuring a wrapped Gunya ankle skirt, a form-fitted cotton Cholo blouse, and a thick Patuka waist binder that protects the lumbar back during long hours of riverbank net hauling and paddy cultivation.',
    culturalSignificance: 'Represents female resilience, matriarchal river guardianship, and the preservation of indigenous Terai textile craftsmanship.',
    accessories: ['Hansuli (Solid Silver Neck Choker)', 'Bulaki (Gold/Brass Septum Ring)', 'Kalli (Heavy Silver Ankle Cuffs)', 'Potey (Beaded Necklace)'],
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'costume-3',
    name: 'Maghe Sankranti Boat Race & Water Festival Regalia',
    nameNepali: 'माघे सङ्क्रान्ति डुङ्गा दौड तथा जल पुजा विशेष पोशाक',
    category: 'ceremonial',
    wearer: 'both',
    fabric: 'Reinforced woven cotton with saffron and crimson trim',
    description: 'Vibrant festival attire donned during Maghe Sankranti and Sansari Devi Jal Puja. Participants wear sacred white and crimson waistbands adorned with brass bells that chime during rhythmic paddle strokes on the Bagmati River in Karmaiya.',
    culturalSignificance: 'Honors the sacred river spirits and ancestors who pioneered river transportation across Nepal before roads and suspension bridges existed.',
    accessories: ['Peacock Feather Headband', 'Ghunghru (Brass Ankle Bells)', 'Sacred River Clay Tilak', 'Red Ceremonial Ribbon'],
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'costume-4',
    name: 'Traditional Bote Bridal & Wedding Costume',
    nameNepali: 'बोटे परम्परागत वैवाहिक तथा दुलही पहिरन',
    category: 'wedding',
    wearer: 'women',
    fabric: 'Embroidered silk-cotton blend with pure golden zari threads',
    description: 'A magnificent wedding attire steeped in ritual sanctity. The bride is dressed in an auspicious deep scarlet and turmeric-yellow Gunya accented by hand-hammered heirloom silver jewelry passed through three generations.',
    culturalSignificance: 'Sanctifies the union of families and invites blessings from river spirits (Jal Devata) for fertility, abundance, and safe crossings.',
    accessories: ['Chandra-Surya Silver Brooch', 'Kalli Silver Anklets', 'Heirloom Hansuli Collar', 'Red Sindoor Ribbon'],
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'costume-5',
    name: 'Ancestral Fisher Gear & Waterproof Waist Khurpi Belt',
    nameNepali: 'पुर्ख्यौली माछा मार्ने जाल, खुर्पी र भेषभुषा',
    category: 'fishing',
    wearer: 'men',
    fabric: 'Heavy-duty water-treated hemp-cotton mesh',
    description: 'Specially constructed gear for night fishing on the Bagmati. Features quick-dry cotton shorts, a water-resistant bamboo fish basket (Khurpa/Tungari) strapped at the hip, and a shoulder-slung woven throw-net (Jal).',
    culturalSignificance: 'Exemplifies the ingenuity of indigenous fishing technology, zero-waste biodegradable gear, and deep ecological knowledge of river currents.',
    accessories: ['Woven Bamboo Tungari Basket', 'Jal (Hand-Knotted Throw Net)', 'River Night Torch', 'Hardened Fish Blade'],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'costume-6',
    name: 'Youth Leadership Assembly Formal Uniform',
    nameNepali: 'युवा समुदाय नेतृत्व औपचारिक पोशाक',
    category: 'youth-council',
    wearer: 'both',
    fabric: 'Fine Palpali Dhaka cotton combined with modern navy twill',
    description: 'Modern executive attire worn by Bote Youth Community Nepal council representatives during district administration meetings in Sarlahi, national indigenous forums in Kathmandu, and cultural symposiums.',
    culturalSignificance: 'Bridges ancestral identity with contemporary civic leadership, asserting the constitutional rights and cultural pride of Bote youth.',
    accessories: ['BYCN Official Emblem Lapel Pin', 'Handwoven Palpali Dhaka Topi', 'National Flag Khada Scarf', 'ID Card Lanyard'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    featured: true
  }
];

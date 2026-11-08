/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Comprehensive English to Nepali terminology and sentence dictionary
// for complete 1-click full-site translation
export const EN_TO_NE_DICTIONARY: [RegExp, string][] = [
  // -------------------------------------------------------------
  // 1. BRAND, IDENTITY, PLACES & SACRED RIVERS
  // -------------------------------------------------------------
  [/\bBote Youth Community Nepal\b/gi, 'नेपाल बोटे युवा समुदाय'],
  [/\bBote Youth Community\b/gi, 'बोटे युवा समुदाय'],
  [/\bKarmaiya, Sarlahi District, Nepal\b/gi, 'कर्मैया, सर्लाही जिल्ला, नेपाल'],
  [/\bKarmaiya, Sarlahi District\b/gi, 'कर्मैया, सर्लाही जिल्ला'],
  [/\bKarmaiya, Sarlahi\b/gi, 'कर्मैया, सर्लाही'],
  [/\bBagmati & Narayani River Basin Indigenous Heritage\b/gi, 'बागमती तथा नारायणी नदी तटीय आदिवासी सम्पदा'],
  [/\bBagmati and Narayani rivers\b/gi, 'बागमती तथा नारायणी नदीहरू'],
  [/\bBagmati & Narayani\b/gi, 'बागमती तथा नारायणी'],
  [/\bBagmati River\b/gi, 'बागमती नदी'],
  [/\bNarayani River\b/gi, 'नारायणी नदी'],
  [/\bKarmaiya Ghat\b/gi, 'कर्मैया घाट'],
  [/\bKarmaiya\b/gi, 'कर्मैया'],
  [/\bSarlahi District\b/gi, 'सर्लाही जिल्ला'],
  [/\bSarlahi\b/gi, 'सर्लाही'],
  [/\bBagmati\b/gi, 'बागमती'],
  [/\bNarayani\b/gi, 'नारायणी'],
  [/\bTarahi Bote\b/gi, 'तराही बोटे'],
  [/\bTarahi dialect\b/gi, 'तराही लवज'],
  [/\bTarahi\b/gi, 'तराही'],
  [/\bBote Community\b/gi, 'बोटे समुदाय'],
  [/\bBote people\b/gi, 'बोटे जाति'],
  [/\bBote Youths\b/gi, 'बोटे युवाहरू'],
  [/\bBote Youth\b/gi, 'बोटे युवा'],
  [/\bBote\b/gi, 'बोटे'],

  // -------------------------------------------------------------
  // 2. TAGLINES, VISION, HEADINGS & COMPLETE HERO PARAGRAPHS
  // -------------------------------------------------------------
  [/\bPreserving Heritage • Empowering the Future\b/gi, 'सम्पदाको संरक्षण • भविष्यको सशक्तीकरण'],
  [/\bPreserving Our River Heritage, Empowering Bote Youth\b/gi, 'हाम्रो नदी सम्पदाको संरक्षण, बोटे युवाहरूको सशक्तीकरण'],
  [/\bPreserving Our River Heritage\b/gi, 'हाम्रो नदी सम्पदाको संरक्षण'],
  [/\bEmpowering Bote Youth\b/gi, 'बोटे युवाहरूको सशक्तीकरण'],
  [/\bPreserving Our\b/gi, 'हाम्रो संरक्षण'],
  [/\bEmpowering\b/gi, 'सशक्तीकरण'],
  [/\bOfficial portal of the Bote Community of Karmaiya, Sarlahi District, Nepal\b/gi, 'नेपालको सर्लाही जिल्ला कर्मैयास्थित बोटे समुदायको आधिकारिक डिजिटल पोर्टल'],
  [/\bSafeguarding our ancient single-log canoe craft\b/gi, 'हाम्रो प्राचीन एक-ढुङ्गे काठको डुङ्गा निर्माण कलाको संरक्षण'],
  [/\brevitalizing the endangered Tarahi Bote language\b/gi, 'लोपोन्मुख तराही बोटे भाषाको पुनरुत्थान'],
  [/\bfunding education for the next generation\b/gi, 'आगामी पुस्ताका लागि शैक्षिक छात्रवृत्ति'],
  [/\bBote Population\b/gi, 'बोटे कुल जनसंख्या'],
  [/\bCensus Population\b/gi, 'जनगणना कुल जनसंख्या'],
  [/\bCouncil Wards\b/gi, 'परिषद वडा कार्यक्षेत्र'],
  [/\bScholarship Fund\b/gi, 'छात्रवृत्ति कोष'],
  [/\bIndigenous Pride\b/gi, 'आदिवासी पहिचान तथा गौरव'],
  [/\bCensus 2021\b/gi, 'जनगणना २०२१'],
  [/\bBento Grid • Community Matrix\b/gi, 'बेन्टो ग्रिड • समुदाय संरचना'],
  [/\bCommunity Matrix\b/gi, 'समुदाय संरचना'],
  [/\bBote Youth Grid Overview\b/gi, 'बोटे युवा समुदाय समग्र परिचय'],
  [/\bGrid Overview\b/gi, 'समग्र परिचय'],
  [/\bRevitalizing Ancient Water Traditions & Youth Leadership\b/gi, 'पुर्ख्यौली जल परम्पराको संरक्षण तथा युवा नेतृत्व'],
  [/\bJal Puja & River Rites\b/gi, 'जल पूजा तथा नदी संस्कृति'],
  [/\bTarahi Bote Lexicon\b/gi, 'तराही बोटे शब्दकोश'],
  [/\bHear Audio & Dictionary\b/gi, 'अडियो र शब्दकोश सुन्नुहोस्'],
  [/\bCarved Simal Wood\b/gi, 'सिमलको काठबाट निर्मित डुङ्गा'],
  [/\bView Gallery & Craft\b/gi, 'सम्पदा र कला हेर्नुहोस्'],
  [/\bActive Youth Council\b/gi, 'सक्रिय युवा परिषद'],
  [/\bActive Youth Committees\b/gi, 'सक्रिय युवा समितिहरू'],
  [/\bGrassroots leadership in Karmaiya, Sarlahi\b/gi, 'कर्मैया, सर्लाहीको स्थानीय युवा नेतृत्व'],
  [/\bBecome a Member\b/gi, 'सदस्य बन्नुहोस्'],
  [/\bJoin Us & Get Digital ID\b/gi, 'सदस्य बन्नुहोस् र डिजिटल परिचयपत्र पाउनुहोस्'],
  [/\bGet Digital ID\b/gi, 'डिजिटल परिचयपत्र पाउनुहोस्'],
  [/\bGet Your Official Bote Youth Community Digital Identity Card\b/gi,
   'आफ्नो आधिकारिक बोटे युवा समुदाय डिजिटल परिचयपत्र प्राप्त गर्नुहोस्'],
  [/\bYour Digital Identity Card is Active & Verified\b/gi, 'तपाईंको डिजिटल परिचयपत्र सक्रिय तथा प्रमाणित छ'],
  [/\bMembership Active\b/gi, 'सदस्यता सक्रिय'],
  [/\bOfficial Member Active\b/gi, 'आधिकारिक सदस्य सक्रिय'],
  [/\bVerified Member\b/gi, 'प्रमाणित सदस्य'],
  [/\bView My Member ID Card\b/gi, 'मेरो डिजिटल परिचयपत्र हेर्नुहोस्'],
  [/\bView ID Card\b/gi, 'परिचयपत्र हेर्नुहोस्'],
  [/\bView My Official ID Card\b/gi, 'मेरो परिचयपत्र हेर्नुहोस्'],
  [/\bFollow Community Updates\b/gi, 'समुदाय अपडेट फलो गर्नुहोस्'],
  [/\bMeet Youth Leaders\b/gi, 'युवा नेतृत्वलाई भेट्नुहोस्'],
  [/\bExplore History\b/gi, 'इतिहास अवलोकन गर्नुहोस्'],
  [/\bYouth Council\b/gi, 'युवा कार्यसमिति'],
  [/\bCore Pillars of Bote Community\b/gi, 'बोटे समुदायका मुख्य आधारस्तम्भ'],
  [/\bHeritage Preserved, Generation Empowered\b/gi, 'सम्पदाको संरक्षण, नयाँ पुस्ताको सशक्तीकरण'],
  [/\bSingle-log dugout canoe\b/gi, 'एक-ढुङ्गे काठको डुङ्गा'],
  [/\bSingle-log canoe craft\b/gi, 'एक-ढुङ्गे काठको डुङ्गा निर्माण कला'],
  [/\bSingle-log canoe\b/gi, 'एक-ढुङ्गे डुङ्गा'],
  [/\bDugout canoe\b/gi, 'काठको डुङ्गा'],
  [/\bDugout Canoes\b/gi, 'काठका डुङ्गाहरू'],
  [/\bCanoe\b/gi, 'डुङ्गा'],
  [/\bLiving Sacred Waters\b/gi, 'पवित्र जल सभ्यता'],
  [/\bOral Heritage Soundscape\b/gi, 'मौखिक सम्पदा ध्वनितरङ्ग'],
  [/\bSansari Devi Sacred River Chants & Khainjadi Rhythm\b/gi, 'संसारी देवी पवित्र नदी मन्त्र तथा खैँजडी ताल'],
  [/\bSansari Devi River Chant\b/gi, 'संसारी देवी नदी मन्त्र'],
  [/\bPlay River Chant\b/gi, 'नदी मन्त्र सुन्नुहोस्'],
  [/\bPause Soundscape\b/gi, 'ध्वनि रोक्नुहोस्'],
  [/\bExecutive Representation\b/gi, 'कार्यकारी प्रतिनिधित्व'],
  [/\bBote Youths Leader & Community Committee\b/gi, 'बोटे युवा नेतृत्व तथा समुदाय कार्य समिति'],
  [/\bYouths Leader & Central Committee\b/gi, 'युवा नेतृत्व तथा केन्द्रीय समिति'],
  [/\bYouth Empower & Save Our Cultures\b/gi, 'युवा सशक्तीकरण तथा संस्कृति संरक्षण'],
  [/\bCulture Dress & Silver Ornaments\b/gi, 'सांस्कृतिक पोशाक तथा चाँदीका गहना'],
  [/\bCulture Dress & Ornaments\b/gi, 'सांस्कृतिक पोशाक तथा गहना'],
  [/\bBote Culture, Rituals & River Worship\b/gi, 'बोटे संस्कृति, पूजाविधि तथा नदी आराधना'],

  // Paragraph: Leaders intro
  [/Meet the 10 dedicated executive officers guiding Bote Youth Community Nepal \(BoteYouthCommunityNepal\)\. Combining the vibrant dynamism of the Youth Leadership Committee with the customary wisdom of the Central Community Council\./gi,
   'नेपाल बोटे युवा समुदाय (BoteYouthCommunityNepal) लाई मार्गदर्शन गर्ने १० समर्पित कार्यकारी पदाधिकारीहरूलाई भेट्नुहोस्। युवा नेतृत्व समितिको जीवन्त ऊर्जा र केन्द्रीय कार्य समितिको परम्परागत विवेकको संयोजन।'],

  // Paragraph: Culture intro
  [/To be Bote is to belong to the sacred waters\. For centuries, our spiritual existence has revolved around river deities, ancestral forest spirits, seasonal canoe races, and animist prayers across the Bagmati and Narayani rivers\./gi,
   'बोटे हुनु भनेको पवित्र जल सम्पदासँग जोडिनु हो। शताब्दीयौँदेखि हाम्रो आध्यात्मिक अस्तित्व नदीका देवीदेवता, पुर्ख्यौली वन-जङ्गलका आत्मा, मौसमी डुङ्गा दौड र बागमती तथा नारायणी नदी किनारका प्रकृतिपूजामा केन्द्रित छ।'],

  // Paragraph: Soundscape intro
  [/Listen to traditional rhythmic prayers recited by Bote elder women invoking river spirits before launching newly hollowed wooden boats onto the water\./gi,
   'नयाँ काठको डुङ्गा पानीमा उतार्नुअघि नदी देवी-देवताको आह्वान गर्दै बोटे वृद्ध महिलाहरूले गाउने परम्परागत मन्त्र तथा प्रार्थना सुन्नुहोस्।'],

  // -------------------------------------------------------------
  // 3. NAVIGATION ITEMS & TABS
  // -------------------------------------------------------------
  [/\bHome\b/g, 'गृहपृष्ठ'],
  [/\bAbout Bote Community\b/gi, 'बोटे समुदायको बारेमा'],
  [/\bAbout Us\b/gi, 'हाम्रो बारेमा'],
  [/\bAbout\b/g, 'हाम्रो बारेमा'],
  [/\bHistory\b/gi, 'इतिहास'],
  [/\bBote History\b/gi, 'बोटे इतिहास'],
  [/\bTraditions\b/gi, 'परम्परा'],
  [/\bCultures & River Rituals\b/gi, 'संस्कृति तथा नदी पूजाविधि'],
  [/\bCultures & Traditions\b/gi, 'संस्कृति तथा परम्परा'],
  [/\bCultures\b/gi, 'संस्कृति'],
  [/\bLanguage \(Tarahi Dialect\)\b/gi, 'भाषा (तराही बोटे लवज)'],
  [/\bLanguage \(Tarahi\)\b/gi, 'भाषा (तराही बोटे)'],
  [/\bLanguage\b/g, 'भाषा'],
  [/\bCulture Dress\b/gi, 'सांस्कृतिक पोशाक'],
  [/\bDress & Ornaments\b/gi, 'पोशाक तथा गहना'],
  [/\bLeaders\b/gi, 'नेतृत्व'],
  [/\bLeadership\b/gi, 'नेतृत्व मण्डल'],
  [/\bPrograms\b/gi, 'कार्यक्रमहरू'],
  [/\bScholarships Center\b/gi, 'छात्रवृत्ति केन्द्र'],
  [/\bScholarships\b/gi, 'छात्रवृत्ति'],
  [/\bScholarship\b/gi, 'छात्रवृत्ति'],
  [/\bNotices, Meetings & Files\b/gi, 'सूचना, बैठक तथा कागजात'],
  [/\bNotices & Files\b/gi, 'सूचना तथा कागजात'],
  [/\bNotices\b/gi, 'सूचनाहरू'],
  [/\bNotice\b/gi, 'सूचना'],
  [/\bFollow Our Community\b/gi, 'हाम्रो समुदायमा जोडिनुहोस्'],
  [/\bFollow Community\b/gi, 'समुदाय फलो गर्नुहोस्'],
  [/\bCommunity\b/gi, 'समुदाय'],
  [/\bAdmin Portal\b/gi, 'प्रशासन पोर्टल'],
  [/\bAdmin Panel\b/gi, 'प्रशासन प्यानल'],
  [/\bAdmin\b/gi, 'प्रशासन'],

  // -------------------------------------------------------------
  // 4. ACTION BUTTONS, CONTROLS & LABELS
  // -------------------------------------------------------------
  [/\bJoin Us\b/gi, 'सदस्य बन्नुहोस्'],
  [/\bJoin Community & Get ID\b/gi, 'समुदायमा जोडिनुहोस् र डिजिटल परिचयपत्र पाउनुहोस्'],
  [/\bJoin Community\b/gi, 'समुदायमा आबद्ध हुनुहोस्'],
  [/\bJoin Now\b/gi, 'अहिले जोडिनुहोस्'],
  [/\bJoin\b/g, 'जोडिनुहोस्'],
  [/\bFollowing\b/gi, 'फलो गरिएको'],
  [/\bFollowers\b/gi, 'अनुयायीहरू'],
  [/\bFollow\b/g, 'फलो गर्नुहोस्'],
  [/\bMy Member ID\b/gi, 'मेरो डिजिटल परिचयपत्र'],
  [/\bView My Member ID Card\b/gi, 'मेरो डिजिटल परिचयपत्र हेर्नुहोस्'],
  [/\bView Member ID\b/gi, 'डिजिटल परिचयपत्र हेर्नुहोस्'],
  [/\bVerified Member\b/gi, 'प्रमाणित सदस्य'],
  [/\bVerified Community Follower Active\b/gi, 'सक्रिय प्रमाणित अनुयायी'],
  [/\bFill Community Joining Form & Get ID Card\b/gi, 'सदस्यता फारम भर्नुहोस् र परिचयपत्र पाउनुहोस्'],
  [/\bFill Joining Form\b/gi, 'सदस्यता फारम भर्नुहोस्'],
  [/\bNotifications & Follow Updates\b/gi, 'सूचना तथा अद्यावधिकहरू'],
  [/\bNotifications\b/gi, 'सूचनाहरू'],
  [/\bNotification Center\b/gi, 'सूचना केन्द्र'],
  [/\bSearch community\.\.\.\b/gi, 'समुदाय खोज्नुहोस्...'],
  [/\bSearch community\b/gi, 'समुदाय खोज्नुहोस्'],
  [/\bSearch leaders by name, role or ward\.\.\.\b/gi, 'नाम, पद वा वडा अनुसार नेतृत्व खोज्नुहोस्...'],
  [/\bSearch\b/g, 'खोज्नुहोस्'],
  [/\bRead More\b/gi, 'थप पढ्नुहोस्'],
  [/\bRead full\b/gi, 'पूर्ण विवरण पढ्नुहोस्'],
  [/\bApply Now\b/gi, 'अहिले आवेदन दिनुहोस्'],
  [/\bApply for Scholarship\b/gi, 'छात्रवृत्तिका लागि आवेदन दिनुहोस्'],
  [/\bApply\b/g, 'आवेदन दिनुहोस्'],
  [/\bClose\b/gi, 'बन्द गर्नुहोस्'],
  [/\bSave\b/gi, 'सुरक्षित गर्नुहोस्'],
  [/\bDownload PDF\b/gi, 'पीडीएफ डाउनलोड'],
  [/\bDownload Card\b/gi, 'कार्ड डाउनलोड'],
  [/\bDownload\b/gi, 'डाउनलोड गर्नुहोस्'],
  [/\bSubmit Application\b/gi, 'आवेदन पेश गर्नुहोस्'],
  [/\bSubmit\b/gi, 'पेश गर्नुहोस्'],
  [/\bCancel\b/gi, 'रद्द गर्नुहोस्'],
  [/\bConfirm\b/gi, 'पुष्टि गर्नुहोस्'],
  [/\bBack to Top\b/gi, 'माथि जानुहोस्'],
  [/\bScroll to top\b/gi, 'शीर्षमा फर्कनुहोस्'],
  [/\bReading Progress\b/gi, 'पठन प्रगति'],
  [/\bCopy Phone\b/gi, 'फोन नम्बर प्रतिलिपि'],
  [/\bCopied to clipboard!\b/gi, 'क्लिपबोर्डमा प्रतिलिपि गरियो!'],
  [/\bCopied!\b/gi, 'प्रतिलिपि गरियो!'],
  [/\bDirect Call\b/gi, 'सिधा फोन'],
  [/\bSend Email\b/gi, 'इमेल पठाउनुहोस्'],
  [/\bView Details\b/gi, 'विवरण हेर्नुहोस्'],
  [/\bView All\b/gi, 'सबै हेर्नुहोस्'],
  [/\bShare\b/gi, 'साझेदारी गर्नुहोस्'],
  [/\bFilter by\b/gi, 'फिल्टर गर्नुहोस्'],
  [/\bAll Categories\b/gi, 'सबै विधाहरू'],
  [/\bYouth Leadership\b/gi, 'युवा नेतृत्व'],
  [/\bYouth Council\b/gi, 'युवा समिति'],
  [/\bCommunity Elders\b/gi, 'समुदाय जेष्ठ सदस्य'],
  [/\bCommunity Elder Council\b/gi, 'समुदाय जेष्ठ नागरिक परिषद्'],
  [/\bCentral Committee\b/gi, 'केन्द्रीय कार्य समिति'],
  [/\bAdvisory Board\b/gi, 'सल्लाहकार समिति'],

  // -------------------------------------------------------------
  // 5. LEADERSHIP ROLES & POSITIONS
  // -------------------------------------------------------------
  [/\bYouth Leader Chairman\b/gi, 'युवा नेतृत्व अध्यक्ष'],
  [/\bYouth Vice President\b/gi, 'युवा उपाध्यक्ष'],
  [/\bYouth Secretary\b/gi, 'युवा सचिव'],
  [/\bYouth Member\b/gi, 'युवा सदस्य'],
  [/\bCommunity Chairman\b/gi, 'समुदाय अध्यक्ष'],
  [/\bCultural Advisor\b/gi, 'सांस्कृतिक सल्लाहकार'],
  [/\bSenior Canoe Elder\b/gi, 'वरिष्ठ डुङ्गा विज्ञ जेष्ठ सदस्य'],
  [/\bEducation Coordinator\b/gi, 'शिक्षा संयोजक'],
  [/\bWomen Mobilizer\b/gi, 'महिला परिचालन संयोजक'],
  [/\bGeneral Secretary\b/gi, 'महासचिव'],
  [/\bCulture Coordinator\b/gi, 'संस्कृति संयोजक'],
  [/\bTreasurer\b/gi, 'कोषाध्यक्ष'],
  [/\bExecutive Member\b/gi, 'कार्यकारी सदस्य'],
  [/\bPresident\b/gi, 'अध्यक्ष'],
  [/\bVice President\b/gi, 'उपाध्यक्ष'],
  [/\bCoordinator\b/gi, 'संयोजक'],
  [/\bSecretary\b/gi, 'सचिव'],
  [/\bWard No\.\b/gi, 'वडा नं.'],
  [/\bWard\b/gi, 'वडा'],
  [/\bTerms & Tenure\b/gi, 'पदावधि तथा कार्यकाल'],
  [/\bTerm\b/gi, 'कार्यकाल'],
  [/\bTenure\b/gi, 'पदावधि'],
  [/\bActive Verified\b/gi, 'सक्रिय प्रमाणित'],
  [/\bVerified\b/gi, 'प्रमाणित'],
  [/\bActive\b/gi, 'सक्रिय'],

  // -------------------------------------------------------------
  // 6. TRADITIONS, RITUALS, DRESS & CULTURE
  // -------------------------------------------------------------
  [/\bCast Net Fishing\b/gi, 'जालद्वारा माछा मार्ने परम्परा'],
  [/\bTraditional Boat Racing\b/gi, 'परम्परागत डुङ्गा दौड प्रतियोगिता'],
  [/\bBoat Racing\b/gi, 'डुङ्गा दौड'],
  [/\bMaghe Sankranti River Gathering\b/gi, 'माघे सङ्क्रान्ति नदी मेला'],
  [/\bMaghe Sankranti\b/gi, 'माघे सङ्क्रान्ति'],
  [/\bSansari Puja River Ritual\b/gi, 'संसारी पूजा नदी विधि'],
  [/\bSansari Puja\b/gi, 'संसारी पूजा'],
  [/\bHasuli Silver Torque\b/gi, 'हँसुली चाँदीको घाँटीको गहना'],
  [/\bHasuli\b/gi, 'हँसुली'],
  [/\bSilver Ornaments\b/gi, 'चाँदीका गहना'],
  [/\bSilver\b/gi, 'चाँदी'],
  [/\bTraditional Dress\b/gi, 'परम्परागत पोशाक'],
  [/\bCultural Attire\b/gi, 'सांस्कृतिक पोशाक'],
  [/\bDhungri\b/gi, 'ढुङ्ग्री'],
  [/\bPhuli\b/gi, 'फुुली'],
  [/\bNatthi\b/gi, 'नत्थी'],
  [/\bBala\b/gi, 'बाला'],
  [/\bKalli\b/gi, 'कल्ली'],
  [/\bKachhad\b/gi, 'कछाड'],
  [/\bBhangra\b/gi, 'भाङ्ग्रा'],
  [/\bTopi\b/gi, 'ढाका टोपी'],
  [/\bFariya\b/gi, 'फरिय/साडी'],
  [/\bCholo\b/gi, 'चोलो'],
  [/\bGhalek\b/gi, 'घालेक'],

  // -------------------------------------------------------------
  // 7. SCHOLARSHIPS, NOTICES, STATS & CONTACTS
  // -------------------------------------------------------------
  [/\bScholarships Center\b/gi, 'छात्रवृत्ति केन्द्र'],
  [/\bHigher Education Grants\b/gi, 'उच्च शिक्षा अनुदान'],
  [/\bVocational & Technical Training\b/gi, 'व्यावसायिक तथा प्राविधिक तालिम'],
  [/\bPrimary School Excellence Fund\b/gi, 'प्राथमिक विद्यालय प्रोत्साहन कोष'],
  [/\bTotal Grant Amount\b/gi, 'कुल अनुदान रकम'],
  [/\bEligible Candidates\b/gi, 'योग्य उम्मेदवारहरू'],
  [/\bApplication Deadline\b/gi, 'आवेदन दिने अन्तिम मिति'],
  [/\bRequired Documents\b/gi, 'आवश्यक कागजातहरू'],
  [/\bMonthly Meeting\b/gi, 'मासिक बैठक'],
  [/\bOfficial Notice\b/gi, 'आधिकारिक सूचना'],
  [/\bPublished Date\b/gi, 'प्रकाशित मिति'],
  [/\bContact Details\b/gi, 'सम्पर्क विवरण'],
  [/\bOfficial Email\b/gi, 'आधिकारिक इमेल'],
  [/\bPhone Number\b/gi, 'फोन नम्बर'],
  [/\bOffice Address\b/gi, 'कार्यालय ठेगाना'],
  [/\bOffice\b/gi, 'कार्यालय'],
  [/\bPhone\b/gi, 'फोन'],
  [/\bEmail\b/gi, 'इमेल'],
  [/\bAddress\b/gi, 'ठेगाना'],
  [/\bLocation\b/gi, 'स्थान'],
  [/\bTotal Members\b/gi, 'कुल सदस्यहरू'],
  [/\bActive Youths\b/gi, 'सक्रिय युवाहरू'],
  [/\bYears of Heritage\b/gi, 'सयौँ वर्षको सम्पदा'],
  [/\bCanoe Craftsmanship\b/gi, 'डुङ्गा निर्माण कला'],
  [/\bAll Rights Reserved\b/gi, 'सर्वाधिकार सुरक्षित'],
  [/\bQuick Links\b/gi, 'द्रुत लिङ्कहरू'],
  [/\bLatest Updates\b/gi, 'ताजा अद्यावधिकहरू'],
  [/\bRecent Announcements\b/gi, 'हालैका घोषणाहरू'],
  [/\bKey Highlights\b/gi, 'प्रमुख विशेषताहरू'],
  [/\bCultural Heritage\b/gi, 'सांस्कृतिक सम्पदा'],
  [/\bIndigenous Rights\b/gi, 'आदिवासी अधिकार'],
  [/\bRiver Conservation\b/gi, 'नदी संरक्षण'],
  [/\bEducation Fund\b/gi, 'शिक्षा कोष'],

  // -------------------------------------------------------------
  // 8. BENTO GRID, POLL, PILLARS, & SECTIONS
  // -------------------------------------------------------------
  [/\bBento Grid • Community Matrix\b/gi, 'बेन्टो ग्रिड • समुदाय संरचना'],
  [/\bBento Grid\b/gi, 'बेन्टो ग्रिड'],
  [/\bCommunity Matrix\b/gi, 'समुदाय संरचना'],
  [/\bBote Youth Grid Overview\b/gi, 'बोटे युवा संरचना सिंहावलोकन'],
  [/\bSingle-Log Dugout Canoe\b/gi, 'एक-ढुङ्गे काठको डुङ्गा'],
  [/\bTarahi Bote Oral Language\b/gi, 'तराही बोटे मौखिक भाषा'],
  [/\bExecutive Youth Committee\b/gi, 'कार्यकारी युवा समिति'],
  [/\bVerified Digital ID Card\b/gi, 'प्रमाणित डिजिटल परिचयपत्र'],
  [/\bApply \/ View ID\b/gi, 'परिचयपत्र आवेदन / हेर्नुहोस्'],
  [/\bListen Phrase\b/gi, 'वाक्य सुन्नुहोस्'],
  [/\bAudio Pronunciation\b/gi, 'अडियो उच्चारण'],
  [/\bCore Pillars of Bote Community\b/gi, 'बोटे समुदायका मुख्य आधार स्तम्भहरू'],
  [/\bCore Pillars of BYCN\b/gi, 'नेपाल बोटे युवा समुदायका मुख्य आधार स्तम्भहरू'],
  [/\bFour Foundational Pillars of BYCN\b/gi, 'नेपाल बोटे युवा समुदायका चार आधारभूत स्तम्भहरू'],
  [/\bHeritage Preserved, Generation Empowered\b/gi, 'सम्पदाको संरक्षण, पुस्ताको सशक्तीकरण'],
  [/\bBote History & Origins Timeline\b/gi, 'बोटे जातिको इतिहास'],
  [/\bBote History &amp; Origins Timeline\b/gi, 'बोटे जातिको इतिहास'],
  [/\bबोटे इतिहास & Origins Timeline\b/gi, 'बोटे जातिको इतिहास'],
  [/\bबोटे जातिको इतिहास बोटे of caste Origins Timeline\b/gi, 'बोटे जातिको इतिहास'],
  [/\bबोटे जातिको इतिहास Bote of caste Origins Timeline\b/gi, 'बोटे जातिको इतिहास'],
  [/\bBote of caste Origins Timeline\b/gi, ''],
  [/\bबोटे of caste Origins Timeline\b/gi, ''],
  [/\bBote History & Origins\b/gi, 'बोटे इतिहास र उद्भव'],
  [/\bRead History\b/gi, 'इतिहास पढ्नुहोस्'],
  [/\bExplore Rituals\b/gi, 'पूजाविधि अवलोकन गर्नुहोस्'],
  [/\bStudy Dialect\b/gi, 'लवज अध्ययन गर्नुहोस्'],
  [/\bView Dress\b/gi, 'पोशाक हेर्नुहोस्'],
  [/\bCommunity Voice: 2026 Cultural Priority Poll\b/gi, 'सामुदायिक आवाज: २०२६ सांस्कृतिक प्राथमिकता जनमत सङ्ग्रह'],
  [/\bCommunity Voice\b/gi, 'सामुदायिक आवाज'],
  [/\bCultural Priority Poll\b/gi, 'सांस्कृतिक प्राथमिकता जनमत'],
  [/\bCast your vote on what project the Bote Youth Committee should prioritize next:\b/gi, 'बोटे युवा समितिले कुन परियोजनालाई प्राथमिकता दिनुपर्छ भन्नेमा आफ्नो मत दिनुहोस्:'],
  [/\bCompleting the Tarahi Bote Audio Dictionary & App\b/gi, 'तराही बोटे अडियो शब्दकोश र एप निर्माण'],
  [/\bPreserving Simal Wooden Canoe Craftsmanship & Boat Races\b/gi, 'सिमल काठको डुङ्गा निर्माण कला र डुङ्गा दौड संरक्षण'],
  [/\bExpanding High School & University Scholarships Fund\b/gi, 'माध्यमिक तथा विश्वविद्यालय छात्रवृत्ति कोष विस्तार'],
  [/\bEstablishing Bote Cultural Homestays in Karmaiya\b/gi, 'कर्मैयामा बोटे सांस्कृतिक होमस्टे स्थापना'],
  [/\bSubmit Official Vote\b/gi, 'आधिकारिक मत पेश गर्नुहोस्'],
  [/\bThank you for voting!\b/gi, 'मतदान गर्नुभएकोमा धन्यवाद!'],
  [/\bYour voice guides BYCN action plans for the upcoming year\.\b/gi, 'तपाईंको अमूल्य मतले आगामी वर्षका लागि युवा कार्ययोजनालाई मार्गनिर्देशन गर्नेछ।'],
  [/\bExecutive Leadership Highlights\b/gi, 'कार्यकारी नेतृत्वका प्रमुख पदाधिकारीहरू'],
  [/\bView Full Leadership Directory\b/gi, 'सम्पूर्ण नेतृत्व नामावली हेर्नुहोस्'],
  [/\bAvailable Educational Grants\b/gi, 'उपलब्ध शैक्षिक छात्रवृत्तिहरू'],
  [/\bView All 3 Scholarships\b/gi, 'सबै ३ छात्रवृत्तिहरू हेर्नुहोस्'],
  [/\bSacred Traditions & Crafts\b/gi, 'पवित्र परम्परा र शिल्पकला'],
  [/\bExplore All Traditions\b/gi, 'सबै परम्पराहरू अवलोकन गर्नुहोस्'],
  [/\bOfficial Community Notices\b/gi, 'आधिकारिक सामुदायिक सूचनाहरू'],
  [/\bView All Notices & Minutes\b/gi, 'सबै सूचना तथा निर्णयपुस्तिका हेर्नुहोस्'],
  [/\bRead Circular\b/gi, 'परिपत्र पढ्नुहोस्'],
  [/\bDownload PDF\b/gi, 'पीडीएफ डाउनलोड'],
  [/\bANNUAL GENERAL ASSEMBLY & RIVER FESTIVAL 2026\b/gi, 'वार्षिक साधारण सभा तथा नदी महोत्सव २०२६'],
  [/\bOFFICIAL NOTICE\b/gi, 'आधिकारिक सूचना'],
  [/\bView Official Program\b/gi, 'आधिकारिक कार्यक्रम हेर्नुहोस्'],
  [/\bBack to top\b/gi, 'माथि जानुहोस्'],
  [/\bScroll to top\b/gi, 'माथि जानुहोस्'],
  [/\bSearch community\.\.\.\b/gi, 'समुदाय खोज्नुहोस्...'],
  [/\bSearch leaders by name, role or ward\.\.\.\b/gi, 'नाम, पद वा वडा अनुसार नेतृत्व खोज्नुहोस्...'],
  [/\bEnter your full name\.\.\.\b/gi, 'आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्...'],
  [/\bEnter phone number\.\.\.\b/gi, 'फोन नम्बर प्रविष्ट गर्नुहोस्...'],
  [/\bSearch community or leaders\.\.\.\b/gi, 'समुदाय वा नेतृत्व खोज्नुहोस्...'],

  // -------------------------------------------------------------
  // 9. COMMON VOCABULARY & PHRASES (Ensures ALL words translate)
  // -------------------------------------------------------------
  [/\bEnglish\b/g, 'अंग्रेजी'],
  [/\bNepali\b/g, 'नेपाली'],
  [/\bLanguage\b/g, 'भाषा'],
  [/\bCulture\b/g, 'संस्कृति'],
  [/\bTradition\b/g, 'परम्परा'],
  [/\bHeritage\b/g, 'सम्पदा'],
  [/\bHistory\b/g, 'इतिहास'],
  [/\bYouth\b/g, 'युवा'],
  [/\bElders\b/g, 'जेष्ठ नागरिक'],
  [/\bElder\b/g, 'जेष्ठ'],
  [/\bCommunity\b/g, 'समुदाय'],
  [/\bSociety\b/g, 'समाज'],
  [/\bNation\b/g, 'राष्ट्र'],
  [/\bCountry\b/g, 'देश'],
  [/\bVillage\b/g, 'गाउँ'],
  [/\bDistrict\b/g, 'जिल्ला'],
  [/\bProvince\b/g, 'प्रदेश'],
  [/\bRiver\b/g, 'नदी'],
  [/\bRivers\b/g, 'नदीहरू'],
  [/\bWater\b/g, 'जल'],
  [/\bForest\b/g, 'जङ्गल'],
  [/\bBoat\b/g, 'डुङ्गा'],
  [/\bBoats\b/g, 'डुङ्गाहरू'],
  [/\bFisherman\b/g, 'माझी'],
  [/\bFishing\b/g, 'माछा मार्ने'],
  [/\bEducation\b/g, 'शिक्षा'],
  [/\bStudent\b/g, 'विद्यार्थी'],
  [/\bStudents\b/g, 'विद्यार्थीहरू'],
  [/\bSchool\b/g, 'विद्यालय'],
  [/\bCollege\b/g, 'कलेज'],
  [/\bUniversity\b/g, 'विश्वविद्यालय'],
  [/\bTraining\b/g, 'तालिम'],
  [/\bSkill\b/g, 'सीप'],
  [/\bDevelopment\b/g, 'विकास'],
  [/\bEmpowerment\b/g, 'सशक्तीकरण'],
  [/\bRights\b/g, 'अधिकार'],
  [/\bFuture\b/g, 'भविष्य'],
  [/\bPast\b/g, 'अतीत'],
  [/\bPresent\b/g, 'वर्तमान'],
  [/\bGeneration\b/g, 'पुस्ता'],
  [/\bGenerations\b/g, 'पुस्ताहरू'],
  [/\bHonor\b/g, 'सम्मान'],
  [/\bRespect\b/g, 'आदर'],
  [/\bUnity\b/g, 'एकता'],
  [/\bPeace\b/g, 'शान्ति'],
  [/\bOfficial\b/g, 'आधिकारिक'],
  [/\bPortal\b/g, 'डिजिटल पोर्टल'],
  [/\bWebsite\b/g, 'वेबसाइट'],
  [/\bMember\b/g, 'सदस्य'],
  [/\bMembers\b/g, 'सदस्यहरू'],
  [/\bTotal\b/g, 'जम्मा'],
  [/\bCount\b/g, 'संख्या'],
  [/\bDate\b/g, 'मिति'],
  [/\bYear\b/g, 'वर्ष'],
  [/\bMonth\b/g, 'महिना'],
  [/\bDay\b/g, 'दिन'],
  [/\bTime\b/g, 'समय'],
  [/\bStatus\b/g, 'स्थिति'],
  [/\bDetails\b/g, 'विवरण'],
  [/\bDescription\b/g, 'वर्णन'],
  [/\bCategory\b/g, 'विधा'],
  [/\bFilter\b/g, 'फिल्टर'],
  [/\bSort\b/g, 'क्रम मिलाउनुहोस्'],
  [/\bSelect\b/g, 'छान्नुहोस्'],
  [/\bChoose\b/g, 'छान्नुहोस्'],
  [/\bClick\b/g, 'क्लिक गर्नुहोस्'],
  [/\bLearn More\b/gi, 'थप जान्नुहोस्'],
  [/\bLearn\b/g, 'सिक्नुहोस्'],
  [/\bExplore\b/g, 'अवलोकन गर्नुहोस्'],
  [/\bDiscover\b/g, 'पत्ता लगाउनुहोस्'],
  [/\bMeet\b/g, 'भेट्नुहोस्'],
  [/\bSupport\b/g, 'सहयोग गर्नुहोस्'],
  [/\bHelp\b/g, 'सहयोग'],
  [/\bGuide\b/g, 'मार्गदर्शन'],
  [/\bDocument\b/g, 'कागजात'],
  [/\bDocuments\b/g, 'कागजातहरू'],
  [/\bFile\b/g, 'फाइल'],
  [/\bFiles\b/g, 'फाइलहरू'],
  [/\bMeeting\b/g, 'बैठक'],
  [/\bMeetings\b/g, 'बैठकहरू'],
  [/\bDecision\b/g, 'निर्णय'],
  [/\bDecisions\b/g, 'निर्णयहरू'],
  [/\bResolution\b/g, 'प्रस्ताव'],
  [/\bForm\b/g, 'फारम'],
  [/\bCard\b/g, 'परिचयपत्र'],
  [/\bIdentity\b/g, 'पहिचान'],
  [/\bDigital\b/g, 'डिजिटल'],
  [/\bOnline\b/g, 'अनलाइन'],
  [/\bName\b/g, 'नाम'],
  [/\bFull Name\b/gi, 'पूरा नाम'],
  [/\bFirst Name\b/gi, 'पहिलो नाम'],
  [/\bLast Name\b/gi, 'थर'],
  [/\bAge\b/g, 'उमेर'],
  [/\bGender\b/g, 'लिङ्ग'],
  [/\bMale\b/g, 'पुरुष'],
  [/\bFemale\b/g, 'महिला'],
  [/\bOther\b/g, 'अन्य'],
  [/\bOccupation\b/g, 'पेशा'],
  [/\bProfession\b/g, 'व्यवसाय'],
  [/\bMessage\b/g, 'सन्देश'],
  [/\bNotes\b/g, 'टिप्पणी'],
  [/\bSuccess\b/g, 'सफल'],
  [/\bError\b/g, 'त्रुटि'],
  [/\bWarning\b/g, 'चेतावनी'],
  [/\bInfo\b/g, 'जानकारी'],
  [/\bImportant\b/g, 'महत्वपूर्ण'],
  [/\bPrimary\b/g, 'प्राथमिक'],
  [/\bSecondary\b/g, 'माध्यमिक'],
  [/\bHigher\b/g, 'उच्च'],

  // Joining Form, Modals & Community UI
  [/\bCommunity Joining Form & Digital ID Card\b/gi, 'समुदाय सदस्यता फारम तथा डिजिटल परिचयपत्र'],
  [/\bJoining Form\b/gi, 'सदस्यता फारम'],
  [/\bJoining\b/gi, 'सदस्यता'],
  [/\bPersonal Particulars & Identity\b/gi, 'व्यक्तिगत विवरण तथा पहिचान'],
  [/\bPersonal Particulars\b/gi, 'व्यक्तिगत विवरण'],
  [/\bAddress & Ward Coordinates\b/gi, 'स्थायी तथा हालको ठेगाना'],
  [/\bWard Coordinates\b/gi, 'वडा तथा ठेगाना'],
  [/\bCoordinates\b/gi, 'ठेगाना विवरण'],
  [/\bMember Photo for Digital ID Card\b/gi, 'डिजिटल परिचयपत्रका लागि फोटो'],
  [/\bUpload Passport Size Photo\b/gi, 'पासपोर्ट साइजको फोटो अपलोड गर्नुहोस्'],
  [/\bPassport Size Photo\b/gi, 'पासपोर्ट साइजको फोटो'],
  [/\bThis photo will be embossed directly onto your official Bote Youth Community Nepal Identity Card\.\b/gi, 'यो तस्बिर सिधै तपाईंको आधिकारिक नेपाल बोटे युवा समुदाय परिचयपत्रमा समावेश हुनेछ।'],
  [/\bVolunteer & Community Interests \(स्वयंसेवा तथा रुचि क्षेत्र\)\b/gi, 'स्वयंसेवा तथा रुचि क्षेत्र'],
  [/\bVolunteer & Community Interests\b/gi, 'स्वयंसेवा तथा रुचि क्षेत्र'],
  [/\bVolunteer Opportunities\b/gi, 'स्वयंसेवा अवसरहरू'],
  [/\bVolunteer\b/gi, 'स्वयंसेवा'],
  [/\bSelect one or multiple areas where you want to contribute, volunteer, or receive specialized community training\.\b/gi, 'तपाईंले योगदान गर्न, स्वयंसेवा गर्न वा समुदायको तालिम लिन चाहेको एक वा बढी क्षेत्र छनोट गर्नुहोस्।'],
  [/\bHave another personal skill or community passion\? Add your custom interest:\b/gi, 'अन्य कुनै सीप वा रुचि छ? आफ्नो रुचि थप्नुहोस्:'],
  [/\bFilter volunteer opportunities by keyword \(e\.g\. boat, language, tutoring, rescue, digital\)\.\.\.\b/gi, 'कुञ्जी शब्दबाट स्वयंसेवा अवसरहरू खोज्नुहोस् (उदा. डुङ्गा, भाषा, ट्युसन, उद्धार)...'],
  [/\bAll Areas\b/gi, 'सबै क्षेत्र'],
  [/\bCulture & Heritage\b/gi, 'संस्कृति र सम्पदा'],
  [/\bRiver & Environment\b/gi, 'नदी तथा वातावरण'],
  [/\bEducation & Youth\b/gi, 'शिक्षा र युवा'],
  [/\bHealth & Welfare\b/gi, 'स्वास्थ्य र कल्याण'],
  [/\bDigital & Media\b/gi, 'डिजिटल र मिडिया'],
  [/\bLeadership & Rights\b/gi, 'नेतृत्व र अधिकार'],
  [/\bSelected\b/gi, 'छनोट गरिएको'],
  [/\bClear all\b/gi, 'सबै हटाउनुहोस्'],
  [/\bMunicipality \/ Rural Municipality\b/gi, 'नगरपालिका / गाउँपालिका'],
  [/\bRural Municipality\b/gi, 'गाउँपालिका'],
  [/\bMunicipality\b/gi, 'नगरपालिका'],
  [/\bWard Number\b/gi, 'वडा नम्बर'],
  [/\bMobile Hotline \/ WhatsApp\b/gi, 'मोबाइल / ह्वाट्सएप नम्बर'],
  [/\bMobile Hotline\b/gi, 'मोबाइल नम्बर'],
  [/\bEmail \(Optional\)\b/gi, 'इमेल (ऐच्छिक)'],
  [/\bSubmit Registration & Generate Digital ID Card\b/gi, 'दर्ता पेश गर्नुहोस् र डिजिटल परिचयपत्र प्राप्त गर्नुहोस्'],
  [/\bSubmit Registration\b/gi, 'दर्ता पेश गर्नुहोस्'],
  [/\bGenerate Printable Member ID Card\b/gi, 'प्रिन्ट गर्न मिल्ने परिचयपत्र तयार गर्नुहोस्'],
  [/\bAlready Registered\? Click here to view your saved ID Card\b/gi, 'पहिले नै दर्ता भइसक्नुभयो? आफ्नो सुरक्षित परिचयपत्र हेर्न यहाँ क्लिक गर्नुहोस्'],
  [/\bOfficial Membership Registration 2026\b/gi, 'आधिकारिक सदस्यता दर्ता २०२६'],
  [/\bNeed to register another member\? \(Admin or Family Member\)\b/gi, 'अन्य सदस्य दर्ता गर्न आवश्यक छ? (प्रशासक वा परिवारका सदस्य)'],

  // Leadership Modal & Actions
  [/\bAssigned Executive Responsibilities\b/gi, 'तोकिएको कार्यकारी जिम्मेवारीहरू'],
  [/\bContact Youth Leader Chairman Directly\b/gi, 'युवा नेतृत्व अध्यक्षलाई सिधै सम्पर्क गर्नुहोस्'],
  [/\bContact Community Chairman Directly\b/gi, 'समुदाय अध्यक्षलाई सिधै सम्पर्क गर्नुहोस्'],
  [/\bWrite a message, inquiry, or suggestion directly to\b/gi, 'सिधै सन्देश, सोधपुछ वा सुझाव लेख्नुहोस्:'],
  [/\bSend Message\b/gi, 'सन्देश पठाउनुहोस्'],
  [/\bClose Details\b/gi, 'विवरण बन्द गर्नुहोस्'],
  [/\bMessage dispatched to\b/gi, 'सन्देश सफलतापूर्वक पठाइयो:'],
  [/\band logged in community records!\b/gi, 'र समुदाय अभिलेखमा दर्ता भयो!'],
  [/\bInteractive Cards: Hover or tap any leader card to reveal direct phone, email, and portfolios\.\b/gi, 'अन्तरक्रियात्मक कार्डहरू: नेतृत्वको फोन, इमेल र जिम्मेवारी हेर्न कार्डमा थिच्नुहोस् वा छुनुहोस्।'],
  [/\bWant to Serve in the Bote Youth Leadership Committee\?\b/gi, 'बोटे युवा नेतृत्व समितिमा सेवा गर्न चाहनुहुन्छ?'],
  [/\bEvery registered youth member aged 15-35 can volunteer for portfolios in river cleanup, language transcription, and scholarship mentoring\.\b/gi, '१५ देखि ३५ वर्षका हरेक दर्ता भएका युवा सदस्यहरूले नदी सफाइ, भाषा संकलन, र छात्रवृत्ति परामर्शका क्षेत्रमा स्वयंसेवा गर्न सक्नुहुन्छ।'],
  [/\bSubmit Community Joining Form\b/gi, 'समुदाय सदस्यता फारम भर्नुहोस्'],
  [/\bRegistered Community Member\b/gi, 'दर्ता भएका समुदाय सदस्य'],
  [/\bYour Leadership Participation is Welcomed\b/gi, 'तपाईंको नेतृत्व सहभागितालाई स्वागत छ'],
  [/\bYour official Bote Youth Community Nepal membership is verified\. Reach out directly to committee portfolio leads or review your digital identity card\.\b/gi, 'तपाईंको आधिकारिक नेपाल बोटे युवा समुदाय सदस्यता प्रमाणित भएको छ। समिति संयोजकहरूसँग सिधै सम्पर्क गर्नुहोस् वा आफ्नो डिजिटल परिचयपत्र हेर्नुहोस्।'],

  // Bento Grid & Metrics
  [/\bExplore heritage, language, craftsmanship, council leadership, and digital identity through interconnected Bento modules\.\b/gi, 'अन्तरसम्बन्धित बेन्टो मोड्युलमार्फत सम्पदा, भाषा, डुङ्गा कला, युवा नेतृत्व र डिजिटल पहिचानको अवलोकन गर्नुहोस्।'],
  [/\bSacred offerings to river deities ensuring safe boat passage and rich fish harvests\.\b/gi, 'नदी देवी-देवताको पूजा, सुरक्षित जलयात्रा तथा समृद्ध माछा शिकारको कामना।'],
  [/\bPreserving an endangered oral dialect through active audio archiving and community dictionaries\.\b/gi, 'अडियो अभिलेखीकरण र सामुदायिक शब्दकोशमार्फत लोपोन्मुख मातृभाषाको संरक्षण।'],
  [/\bThe Bote indigenous community honors ancestral river navigation, single-log dugout canoes \(Ek-Dunge Nau\), and sacred water rites while educating and uniting the next generation of Nepali leadership\.\b/gi, 'बोटे आदिवासी समुदायले पुर्ख्यौली जलयात्रा, एक-ढुङ्गे काठका डुङ्गाहरू, र पवित्र नदी पूजाको सम्मान गर्दै नयाँ पुस्ताको शिक्षा तथा युवा नेतृत्वलाई एकताबद्ध गर्दछ।'],
  [/\bBote Population\b/gi, 'बोटे कुल जनसंख्या'],
  [/\bPopulation\b/gi, 'जनसंख्या'],
  [/\bCouncil Wards\b/gi, 'परिषद वडा कार्यक्षेत्र'],
  [/\bScholarship Fund\b/gi, 'छात्रवृत्ति कोष'],
  [/\bFund\b/gi, 'कोष'],
  [/\bIndigenous Pride\b/gi, 'आदिवासी गौरव'],
  [/\bPride\b/gi, 'गौरव'],
  [/\bMatrix\b/gi, 'संरचना'],
  [/\bGrid Overview\b/gi, 'समग्र परिचय'],
  [/\bGrid\b/gi, 'तालिका'],
  [/\bOverview\b/gi, 'समग्र परिचय'],
  [/\bDialect\b/gi, 'लवज (उपभाषा)'],
  [/\bLexicon\b/gi, 'शब्दकोश'],
  [/\bRites\b/gi, 'संस्कार तथा विधि'],
  [/\bGET\b/g, 'पाउनुहोस्'],
  [/\bGet\b/g, 'पाउनुहोस्'],

  // -------------------------------------------------------------
  // 8. BOTE HISTORY, EK-DUNGE NAU ARCHITECTURE & TIMELINE
  // -------------------------------------------------------------
  [/\bBote History & River Navigation\b/gi, 'बोटे इतिहास तथा नदी यात्रा परम्परा'],
  [/\bBote History\b/gi, 'बोटे इतिहास'],
  [/\bTrace the ancient evolutionary timeline of the Bote people of Sarlahi, Nepal — from navigating rapid river rapids in handcrafted single-log dugouts to organizing modern youth leadership initiatives\.\b/gi,
   'नेपालको सर्लाहीस्थित बोटे जातिको प्राचीन ऐतिहासिक विकासक्रम — हातले कुँदिएका एक-ढुङ्गे काठका डुङ्गामार्फत उर्लँदो नदी पार गर्नेदेखि आधुनिक युवा नेतृत्व अभियानसम्मको यात्रा।'],
  [/\bEk-Dunge Nau: The Architecture of Bote Single-Log Canoes\b/gi, 'एक-ढुङ्गे नाउ: बोटे परम्परागत काठको डुङ्गा शिल्पकला'],
  [/\bThe Architecture of Bote Single-Log Canoes\b/gi, 'बोटे परम्परागत काठको डुङ्गा शिल्पकला'],
  [/\bThe Ek-Dunge Nau \(single-log canoe\) is an indigenous engineering masterpiece\. Carved out of a single massive tree trunk without nails or joints, these boats can navigate treacherous monsoon currents and carry dozens of passengers safely across the Bagmati, Narayani, and Kaligandaki rivers\.\b/gi,
   'एक-ढुङ्गे नाउ (काठको डुङ्गा) आदिवासी इन्जिनियरिङको उत्कृष्ट नमुना हो। बिना किल्ला वा जोड, एउटै विशाल रुखको मुढाबाट कुँदिएका यी डुङ्गाहरूले वर्षायामको उर्लँदो बाढीमा पनि दर्जनौँ यात्रुहरूलाई बागमती, नारायणी र कालीगण्डकी नदी सुरक्षित रूपमा पार गराउँछन्।'],
  [/\bTree Selection & Forest Rite\b/gi, 'रुख छनोट तथा वन पूजा संस्कार'],
  [/\bElders select giant Simal \(silk-cotton\) or Sal trees\. Prayers are offered to forest spirits with red vermillion and rice to seek spiritual permission before felling\.\b/gi,
   'जेष्ठ सदस्यहरूले विशाल सिमल वा सालको रुख छनोट गर्छन्। रुख ढाल्नुअघि वन देवी-देवताको आध्यात्मिक अनुमति माग्न रातो सिन्दूर र अक्षतासहित पूजा-अर्चना गरिन्छ।'],
  [/\bAdze Core Hollowing\b/gi, 'बाँसुल (चारी) द्वारा भित्री भाग खोप्ने'],
  [/\bArtisans use customary adzes \(\*chari\*\) to chip away the heartwood, meticulously calibrating the hull thickness to ensure uniform buoyancy and balance in white-water rapids\.\b/gi,
   'कलाकारहरूले परम्परागत बाँसुल (चारी) प्रयोग गरी रुखको भित्री काठ खोप्छन्, र नदीको तीव्र छालमा सन्तुलन कायम राख्न डुङ्गाको बाहिरी र भित्री मोटाइ सटिक रूपमा मिलाउँछन्।'],
  [/\bFire-Seasoning the Hull\b/gi, 'आगोको धुवाँद्वारा काठको उपचार (सिजनिङ)'],
  [/\bControlled smoldering fires are burned inside the hollow to char the wood surface\. This indigenous heat treatment seals the pores against water beetles and rot\.\b/gi,
   'खोपेको डुङ्गाभित्र नियन्त्रित मन्द आगो बालेर काठको सतहलाई डढाइन्छ। यो परम्परागत प्रविधिले काठका छिद्रहरू बन्द गरी पानीका कीरा र सडनबाट सुरक्षित राख्छ।'],
  [/\bCenturies of Riparian Craft\b/gi, 'शताब्दीयौँ पुरानो जलयात्रा तथा शिल्पकला'],
  [/\bExplore Bote Cultural Traditions & Rituals\b/gi, 'बोटे सांस्कृतिक परम्परा तथा नदी पूजाविधि अन्वेषण गर्नुहोस्'],
  [/\bDiscover Sansari Devi River Puja, Maghe Sankranti races, and animist prayers\.\b/gi, 'संसारी देवी नदी पूजा, माघे सङ्क्रान्ति डुङ्गा दौड र प्रकृति आराधनाको अवलोकन गर्नुहोस्।'],
  [/\bView Cultures\b/gi, 'संस्कृति अवलोकन गर्नुहोस्'],
  [/\bBote Evolutionary Timeline\b/gi, 'बोटे जातिको ऐतिहासिक विकासक्रम'],
  [/\bInteractive Chronological Journey\b/gi, 'अन्तरक्रियात्मक कालक्रम यात्रा'],
  [/\bClick any era on the rail or use the player to travel through centuries of river heritage\.\b/gi, 'नदी सम्पदाको शताब्दीयौँको इतिहास अन्वेषण गर्न रेलमा कुनै पनि युग क्लिक गर्नुहोस् वा स्वतः भ्रमण सुरु गर्नुहोस्।'],
  [/\bInteractive Spotlight\b/gi, 'अन्तरक्रियात्मक हाइलाइट'],
  [/\bComplete Trail\b/gi, 'पूर्ण कालक्रम'],
  [/\bChronological Trail \(All 7 Epochs\)\b/gi, 'पूर्ण ऐतिहासिक कालक्रम (सबै ७ कालखण्ड)'],
  [/\bA continuous historical timeline from ancient river worship to modern youth empowerment\.\b/gi, 'प्राचीन नदी पूजादेखि आधुनिक युवा सशक्तीकरणसम्मको निरन्तर ऐतिहासिक यात्रा।'],
  [/\bArchival Evidence & Artifacts:\b/gi, 'ऐतिहासिक प्रमाण तथा अवशेषहरू:'],
  [/\bArchival Evidence & Artifacts\b/gi, 'ऐतिहासिक प्रमाण तथा अवशेषहरू'],
  [/\bCultural Impact & Preservation Significance\b/gi, 'सांस्कृतिक प्रभाव तथा संरक्षण महत्व'],
  [/\bPrevious Era\b/gi, 'अघिल्लो युग'],
  [/\bNext Era\b/gi, 'अर्को युग'],
  [/\bExplore River Rites\b/gi, 'नदी पूजा परम्परा हेर्नुहोस्'],
  [/\bClick to Spotlight\b/gi, 'विस्तृत विवरण हेर्नुहोस्']
];

// Pre-sorted dictionary descending by pattern length so that longer sentences
// and multi-word phrases match FIRST before single words fragment the text.
let sortedDictionaryCache: [RegExp, string][] | null = null;
function getSortedDictionary(): [RegExp, string][] {
  if (!sortedDictionaryCache) {
    sortedDictionaryCache = [...EN_TO_NE_DICTIONARY].sort((a, b) => b[0].source.length - a[0].source.length);
  }
  return sortedDictionaryCache;
}

// Helper to store original English texts so we can restore English with 100% fidelity
const originalTextMap = new WeakMap<Node, string>();
const originalAttributeMap = new WeakMap<Element, Record<string, string>>();

let activeObserver: MutationObserver | null = null;
let currentLanguageTarget: 'ne' | 'en' = 'en';

/**
 * Translates a single text string into Nepali using sorted dictionary
 */
export function translateStringToNepali(raw: string): string {
  if (!raw || typeof raw !== 'string') return raw;
  let text = raw;
  const dict = getSortedDictionary();
  for (const [regex, nepali] of dict) {
    text = text.replace(regex, nepali);
  }
  return text;
}

/**
 * Perform direct DOM text and attribute translation fallback across the entire document
 */
export function applyDomTranslation(targetLang: 'ne' | 'en') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  currentLanguageTarget = targetLang;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (
          tag === 'script' ||
          tag === 'style' ||
          tag === 'noscript' ||
          tag === 'code' ||
          tag === 'pre' ||
          parent.classList.contains('goog-te-combo') ||
          parent.id === 'google_translate_element'
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue || node.nodeValue.trim() === '') {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes: Node[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  // Also query elements with translatable attributes (placeholder, title, aria-label)
  const inputElements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input[placeholder], textarea[placeholder]'
  );
  const titledElements = document.querySelectorAll<HTMLElement>(
    'button[title], a[title], button[aria-label], a[aria-label]'
  );

  if (targetLang === 'ne') {
    // 1. Translate DOM Text Nodes
    for (const node of nodes) {
      if (!originalTextMap.has(node)) {
        originalTextMap.set(node, node.nodeValue || '');
      }
      const original = originalTextMap.get(node) || node.nodeValue || '';
      const translated = translateStringToNepali(original);
      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    }

    // 2. Translate Input and Textarea Placeholders
    inputElements.forEach((el) => {
      if (!originalAttributeMap.has(el)) {
        originalAttributeMap.set(el, {});
      }
      const saved = originalAttributeMap.get(el)!;
      if (!('placeholder' in saved) && el.placeholder) {
        saved.placeholder = el.placeholder;
      }
      const original = saved.placeholder || el.placeholder;
      if (original) {
        const translated = translateStringToNepali(original);
        if (el.placeholder !== translated) {
          el.placeholder = translated;
        }
      }
    });

    // 3. Translate Element Titles and Aria Labels
    titledElements.forEach((el) => {
      if (!originalAttributeMap.has(el)) {
        originalAttributeMap.set(el, {});
      }
      const saved = originalAttributeMap.get(el)!;
      const titleAttr = el.getAttribute('title');
      const ariaAttr = el.getAttribute('aria-label');

      if (titleAttr && !('title' in saved)) {
        saved.title = titleAttr;
      }
      if (ariaAttr && !('aria-label' in saved)) {
        saved['aria-label'] = ariaAttr;
      }

      if (saved.title) {
        const translatedTitle = translateStringToNepali(saved.title);
        if (el.getAttribute('title') !== translatedTitle) {
          el.setAttribute('title', translatedTitle);
        }
      }
      if (saved['aria-label']) {
        const translatedAria = translateStringToNepali(saved['aria-label']);
        if (el.getAttribute('aria-label') !== translatedAria) {
          el.setAttribute('aria-label', translatedAria);
        }
      }
    });

    // 4. MutationObserver with characterData & subtree to translate dynamic components instantly
    if (!activeObserver && typeof MutationObserver !== 'undefined') {
      let timeoutId: number | null = null;
      activeObserver = new MutationObserver(() => {
        if (currentLanguageTarget !== 'ne') return;
        if (timeoutId) window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          if (currentLanguageTarget === 'ne') {
            applyDomTranslation('ne');
          }
        }, 60);
      });

      activeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  } else {
    // Restore English
    if (activeObserver) {
      activeObserver.disconnect();
      activeObserver = null;
    }

    // 1. Restore DOM Text Nodes
    for (const node of nodes) {
      if (originalTextMap.has(node)) {
        const original = originalTextMap.get(node);
        if (original && node.nodeValue !== original) {
          node.nodeValue = original;
        }
      }
    }

    // 2. Restore Input and Textarea Placeholders
    inputElements.forEach((el) => {
      const saved = originalAttributeMap.get(el);
      if (saved && saved.placeholder && el.placeholder !== saved.placeholder) {
        el.placeholder = saved.placeholder;
      }
    });

    // 3. Restore Element Titles and Aria Labels
    titledElements.forEach((el) => {
      const saved = originalAttributeMap.get(el);
      if (saved) {
        if (saved.title && el.getAttribute('title') !== saved.title) {
          el.setAttribute('title', saved.title);
        }
        if (saved['aria-label'] && el.getAttribute('aria-label') !== saved['aria-label']) {
          el.setAttribute('aria-label', saved['aria-label']);
        }
      }
    });
  }
}

/**
 * Purge and clean up any Google Translate banners, iframes, and cookies
 */
export function purgeGoogleTranslateArtifacts() {
  if (typeof document === 'undefined') return;

  // 1. Remove any injected Google Translate DOM elements/iframes
  const selectors = [
    '.goog-te-banner-frame',
    '.skiptranslate',
    '#goog-gt-tt',
    '#google_translate_element',
    '.goog-te-balloon-frame',
    'iframe[name^="goog-te-"]',
    'iframe.goog-te-banner-frame'
  ];

  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      try {
        el.remove();
      } catch {
        // ignore
      }
    });
  });

  // 2. Reset body top styling that Google Translate forces
  if (document.body) {
    document.body.style.top = '0px';
    document.body.style.position = 'static';
  }

  // 3. Clear googtrans cookies
  try {
    const domain = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (domain) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    }
  } catch {
    // ignore
  }
}

/**
 * Triggers clean 1-click full-website translation between Nepali ('ne') and English ('en')
 * without any external Google Translate headers, toolbars, or banners.
 * Executes multiple staggered frames to catch any deferred React updates.
 */
export function triggerFullWebsiteTranslation(targetLang: 'ne' | 'en') {
  if (typeof window === 'undefined') return;

  // Ensure Google Translate banners and toolbars are purged
  purgeGoogleTranslateArtifacts();

  // Update Document Attribute & Storage
  document.documentElement.lang = targetLang;
  localStorage.setItem('bycn_user_language', targetLang);

  // Run pass 1: Immediate
  applyDomTranslation(targetLang);

  // Run pass 2: Next animation frame (after immediate React render updates)
  requestAnimationFrame(() => {
    applyDomTranslation(targetLang);
  });

  // Run pass 3: Microtask & short timeout for complex component transitions
  setTimeout(() => {
    applyDomTranslation(targetLang);
  }, 60);

  setTimeout(() => {
    applyDomTranslation(targetLang);
  }, 200);
}

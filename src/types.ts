export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const TRANSLATIONS = {
  en: {
    title: "Yojana Sahayak",
    subtitle: "Your AI Guide to Indian Government Schemes",
    placeholder: "Ask about scholarships, pensions, or welfare schemes...",
    send: "Send",
    suggestions: ["Scholarships for students", "PMAY Housing Scheme", "PM-Kisan benefits", "Health insurance schemes"],
    welcome: "Namaste! I am Yojana Sahayak. How can I help you explore government schemes today?",
  },
  hi: {
    title: "योजना सहायक",
    subtitle: "भारतीय सरकारी योजनाओं के लिए आपका एआई गाइड",
    placeholder: "छात्रवृत्ति, पेंशन या कल्याणकारी योजनाओं के बारे में पूछें...",
    send: "भेजें",
    suggestions: ["छात्रों के लिए छात्रवृत्ति", "PMAY आवास योजना", "PM-Kisan लाभ", "स्वास्थ्य बीमा योजनाएं"],
    welcome: "नमस्ते! मैं योजना सहायक हूँ। आज मैं सरकारी योजनाओं को खोजने में आपकी कैसे मदद कर सकता हूँ?",
  },
  bn: {
    title: "যোজনা সহায়ক",
    subtitle: "ভারতীয় সরকারি প্রকল্পের জন্য আপনার এআই গাইড",
    placeholder: "স্কলারশিপ, পেনশন বা কল্যাণমূলক প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...",
    send: "পাঠান",
    suggestions: ["ছাত্রদের জন্য স্কলারশিপ", "PMAY আবাসন প্রকল্প", "PM-Kisan সুবিধা", "স্বাস্থ্য বীমা প্রকল্প"],
    welcome: "নমস্কার! আমি যোজনা সহায়ক। আজ আমি আপনাকে সরকারি প্রকল্পগুলি অন্বেষণ করতে কীভাবে সাহায্য করতে পারি?",
  },
  ta: {
    title: "யோஜனா சகாயக்",
    subtitle: "இந்திய அரசு திட்டங்களுக்கான உங்கள் AI வழிகாட்டி",
    placeholder: "உதவித்தொகை, ஓய்வூதியம் அல்லது நலத்திட்டங்கள் பற்றி கேளுங்கள்...",
    send: "அனுப்பு",
    suggestions: ["மாணவர்களுக்கான உதவித்தொகை", "PMAY வீட்டு வசதி திட்டம்", "PM-Kisan பலன்கள்", "காப்பீட்டுத் திட்டங்கள்"],
    welcome: "வணக்கம்! நான் யோஜனா சகாயக். இன்று அரசு திட்டங்களை ஆராய உங்களுக்கு நான் எப்படி உதவ முடியும்?",
  },
};


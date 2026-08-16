export const company = {
  name: "QHC",
  fullName: "Quality Health Care",
  tagline: "Care You Can Trust",
  director: "Mahroza Rao",
  phone: "+92 3004334065",
  phoneTel: "+923004334065",
  whatsapp: "923004334065",
  whatsappUrl: "https://wa.me/923004334065",
  email: "info@qhcare.com.pk",
  website: "qhcare.com.pk",
  city: "Lahore",
  offices: [
    {
      label: "Office 1 — Gulberg",
      address: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
    },
    {
      label: "Office 2 — Defense Road",
      address: "Office #5, Bismillah Plaza, Defense Road, Lahore",
    },
  ],
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/appointment", label: "Appointment" },
  { href: "/contact", label: "Contact" },
] as const;

export type ServiceItem = {
  id: string;
  title: string;
  short: string;
  description: string;
  image: string;
};

export const services: ServiceItem[] = [
  {
    id: "home-nursing",
    title: "Home Nursing",
    short: "Male & Female",
    description:
      "Qualified male and female nurses providing professional nursing care in the comfort of your home across Lahore.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dressing-iv",
    title: "Dressing & IV Injections",
    short: "Wound care & infusions",
    description:
      "Sterile wound dressing, IV cannulation, and injection administration by trained clinicians at your doorstep.",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "physiotherapy",
    title: "Physiotherapy at Home",
    short: "Recovery & mobility",
    description:
      "Personalized physiotherapy sessions at home to restore strength, mobility, and comfort after illness or injury.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doctor-consultation",
    title: "Doctors Consultation at Home",
    short: "Physician visits",
    description:
      "Experienced doctors visit your home for consultations, follow-ups, and medical advice without hospital travel.",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "diagnostics",
    title: "X-Ray / Ultrasound / ECG at Home",
    short: "Home diagnostics",
    description:
      "Portable diagnostic services including X-ray, ultrasound, and ECG conducted safely in your residence.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "elderly-care",
    title: "Elderly Care",
    short: "Senior support",
    description:
      "Compassionate, dignified care for seniors—daily assistance, medication support, and companionship in Lahore.",
    image:
      "https://images.unsplash.com/photo-1542849808-1ed9a6d0e862?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mental-health",
    title: "Mental Health Care & Support",
    short: "Counseling support",
    description:
      "Confidential mental health support and guidance to help patients and families navigate emotional wellbeing.",
    image:
      "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "baby-care",
    title: "Baby Care",
    short: "Newborn & infant",
    description:
      "Trusted baby care and newborn support from trained caregivers, focused on safety, hygiene, and comfort.",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
  },
];

export const whyChooseUs = [
  {
    title: "Qualified Healthcare Professionals",
    text: "Every caregiver is carefully vetted, trained, and matched to your clinical needs.",
  },
  {
    title: "24/7 Availability Across Lahore",
    text: "Round-the-clock support so help is available whenever your family needs it.",
  },
  {
    title: "Patient-Centric Home Care",
    text: "Personalized plans that prioritize comfort, dignity, and clear communication.",
  },
  {
    title: "Seamless Continuum of Care",
    text: "From first call to ongoing visits, we coordinate care without hospital hassle.",
  },
] as const;

export const stats = [
  { value: "1000+", label: "Happy Patients" },
  { value: "8", label: "Services" },
  { value: "24/7", label: "Available" },
  { value: "Lahore", label: "Based" },
] as const;

export const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Gulberg, Lahore",
    quote:
      "QHC arranged a female nurse for my mother within hours. Professional, kind, and always on time. We finally feel at ease at home.",
  },
  {
    name: "Imran Sheikh",
    role: "DHA, Lahore",
    quote:
      "Physiotherapy at home saved us countless hospital trips. The therapist explained every exercise clearly and my father improved quickly.",
  },
  {
    name: "Sana Malik",
    role: "Johar Town, Lahore",
    quote:
      "From IV dressings to doctor visits, QHC handled everything with care. Transparent communication and genuine compassion throughout.",
  },
] as const;

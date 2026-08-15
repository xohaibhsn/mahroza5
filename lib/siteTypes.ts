export type SiteService = {
  id: string;
  dbId?: number;
  title: string;
  short: string;
  description: string;
  image: string;
};

export type SiteTestimonial = {
  name: string;
  role: string;
  quote: string;
};

export type SiteContent = {
  hero_heading: string;
  hero_subheading: string;
  about_text: string;
  stat_patients: string;
  stat_services: string;
  stat_availability: string;
  stat_location: string;
  phone: string;
  whatsapp: string;
  address1: string;
  address2: string;
  email: string;
  logo_url: string;
  favicon_url: string;
  site_title: string;
  meta_description: string;
};

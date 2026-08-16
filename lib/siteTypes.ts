export type SiteService = {
  id: string;
  dbId?: number;
  title: string;
  short: string;
  description: string;
  image: string;
  icon?: string;
};

export type SiteTestimonial = {
  name: string;
  role: string;
  quote: string;
  rating?: number;
};

export type SiteContent = {
  hero_heading: string;
  hero_subheading: string;
  hero_button_text: string;
  about_heading: string;
  about_description: string;
  about_text: string;
  why_point_1: string;
  why_point_2: string;
  why_point_3: string;
  why_point_4: string;
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
  og_image_url: string;
  site_title: string;
  meta_description: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  tiktok_url: string;
};

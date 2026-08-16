import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=800&q=80",
    alt: "Female nurse with stethoscope smiling",
  },
  {
    src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    alt: "Doctor visiting patient at home",
  },
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    alt: "Elderly care at home",
  },
  {
    src: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    alt: "Baby care and family healthcare",
  },
];

export default function HeroSlider() {
  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="h-[450px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-[450px] w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

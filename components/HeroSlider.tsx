import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { DEFAULT_SLIDES } from "@/lib/contentSections";
import "swiper/css";
import "swiper/css/effect-fade";

const slideAlts = [
  "Female nurse with stethoscope smiling",
  "Doctor visiting patient at home",
  "Elderly care at home",
  "Baby care and family healthcare",
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<string[]>(DEFAULT_SLIDES);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/site-content");
        const data = await res.json();
        const fromApi = [
          data?.hero?.slide_1,
          data?.hero?.slide_2,
          data?.hero?.slide_3,
          data?.hero?.slide_4,
        ]
          .map((s) => String(s || "").trim())
          .filter(Boolean);
        if (active && fromApi.length) {
          setSlides(fromApi.length >= 4 ? fromApi.slice(0, 4) : [...fromApi, ...DEFAULT_SLIDES].slice(0, 4));
        }
      } catch {
        // keep defaults
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="h-[450px] w-full"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={slideAlts[index] || `Hero slide ${index + 1}`}
              className="h-[450px] w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

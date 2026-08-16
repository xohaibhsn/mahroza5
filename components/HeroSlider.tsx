import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { DEFAULT_SLIDES } from "@/lib/contentSections";
import "swiper/css";
import "swiper/css/pagination";

const slideAlts = [
  "Female nurse with stethoscope smiling",
  "Doctor visiting patient at home",
  "Elderly care at home",
  "Baby care and family healthcare",
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<string[]>(DEFAULT_SLIDES);
  const [ready, setReady] = useState(false);

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
          setSlides(
            fromApi.length >= 4
              ? fromApi.slice(0, 4)
              : [...fromApi, ...DEFAULT_SLIDES].slice(0, 4)
          );
        }
      } catch {
        // keep defaults
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="hero-slider w-full overflow-hidden rounded-2xl bg-primary-dark shadow-2xl">
      <Swiper
        key={ready ? slides.join("|") : "loading"}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={slides.length > 1}
        speed={600}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        className="h-[240px] w-full sm:h-[340px] lg:h-[450px]"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={`${index}-${src}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={slideAlts[index] || `Hero slide ${index + 1}`}
              className="block h-[240px] w-full object-cover sm:h-[340px] lg:h-[450px]"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

import { useState } from 'react';
import PromoLightbox from './PromoLightbox';

export default function Promotions({ promo1ImageUrl, promo2ImageUrl }) {
  const images = [promo1ImageUrl, promo2ImageUrl].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(null);

  if (images.length === 0) return null;

  return (
    <section id="promociones" className="bg-cream px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Nuestras promociones
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Disfruta nuestras promos del mes
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group overflow-hidden rounded-2xl shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
            >
              <img
                src={src}
                alt={`Promoción ${i + 1}`}
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <PromoLightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </section>
  );
}

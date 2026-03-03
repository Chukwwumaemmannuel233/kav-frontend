"use client";

import Link from "next/link";
import SiteHeader from "../../components/site-header";

export default function OurStory() {
  return (
    <main className="bg-white">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
          Woven with Purpose
        </h1>
        <p className="text-base md:text-lg text-neutral-700 max-w-3xl mx-auto leading-relaxed">
          Discover the story behind our threads, a narrative of passion,
          craftsmanship, and timeless quality that defines every piece we
          create.
        </p>
      </section>

      {/* Heritage Image */}
      <section className="px-6 md:px-16 py-12 md:py-16 flex justify-center">
        <div className="w-full max-w-5xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABAUAXCnZUmpdjtQlpMEVYtqxz2nHtfcPKiUMoLDRThhQwz3X9YPdRd9fyQizWihK38tLeJg8VfYX0DRpynvA4fp8XYeqyaIFr43F-A0fsl8mNHesKI-bzcJ-iglHIXpJ2_vE2Uny_J6X2-ZfW3OPAyC6yXq-Ptz74HAsos6L2L7L0OMjf_KFHqdAw0H6m9vk6twwVl2QU4cW1W7CXglzRaRNXUcCdNFp3PZNN4CZ86Tfu5iRXZ0Z49P-VcJcELWoR0d-blaJsXxRy"
            alt="Woven fabric texture"
            className="w-full h-72 md:h-96 object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Our Heritage Section */}
      <section className="py-16 md:py-24 px-6 md:px-16 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Heritage</h2>
        <div className="space-y-6 text-neutral-700 leading-relaxed">
          <p className="text-base md:text-lg">
            Our journey began with a simple belief: that the fabrics we choose
            to live with should be as beautiful and enduring as the stories they
            help create. Founded by artisans with a shared passion for
            traditional techniques and modern design, our brand was born from a
            desire to bring exceptional textiles to discerning creators and
            homeowners.
          </p>
          <p className="text-base md:text-lg">
            Each thread carries a legacy of generations, a commitment to quality
            that transcends trends. We started in a small workshop, surrounded
            by the hum of looms and the scent of natural dyes, with a vision to
            honor the past while weaving the future.
          </p>
        </div>
      </section>

      {/* Heritage Images Grid */}
      <section className="px-6 md:px-16 py-12 md:py-16 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdDy89xG5pA6YpACLJzGGaT4gDTvpj7vPVHetu65olrc9f3eQ_8YDiGaouTDV3Ly-LuOHDldWTMmwt5w_sjIC4UpcuGww2MCfAfjmyD9d-k3hjLFxOamPrqn71gEMfQtaXRznPsU0ETIpNGnm6tRaqoEMcDneJ__yn0ByDXQ_6Gx-Ll_1jUsrgTMjcmVGvH284XNU8NhafG9LvQJ3lSjxYL_a4lh6USKt7cL9tOc7BCFm5RWe2vYDztCnRofS2dOPeYEUC70CXHIL8"
              alt="Textile loom in workshop"
              className="w-full h-72 md:h-80 object-cover rounded-lg"
            />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRkqGqJ1yKERZx3XInuVZx16BQ8nqd_01XkyNiP8MbGQGHplhRnM5843NUURHigiwd4GeXaKVrZ2hhoJvkeaNxJ1_AWuFEg49OEKgkmZtvRqoqux8YGOnozRf2NW7zdzhM3ucU0DNevM1P2HZl-DdDJ16qksEcF_ySMzgW62DeZ_08A5fi4z2_jzO-AmvAwOYhnymh2M_AK7Mc_oo_Wr14adZSP1yKqZkw6WbgB_RxyLryvrqvRWHqo-jkDJwiqMg-Q_y51LQE2kVQ"
              alt="Hands dyeing fabric naturally"
              className="w-full h-72 md:h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* The Craftsmanship Section */}
      <section className="py-16 md:py-24 px-6 md:px-16 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          The Craftsmanship
        </h2>
        <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
          We believe in the power of the human touch. Our fabrics are the result
          of countless hours of meticulous work, from sourcing the finest
          natural fibers to the final inspection of every yard. We partner with
          small, family-run mills that share our dedication to ethical practices
          and unparalleled quality. This synergy of traditional methods and
          contemporary design results in textiles that are not just materials,
          but works of art.
        </p>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 md:py-24 px-6 md:px-16 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Vision</h2>
        <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
          Looking ahead, our vision is to continue championing the art of
          textile making. We are committed to sustainability, exploring
          innovative, eco-friendly materials and processes that protect our
          planet. We aim to inspire a community of creators who value
          authenticity and quality, providing them with fabrics that empower
          their creative expression. Our story is ever-evolving, woven into
          every new design we introduce.
        </p>
      </section>

      {/* CTA Button */}
      <section className="py-16 md:py-24 px-6 md:px-16 flex justify-center">
        <Link href="/shop">
          <button className="bg-black text-white px-8 py-4 font-medium hover:bg-neutral-900 transition text-base md:text-lg">
            Explore Our Fabrics
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-neutral-600 mb-8">
            © 2025 FABRIC. All rights reserved.
          </p>
          <div className="flex justify-center gap-8">
            <a
              href="#"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Pinterest
            </a>
            <a
              href="#"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

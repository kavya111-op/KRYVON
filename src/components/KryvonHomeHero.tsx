import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShoppingBag,
  Gift,
  TicketPercent,
} from 'lucide-react';
import './KryvonHomeHero.css';

// REAL PRODUCT IMAGES
const heroHeadphones = new URL(
  '../assets/images/hero-headphones.png.jpg',
  import.meta.url
).href;

const headphones = new URL(
  '../assets/images/headphones_anc_black_1793726638571.jpg',
  import.meta.url
).href;

const keyboard = new URL(
  '../assets/images/mechanical_keyboard_wireless_1793726640049.jpg',
  import.meta.url
).href;

type KryvonCategory = 'audio' | 'mobile' | 'computing' | 'gaming';

interface KryvonHomeHeroProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenCollection?: (category: KryvonCategory) => void;
}

const categories = [
  {
    id: 'audio' as const,
    number: '01',
    name: 'Audio',
    tagline: 'Find your sound.',
    description: 'Headphones · Earbuds · Speakers',
    image: headphones,
    imageAlt: 'Premium wireless headphones',
    className: 'category-audio',
  },
  {
    id: 'mobile' as const,
    number: '02',
    name: 'Mobile',
    tagline: 'Stay connected.',
    description: 'Smartphones · Accessories · Tablets',
    image: '/images/mobile.jpg',
    imageAlt: 'Mobile technology collection',
    className: 'category-mobile',
  },
  {
    id: 'computing' as const,
    number: '03',
    name: 'Computing',
    tagline: 'Create without limits.',
    description: 'Laptops · Keyboards · Workspace',
    image: keyboard,
    imageAlt: 'Mechanical wireless keyboard',
    className: 'category-computing',
  },
  {
    id: 'gaming' as const,
    number: '04',
    name: 'Gaming',
    tagline: 'Enter your world.',
    description: 'Controllers · Gaming gear · Accessories',
    image: '/images/gaming.jpg',
    imageAlt: 'Gaming technology collection',
    className: 'category-gaming',
  },
];

export default function KryvonHomeHero({
  cartCount = 0,
  onOpenCart,
  onOpenCollection,
}: KryvonHomeHeroProps) {
  return (
    <main className="kryvon-home">

      {/* NAVIGATION */}
      <nav className="kryvon-nav">
        <a href="/" className="kryvon-logo">
          KRYVON<span>.</span>
        </a>

        <div className="kryvon-nav-links">
          <a href="#products">Discover</a>
          <a href="#ai-kit-builder">AI Kit Builder</a>
          <a href="#kryvon-offers">Offers & Coupons</a>
        </div>

        <button
          className="kryvon-cart"
          onClick={onOpenCart}
          type="button"
        >
          <ShoppingBag size={17} />
          <span>Bag ({cartCount})</span>
        </button>
      </nav>

      {/* HERO */}
      <section className="kryvon-hero">

        <motion.div
          className="kryvon-hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="kryvon-eyebrow">
            INTELLIGENT COMMERCE · MADE SIMPLE
          </span>

          <h1>
            Technology,
            <br />
            <em>chosen intelligently.</em>
          </h1>

          <p>
            Discover technology that fits your needs, your lifestyle
            and your budget. Let intelligent recommendations help
            you make smarter buying decisions.
          </p>

          <div className="kryvon-hero-actions">
            <a href="#products" className="kryvon-primary-btn">
              Explore products <ArrowRight size={17} />
            </a>

            <a href="#ai-kit-builder" className="kryvon-secondary-btn">
              Build my kit
            </a>
          </div>

          <div className="kryvon-trust-note">
            <span className="trust-dot" />
            Smart recommendations, built around your budget
          </div>
        </motion.div>

        <motion.div
          className="kryvon-hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="hero-image-backdrop" />

          <img
            className="hero-product-image"
            src={heroHeadphones}
            alt="Premium wireless headphones"
          />

          <div className="hero-image-caption">
            <span>01 / FEATURED DISCOVERY</span>
            <strong>Sound, reimagined.</strong>
          </div>

          <div className="hero-floating-label">
            <span className="floating-label-dot" />
            Thoughtfully selected
          </div>
        </motion.div>

      </section>

      {/* FOUR CATEGORY COLLECTIONS */}
      <section className="kryvon-product-section" id="products">

        <div className="product-section-heading">
          <div>
            <span className="kryvon-eyebrow">
              EXPLORE BY CATEGORY
            </span>

            <h2>
              Find your kind
              <br />
              <em>of technology.</em>
            </h2>
          </div>

          <span className="category-section-note">
            FOUR WORLDS. ONE SMARTER WAY TO SHOP.
          </span>
        </div>

        <div className="kryvon-category-grid">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              type="button"
              className={`kryvon-category-card ${category.className}`}
              onClick={() => onOpenCollection?.(category.id)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: index * 0.1,
              }}
              whileHover={{ y: -5 }}
              aria-label={`Explore ${category.name} collection`}
            >
              <div className="category-image-area">

                <span className="category-number">
                  {category.number} / 04
                </span>

                <img
                  src={category.image}
                  alt={category.imageAlt}
                  loading="lazy"
                />

                <span className="category-image-arrow">
                  <ArrowRight size={19} />
                </span>

              </div>

              <div className="category-card-content">
                <div>
                  <span className="category-status">
                    EXPLORE COLLECTION
                  </span>

                  <h3>{category.name}</h3>

                  <p className="category-tagline">
                    {category.tagline}
                  </p>

                  <p className="category-description">
                    {category.description}
                  </p>
                </div>

                <span className="category-bottom-arrow">
                  <ArrowRight size={19} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

      </section>

      {/* KRYVON OFFERS & COUPONS */}
      <section
        className="kryvon-offers-section"
        id="kryvon-offers"
      >

        <div className="kryvon-offers-heading">
          <div>
            <span className="offers-eyebrow">
              A LITTLE SOMETHING EXTRA
            </span>

            <h2>
              KRYVON
              <br />
              <em>Privileges.</em>
            </h2>
          </div>

          <p className="offers-subtitle">
            Lovely finds deserve
            <br />
            <em>lovely little perks.</em>
          </p>
        </div>

        <div className="kryvon-offers-grid">

          {/* WELCOME OFFER */}
          <motion.article
            className="kryvon-offer-card offer-welcome"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="offer-card-top">
              <span className="offer-icon">
                <Gift size={23} strokeWidth={1.7} />
              </span>

              <span className="offer-number">01 / A WARM WELCOME</span>
            </div>

            <div className="offer-card-copy">
              <span className="offer-card-label">
                YOUR KRYVON JOURNEY
              </span>

              <h3>
                A little
                <br />
                welcome treat.
              </h3>

              <p>
                New here? Discover the latest welcome benefits
                and eligible offers on your first order.
              </p>
            </div>

            <a href="#products" className="offer-card-link">
              Start exploring <ArrowRight size={17} />
            </a>

            <span className="offer-decoration offer-decoration-one" />
          </motion.article>

          {/* BUNDLE OFFER */}
          <motion.article
            className="kryvon-offer-card offer-bundle"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            whileHover={{ y: -5 }}
          >
            <div className="offer-card-top">
              <span className="offer-icon">
                <TicketPercent size={23} strokeWidth={1.7} />
              </span>

              <span className="offer-number">02 / THE SMARTER COMBO</span>
            </div>

            <div className="offer-card-copy">
              <span className="offer-card-label">
                MADE TO GO TOGETHER
              </span>

              <h3>
                Better
                <br />
                together.
              </h3>

              <p>
                Pair the tech you love. Explore combinations
                that make your everyday setup feel complete.
              </p>
            </div>

            <a href="#products" className="offer-card-link">
              Find your combination <ArrowRight size={17} />
            </a>

            <span className="offer-decoration offer-decoration-two" />
          </motion.article>

          {/* SPECIAL FINDS */}
          <motion.article
            className="kryvon-offer-card offer-special"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            whileHover={{ y: -5 }}
          >
            <div className="offer-card-top">
              <span className="offer-icon">
                <Gift size={23} strokeWidth={1.7} />
              </span>

              <span className="offer-number">03 / WORTH A LOOK</span>
            </div>

            <div className="offer-card-copy">
              <span className="offer-card-label">
                SELECTED DISCOVERIES
              </span>

              <h3>
                Little finds.
                <br />
                Lovely value.
              </h3>

              <p>
                Keep an eye on selected products, special
                picks and seasonal offers from KRYVON.
              </p>
            </div>

            <a href="#products" className="offer-card-link">
              Discover the picks <ArrowRight size={17} />
            </a>

            <span className="offer-decoration offer-decoration-three" />
          </motion.article>

        </div>

        <p className="offers-footnote">
          Available offers, terms and eligibility are displayed
          at checkout.
        </p>

      </section>

      {/* CLOSING SECTION */}
      <section className="kryvon-closing">
        <span className="kryvon-eyebrow">
          THE KRYVON APPROACH
        </span>

        <h2>
          Less noise.
          <br />
          <em>More signal.</em>
        </h2>

        <a href="#products">
          Discover smarter <ArrowRight size={17} />
        </a>
      </section>

    </main>
  );
}
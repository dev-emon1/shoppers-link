import Banner from "@/modules/home/components/banner/index";
import Category from "@/modules/home/components/category/index";

import FeaturedProducts from "@/modules/home/components/FeaturedProducts";

import PromoBanner from "@/modules/home/components/promo_banner/index";
// Promotional banner highlighting special campaigns

import ShopByBrand from "@/modules/home/components/shop_by_brand/index";
// Brand showcase slider section

import NewsletterHybrid from "@/modules/home/components/newsletter/index";
// Newsletter subscription and partner CTA section

import NewArrivals from "@/modules/home/components/NewArrivals";
// New arrivals product section

// import WelcomePopup from "@/components/common/WelcomePopup";
// Optional welcome popup (currently disabled)

import TopRatingProducts from "@/modules/home/components/TopRatingProducts";
// Top-rated products section based on customer ratings

import TopSellingProducts from "@/modules/home/components/TopSellingProduct";
// Best-selling products section

import HelpLine from "@/components/common/HelpLine";
import HomePrefetch from "@/modules/home/components/home_prefetch/index";
import LazySection from "@/components/common/LazySection";
// Customer support / helpline component

export default function Home() {
  return (
    <>
      {/* Optional welcome popup */}
      {/* <WelcomePopup /> */}
      <HomePrefetch />
      <main>
        {/* Global help / support banner */}
        <HelpLine />

        {/* Homepage hero banner */}
        <Banner />

        {/* Shop by category section */}
        <Category />

        {/* Featured products section */}
        <FeaturedProducts />

        {/* Featured deals section (disabled) */}
        {/* <FeaturedDeal /> */}

        {/* Top-rated products section */}
        <TopRatingProducts />

        {/* Promotional campaign banner */}
        <LazySection>
          <PromoBanner position="homepage" />
        </LazySection>

        {/* New arrivals section */}
        <LazySection>
          <NewArrivals />
        </LazySection>

        {/* Top-selling products section */}
        <LazySection>
          <TopSellingProducts />
        </LazySection>

        {/* Shop by brand slider */}
        <LazySection>
          <ShopByBrand />
        </LazySection>

        {/* Newsletter & partner CTA */}
        <LazySection>
          <NewsletterHybrid />
        </LazySection>
      </main>
    </>
  );
}

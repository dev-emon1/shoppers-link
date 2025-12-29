import Banner from "@/modules/home/components/Banner";
// Hero banner section displayed at the top of the homepage

import Category from "@/modules/home/components/Category";
// Product category grid section

import FeaturedProducts from "@/modules/home/components/FeaturedProducts";
// Featured products showcase section

// import FeaturedDeal from "@/components/home/FeaturedDeals";
// Optional featured deals section (currently disabled)

import PromoBanner from "@/modules/home/components/PromoBanner";
// Promotional banner highlighting special campaigns

import ShopByBrand from "@/modules/home/components/ShopByBrand";
// Brand showcase slider section

import NewsletterHybrid from "@/modules/home/components/Newsletter";
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
// Customer support / helpline component

export default function Home() {
  return (
    <>
      {/* Optional welcome popup */}
      {/* <WelcomePopup /> */}

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
        <PromoBanner position="homepage" />

        {/* New arrivals section */}
        <NewArrivals />

        {/* Top-selling products section */}
        <TopSellingProducts />

        {/* Shop by brand slider */}
        <ShopByBrand />

        {/* Newsletter & partner CTA */}
        <NewsletterHybrid />
      </main>
    </>
  );
}

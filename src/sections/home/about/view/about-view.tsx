'use client';

import { AboutHero } from '../about-hero';
import { AboutWhat } from '../about-what';
import { AboutTeam } from '../about-team';
import { AboutVision } from '../about-vision';
import { AboutTestimonials } from '../about-testimonials';
import { HomeAdvertisement } from '../../home-advertisement';
import { HomeFAQs } from '../../home-faqs';

// ----------------------------------------------------------------------

export function AboutView() {
  return (
    <>
      <AboutHero />

      <AboutWhat />

      <AboutVision />

      {/* <AboutTeam /> */}

      <HomeAdvertisement />

      <HomeFAQs />

      <AboutTestimonials />
    </>
  );
}

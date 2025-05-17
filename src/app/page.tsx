'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import ChecklistSection from '@/components/checklist/checklist-section';
import Hero from '@/components/ui/hero';


function useHeaderVisibility(heroRef: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [heroRef]);

  return visible;
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const showHeader = useHeaderVisibility(heroRef);

  return (
    <main className="min-h-screen flex flex-col">
      <section ref={heroRef} >
        <Hero />
      </section>
      <Header show={showHeader} />
      <ChecklistSection />
      <Footer />
    </main>
  );
}

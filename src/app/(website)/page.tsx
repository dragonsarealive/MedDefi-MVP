import HeroSectionFixed from '@/components/home/HeroSectionFixed';
import AboutUs from '@/components/home/AboutUs';
import Services from '@/components/home/Services';
import Doctors from '@/components/home/Doctors';
import Contact from '@/components/home/Contact';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <section id="hero">
        <HeroSectionFixed />
      </section>
      
      <section id="about-us" className="mt-20 mr-12 ml-12">
        <AboutUs />
      </section>
      
      <section id="services" className="mt-20 mr-12 ml-12">
        <Services />
      </section>
      
      <section id="doctors" className="mt-20 mr-12 ml-12">
        <Doctors />
      </section>
      
      <section id="contact" className="mt-20 mr-12 ml-12">
        <Contact />
      </section>
    </div>
  );
} 
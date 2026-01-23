import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ShieldCheck, Truck, Sparkles, Diamond, ShoppingBag, DollarSign, Star, BrainCircuit } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { Product } from '../types';




export const Home: React.FC = () => {
  const { products } = useProduct();
  const { addToCart } = useCart();

  // --- Hero Slider Logic ---
  const heroImages = [
   "/Beaded.jpeg",
   "/Pearl.jpeg",
   "/Asoke.jpeg",
   "/Red_suit.jpeg",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  // --- Mock Data ---
  const testimonials = [
    { name: "Eleanor P.", role: "Fashion Editor", quote: "Stylus has completely revolutionized my wardrobe for fashion week. Access to archival McQueen without the investment is a dream." },
    { name: "James Sterling", role: "CEO", quote: "The tuxedo rental process was seamless. The fit was perfect, and the delivery was punctual. Pure excellence." },
    { name: "Sophia L.", role: "Influencer", quote: "Authenticity is my biggest concern, and Stylus delivers. Every bag I've rented has been pristine and verified." }
  ];

  const team = [
    { name: "Augustine Achi", role: "Founder & CEO", img: "/Austin.jpeg" },
    { name: "Augustine Nwodo", role: "Chief Marketing Manager", img: "/Austin_Nwodo.jpeg" },
    { name: "Francis Okonkwo", role: "Chief Project Manager", img: "/Francis1.jpeg" },
    { name: "Augustine Odezulu", role: "Chief Developing Manager", img: "/Austin_Odezulu.jpeg" },
  ];

  const quickAddToCart = (product: Product) => {
    // Basic add to cart for demo from home page
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 4);
    
    addToCart({
        id: `${product.id}-${Date.now()}`,
        product: product,
        selectedSize: product.availableSizes[0] || 'One Size',
        duration: 4,
        price: product.rentalPrice,
        startDate: today.toLocaleDateString(),
        endDate: endDate.toLocaleDateString()
    });
    alert(`${product.name} added to your bag.`);
  };

  return (
    <div className="animate-fade-in relative">
      
      {/* 1. HERO SECTION (SLIDER) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-espresso">
        {heroImages.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt="Hero" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent"></div>
          </div>
        ))}
        
        <div className="relative z-10 text-center max-w-4xl px-4 animate-slide-up">
          <p className="text-golden-orange font-serif tracking-[0.3em] uppercase mb-4 shadow-black drop-shadow-md">New Arrivals</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream mb-8 leading-tight drop-shadow-lg">
            Wear Royalty <br/> Without Cost
          </h1>
          <Link to="/catalog">
            <Button variant="primary" className="text-lg px-10 py-4">View Details</Button>
          </Link>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3">
             {heroImages.map((_, idx) => (
               <button 
                 key={idx} 
                 onClick={() => setCurrentSlide(idx)}
                 className={`w-12 h-1 rounded-full transition-all ${idx === currentSlide ? 'bg-golden-orange' : 'bg-white/20'}`}
               />
             ))}
          </div>
        </div>
      </section>

      {/* 2. AI STYLIST SECTION */}
      <section className="py-24 bg-[#1f0c05] relative overflow-hidden border-t border-golden-orange/10">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-golden-orange/5 rounded-full blur-[100px]"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="w-full md:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-golden-orange/50 rounded-full text-golden-orange text-xs uppercase tracking-widest mb-6">
                    <BrainCircuit size={14} /> Coming Soon
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">Experience the Future</h2>
                  <p className="text-cream/70 text-lg leading-relaxed mb-8">
                     Unlock personalized fashion with our AI Concierge. Upload your inspiration, describe your event, or ask for trends. The Stylus AI curates a look specifically for you from our exclusive vault.
                  </p>
                  <Link to="/ai-stylist">
                    <Button variant="outline">Try AI Stylist Now</Button>
                  </Link>
               </div>
               <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-golden-orange to-espresso rounded-full p-1 animate-pulse-slow">
                     <div className="w-full h-full bg-[#1a0a04] rounded-full flex items-center justify-center relative overflow-hidden">
                        <Sparkles size={120} className="text-golden-orange animate-spin-slow opacity-80" />
                        <div className="absolute inset-0 bg-[url('/Meta.jpeg')] opacity-20 bg-cover mix-blend-overlay"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 bg-espresso">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-golden-orange uppercase tracking-widest text-xs font-bold">The Stylus Promise</span>
            <h2 className="font-serif text-4xl text-cream mt-2">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 border border-white/5 hover:border-golden-orange/30 transition-all duration-300 bg-white/[0.02] text-center group">
              <Sparkles className="h-10 w-10 text-golden-orange mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-cream mb-4">Curated Excellence</h3>
              <p className="text-cream/60 text-sm">Hand-selected pieces from the world's most prestigious fashion houses.</p>
            </div>
            <div className="p-8 border border-white/5 hover:border-golden-orange/30 transition-all duration-300 bg-white/[0.02] text-center group">
              <ShieldCheck className="h-10 w-10 text-golden-orange mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-cream mb-4">Authenticity</h3>
              <p className="text-cream/60 text-sm">Guaranteed. Every item is verified by expert authenticators and AI.</p>
            </div>
            <div className="p-8 border border-white/5 hover:border-golden-orange/30 transition-all duration-300 bg-white/[0.02] text-center group">
              <DollarSign className="h-10 w-10 text-golden-orange mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-cream mb-4">Quality Affordability</h3>
              <p className="text-cream/60 text-sm">Access ₦5,000 gowns for a fraction of the retail price.</p>
            </div>
            <div className="p-8 border border-white/5 hover:border-golden-orange/30 transition-all duration-300 bg-white/[0.02] text-center group">
               <Truck className="h-10 w-10 text-golden-orange mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-cream mb-4">Many More</h3>
              <p className="text-cream/60 text-sm">Same-day delivery, free dry cleaning, and flexible return windows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COLLECTION PREVIEW */}
      <section className="py-24 bg-cream text-espresso">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
              <div>
                 <span className="text-golden-orange uppercase tracking-widest text-xs font-bold">The Edit</span>
                 <h2 className="font-serif text-4xl text-espresso mt-2">Trending Collections</h2>
              </div>
              <Link to="/catalog">
                 <Button variant="secondary">View All</Button>
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="group relative bg-white shadow-xl overflow-hidden">
                   <div className="relative h-[400px] w-full overflow-hidden">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                         <button 
                            onClick={() => quickAddToCart(product)}
                            className="bg-golden-orange text-espresso font-bold uppercase tracking-wider px-6 py-3 hover:bg-white transition-colors flex items-center gap-2"
                         >
                            <ShoppingBag size={16} /> Add to Bag
                         </button>
                         <Link to={`/product/${product.id}`} className="text-white border-b border-white hover:text-golden-orange hover:border-golden-orange transition-colors uppercase text-sm tracking-widest font-bold">
                            View Product Details
                         </Link>
                      </div>
                   </div>
                   <div className="p-6">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-golden-orange text-xs uppercase tracking-wide font-bold">{product.brand}</p>
                            <h3 className="font-serif text-xl text-espresso">{product.name}</h3>
                         </div>
                         <p className="font-serif text-lg text-espresso/80">₦{product.rentalPrice}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-espresso border-b border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl text-cream mb-16 text-center">Voices of Luxury</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-[#1f0c05] p-10 border border-white/5 relative">
                     <div className="absolute top-6 left-6 text-golden-orange text-6xl font-serif opacity-20">"</div>
                     <p className="text-cream/80 italic mb-8 relative z-10">{t.quote}</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-golden-orange/20 rounded-full flex items-center justify-center text-golden-orange font-bold font-serif">
                           {t.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-cream uppercase tracking-wide">{t.name}</p>
                           <p className="text-xs text-cream/50">{t.role}</p>
                        </div>
                     </div>
                     <div className="flex gap-1 mt-4">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-golden-orange text-golden-orange" />)}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. OUR TEAM */}
      <section className="py-32 bg-[#1a0a04] relative overflow-hidden">
         <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-golden-orange/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-20 right-0 w-[300px] h-[300px] bg-golden-orange/5 rounded-full blur-[100px]"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
               <span className="text-golden-orange uppercase tracking-widest text-xs font-bold">Behind the Seams</span>
               <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4">Meet Our Team</h2>
               <p className="text-cream/60 mt-4 max-w-2xl mx-auto">Talented individuals dedicated to redefining fashion and bringing luxury to everyone.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {team.map((member, idx) => (
                  <div 
                     key={idx} 
                     className="group relative animate-scale-in"
                     style={{animationDelay: `${idx * 0.15}s`}}
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <div className="relative p-6 border border-golden-orange/20 bg-white/[0.02] rounded-xl hover:border-golden-orange/60 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/20 group-hover:translate-y-[-8px] h-full flex flex-col items-center text-center">
                        {/* Image */}
                        <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-3 border-golden-orange/30 group-hover:border-golden-orange transition-all duration-500 relative">
                           <img 
                              src={member.img} 
                              alt={member.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                           />
                           <div className="absolute inset-0 bg-golden-orange/0 group-hover:bg-golden-orange/10 transition-colors duration-500"></div>
                        </div>
                        
                        {/* Content */}
                        <h3 className="font-serif text-xl text-cream mb-2 group-hover:text-golden-orange transition-colors">{member.name}</h3>
                        <p className="text-golden-orange text-xs uppercase tracking-widest mb-4 font-semibold">{member.role}</p>
                        
                        {/* Divider */}
                        <div className="w-8 h-px bg-golden-orange/30 mb-4"></div>
                        
                        {/* Description */}
                        <p className="text-cream/60 text-sm mb-6 flex-grow">Bringing expertise and passion to every aspect of Stylus.</p>
                        
                        {/* Button */}
                        <button className="w-full py-2 px-4 border border-golden-orange/30 text-golden-orange text-xs uppercase tracking-widest hover:bg-golden-orange/10 hover:border-golden-orange/60 transition-all duration-300">
                           View Profile
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section className="py-24 bg-gradient-to-r from-espresso to-[#1f0c05] relative overflow-hidden border-t border-golden-orange/20">
         <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-golden-orange/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-golden-orange/5 rounded-full blur-[120px]"></div>
         
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 animate-slide-up">
               <span className="text-golden-orange uppercase tracking-widest text-xs font-bold">Stay Connected</span>
               <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 mb-6">Exclusive Luxury Updates</h2>
               <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto">
                  Be the first to know about new arrivals, exclusive rentals, and special invitations to our VIP events. Subscribe to our newsletter for curated fashion moments delivered to your inbox.
               </p>
            </div>

            <div className="bg-white/5 border border-golden-orange/20 rounded-xl p-8 md:p-12 backdrop-blur-sm hover:border-golden-orange/40 transition-all duration-300">
               <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); (e.target as HTMLFormElement).reset(); }} className="flex flex-col sm:flex-row gap-4">
                  <input 
                     type="email" 
                     placeholder="Enter your email address" 
                     required
                     className="flex-1 px-6 py-3 bg-espresso text-cream placeholder-cream/40 border border-golden-orange/20 focus:border-golden-orange focus:outline-none focus:ring-2 focus:ring-golden-orange/30 rounded-lg transition-all duration-300 text-sm md:text-base"
                  />
                  <button 
                     type="submit"
                     className="px-8 py-3 bg-golden-orange text-espresso font-bold uppercase tracking-wider rounded-lg hover:bg-golden-light hover:shadow-lg hover:shadow-golden-orange/40 transition-all duration-300 whitespace-nowrap text-sm md:text-base"
                  >
                     Subscribe
                  </button>
               </form>
               
               <p className="text-cream/50 text-xs mt-6 text-center">
                  We respect your privacy. Unsubscribe at any time. <span className="text-golden-orange hover:underline cursor-pointer">View our Privacy Policy</span>
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
               <div className="text-center">
                  <div className="text-3xl text-golden-orange font-serif mb-3">✦</div>
                  <p className="text-cream/70 text-sm">Weekly curated recommendations</p>
               </div>
               <div className="text-center">
                  <div className="text-3xl text-golden-orange font-serif mb-3">✦</div>
                  <p className="text-cream/70 text-sm">Exclusive member-only discounts</p>
               </div>
               <div className="text-center">
                  <div className="text-3xl text-golden-orange font-serif mb-3">✦</div>
                  <p className="text-cream/70 text-sm">Early access to limited drops</p>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};
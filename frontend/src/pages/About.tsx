import React from 'react';
import { Diamond, Clock, Globe, Sparkles, Shield, Leaf, AlertCircle, Lightbulb, TrendingUp, Zap } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-espresso animate-fade-in">
       {/* Header */}
       <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
             <img src="/Pearl.jpeg" alt="About Stylus" className="w-full h-full object-cover opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/50"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl px-4">
             <span className="text-golden-orange uppercase tracking-[0.3em] text-sm">Stylus</span>
             <h1 className="font-serif text-5xl md:text-6xl text-cream mt-4">Your Wardrobe on Demand</h1>
          </div>
       </div>

       {/* Mission Statement */}
       <div className="max-w-4xl mx-auto px-6 py-24 text-center">
           <Diamond className="w-12 h-12 text-golden-orange mx-auto mb-8 animate-float" />
           <p className="text-2xl font-serif text-cream leading-relaxed mb-12 italic">
             "Stylus was created at the intersection of fashion, lifestyle, and modern reality."
           </p>
           <p className="text-cream/70 leading-relaxed">
             Founded in 2025, Stylus bridges the gap between the runway and your reality. We have curated a vault of the world's most coveted garments, making them accessible to a community of fashion-forward individuals who value variety, sustainability, and excellence.
           </p>
       </div>

       {/* The Question & Journey Section */}
       <div className="bg-[#1f0c05] py-32 border-t border-b border-white/5">
           <div className="max-w-6xl mx-auto px-6">
               <h2 className="font-serif text-4xl md:text-5xl text-cream mb-20 text-center">Our Journey</h2>
               
               {/* Challenge & Realization Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                   {/* Challenge Card */}
                   <div className="group relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="relative p-10 border border-golden-orange/30 bg-white/[0.02] rounded-xl hover:border-golden-orange/60 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/20 text-center">
                           <div className="flex flex-col items-center">
                               <div className="flex-shrink-0 mb-6">
                                   <div className="relative inline-block">
                                       <div className="absolute inset-0 bg-golden-orange/20 rounded-full blur-md"></div>
                                       <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-golden-orange/20 to-golden-orange/10 flex items-center justify-center">
                                           <AlertCircle className="w-8 h-8 text-golden-orange group-hover:text-golden-orange transition-colors" />
                                       </div>
                                   </div>
                               </div>
                               <div>
                                   <h3 className="font-serif text-3xl md:text-4xl text-cream mb-6">The Challenge</h3>
                                   <div className="space-y-4 text-cream/70">
                                       <div>
                                           <p className="text-base md:text-lg leading-relaxed">
                                               We live in a world where <span className="text-cream font-semibold">moments matter.</span> People show up for weddings, work, celebrations, milestones, and opportunities.
                                           </p>
                                       </div>
                                       <div className="pt-4 border-t border-golden-orange/20">
                                           <p className="text-base md:text-lg leading-relaxed">
                                               Yet fashion ownership remains <span className="text-golden-orange">rigid, expensive, and inefficient.</span> People buy outfits worn once, store clothes rarely used, and spend heavily just to meet appearance expectations.
                                           </p>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Realization Card */}
                   <div className="group relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="relative p-10 border border-golden-orange/30 bg-white/[0.02] rounded-xl hover:border-golden-orange/60 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/20 text-center">
                           <div className="flex flex-col items-center">
                               <div className="flex-shrink-0 mb-6">
                                   <div className="relative inline-block">
                                       <div className="absolute inset-0 bg-golden-orange/20 rounded-full blur-md"></div>
                                       <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-golden-orange/20 to-golden-orange/10 flex items-center justify-center">
                                           <Lightbulb className="w-8 h-8 text-golden-orange group-hover:animate-bounce" />
                                       </div>
                                   </div>
                               </div>
                               <div>
                                   <h3 className="font-serif text-3xl md:text-4xl text-cream mb-6">The Realization</h3>
                                   <div className="space-y-3 text-cream/80">
                                       <div className="flex items-center justify-center gap-3">
                                           <Zap className="w-4 h-4 text-golden-orange flex-shrink-0" />
                                           <p className="text-base md:text-lg"><span className="text-cream font-semibold">Work</span> is fluid</p>
                                       </div>
                                       <div className="flex items-center justify-center gap-3">
                                           <Zap className="w-4 h-4 text-golden-orange flex-shrink-0" />
                                           <p className="text-base md:text-lg"><span className="text-cream font-semibold">Identity</span> is dynamic</p>
                                       </div>
                                       <div className="flex items-center justify-center gap-3">
                                           <Zap className="w-4 h-4 text-golden-orange flex-shrink-0" />
                                           <p className="text-base md:text-lg"><span className="text-cream font-semibold">Social moments</span> are constant</p>
                                       </div>
                                       <div className="flex items-center justify-center gap-3">
                                           <Zap className="w-4 h-4 text-golden-orange flex-shrink-0" />
                                           <p className="text-base md:text-lg"><span className="text-cream font-semibold">Style</span> is no longer static</p>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Divider with "From this..." text */}
               <div className="flex items-center gap-4 mb-24">
                   <div className="flex-1 h-px bg-gradient-to-r from-transparent to-golden-orange/30"></div>
                   <p className="text-center text-cream text-lg font-serif italic whitespace-nowrap px-6">From this realization</p>
                   <div className="flex-1 h-px bg-gradient-to-l from-transparent to-golden-orange/30"></div>
               </div>

               {/* The Question Cards */}
               <div>
                   <p className="text-center text-cream text-2xl font-serif mb-16">Stylus began with <span className="text-golden-orange">a question:</span></p>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       <div className="group relative">
                           <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="relative p-6 border border-golden-orange/30 bg-white/[0.02] rounded-lg hover:bg-white/[0.08] hover:border-golden-orange/60 transition-all duration-300 hover:scale-105 cursor-pointer group-hover:shadow-lg group-hover:shadow-golden-orange/20 animate-scale-in">
                               <TrendingUp className="w-5 h-5 text-golden-orange mb-4 group-hover:scale-110 transition-transform" />
                               <p className="text-golden-orange font-serif text-sm leading-relaxed group-hover:text-white transition-colors">What if wardrobes moved at the speed of modern life?</p>
                           </div>
                       </div>
                       <div className="group relative">
                           <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="relative p-6 border border-golden-orange/30 bg-white/[0.02] rounded-lg hover:bg-white/[0.08] hover:border-golden-orange/60 transition-all duration-300 hover:scale-105 cursor-pointer group-hover:shadow-lg group-hover:shadow-golden-orange/20 animate-scale-in" style={{animationDelay: '0.1s'}}>
                               <Sparkles className="w-5 h-5 text-golden-orange mb-4 group-hover:scale-110 transition-transform" />
                               <p className="text-golden-orange font-serif text-sm leading-relaxed group-hover:text-white transition-colors">What if fashion adapted to your moments?</p>
                           </div>
                       </div>
                       <div className="group relative">
                           <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="relative p-6 border border-golden-orange/30 bg-white/[0.02] rounded-lg hover:bg-white/[0.08] hover:border-golden-orange/60 transition-all duration-300 hover:scale-105 cursor-pointer group-hover:shadow-lg group-hover:shadow-golden-orange/20 animate-scale-in" style={{animationDelay: '0.2s'}}>
                               <Diamond className="w-5 h-5 text-golden-orange mb-4 group-hover:scale-110 transition-transform" />
                               <p className="text-golden-orange font-serif text-sm leading-relaxed group-hover:text-white transition-colors">What if luxury was defined by access?</p>
                           </div>
                       </div>
                       <div className="group relative">
                           <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="relative p-6 border border-golden-orange/30 bg-white/[0.02] rounded-lg hover:bg-white/[0.08] hover:border-golden-orange/60 transition-all duration-300 hover:scale-105 cursor-pointer group-hover:shadow-lg group-hover:shadow-golden-orange/20 animate-scale-in" style={{animationDelay: '0.3s'}}>
                               <Shield className="w-5 h-5 text-golden-orange mb-4 group-hover:scale-110 transition-transform" />
                               <p className="text-golden-orange font-serif text-sm leading-relaxed group-hover:text-white transition-colors">What if ownership was a choice?</p>
                           </div>
                       </div>
                   </div>
                   <div className="text-center mt-16">
                       <p className="text-cream text-xl font-serif">Stylus was born.</p>
                   </div>
               </div>
           </div>
       </div>

       {/* Three Pillars Section */}
       <div className="bg-espresso py-32">
           <div className="max-w-7xl mx-auto px-6">
               <div className="text-center mb-20">
                   <span className="text-golden-orange uppercase tracking-[0.3em] text-xs font-bold">Our Philosophy</span>
                   <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 mb-6">Three Pillars of Stylus</h2>
                   <p className="text-cream/70 max-w-2xl mx-auto">We are not replacing fashion. We are redefining how it fits into your life.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {/* Card 1: Fashion */}
                   <div className="group relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="relative p-8 border border-golden-orange/20 bg-white/[0.02] rounded-lg hover:border-golden-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/20 transform group-hover:translate-y-[-8px]">
                           <div className="h-12 w-12 rounded-full bg-golden-orange/10 flex items-center justify-center mb-6 group-hover:bg-golden-orange/20 transition-colors">
                               <Sparkles className="w-6 h-6 text-golden-orange group-hover:animate-spin" />
                           </div>
                           <h3 className="font-serif text-2xl text-cream mb-6">Redefining Fashion</h3>
                           <div className="space-y-4 text-cream/70">
                               <p className="text-sm leading-relaxed">
                                   <span className="text-cream font-semibold">Stylus is not a clothing store.</span> We are a lifestyle convenience platform.
                               </p>
                               <p className="text-sm leading-relaxed">
                                   We curate wardrobes across trendy, premium, and luxury — giving you freedom to dress for the moment you're in. Fashion, to us, is not about excess. <span className="text-golden-orange">It's about relevance.</span>
                               </p>
                           </div>
                           <div className="mt-6 pt-6 border-t border-golden-orange/10">
                               <p className="text-xs text-golden-orange font-semibold uppercase tracking-widest">From everyday to statement pieces</p>
                           </div>
                       </div>
                   </div>

                   {/* Card 2: Luxury */}
                   <div className="group relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="relative p-8 border border-golden-orange/20 bg-white/[0.02] rounded-lg hover:border-golden-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/20 transform group-hover:translate-y-[-8px]" style={{transitionDelay: '0.1s'}}>
                           <div className="h-12 w-12 rounded-full bg-golden-orange/10 flex items-center justify-center mb-6 group-hover:bg-golden-orange/20 transition-colors">
                               <Shield className="w-6 h-6 text-golden-orange group-hover:animate-pulse" />
                           </div>
                           <h3 className="font-serif text-2xl text-cream mb-6">Redefining Luxury</h3>
                           <div className="space-y-4 text-cream/70">
                               <p className="text-sm leading-relaxed">
                                   Luxury has evolved. It's no longer about filling wardrobes — it's about <span className="text-cream font-semibold">freedom, convenience, and confidence.</span>
                               </p>
                               <ul className="space-y-2 text-xs">
                                   <li className="flex gap-2"><span className="text-golden-orange">✓</span> Access without long-term commitment</li>
                                   <li className="flex gap-2"><span className="text-golden-orange">✓</span> Freedom to choose your moment</li>
                                   <li className="flex gap-2"><span className="text-golden-orange">✓</span> Showing up well, without excess</li>
                               </ul>
                               <p className="text-xs italic text-golden-orange pt-2">True luxury shows up when it matters.</p>
                           </div>
                       </div>
                   </div>

                   {/* Card 3: Ownership */}
                   <div className="group relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="relative p-8 border border-golden-orange/20 bg-white/[0.02] rounded-lg hover:border-golden-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-golden-orange/20 transform group-hover:translate-y-[-8px]" style={{transitionDelay: '0.2s'}}>
                           <div className="h-12 w-12 rounded-full bg-golden-orange/10 flex items-center justify-center mb-6 group-hover:bg-golden-orange/20 transition-colors">
                               <Leaf className="w-6 h-6 text-golden-orange group-hover:animate-bounce" />
                           </div>
                           <h3 className="font-serif text-2xl text-cream mb-6">Redefining Ownership</h3>
                           <div className="space-y-4 text-cream/70">
                               <p className="text-sm leading-relaxed">
                                   Stylus challenges the idea that value comes from possession.
                               </p>
                               <ul className="space-y-2 text-xs">
                                   <li className="flex gap-2"><span className="text-golden-orange">✓</span> Own only what you truly need</li>
                                   <li className="flex gap-2"><span className="text-golden-orange">✓</span> Access is smarter than accumulation</li>
                                   <li className="flex gap-2"><span className="text-golden-orange">✓</span> Shared wardrobes, sustainable style</li>
                               </ul>
                               <p className="text-xs text-cream/60 pt-2">Reducing waste. Increasing variety. Aligning consumption with modern living.</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Mission & Vision Section */}
       <div className="bg-[#1f0c05] py-32 border-y border-white/5">
           <div className="max-w-5xl mx-auto px-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   {/* Mission */}
                   <div className="text-center group">
                       <div className="inline-block mb-6">
                           <span className="text-golden-orange uppercase tracking-[0.3em] text-xs font-bold">Core Purpose</span>
                       </div>
                       <h3 className="font-serif text-3xl text-cream mb-6 group-hover:text-golden-orange transition-colors">Our Mission</h3>
                       <p className="text-cream/70 leading-relaxed">
                           Stylus exists to make style accessible, flexible, and intelligent by giving people on-demand access to the right wardrobe for every moment — without the burden of ownership. We empower modern lifestyles through convenience, curated fashion, and smart access over excess.
                       </p>
                   </div>

                   {/* Vision */}
                   <div className="text-center group">
                       <div className="inline-block mb-6">
                           <span className="text-golden-orange uppercase tracking-[0.3em] text-xs font-bold">The Future</span>
                       </div>
                       <h3 className="font-serif text-3xl text-cream mb-6 group-hover:text-golden-orange transition-colors">Our Vision</h3>
                       <p className="text-cream/70 leading-relaxed">
                           To redefine fashion, luxury, and ownership by building a world where access replaces possession, style adapts to life, and wardrobes move at the speed of modern living. What you wear is no longer limited by what you own — but expanded by what you can access.
                       </p>
                   </div>
               </div>
           </div>
       </div>
      
       {/* Core Values Section */}
       <div className="bg-espresso py-32">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="font-serif text-4xl md:text-5xl text-cream text-center mb-20">What Drives Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                 <div className="group">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-golden-orange/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                        <Clock className="w-12 h-12 text-golden-orange mx-auto relative group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-serif text-xl text-cream mb-4 group-hover:text-golden-orange transition-colors">Timeless Style</h3>
                    <p className="text-cream/60 text-sm">We don't chase trends; we curate icons. Our collection spans decades of design excellence.</p>
                 </div>
                 <div className="group">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-golden-orange/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                        <Globe className="w-12 h-12 text-golden-orange mx-auto relative group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-serif text-xl text-cream mb-4 group-hover:text-golden-orange transition-colors">Global Sourcing</h3>
                    <p className="text-cream/60 text-sm">From Milan to Paris, our buyers scout the globe to bring exclusive pieces unavailable elsewhere.</p>
                 </div>
                 <div className="group">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-golden-orange/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                        <Leaf className="w-12 h-12 text-golden-orange mx-auto relative group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-serif text-xl text-cream mb-4 group-hover:text-golden-orange transition-colors">Sustainable Luxury</h3>
                    <p className="text-cream/60 text-sm">Extending garment lifecycles reduces waste and promotes a circular fashion economy.</p>
                 </div>
              </div>
          </div>
       </div>

       {/* Closing Statement */}
       <div className="bg-[#1f0c05] py-24 text-center border-t border-white/5">
           <div className="max-w-3xl mx-auto px-6">
               <p className="text-cream/80 text-lg leading-relaxed mb-6">
                   Your life changes. Your style should too.
               </p>
               <p className="font-serif text-3xl text-cream mb-12">
                   Stylus. Your wardrobe on demand.
               </p>
               <div className="w-16 h-1 bg-golden-orange mx-auto"></div>
           </div>
       </div>
    </div>
  );
};

import React from 'react';
import { Diamond, Clock, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-espresso animate-fade-in">
       {/* Header */}
       <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop" alt="About Stylus" className="w-full h-full object-cover opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/50"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl px-4">
             <span className="text-golden-orange uppercase tracking-[0.3em] text-sm">Our Story</span>
             <h1 className="font-serif text-5xl md:text-7xl text-cream mt-4">Redefining Paradigms</h1>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-6 py-24 text-center">
           <Diamond className="w-12 h-12 text-golden-orange mx-auto mb-8" />
           <p className="text-2xl font-serif text-cream leading-relaxed mb-12">
             "Stylus was created at the intersection of fashion, lifestyle, and modern reality."
           </p>
           <p className="text-cream/70 leading-relaxed mb-8">
             Founded in 2025, Stylus bridges the gap between the runway and your reality. We have curated a vault of the world's most coveted garments, making them accessible to a community of fashion-forward individuals who value variety, sustainability, and excellence.<br></br>
             We live in a world where moments matter — where people are constantly required to show up: for weddings, work, celebrations, milestones, and opportunities. Yet fashion ownership has remained rigid, expensive, and inefficient. People buy outfits they wear once, store clothes they rarely use, and spend heavily just to meet the expectations of appearance
           </p>
           <p className="text-cream/70 leading-relaxed mb-8">
           At the same time, life has changed.

Work is fluid.
Identity is dynamic.
Social moments are constant.
And style is no longer static.<br></br>

Stylus began with a question:

What if wardrobes moved at the speed of modern life?

What if fashion adapted to your moments instead of sitting idle in your closet?
What if luxury was defined by access, not accumulation?
What if ownership was no longer the default, but a choice?

From that question, Stylus was born.


           </p>
           <p className="text-cream/70 leading-relaxed mb-8">
           Redefining Fashion<br></br>

Stylus is not a clothing store.
It is a lifestyle convenience platform.<br></br>

We curate wardrobes access across  — trendy, premium, and luxury — giving people the freedom to dress for the moment they’re in. From everyday wear to statement pieces, Stylus makes fashion flexible, intentional, and accessible.<br></br>

Fashion, to us, is not about excess.
It’s about relevance.


           </p>
           <p className="text-cream/70 leading-relaxed mb-8">Redefining Luxury<br></br>

Luxury has evolved.

Today, luxury is not about filling wardrobes — it’s about freedom, convenience, and confidence.<br></br>

Stylus redefines luxury as:

The ability to access exceptional style without long-term commitment

The freedom to choose what fits your moment

The ease of showing up well, without overbuying


True luxury is not what you store — it’s what shows up when it matters.




           </p>
           <p className="text-cream/70 leading-relaxed mb-8">Redefining Ownership<br></br>

Stylus challenges the traditional idea that value comes from possession.<br></br>

We believe:

You don’t need to own everything you wear

Access is smarter than accumulation

Shared wardrobes create sustainable style


By enabling rentals, subscriptions, and shared access, Stylus transforms fashion into a service — reducing waste, increasing variety, and aligning consumption with modern living.



           </p>
           <p className="text-cream/70 leading-relaxed mb-8">Our Philosophy<br></br>

Your life changes. Your style should too.<br></br>

Stylus exists for the modern individual - flexible, ambitious, and intentional — who understands that style is not about owning more, but choosing better.

We are not replacing fashion.
We are redefining how it fits into your life.

Stylus. Your wardrobe on demand.


           </p>
           <p className="text-2xl font-serif text-cream leading-relaxed mb-12">
            "Our Mission"

           </p>
           <p classname="text-cream/70 leading-relaxed mb-8">
           Stylus exists to make style accessible, flexible, and intelligent by giving people on-demand access to the right wardrobe for every moment — without the burden of ownership.
We empower modern lifestyles through convenience, curated fashion, and smart access over excess.



           </p><br></br>
           <br></br>
           <p className="text-2xl font-serif text-cream leading-relaxed mb-12">
            "Our Vision"

           </p>
           <p className="text-cream/70 leading-relaxed mb-8">
           To redefine fashion, luxury, and ownership by building a world where access replaces possession, style adapts to life, and wardrobes move at the speed of modern living.
Stylus envisions a future where what you wear is no longer limited by what you own - but expanded by what you can access.

           </p>
       </div>
      
       <div className="bg-[#1f0c05] py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             <div>
                <Clock className="w-10 h-10 text-golden-orange mx-auto mb-6" />
                <h3 className="font-serif text-xl text-cream mb-4">Timeless Style</h3>
                <p className="text-cream/60 text-sm">We don't just chase trends; we curate icons. Our collection spans decades of design excellence.</p>
             </div>
             <div>
                <Globe className="w-10 h-10 text-golden-orange mx-auto mb-6" />
                <h3 className="font-serif text-xl text-cream mb-4">Global Sourcing</h3>
                <p className="text-cream/60 text-sm">From Milan to Paris, our buyers scout the globe to bring you exclusive pieces unavailable elsewhere.</p>
             </div>
             <div>
                <Diamond className="w-10 h-10 text-golden-orange mx-auto mb-6" />
                <h3 className="font-serif text-xl text-cream mb-4">Sustainable Luxury</h3>
                <p className="text-cream/60 text-sm">Extending the lifecycle of luxury garments reduces waste and promotes a circular fashion economy.</p>
             </div>
          </div>
       </div>
    </div>
  );
};
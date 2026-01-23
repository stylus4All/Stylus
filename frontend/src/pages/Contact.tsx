import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting Stylus! We\'ll respond to your message shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-espresso pt-12 pb-24 animate-fade-in relative overflow-hidden">
       {/* Decorative Elements */}
       <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-golden-orange/5 rounded-full blur-[120px]"></div>
       <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-golden-orange/5 rounded-full blur-[120px]"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           {/* Header Section */}
           <div className="text-center mb-20 animate-slide-up">
              <span className="text-golden-orange uppercase tracking-[0.2em] text-xs font-bold">Get in Touch</span>
              <h1 className="font-serif text-5xl md:text-6xl text-cream mt-4 mb-6">Contact Stylus</h1>
              <p className="text-cream/70 text-lg max-w-2xl mx-auto">Have a question about our collections or need assistance? Our team is here to help. Reach out and let's create something extraordinary together.</p>
           </div>

           {/* Main Content Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
               
               {/* Contact Info Cards */}
               <div className="space-y-6 animate-scale-in" style={{animationDelay: '0.1s'}}>
                   {/* Location Card */}
                   <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-golden-orange/20 rounded-xl hover:border-golden-orange/50 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/20">
                       <div className="flex items-start gap-4 mb-4">
                           <div className="p-3 bg-golden-orange/10 rounded-lg group-hover:bg-golden-orange/20 transition-all">
                               <MapPin className="text-golden-orange" size={24} />
                           </div>
                           <div>
                               <h3 className="font-serif text-xl text-cream mb-1">Headquarters</h3>
                               <p className="text-cream/60 text-sm">Visit us in person</p>
                           </div>
                       </div>
                       <p className="text-cream/80 ml-14 leading-relaxed">Abuja, Nigeria<br/><span className="text-cream/50 text-sm">Coming Soon in Lagos & Port Harcourt</span></p>
                   </div>

                   {/* Phone Card */}
                   <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-golden-orange/20 rounded-xl hover:border-golden-orange/50 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/20">
                       <div className="flex items-start gap-4 mb-4">
                           <div className="p-3 bg-golden-orange/10 rounded-lg group-hover:bg-golden-orange/20 transition-all">
                               <Phone className="text-golden-orange" size={24} />
                           </div>
                           <div>
                               <h3 className="font-serif text-xl text-cream mb-1">Call Us</h3>
                               <p className="text-cream/60 text-sm">We love hearing from you</p>
                           </div>
                       </div>
                       <p className="text-cream/80 ml-14 font-serif text-lg">+234 903 304 4460</p>
                   </div>

                   {/* Email Card */}
                   <div className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-golden-orange/20 rounded-xl hover:border-golden-orange/50 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/20">
                       <div className="flex items-start gap-4 mb-4">
                           <div className="p-3 bg-golden-orange/10 rounded-lg group-hover:bg-golden-orange/20 transition-all">
                               <Mail className="text-golden-orange" size={24} />
                           </div>
                           <div>
                               <h3 className="font-serif text-xl text-cream mb-1">Email</h3>
                               <p className="text-cream/60 text-sm">Send us a message</p>
                           </div>
                       </div>
                       <p className="text-cream/80 ml-14 break-all">Stylus@gmail.com</p>
                   </div>

                   {/* Hours Card */}
                   <div className="group p-8 bg-gradient-to-br from-golden-orange/10 to-golden-orange/5 border border-golden-orange/30 rounded-xl hover:border-golden-orange/70 transition-all duration-300 hover:shadow-2xl hover:shadow-golden-orange/30">
                       <div className="flex items-start gap-4">
                           <div className="p-3 bg-golden-orange/20 rounded-lg group-hover:bg-golden-orange/30 transition-all">
                               <Clock className="text-golden-orange" size={24} />
                           </div>
                           <div className="flex-1">
                               <h3 className="font-serif text-xl text-golden-orange mb-3">Stylus Hours</h3>
                               <div className="space-y-2">
                                   <p className="text-cream/70 text-sm"><span className="font-semibold">Mon - Fri:</span> 8am - 8pm EST</p>
                                   <p className="text-cream/70 text-sm"><span className="font-semibold">Sat - Sun:</span> 10am - 6pm EST</p>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Contact Form */}
               <div className="lg:col-span-2 animate-scale-in" style={{animationDelay: '0.2s'}}>
                   <div className="bg-gradient-to-br from-[#1f0c05] to-[#1a0a04] p-8 md:p-12 border border-golden-orange/20 rounded-xl shadow-2xl hover:border-golden-orange/40 transition-all duration-300">
                       <div className="flex items-center gap-3 mb-8">
                           <MessageSquare className="text-golden-orange" size={28} />
                           <h2 className="font-serif text-3xl text-cream">Send us a Message</h2>
                       </div>
                       
                       <p className="text-cream/60 mb-8">We typically respond within 24 hours during business hours.</p>

                       <form onSubmit={handleSubmit} className="space-y-6">
                           {/* Name & Email Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                   <label className="text-xs text-golden-orange uppercase tracking-widest mb-3 block font-semibold">Full Name *</label>
                                   <input 
                                       type="text" 
                                       name="name"
                                       value={formData.name}
                                       onChange={handleChange}
                                       required
                                       className="w-full bg-espresso/50 border border-golden-orange/20 p-4 text-cream placeholder-cream/30 focus:border-golden-orange focus:bg-espresso focus:ring-2 focus:ring-golden-orange/30 outline-none rounded-lg transition-all duration-300" 
                                       placeholder="Austin Achi" 
                                   />
                               </div>
                               <div>
                                   <label className="text-xs text-golden-orange uppercase tracking-widest mb-3 block font-semibold">Email Address *</label>
                                   <input 
                                       type="email" 
                                       name="email"
                                       value={formData.email}
                                       onChange={handleChange}
                                       required
                                       className="w-full bg-espresso/50 border border-golden-orange/20 p-4 text-cream placeholder-cream/30 focus:border-golden-orange focus:bg-espresso focus:ring-2 focus:ring-golden-orange/30 outline-none rounded-lg transition-all duration-300" 
                                       placeholder="your@email.com" 
                                   />
                               </div>
                           </div>

                           {/* Subject */}
                           <div>
                               <label className="text-xs text-golden-orange uppercase tracking-widest mb-3 block font-semibold">Subject *</label>
                               <select 
                                   name="subject"
                                   value={formData.subject}
                                   onChange={handleChange}
                                   required
                                   className="w-full bg-espresso/50 border border-golden-orange/20 p-4 text-cream focus:border-golden-orange focus:bg-espresso focus:ring-2 focus:ring-golden-orange/30 outline-none rounded-lg transition-all duration-300 appearance-none cursor-pointer"
                               >
                                   <option value="">Select a subject...</option>
                                   <option>General Inquiry</option>
                                   <option>Rental Assistance</option>
                                   <option>Stylist Consultation</option>
                                   <option>Partnership Opportunity</option>
                                   <option>Technical Support</option>
                               </select>
                           </div>

                           {/* Message */}
                           <div>
                               <label className="text-xs text-golden-orange uppercase tracking-widest mb-3 block font-semibold">Message *</label>
                               <textarea 
                                   rows={6} 
                                   name="message"
                                   value={formData.message}
                                   onChange={handleChange}
                                   required
                                   className="w-full bg-espresso/50 border border-golden-orange/20 p-4 text-cream placeholder-cream/30 focus:border-golden-orange focus:bg-espresso focus:ring-2 focus:ring-golden-orange/30 outline-none rounded-lg transition-all duration-300 resize-none" 
                                   placeholder="Tell us how we can help you..."
                               ></textarea>
                           </div>

                           {/* Submit Button */}
                           <button 
                               type="submit"
                               className="w-full py-4 px-6 bg-gradient-to-r from-golden-orange to-golden-light text-espresso font-bold uppercase tracking-wider rounded-lg hover:shadow-2xl hover:shadow-golden-orange/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                           >
                               Send Message <Send size={18} />
                           </button>

                           <p className="text-cream/40 text-xs text-center">By submitting this form, you agree to our Privacy Policy and Terms of Service.</p>
                       </form>
                   </div>
               </div>
           </div>

           {/* Additional Info Section */}
           <div className="border-t border-golden-orange/10 pt-16 animate-slide-up" style={{animationDelay: '0.3s'}}>
               <h3 className="font-serif text-3xl text-cream mb-12 text-center">Why Reach Out to Stylus?</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="text-center p-8 rounded-xl border border-white/5 hover:border-golden-orange/30 transition-all hover:bg-white/[0.02]">
                       <div className="text-4xl text-golden-orange mb-4">⚡</div>
                       <h4 className="font-serif text-xl text-cream mb-3">Fast Response</h4>
                       <p className="text-cream/60">Get answers within 24 hours from our dedicated customer success team.</p>
                   </div>
                   <div className="text-center p-8 rounded-xl border border-white/5 hover:border-golden-orange/30 transition-all hover:bg-white/[0.02]">
                       <div className="text-4xl text-golden-orange mb-4">💎</div>
                       <h4 className="font-serif text-xl text-cream mb-3">Expert Guidance</h4>
                       <p className="text-cream/60">Our fashion experts are ready to help with styling advice and rentals.</p>
                   </div>
                   <div className="text-center p-8 rounded-xl border border-white/5 hover:border-golden-orange/30 transition-all hover:bg-white/[0.02]">
                       <div className="text-4xl text-golden-orange mb-4">✨</div>
                       <h4 className="font-serif text-xl text-cream mb-3">Personal Touch</h4>
                       <p className="text-cream/60">Every inquiry is treated with care and attention to detail.</p>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};
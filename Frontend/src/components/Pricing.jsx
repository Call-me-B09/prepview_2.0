import React from 'react';
import { Check, HelpCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      desc: 'Test the waters and practice fundamental mock structures.',
      features: [
        '3 AI mock interviews per month',
        'Basic performance scorecard',
        'Standard software role prep',
        'Text-based evaluation summary',
      ],
      cta: 'Start Practicing',
      highlighted: false,
      border: 'border-swiss-grid-border',
    },
    {
      name: 'Professional Pro',
      price: '$29',
      period: 'month',
      desc: 'For active job seekers targeting competitive engineering roles.',
      features: [
        'Unlimited AI mock interviews',
        'Full AI analytics & speech metrics',
        'Tailored resume optimization feedback',
        'Access to all 50+ job roles',
        'Advanced follow-up adaptive evaluation',
        'Priority AI model loading speeds',
      ],
      cta: 'Unlock Premium Access',
      highlighted: true,
      border: 'border-[#8B5CF6]/50 shadow-[0_0_24px_rgba(139,92,246,0.15)]',
    },
    {
      name: 'Enterprise Recruiter',
      price: 'Custom',
      period: 'team size',
      desc: 'Collaborative mock portals for bootcamps, agencies, and recruiters.',
      features: [
        'Branded mock candidate assessment portals',
        'Custom corporate question pools',
        'ATS & HR platform integrations',
        'Dedicated success manager support',
        'Bulk candidate analytics dashboards',
      ],
      cta: 'Contact Corporate Sales',
      highlighted: false,
      border: 'border-swiss-grid-border',
    },
  ];

  return (
    <section id="pricing" className="py-32 bg-[#0A0A0A] relative overflow-hidden border-b border-swiss-grid-border">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#8B5CF6]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-24">
          <span className="font-mono text-xs text-[#8B5CF6] uppercase font-bold tracking-widest block mb-4">
            Subscription Tiers
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-6">
            Clear, transparent pricing.
          </h2>
          <p className="text-sm font-sans font-medium text-text-secondary">
            No contracts or hidden fees. Upgrade or cancel your subscription at any time.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`neumorphic-flat rounded-2xl p-8 flex flex-col justify-between border relative ${plan.border} ${
                plan.highlighted ? 'bg-[#141414] scale-102 z-10' : 'bg-[#121212]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] text-white text-[10px] font-mono font-black uppercase tracking-wider py-1 px-4 rounded-full flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3" />
                  Most Popular Choice
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-mono text-text-secondary font-semibold">
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-5xl font-display font-black text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm font-mono text-text-secondary">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                <div className="h-[1px] bg-swiss-grid-border w-full my-6" />

                {/* Features list */}
                <div className="flex flex-col gap-4">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className={`w-5 h-5 rounded-full ${
                        plan.highlighted ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30' : 'bg-surface border-swiss-grid-border'
                      } border flex items-center justify-center shrink-0`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-[#8B5CF6]' : 'text-text-secondary'}`} />
                      </div>
                      <span className="text-xs font-sans text-white/90 leading-tight">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA */}
              <button
                className={`w-full mt-8 py-4 rounded-xl font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
                  plan.highlighted
                    ? 'gradient-primary text-white hover:opacity-90 shadow-lg'
                    : 'neumorphic-button text-white hover:border-[#4F46E5] hover:text-[#8B5CF6]'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle2, Building } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { SectionHeader } from '@/components/common/SectionHeader';
import { personalInfo } from '@/constants/portfolio';
import { useNotification } from '@/hooks/useNotification';
import { Reveal } from '@/components/common/Reveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setSubmitted(true);
    addToast({
      title: 'Message Sent Successfully',
      description: 'Thank you for getting in touch! Your message has been received.',
      variant: 'success',
    });
    reset();
  };

  return (
    <>
      <Seo
        title="Contact & Recruiter Connect"
        description={`Get in touch with ${personalInfo.name}, Aspiring Software Engineer and Java Full Stack Developer.`}
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <SectionHeader
          badge="Get In Touch"
          badgeIcon={<Mail className="w-4 h-4" />}
          title="Contact Me"
          subtitle="Have a software engineering opportunity or technical inquiry? Feel free to reach out directly."
        />

        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl glass-card space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Contact Details</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Open to Web Development Internships, Software Development Engineer (SDE) roles, and Java Developer opportunities.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</h4>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Inquiry</h4>
                    <a href={`mailto:${personalInfo.contactEmail}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-0.5 block">
                      {personalInfo.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Institution</h4>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{personalInfo.institution}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl glass-card space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Send A Direct Message</h3>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Your message has been submitted successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register('name')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                    />
                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      {...register('email')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                    />
                    {errors.email && <p className="text-[11px] text-rose-500">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-1">
                  <label htmlFor="organization" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Company / Organization (Optional)
                  </label>
                  <input
                    id="organization"
                    type="text"
                    placeholder="Acme Corp"
                    {...register('organization')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label htmlFor="subject" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Software Engineering Inquiry"
                    {...register('subject')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                  {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject.message}</p>}
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="message" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Message Content *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your role or opportunity..."
                    {...register('message')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
                  />
                  {errors.message && <p className="text-[11px] text-rose-500">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </>
);
};

export default Contact;

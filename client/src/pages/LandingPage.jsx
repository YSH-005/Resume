import { motion } from 'framer-motion';
import CTASection from '../components/common/CTASection';
import Testimonials from '../components/common/Testimonials';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      

      {/* Hero */}
      <section className="px-8 py-20 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Connect. Learn. Grow.
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Book mentors, build your resume, and boost your career — all in one platform.
        </motion.p>
        <motion.a
          href="/register"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium text-lg hover:bg-indigo-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.a>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-3xl font-semibold text-center mb-12">Why MentorConnect?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Expert Mentorship", desc: "Book sessions with top industry pros." },
            { title: "Resume Builder", desc: "Craft standout resumes easily." },
            { title: "ATS Scoring", desc: "Upload resumes to get real-time match feedback." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-xl mb-2">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Testimonials />
      <CTASection />
      
    </div>
  );
};

export default LandingPage;

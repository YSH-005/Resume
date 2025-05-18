const CTASection = () => {
  return (
    <section className="px-8 py-16 bg-indigo-600 text-white text-center">
      <h3 className="text-3xl font-semibold mb-4">Ready to grow your career?</h3>
      <p className="text-lg mb-8">Join MentorConnect and connect with top mentors, build your resume, and get real-time feedback.</p>
      <a
        href="/register"
        className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
      >
        Join Now
      </a>
    </section>
  );
};

export default CTASection;

const testimonials = [
  {
    name: "Aisha K.",
    role: "Mentee",
    feedback: "The resume builder and ATS scoring gave me the confidence to apply for top jobs. My mentor was incredibly helpful!",
  },
  {
    name: "Rahul M.",
    role: "Mentor",
    feedback: "I love mentoring on this platform. It’s intuitive and allows me to genuinely impact careers.",
  },
  {
    name: "Jenny P.",
    role: "Mentee",
    feedback: "Chatting with mentors and accessing their posts gave me insights I never got in school.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white px-8 py-20">
      <h3 className="text-3xl font-semibold text-center mb-12">What Users Are Saying</h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-700 italic mb-4">"{t.feedback}"</p>
            <div className="text-sm font-semibold text-gray-900">{t.name}</div>
            <div className="text-xs text-gray-500">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

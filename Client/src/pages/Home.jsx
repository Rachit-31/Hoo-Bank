const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 font-sans">
      {/* Welcome Section */}
      <header className="text-center mb-20 mt-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to FirstChoice Bank
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Trusted by thousands for secure banking, seamless transactions, and round-the-clock support. Experience a smarter way to manage your finances.
        </p>
      </header>

      {/* Services Section */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-24">
        {[
          {
            title: "Digital Savings",
            desc: "Open and manage savings accounts with real-time insights and high-interest rates."
          },
          {
            title: "Instant Transfers",
            desc: "Send and receive money instantly with zero delays across India."
          },
          {
            title: "Fixed Deposits",
            desc: "Secure your future with customizable fixed deposit plans."
          },
          {
            title: "Smart Dashboard",
            desc: "Track balances, transactions, and account activities with an intuitive UI."
          },
          {
            title: "24/7 Customer Support",
            desc: "Our dedicated support team is here for you any time, any day."
          },
          {
            title: "Secure Authentication",
            desc: "Multi-layered security to keep your financial data protected."
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm hover:border-blue-500 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-10 text-white">
          Trusted by Account Holders Nationwide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "Using FirstChoice Bank has made managing my finances effortless. I especially love the smart dashboard.",
              name: "Riya Sharma",
            },
            {
              quote:
                "I was able to open a fixed deposit in minutes. Smooth process, great support team!",
              name: "Aditya Verma",
            },
            {
              quote:
                "Their instant transfer system is lightning fast. Very reliable during emergencies.",
              name: "Sneha Patil",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800 hover:border-blue-500 transition"
            >
              <p className="italic text-gray-300">“{t.quote}”</p>
              <div className="mt-4 font-semibold text-blue-400">– {t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

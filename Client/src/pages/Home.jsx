import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-zinc-900 text-white px-6 py-12 font-sans">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Welcome to FirstChoice Bank
        </h1>
        <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
          Your Gateway to Secure and Seamless Digital Finance
        </p>
      </header>

      {/* Features Section */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20">
        {[
          { title: "Secure Custody", desc: "Military-grade cold storage for digital assets." },
          { title: "Trading Platform", desc: "Compliant, fast execution with deep liquidity." },
          { title: "Staking Services", desc: "Earn rewards while keeping assets secure." },
          { title: "Regulatory Compliance", desc: "Fully licensed and regularly audited." },
          { title: "API Access", desc: "Integrate seamlessly with your systems." },
          { title: "24/7 Support", desc: "Dedicated support to assist whenever needed." },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-md hover:shadow-lg hover:border-blue-500 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <div className="text-center mb-24">
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
        >
          Get Started → Login Now
        </Link>
      </div>

      {/* Testimonials */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-10 text-white">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "FirstChoice Bank helped me manage my savings better. The UI is so simple and secure!",
              name: "Riya Sharma",
            },
            {
              quote:
                "Transferring money is lightning fast. I feel confident trusting FirstChoice with my finances.",
              name: "Aditya Verma",
            },
            {
              quote:
                "Customer service is fantastic. They really care about solving issues quickly.",
              name: "Sneha Patil",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-zinc-800 to-zinc-700 p-6 rounded-xl shadow-md text-left border border-zinc-600 hover:border-blue-500 transition"
            >
              <p className="italic text-gray-300">“{t.quote}”</p>
              <div className="mt-4 font-semibold text-blue-400">– {t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home

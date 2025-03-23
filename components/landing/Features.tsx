export default function Features() {
    const features = [
      {
        title: "AI-Powered Conversations",
        description: "Practice with our advanced AI tutors that adapt to your English level and learning style.",
        icon: "⚡",
      },
      {
        title: "Real-time Feedback",
        description: "Get instant feedback on pronunciation, grammar, and vocabulary as you speak.",
        icon: "🔍",
      },
      {
        title: "Personalized Learning",
        description: "Customized lesson plans based on your goals, interests, and progress.",
        icon: "🎯",
      },
      {
        title: "Flexible Practice",
        description: "Train anytime, anywhere with conversations designed for real-world scenarios.",
        icon: "🌐",
      },
      {
        title: "Progress Tracking",
        description: "Monitor your improvement with detailed analytics and performance metrics.",
        icon: "📈",
      },
      {
        title: "Industry-Specific Content",
        description: "Specialized vocabulary and scenarios for business, academic, or casual English.",
        icon: "🏢",
      },
    ];
  
    return (
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our AI-powered English tutoring platform offers a unique learning experience tailored to your needs.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-primary-500 transition-colors"
            >
              <div className="text-4xl mb-4 bg-gray-700 h-16 w-16 rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-100">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
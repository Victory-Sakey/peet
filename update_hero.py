import sys

with open(r'c:\Users\HomePC\Documents\peet\src\components\public\Hero.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_content = r'''      {/* Rest of the page content in a max-width container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-24 pt-16">
        
        {/* 3. PROBLEM SECTION */}
        <section className="relative py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Finding real opportunities shouldn’t feel like a <span className="text-purple-600">full-time job.</span>
              </h2>
            </div>
            <div className="space-y-6 lg:pl-12 lg:border-l border-zinc-200 dark:border-zinc-800">
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Most people waste hours scrolling through scattered websites, social media posts, and outdated listings—only to miss the opportunities that actually matter.
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-200 leading-relaxed">
                Peet brings everything together in one place, so you can focus on applying, not searching.
              </p>
            </div>
          </div>
        </section>

        {/* 4. SOLUTION SECTION */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Everything You Need, <br className="hidden sm:block"/>In One Platform
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed">
              Peet helps you discover opportunities that match your goals, background, and ambition—whether you're just starting out or leveling up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Job opportunities", desc: "From trusted employers and top startups.", icon: Briefcase, color: "text-blue-600" },
              { title: "Scholarships", desc: "Academic programs and financial aid.", icon: GraduationCap, color: "text-amber-500" },
              { title: "Skill training", desc: "Bootcamps and technical courses.", icon: Zap, color: "text-purple-600" },
              { title: "Internships", desc: "Fellowships and real-world experience.", icon: Users, color: "text-emerald-500" },
              { title: "Local and global", desc: "Opportunities near you and worldwide.", icon: Globe, color: "text-pink-500" },
              { title: "Fast application", desc: "Simple, streamlined access.", icon: Target, color: "text-red-500" },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-black shadow-sm flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="space-y-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              How Peet Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0"></div>

            {[
              { step: "Step 1", title: "Discover", desc: "Browse curated opportunities tailored to your goals.", icon: Search },
              { step: "Step 2", title: "Choose", desc: "Filter by category, location, or skill level.", icon: Target },
              { step: "Step 3", title: "Apply", desc: "Apply directly and track your progress.", icon: ArrowUpRight },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 border-4 border-white dark:border-black">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 w-full shadow-sm">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">{s.step}</div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{s.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. FEATURE HIGHLIGHTS */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 blur-3xl rounded-full"></div>
              <div className="relative bg-zinc-900 rounded-[2rem] p-8 border border-zinc-800 shadow-2xl aspect-square flex flex-col justify-center overflow-hidden">
                 {/* Abstract UI graphic */}
                 <div className="space-y-4 w-full">
                    <div className="h-12 w-3/4 bg-zinc-800/50 rounded-xl animate-pulse"></div>
                    <div className="h-24 w-full bg-purple-600/20 rounded-xl border border-purple-500/30"></div>
                    <div className="h-12 w-5/6 bg-zinc-800/50 rounded-xl"></div>
                    <div className="h-12 w-1/2 bg-zinc-800/50 rounded-xl"></div>
                 </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Built for People <br />Who Want More
              </h2>
              <ul className="space-y-5">
                {[
                  "Smart opportunity discovery",
                  "Clean, distraction-free interface",
                  "Verified listings only",
                  "Personalized recommendations (coming soon)",
                  "Save and track opportunities",
                  "Easy sharing with friends or mentors"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-lg text-zinc-700 dark:text-zinc-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. FOR ORGANIZATIONS */}
        <section className="relative overflow-hidden rounded-[3rem] bg-zinc-950 text-white p-12 sm:p-20 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5" />
              For Organizations
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Have Opportunities to Share?
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Schools, companies, training centers, and organizations can post opportunities directly on Peet and reach thousands of motivated users.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setActivePage("post-opportunity")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-lg font-bold transition-all duration-300 shadow-lg shadow-purple-600/25 hover:-translate-y-1 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Post an Opportunity
              </button>
            </div>
          </div>
        </section>

        {/* 8. IMPACT / VISION SECTION */}
        <section className="py-24 text-center px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
              Opportunity Shouldn’t Be Hard to Find. <br className="hidden md:block"/>It Should Find You.
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium max-w-3xl mx-auto">
              Peet exists to close the gap between ambition and access—so that anyone, anywhere, can discover the right opportunity at the right time.
            </p>
          </div>
        </section>

        {/* 9. TESTIMONIALS */}
        <section className="space-y-12 pb-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              People Are Already Finding <br/>Their Next Step
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I found my internship in less than a week.", name: "Sarah J.", role: "Student" },
              { quote: "Finally a platform that doesn’t waste my time.", name: "Marcus T.", role: "Software Engineer" },
              { quote: "Everything I needed was in one place.", name: "Elena R.", role: "Career Switcher" }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 relative flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl font-medium text-zinc-900 dark:text-white leading-relaxed mb-8 flex-1">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-xs text-zinc-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. FINAL CTA SECTION */}
        <section className="relative overflow-hidden rounded-[3rem] bg-purple-600 text-white p-16 sm:p-24 text-center shadow-2xl mb-12">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Your Next Opportunity Is Waiting.
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed font-medium">
              Don’t just search. Discover what’s meant for you.
            </p>
            <div className="pt-6">
              <button
                onClick={() => setActivePage("browse")}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-purple-700 hover:bg-zinc-50 rounded-full text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
'''

lines = lines[:99] + [new_content + '\n']
with open(r'c:\Users\HomePC\Documents\peet\src\components\public\Hero.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

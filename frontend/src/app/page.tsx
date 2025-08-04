import Image from 'next/image';

export default function Home() {
  const departments = [
    {
      name: "Software",
      description: "Build and maintain our digital platforms and tools"
    },
    {
      name: "Outreach",
      description: "Connect with partners and grow our network"
    },
    {
      name: "Finance",
      description: "Manage budgets and funding initiatives"
    },
    {
      name: "Media",
      description: "Create content and manage our online presence"
    },
    {
      name: "Chapters",
      description: "Support and expand our regional branches"
    },
    {
      name: "Special Operations",
      description: "Handle strategic projects and initiatives"
    },
    {
      name: "Human Resources",
      description: "Recruit and support our team members"
    }
  ];

  return (
    <main className="min-h-screen text-white">
      {/* Logo Header */}
      <header className="flex justify-center py-8">
        <div className="w-96 md:w-[500px]">
          <Image
            src="/T4T Logo.png"
            alt="Teens4Teens Logo"
            width={204}
            height={192}
            className="object-contain" 
            priority
          />
        </div>
      </header>

  
{/* Hero section with inline buttons */}
<section className="hero-section flex flex-col items-center justify-center px-4 pb-12">
  <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
    Teens4Teens Internship Application
  </h1>
  <div className="w-full max-w-[850px] mx-auto">
    <p className="text-2xl md:text-[1.75rem] mb-10 text-center leading-relaxed">
      Join Teens 4 Teens, a 501(c)(3) nonprofit run entirely by students and dedicated to making real, measurable impact in our communities. We're offering multiple pro-bono, part-time, fully remote internships for Fall 2025! Whether you're passionate about education, social impact, tech, media, or nonprofit leadership — there's a spot for you.
    </p>
    <div className="flex justify-center">
      <a 
        href="/login" 
        className="home-button inline-block text-center no-underline hover:no-underline font-poppins text-xl md:text-2xl py-4 px-10 rounded-lg mr-6"
      >
        Apply Now
      </a>
  
    </div>
  </div>
</section>
      {/* Our Departments Section */}
      <section className="py-12 px-4">
        <h2 className="text-[2.0rem] font-bold mb-8 text-center">
          Our Departments
        </h2>
        <p className="text-[1.625rem] md:text-[1.75rem] mb-10 text-center leading-relaxed">
  See which teams you can be part of at Teens 4 Teens
</p>


        <div className="steps-container">
          {departments.slice(0, 3).map((dept, index) => (
            <div key={index} className="step-box">
              <h3 className="text-[1.4rem] font-bold mb-4">{dept.name}</h3>
              <p className="text-[1.1rem]">{dept.description}</p>
            </div>
          ))}
        </div>
        <div className="steps-container mt-8">
          {departments.slice(3, 6).map((dept, index) => (
            <div key={index} className="step-box">
              <h3 className="text-[1.4rem] font-bold mb-4">{dept.name}</h3>
              <p className="text-[1.1rem]">{dept.description}</p>
            </div>
          ))}
        </div>
        <div className="py-12 px-4 flex justify-center">
  <div className="step-box p-6 w-full max-w-[600px]">
    <h3 className="text-[1.4rem] font-bold mb-4">Human Resources</h3>
    <p className="text-[1.1rem] mb-6">Recruit and support our team members</p>
  </div>
</div>

      </section>

      {/* Application Process Section */}
<section className="py-12 px-4">
  <h2 className="text-[2.0rem] font-bold mb-8 text-center">
    Our Application Process
  </h2>
  <div className="steps-container">
    <div className="step-box">
      <h3 className="text-[1.4rem] font-bold mb-4">Step 1</h3>
      <p className="text-[1.1rem]">Submit our short 5-minute application</p>
    </div>
    
    <div className="step-arrow">→</div>
    
    <div className="step-box">
      <h3 className="text-[1.4rem] font-bold mb-4">Step 2</h3>
      <p className="text-[1.1rem]">Go through two rounds of 15-20 minute interviews with our team</p>
    </div>
    
    <div className="step-arrow">→</div>
    
    <div className="step-box">
      <h3 className="text-[1.4rem] font-bold mb-4">Step 3</h3>
      <p className="text-[1.1rem]">Start your journey with Teens4Teens and join our team</p>
    </div>
  </div>
</section>


<footer className="pt-12 pb-20 px-4 bg-gray-800 text-white">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-[2rem] font-bold mb-10 text-center">
      Get In Touch
    </h2>

    {/* Contact Boxes */}
    <div className="flex flex-wrap justify-between gap-y-10 gap-x-6 mb-16">
      {/* Email */}
      <div className="text-center p-6 rounded-lg bg-gray-700 w-full sm:w-[30%] flex-1">
        <h3 className="text-[1.4rem] font-bold mb-4">Email Us</h3>
        <a 
          href="mailto:info@teens4teens.net" 
          className="hover:underline text-[1.1rem] hover:text-green-400 transition-colors"
        >
          info@teens4teens.net
        </a>
      </div>

      {/* Instagram */}
      <div className="text-center p-6 rounded-lg bg-gray-700 w-full sm:w-[30%] flex-1">
        <h3 className="text-[1.4rem] font-bold mb-4">Instagram</h3>
        <a 
          href="https://www.instagram.com/t4t_ig/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline text-[1.1rem] hover:text-pink-500 transition-colors"
        >
          @teens4teens
        </a>
      </div>

      {/* LinkedIn */}
      <div className="text-center p-6 rounded-lg bg-gray-700 w-full sm:w-[30%] flex-1">
        <h3 className="text-[1.4rem] font-bold mb-4">LinkedIn</h3>
        <a 
          href="https://www.linkedin.com/company/teens4teens-nonprofit/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline text-[1.1rem] hover:text-blue-400 transition-colors"
        >
          Teens4Teens
        </a>
      </div>
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-700 pt-10 text-center">
      <p className="text-gray-400 text-sm md:text-base">
        © {new Date().getFullYear()} Teens4Teens. A 501(c)(3) nonprofit organization. All rights reserved.
      </p>
    </div>
  </div>
</footer>
</main>
  )
}

import Image from 'next/image';
import { Mail, Instagram, Linkedin, Link} from 'lucide-react';
export default function Home() {


  return (
    <main className="min-h-screen text-white">  
{/* Hero section with inline buttons */}
<section className="hero-section flex flex-col items-center justify-center px-4 pb-12">
  <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
    Teens4Teens Internship Application
  </h1>
  <div className="w-full max-w-[850px] mx-auto">
    <p className="text-2xl md:text-[1.75rem] mb-10 text-center leading-relaxed">
      Join Teens 4 Teens, a 501(c)(3) nonprofit run entirely by students and dedicated to making real, measurable impact in our communities. We're offering multiple positions starting Fall 2025! Whether you're passionate about education, social impact, tech, media, or nonprofit leadership — there's a spot for you.
    </p>
    
    {/* Three key benefit labels */}
    <div className="benefit-labels">
      <div className="label-green">Fully Remote</div>
      <div className="label-blue">Part-Time</div>
      <div className="label-purple">Real Impact</div>
    </div>
    
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
{/* First Row - Blue, Green, Purple */}
  <div className="steps-container">
    <div className="step-box step-box-blue">
      <h3 className="text-[1.4rem] font-bold mb-4">Software</h3>
      <p className="text-[1.1rem]">Build and maintain our digital platforms and tools</p>
      <p className="text-sm text-gray-700 italic">
        Open positions: Front End Engineer, Full Stack Engineer, AI Engineer, Data Scientist, Technical Project Manager.
      </p>
    </div>
    <div className="step-box step-box-green">
      <h3 className="text-[1.4rem] font-bold mb-4">Outreach</h3>
      <p className="text-[1.1rem]">Connect with partners and grow our network</p>
      <p className="text-sm text-gray-700 italic">
        Open positions: Partnership Researcher, Outreach Coordinator / Sales, Administrative Assistant, Local Outreach Ambassador.
      </p>
    </div>
    <div className="step-box step-box-purple">
      <h3 className="text-[1.4rem] font-bold mb-4">Finance</h3>
      <p className="text-[1.1rem]">Manage budgets and funding initiatives</p>
      <p className="text-sm text-gray-700 italic">
        Open positions: Grant Writer / Specialist, Grant Researcher, Grant Compliance Officer (Reviewer).
      </p>
    </div>
  </div>

  {/* Second Row - Green, Blue, Purple (rotated pattern) */}
  <div className="steps-container">
    <div className="step-box step-box-green">
      <h3 className="text-[1.4rem] font-bold mb-4">Media</h3>
      <p className="text-[1.1rem]">Create contents, manage our online presence</p>
      <p className="text-sm text-gray-700 italic">
        Open positions: Content Creator, Social Media Manager, Ambassador Coordinator, Partnership Liaison.
      </p>
    </div>
    <div className="step-box step-box-blue">
      <h3 className="text-[1.4rem] font-bold mb-4">Human Resources</h3>
      <p className="text-[1.1rem]">Support and expand our regional branches</p>
      <p className="text-sm text-gray-700 italic">
        Open positions: Onboarding Specialist, Admin Assistant, HR Representative, Content Coordinator.
      </p>
    </div>
    <div className="step-box step-box-purple">
      <h3 className="text-[1.4rem] font-bold mb-4">Executive</h3>
      <p className="text-[1.1rem]">Handle strategic projects and initiatives</p>
      <p className="text-sm text-gray-700 italic">
        Open position: Chief Secretary (Exec/Chief Secretary).
      </p>
    </div>
  </div>
</section>

  



      {/* Application Process Section */}
<section className="py-12 px-4">
  <h2 className="text-[2.0rem] font-bold mb-8 text-center">
    Our Application Process
  </h2>
  <div className="steps-container">
    <div className="step-box step-box-process-smooth-1">
      <h3 className="text-[1.4rem] font-bold mb-4">Step 1</h3>
      <p className="text-[1.1rem]">Submit our short 5-minute application, no cover letter or essay is needed</p>
    </div>
    
    <div className="step-arrow">→</div>
    
    <div className="step-box step-box-process-smooth-2">
      <h3 className="text-[1.4rem] font-bold mb-4">Step 2</h3>
      <p className="text-[1.1rem]">Go through two rounds of 15-20 minute interviews with our team</p>
    </div>
    
    <div className="step-arrow">→</div>
    
    <div className="step-box step-box-process-smooth-3">
      <h3 className="text-[1.4rem] font-bold mb-4">Step 3</h3>
      <p className="text-[1.1rem]">Join our team, our Slack channel, and start your journey with us</p>
    </div>
  </div>
</section>
<footer className="t4t-footer" style={{ marginTop: '-2rem' }}>
      <div className="t4t-footer-container">
        <h2 className="t4t-footer-title">Get In Touch</h2>
        <div className="t4t-contact-cards-wrapper">
          <div className="t4t-contact-cards-row">
            {/* Email */}
            <div className="t4t-card t4t-card-green">
              <div className="t4t-card-icon">
                <Mail className="t4t-icon-svg" color="white" />
              </div>
              <h3 className="t4t-card-title">Email Us</h3>
              <a href="mailto:info@teens4teens.net" className="t4t-card-link">info@teens4teens.net</a>
            </div>

            {/* Instagram */}
            <div className="t4t-card t4t-card-pinkpurple">
              <div className="t4t-card-icon">
                <Instagram className="t4t-icon-svg" color="white" />
              </div>
              <h3 className="t4t-card-title">Instagram</h3>
              <a href="https://www.instagram.com/t4t_ig/" target="_blank" rel="noopener noreferrer" className="t4t-card-link">@teens4teens</a>
            </div>

            {/* LinkedIn */}
            <div className="t4t-card t4t-card-blue">
              <div className="t4t-card-icon">
                <Linkedin className="t4t-icon-svg" color="white" />
              </div>
              <h3 className="t4t-card-title">LinkedIn</h3>
              <a href="https://www.linkedin.com/company/teens4teens-nonprofit/" target="_blank" rel="noopener noreferrer" className="t4t-card-link">Teens4Teens</a>
            </div>

            {/* Linktree */}
            <div className="t4t-card t4t-card-neutral">
              <div className="t4t-card-icon">
                <Link className="t4t-icon-svg" color="white" />
              </div>
              <h3 className="t4t-card-title">LinkTree</h3>
              <a href="https://linktr.ee/teens4teens23" target="_blank" rel="noopener noreferrer" className="t4t-card-link t4t-card-link-neutral">
                linktr.ee/teens4teens23
              </a>
            </div>
          </div>
        </div>

        <div className="t4t-footer-bottom">
          <p>© {new Date().getFullYear()} Teens4Teens. A 501(c)(3) nonprofit organization. All rights reserved.</p>
        </div>
      </div>
    </footer>
</main>
  )
}

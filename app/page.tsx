import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-bold">LOGO</div>
          <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">
              Start Here
            </a>
            <a href="#" className="hover:text-gray-900">
              Products
            </a>
            <a href="#" className="hover:text-gray-900">
              Solutions
            </a>
            <a href="#" className="hover:text-gray-900">
              Compare
            </a>
            <a href="#" className="hover:text-gray-900">
              Pricing
            </a>
            <a href="#" className="hover:text-gray-900">
              FAQs
            </a>
          </nav>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">View Plans</Button>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-16 max-w-4xl mx-auto">
        {/* New Badge */}
        <div className="inline-flex items-center bg-black text-white text-sm px-4 py-2 rounded-full mb-8">
          <span className="bg-white text-black text-xs px-2 py-1 rounded-full mr-3">New</span>
          Make your notes great again.
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
          A notes app that
          <br />
          works like an <span className="text-teal-500">Organizer</span>
        </h1>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
          Great notes deserve a system that does it all, from making todo lists for an organized life. Getting your startup to market faster than
          other founders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-3">
            <Star className="w-4 h-4 mr-2" />
            Get an Invite
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-3 bg-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Book a Call
          </Button>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-lg font-medium">Start</div>
            <div className="text-lg font-bold border-b-2 border-black pb-1">Ship</div>
            <div className="text-2xl font-bold">N</div>
            <div className="text-lg font-bold">Iterate</div>
            <div className="text-lg font-medium">Inscrease Runway</div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-6 overflow-hidden">
            <img src="/professional-headshot.png" alt="Testimonial" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Quick and Easy Setup</h3>
          <p className="text-gray-600 mb-2">
            "We've scaled to thousands of notes daily. The app's dashboard is the only thing that keeps us sane."
          </p>
          <p className="text-sm text-gray-500">Mike from the app, Logo official</p>
        </div>
      </section>

      {/* Branding Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-4">Branding</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Customize the full experience</h2>
          <p className="text-gray-600 mb-12">
            From note to page to life organized, focus on growth.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button variant="outline" className="rounded-full bg-transparent">
              Shop
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Checkout
            </Button>
            <Button className="bg-black text-white rounded-full">Email</Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Order Mail
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Scan App
            </Button>
          </div>
        </div>
      </section>

      {/* Email Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Emails That Feel
              <br />
              Like You
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Add your logo & socials</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Write your own thank you message</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Your name, your sender email</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Add your socials</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-96 bg-gray-100 rounded-2xl p-4 shadow-lg">
              <div className="bg-white rounded-xl h-full p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs">9:19</div>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                  </div>
                </div>
                <div className="text-sm font-medium mb-2">Your project with Mike is in the app!</div>
                <div className="text-xs text-gray-500 mb-4">21 notes to todos</div>
                <div className="bg-gray-50 rounded-lg p-3 flex-1">
                  <div className="text-lg font-bold mb-2">organized</div>
                  <div className="text-sm mb-2">Your project with Mike is in the app!</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-pink-200 rounded-full"></div>
                    <div className="text-xs">Create first note and organize</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

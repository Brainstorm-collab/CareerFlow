import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setShowSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 max-w-6xl mx-auto mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <MessageSquare size={24} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get in touch with our team for support, questions, or feedback
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center mb-16 relative z-10">
        <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-none px-2 break-words bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-6">
          Get in Touch
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
          Have questions about our platform? Need help with your account? 
          We're here to help you succeed in your career journey.
        </p>
      </section>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <MessageSquare size={24} className="text-blue-400" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send size={18} className="mr-2" />
                  Send Message
                </Button>
                
                {/* Success Message */}
                {showSuccess && (
                  <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-center font-medium">
                      Message sent successfully!
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Mail size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <p className="text-gray-300">support@carrerflow.com</p>
                    <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Phone size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone</h3>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <MapPin size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Office</h3>
                    <p className="text-gray-300">123 Innovation Drive</p>
                    <p className="text-gray-300">Tech Valley, CA 94000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h4 className="text-white font-medium mb-2">How do I apply for a job?</h4>
                  <p className="text-gray-300 text-sm">
                    Simply click the "Apply" button on any job listing. You can also save jobs 
                    to apply later from your Saved Jobs section.
                  </p>
                </div>
                
                <div className="border-b border-white/10 pb-3">
                  <h4 className="text-white font-medium mb-2">How do I post a job?</h4>
                  <p className="text-gray-300 text-sm">
                    Recruiters and administrators can post jobs by going to the "Post Job" section and filling out 
                    the job details form. Candidates cannot post jobs.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Can I edit my application?</h4>
                  <p className="text-gray-300 text-sm">
                    Currently, applications cannot be edited after submission. Please review 
                    carefully before applying.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer Attribution */}
      {/* <div className="text-center py-8 mt-16">
        <p className="text-gray-400 text-sm">
          Made with 💗 by G.Eesaan
        </p>
      </div> */}
    </main>
  );
};

export default ContactPage;

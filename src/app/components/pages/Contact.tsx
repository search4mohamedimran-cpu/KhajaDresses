import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../lib/api";

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await api.submitContact(formData);
      if (result.message) {
        alert("Thank you for contacting us! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      alert("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl mb-6">Get in Touch</h2>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="border-2 border-black p-6 bg-white hover:bg-black hover:text-white transition-all group">
                <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center mb-4">
                  <MapPin className="text-white group-hover:text-black" size={24} />
                </div>
                <h3 className="text-lg mb-2">Visit Us</h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  123 Fashion Street<br />
                  City Center, Downtown<br />
                  Postal Code: 12345
                </p>
              </div>

              {/* Phone */}
              <div className="border-2 border-black p-6 bg-white hover:bg-black hover:text-white transition-all group">
                <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center mb-4">
                  <Phone className="text-white group-hover:text-black" size={24} />
                </div>
                <h3 className="text-lg mb-2">Call Us</h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  Main: +1 234 567 8900<br />
                  Sales: +1 234 567 8901<br />
                  Support: +1 234 567 8902
                </p>
              </div>

              {/* Email */}
              <div className="border-2 border-black p-6 bg-white hover:bg-black hover:text-white transition-all group">
                <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center mb-4">
                  <Mail className="text-white group-hover:text-black" size={24} />
                </div>
                <h3 className="text-lg mb-2">Email Us</h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  General: info@kajadresses.com<br />
                  Sales: sales@kajadresses.com<br />
                  Support: support@kajadresses.com
                </p>
              </div>

              {/* Hours */}
              <div className="border-2 border-black p-6 bg-white hover:bg-black hover:text-white transition-all group">
                <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center mb-4">
                  <Clock className="text-white group-hover:text-black" size={24} />
                </div>
                <h3 className="text-lg mb-2">Business Hours</h3>
                <p className="text-gray-600 group-hover:text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="border-2 border-black p-8 bg-white">
              <h2 className="text-2xl mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:opacity-50"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Status</option>
                      <option value="uniforms">Uniform Availability</option>
                      <option value="bulk">Bulk Orders</option>
                      <option value="partnership">School Partnership</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={8}
                    disabled={submitting}
                    className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:opacity-50"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 border-2 border-black h-64 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
                <p className="text-gray-600">Map Location</p>
                <p className="text-sm text-gray-500">123 Fashion Street, City Center</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-black text-white p-12">
          <h2 className="text-3xl mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl mb-2">What are your delivery times?</h3>
              <p className="text-gray-300">
                Standard delivery takes 3-5 business days. Express delivery is available for urgent orders.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-2">Do you offer bulk discounts?</h3>
              <p className="text-gray-300">
                Yes! We offer special pricing for schools and bulk orders. Contact our sales team for details.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-2">What is your return policy?</h3>
              <p className="text-gray-300">
                We accept returns within 30 days of purchase for unused items in original condition.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-2">Can I customize uniforms?</h3>
              <p className="text-gray-300">
                Yes, we offer customization services including embroidery and school logos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

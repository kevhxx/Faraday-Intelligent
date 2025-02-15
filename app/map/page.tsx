"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/navbar"

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState("london")
  const [loading, setLoading] = useState(true)

  const cities = {
    london: {
      name: "London",
      latitude: 51.5074,
      longitude: -0.1278,
    },
    newyork: {
      name: "New York",
      latitude: 40.7128,
      longitude: -74.006,
    },
    losangeles: {
      name: "Los Angeles",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    hongkong: {
      name: "Hong Kong",
      latitude: 22.3193,
      longitude: 114.1694,
    },
    singapore: {
      name: "Singapore",
      latitude: 1.3521,
      longitude: 103.8198,
    },
  }

  const handleIframeLoad = () => {
    setLoading(false)
  }

  const currentCity = cities[selectedCity as keyof typeof cities]
  const mapUrl = `https://map.openchargemap.io/?mode=embedded&apikey=ec314633-80be-432d-b29d-d530499fe870&latitude=${currentCity.latitude}&longitude=${currentCity.longitude}`

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Charging Station Map</h1>
            <p className="text-xl text-gray-400">
              Explore our network of EV charging stations across {currentCity.name}. Use the city selector above to view
              different locations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full bg-gray-900">
        <div className="max-w-7xl mx-auto">
        {loading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white text-xl">Loading map...</div>
          </div>
        )}
        <iframe
          src={mapUrl}
          allow="geolocation"
          className="w-full h-[600px] border-0"
          onLoad={handleIframeLoad}
          title="EV Charging Stations Map"
        />
        </div>
      </div>
    </div>
  )
}

      {/* Features Section */}
      {/*<div className="py-20 px-6 bg-gray-900">*/}
      {/*  <div className="max-w-7xl mx-auto">*/}
      {/*    <div className="grid gap-8 md:grid-cols-3">*/}
      {/*      <motion.div*/}
      {/*        initial={{ opacity: 0, y: 20 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        transition={{ delay: 0.1 }}*/}
      {/*        className="p-6 rounded-2xl bg-black/30 border border-white/10"*/}
      {/*      >*/}
      {/*        <h3 className="text-xl font-bold mb-3">Real-time Availability</h3>*/}
      {/*        <p className="text-gray-400">Check current status and availability of charging stations in your area.</p>*/}
      {/*      </motion.div>*/}
      {/*      <motion.div*/}
      {/*        initial={{ opacity: 0, y: 20 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        transition={{ delay: 0.2 }}*/}
      {/*        className="p-6 rounded-2xl bg-black/30 border border-white/10"*/}
      {/*      >*/}
      {/*        <h3 className="text-xl font-bold mb-3">Multiple Networks</h3>*/}
      {/*        <p className="text-gray-400">Access charging stations from various providers in one unified interface.</p>*/}
      {/*      </motion.div>*/}
      {/*      <motion.div*/}
      {/*        initial={{ opacity: 0, y: 20 }}*/}
      {/*        whileInView={{ opacity: 1, y: 0 }}*/}
      {/*        viewport={{ once: true }}*/}
      {/*        transition={{ delay: 0.3 }}*/}
      {/*        className="p-6 rounded-2xl bg-black/30 border border-white/10"*/}
      {/*      >*/}
      {/*        <h3 className="text-xl font-bold mb-3">Detailed Information</h3>*/}
      {/*        <p className="text-gray-400">View connector types, power levels, and user reviews for each station.</p>*/}
      {/*      </motion.div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
    {/*  </div>*/}
    {/*</div>*/}
{/*  )*/}
{/*}*/}


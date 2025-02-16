"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { motion } from "framer-motion"
import { Zap, BatteryCharging } from "lucide-react"
import Navbar from "../components/navbar"

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

const suggestedStations = [
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.19819401059614014, 51.47034145809656], // Note: Mapbox uses [lng, lat]
        },
        properties: {
          name: "Advised Charging Station",
          suggest_by: "Faraday Intelligence AI System",
          address: "445 Sulivan Ct, Peterborough Rd, London SW6 3BX",
          usage_cost: "£1.80 + £0.30/kWh; £10.00 overstay after 65 mins",
          connectors: [
            { type: "Type 2", power_kw: 22 },
            { type: "CHAdeMO", power_kw: 50 },
            { type: "CCS", power_kw: 50 },
          ],
        },
      },
    ],
  },
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.191455, 51.477447],
        },
        properties: {
          name: "Advised Charging Station",
          suggest_by: "Faraday Intelligence AI System",
          address: "24A New Kings Rd, London SW6 4SA",
          usage_cost: "£1.80 + £0.30/kWh; £10.00 overstay after 65 mins",
          connectors: [
            { type: "Type 2", power_kw: 22 },
            { type: "CHAdeMO", power_kw: 50 },
            { type: "CCS", power_kw: 50 },
          ],
        },
      },
    ],
  },
]

export default function SuggestedStationsPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.118092, 51.509865], // London center
      zoom: 11,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      setLoading(false)

      // Add markers for each suggested station
      suggestedStations.forEach((station) => {
        station.features.forEach((feature) => {
          // Create custom marker element
          const markerEl = document.createElement("div")
          markerEl.className = "custom-marker"
          markerEl.innerHTML = `
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                <path d="M7 19h10"></path>
                <path d="M7 19a2 2 0 0 1-2-2"></path>
                <path d="M17 19a2 2 0 0 0 2-2"></path>
                <path d="M17 5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                <path d="M12 8v6"></path>
                <path d="M9 11h6"></path>
              </svg>
            </div>
          `

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-4 max-w-sm">
              <h3 class="font-bold text-lg mb-2">${feature.properties.name}</h3>
              <p class="text-gray-600 mb-2">${feature.properties.address}</p>
              <p class="text-sm text-gray-500 mb-2">Operator: Shell</p>
              <p class="text-sm text-gray-500 mb-3">${feature.properties.usage_cost}</p>
              <div class="space-y-2">
                <h4 class="font-semibold">Connectors:</h4>
                ${feature.properties.connectors
                  .map(
                    (connector: { type: string; power_kw: number }) =>
                      `<div class="flex items-center gap-2">
                        <span class="text-primary">⚡</span>
                        <span>${connector.type} - ${connector.power_kw}kW</span>
                      </div>`,
                  )
                  .join("")}
              </div>
            </div>
          `)

          const lngLat: [number, number] = feature.geometry.coordinates.length >= 2
          ? [feature.geometry.coordinates[0], feature.geometry.coordinates[1]]
          : [0, 0]; // 备用默认坐标
          // Add marker to map
          new mapboxgl.Marker(markerEl).setLngLat(lngLat).setPopup(popup).addTo(map.current!)
        })
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-gray-400">
      <Navbar selectedCity="london" />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Cases</h1>
            <p className="text-xl text-gray-400">
              AI-powered recommendations for optimal charging station locations in London.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-white text-xl">Loading map...</div>
            </div>
          )}
          <div ref={mapContainer} className="w-full h-[600px]" />
        </div>
      </div>

      {/* Legend Section */}
      <div className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-black/30 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">Suggested Locations</h3>
              </div>
              <p className="text-gray-400">
                These locations are carefully selected based on traffic patterns, population density, and existing
                infrastructure.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-black/30 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <BatteryCharging className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Multiple Connector Types</h3>
              </div>
              <p className="text-gray-400">
                Each station is equipped with various connector types to support different vehicle models and charging
                speeds.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}


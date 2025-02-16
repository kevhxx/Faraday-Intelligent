"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { motion } from "framer-motion"
import { Zap, AlertTriangle } from "lucide-react"
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
          operator: "Shell",
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
          operator: "Shell",
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

const improvementStations = [
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.221589, 51.476378],
        },
        properties: {
          name: "Stevenage Road Charging Point",
          operator: "Hammersmith and Fulham Council",
          address: "Opposite 75 Stevenage Road, London, SW6 6NP",
          Comments: "Major Underperforming station",
          connectors: [
            { type: "Type 2", power_kw: 7, quantity: 3 },
            { type: "Type 1", power_kw: 4, quantity: 3 },
          ],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.12911, 51.46895],
        },
        properties: {
          name: "Chelsham Road Charging Point",
          operator: "Lambeth Council",
          address: "Chelsham Road, Lambeth, SW6 6NP",
          connectors: [{ type: "Type 2", power_kw: 7, quantity: 2 }],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.216314, 51.483501],
        },
        properties: {
          name: "Everington Street Charging Point",
          operator: "Hammersmith and Fulham Council",
          address: "Opposite 56 Everington Street, London, SW6 7PL",
          Comments: "Major Underperforming station",
          connectors: [
            { type: "Type 2", power_kw: 7, quantity: 2 },
            { type: "Type 1", power_kw: 4, quantity: 2 },
          ],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.198331, 51.483719],
        },
        properties: {
          name: "Asset No. LC 6 Charging Point",
          operator: "Ubitricity",
          Comments: "Major Underperforming station",
          address: "Asset No. LC 6, London, SW6 1JX",
          connectors: [{ type: "Type 2", power_kw: 3.7 }],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.195912, 51.472017],
        },
        properties: {
          name: "Chiddingstone St 51 Charging Point",
          operator: "Ubitricity",
          Comments: "Major Underperforming station",
          address: "Chiddingstone St 51, London, SW6 3TG",
          connectors: [{ type: "Type 2", power_kw: 3.7 }],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.193506, 51.473018],
        },
        properties: {
          name: "Perrymead St 55 Charging Point",
          operator: "Ubitricity",
          Comments: "Major Underperforming station",
          address: "Perrymead St 55, London, SW6 3SN",
          connectors: [{ type: "Type 2", power_kw: 3.7 }],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.21674, 51.47358],
        },
        properties: {
          name: "Cloncurry St 47 Charging Point",
          operator: "Ubitricity",
          Comments: "Major Underperforming station",
          address: "Cloncurry St 47, London, SW6 6DT",
          connectors: [{ type: "Type 2", power_kw: 3.7 }],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-0.21739, 51.47475],
        },
        properties: {
          name: "Woodlawn Rd 50 Charging Point",
          operator: "Ubitricity",
          Comments: "Major Underperforming station",
          address: "Woodlawn Rd 50, London, SW6 6EU",
          connectors: [{ type: "Type 2", power_kw: 3.7 }],
        },
      },
    ],
  },
];

const redMarker = [
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-0.195952, 51.485608],
    },
    properties: {
      name: "Seagrave Road Charging Point",
      operator: "Hammersmith and Fulham Council",
      address: "35 Seagrave Road, London, SW6 1SA",
      Comments: "Critical issue at this underperforming station",
      connectors: [
        { type: "Type 2", power_kw: 22 },
        { type: "CHAdeMO", power_kw: 50 },
        { type: "CCS", power_kw: 50 },
      ],
    },
  }
];



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
      // center: [-0.118092, 51.509865], // London center
      center: [-0.186953, 51.479732],
      zoom: 13,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      setLoading(false)

      // Add markers for suggested stations
      suggestedStations.forEach((station) => {
        station.features.forEach((feature) => {
          // Create custom marker element for suggested stations
          const markerEl = document.createElement("div")
          markerEl.className = "custom-marker"
          markerEl.innerHTML = `
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-200">
                <path d="M7 19h10"></path>
                <path d="M7 19a2 2 0 0 1-2-2"></path>
                <path d="M17 19a2 2 0 0 0 2-2"></path>
                <path d="M17 5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
                <path d="M12 8v6"></path>
                <path d="M9 11h6"></path>
              </svg>
            </div>
          `

          // Create popup for suggested stations
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-4 max-w-sm">
              <h3 class="text-black font-bold text-lg mb-2">${feature.properties.name}</h3>
              <p class="text-black mb-2">${feature.properties.address}</p>
              <p class="text-sm text-gray-500 mb-2">Operator: ${feature.properties.operator}</p>
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

          new mapboxgl.Marker(markerEl).setLngLat(lngLat).setPopup(popup).addTo(map.current!)
        })
      })

      // Add markers for improvement stations
      improvementStations.forEach((station) => {
        station.features.forEach((feature) => {
          // Create custom marker element for improvement stations
          const markerEl = document.createElement("div")
          markerEl.className = "custom-marker"
          markerEl.innerHTML = `
            <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          `

          // Create popup for improvement stations
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-4 max-w-sm">
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-yellow-500 text-gray-300 px-2 py-1 rounded text-sm">Needs Improvement</span>
              </div>
              <h3 class="font-bold text-lg mb-2">${feature.properties.name}</h3>
              <p class="text-gray-600 mb-2">${feature.properties.address}</p>
              <p class="text-sm text-gray-500 mb-2">Operator: ${feature.properties.operator}</p>
              <p class="text-sm text-red-500 mb-3">${feature.properties.Comments}</p>
              <div class="space-y-2">
                <h4 class="font-semibold">Connectors:</h4>
                ${feature.properties.connectors
                  .map(
                    (connector: { type: string; power_kw: number }) =>
                      `<div class="flex items-center gap-2">
                        <span class="text-yellow-500">⚡</span>
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

          new mapboxgl.Marker(markerEl).setLngLat(lngLat).setPopup(popup).addTo(map.current!)
        })
      })

      // Add red marker for critical stations

      redMarker.forEach((feature) => {

        const markerEl = document.createElement("div")

        markerEl.className = "custom-marker"

        markerEl.innerHTML = `
          <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
               </svg> 
               </div>`
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-4 max-w-sm">
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-red-500 text-gray-300 px-2 py-1 rounded text-sm">Critical Issue</span>
            </div>
            <h3 class="font-bold text-lg mb-2">${feature.properties.name}</h3>
            <p class="text-gray-600 mb-2">${feature.properties.address}</p>
            <p class="text-sm text-gray-500 mb-2">Operator: ${feature.properties.operator}</p>
            <p class="text-sm text-red-500 mb-3">${feature.properties.Comments}</p>
            <div class="space-y-2">
              <h4 class="font-semibold">Connectors:</h4>
              ${feature.properties.connectors
                .map(
                  (connector: { type: string; power_kw: number }) =>
                    `<div class="flex items-center gap-2">
                      <span class="text-red-500">⚡</span>
                      <span>${connector.type} - ${connector.power_kw}kW</span>
                    </div>`,
                ).join("")}
            </div>
          </div>`)
        const lngLat: [number, number] = feature.geometry.coordinates.length >= 2
            ? [feature.geometry.coordinates[0], feature.geometry.coordinates[1]]
            : [0, 0]; // 备用默认坐标
        new mapboxgl.Marker(markerEl).setLngLat(lngLat).setPopup(popup).addTo(map.current!)

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Station Analysis</h1>
            <p className="text-xl text-gray-400">
              View suggested new locations and stations that need improvement across London.
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
                  <Zap className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold">Suggested New Locations</h3>
              </div>
              <p className="text-gray-400">
                Optimal locations for new charging stations, selected based on our AI analysis of traffic patterns,
                population density, and infrastructure capacity.
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
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold">Needs Improvement</h3>
              </div>
              <p className="text-gray-400">
                Existing stations that require upgrades or maintenance based on performance data and user feedback.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}


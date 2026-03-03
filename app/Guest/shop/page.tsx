"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import SiteHeader from "../../components/site-header"

interface Fabric {
  id: number
  name: string
  price: number
  material: string
  color: string
  image: string
}

const allFabrics: Fabric[] = [
  {
    id: 1,
    name: "Linen Blend - Natural",
    price: 15,
    material: "Linen",
    color: "Natural",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA3B_SadHV27p74Ozd9EWLtej1bCrh0ortAORekJqazr-VhbiJqYWfTzy_Kw6RbAJ1mwqUWf6m98M5F53Pogu_AvviAqn56JP4GSzk4cciSajABvxXAXrcTPI7THZ1vWvfRPTWk0N7zj_FDB8S76rwOdkLXodlt7IZ1vBDFjtimjPXb0pRkpcJkSC3rZQMWPlVpnNiIYg2LFj-IpjWKSzcPIdKVE99xcuY5oaPzwhBMf2oSZcAGl786i77FHv_LXv_IBLOa7f7Az4A",
  },
  {
    id: 2,
    name: "Cotton Jersey - Black",
    price: 12,
    material: "Cotton",
    color: "Black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhgNUo5fY_mpel0s-mEkyNdndD0pWvumUnfYFC6fC2qKYpqYtcmABA6wqBFGFK9Q2VFzeWc_XMI1OlZ-vye9vxBi3SkgZi5H-s1_OeQZrFnPHq7fakWKeaTMJ5OFX9s5V6hvD3J3_PFmRPgt0mJDXKE5TyPPf1YyBvIhCJUSBAvc2NZLm2m91MlNvLFtRAHrveoMytb5pbaRTJvIJmFvvPWgADJ6mOZTPgkq1e-BxMqr1cwBK8cyO4n5Gr9AtRT6pOlSet630IRNu",
  },
  {
    id: 3,
    name: "Silk Charmeuse - Ivory",
    price: 25,
    material: "Silk",
    color: "Ivory",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBQQhL7iWY1VVELRVltrz0D5e7nXW-GldSf8QOZ72boeYGb-r2wttgRAfcUtSTBPtFZt0XMo7-mr3Wev0wYyx5kQIuXihqZQBlH4aAm4YqCYkEEnFZcGCw6LQN-f6niiLDIiUZ7HM-hTWwg4bL6C_4S0Pp8lLPWxjR0NRZwBrWbs1NGSXWqXMR-myiZue7qErFM26LVIU3YWGWCcAJbs2U1Xb2M9ldoKW5vI3MkpDC-XIUGPFG1MwiPUmpOuDVz8wmuWz2IbIwowFn",
  },
  {
    id: 4,
    name: "Wool Tweed - Heather Grey",
    price: 22,
    material: "Wool",
    color: "Grey",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCO4hO9mmEszO5PqP07kk1XaB_AQQ84R-RmAr_44MeT5llW6yC46kiLfTpBeXzcAKykrAully_57fc_K-u92dYysMy6Uu6rzXs78JqJ9ieUywu9UtTo3P7GDb8ORaFrs-e3jC7xJgoG4lU3G_e1ugW01Qc__tquTsOO5j0UXDyPfrnyeTWNQWhpb1NLsh4wlJPkyfV3p2fartTZsZjvYdhmnd47LAQ6aLdhFb4-l-pAJpSCg5S1YDV9ubc8vcHTbwmA8-zcPgTBKDO8",
  },
  {
    id: 5,
    name: "Organic Cotton Poplin - White",
    price: 14,
    material: "Cotton",
    color: "White",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmgdJro5Og426vKHoh9HdMb9HPJAUb6eafLTlAKT9ALyvJCVCD1jPLX-yWhBlTIGK7SBaucfhzJd8R74-hKuSZ_TgkvYH6EVUZ8ZlyswAZ4g5gjtAMMI9gJAg4zCCV0ohCo8jVOayC_S_NC1Jb5ExhKhQGuig995UqffyqBfGH0Vr5V9quwLv4-TMfJvuXJZBtnlMk05-2KRE3FWP5yu7AucESxWefqKePHC1UAuQyfRxFOf05ExS0QS9gJsr-BACmRipVtL1gY4B",
  },
  {
    id: 6,
    name: "Bamboo Rayon - Dusty Rose",
    price: 16,
    material: "Bamboo",
    color: "Rose",
    image: "/images/dusty-rose-bamboo-rayon-fabric.jpg",
  },
  {
    id: 7,
    name: "Hemp Canvas - Olive Green",
    price: 18,
    material: "Hemp",
    color: "Green",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCf2pe8BFk5rdm3XZQBWFedmR9xhgaqbGKCXhzILHrqC-crOiyGPAWB1j_0uDcBF4_JX9LghlEvL6TaQA5E5MEJMs219n0IdGVp9JuLKhjt6DprqoceKUDitmifMafSEsuOBF4p4wRvnCB_-0DROgH0X4UhqJZmiD1FkPsa7AXMNN_HEbbMNI4X1TZwnv7SJrrfC6GXWMhWeVgzqLo1-rttXwodAE_kOCwCYwCC1Cft9xYKrNXUkEj9fk3WLpG2sGel0BbHy-avOgP",
  },
  {
    id: 8,
    name: "Velvet - Deep Navy",
    price: 20,
    material: "Velvet",
    color: "Navy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgJtfEeoA6TFNGpKQ6o0YL1EguaYpZqhUC2BkAeDhM2q-v1EpMXiXP0UIlhGw2knJVyju8ToK6s2ljk-PEocTY0YfrjoSStOp8nenXzaL34U3Rz7J_vGCk4gBm1d7JJvRKeO71ewLL--4ydW2ZPdprOw4LpuZEWZh3KNJ5EP0ItnizbjTrDd1-VuLQ0tzLnO1_FvNRQ24FumfXT8wFhj9xSCwCycR_FTqulDThd3gahZh8gLWa5wsmaRtAOwcRsYpwTWJEb8LgG48D",
  },
  {
    id: 9,
    name: "Linen Blend - Sage",
    price: 15,
    material: "Linen",
    color: "Sage",
    image: "/images/sage-linen-blend-fabric.jpg",
  },
  {
    id: 10,
    name: "Cotton Sateen - Cream",
    price: 13,
    material: "Cotton",
    color: "Cream",
    image: "/images/cream-cotton-sateen-fabric.jpg",
  },
  {
    id: 11,
    name: "Silk Dupioni - Blush",
    price: 28,
    material: "Silk",
    color: "Blush",
    image: "/images/blush-silk-dupioni-fabric.jpg",
  },
  {
    id: 12,
    name: "Wool Felt - Charcoal",
    price: 24,
    material: "Wool",
    color: "Charcoal",
    image: "/images/charcoal-wool-felt-fabric.jpg",
  },
]

export default function Shop() {
  const [sortBy, setSortBy] = useState("newest")
  const [filterMaterial, setFilterMaterial] = useState("all")
  const [filterColor, setFilterColor] = useState("all")
  const [itemsToShow, setItemsToShow] = useState(8)

  const filteredFabrics = allFabrics
    .filter((fabric) => filterMaterial === "all" || fabric.material.toLowerCase() === filterMaterial.toLowerCase())
    .filter((fabric) => filterColor === "all" || fabric.color.toLowerCase() === filterColor.toLowerCase())
    .sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return 0
    })

  const displayedFabrics = filteredFabrics.slice(0, itemsToShow)
  const hasMoreFabrics = itemsToShow < filteredFabrics.length

  const materials = ["Linen", "Cotton", "Silk", "Wool", "Bamboo", "Hemp", "Velvet"]
  const colors = [
    "Natural",
    "Black",
    "Ivory",
    "Grey",
    "White",
    "Rose",
    "Green",
    "Navy",
    "Sage",
    "Cream",
    "Blush",
    "Charcoal",
  ]

  return (
    <main className="bg-white">
      <SiteHeader />

      <section className="px-6 md:px-16 py-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-8">All Fabrics</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-neutral-100 px-6 py-3 rounded-full text-sm font-medium cursor-pointer pr-10"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              className="appearance-none bg-neutral-100 px-6 py-3 rounded-full text-sm font-medium cursor-pointer pr-10"
            >
              <option value="all">Material</option>
              {materials.map((material) => (
                <option key={material} value={material.toLowerCase()}>
                  {material}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="appearance-none bg-neutral-100 px-6 py-3 rounded-full text-sm font-medium cursor-pointer pr-10"
            >
              <option value="all">Color</option>
              {colors.map((color) => (
                <option key={color} value={color.toLowerCase()}>
                  {color}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedFabrics.map((fabric) => (
            <div key={fabric.id} className="group cursor-pointer">
              <div className="bg-neutral-100 rounded-lg overflow-hidden mb-4 h-64">
                <img
                  src={fabric.image || "/placeholder.svg"}
                  alt={fabric.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{fabric.name}</h3>
              <p className="text-neutral-600 text-sm">${fabric.price.toFixed(2)} / yard</p>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreFabrics && (
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setItemsToShow(itemsToShow + 4)}
              className="bg-neutral-200 hover:bg-neutral-300 transition px-8 py-3 rounded-full font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-6 md:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
          <p>© 2025 Textile Co. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="/faq" className="hover:text-neutral-900 transition">
              FAQs
            </Link>
            <Link href="/shipping-info" className="hover:text-neutral-900 transition">
              Shipping Info
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Home, Mic, Moon, Sun, Upload } from "lucide-react"
import { useState } from "react"

export default function Component() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="grid grid-cols-[240px_1fr] h-screen dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="border-r dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-yellow-400 text-xl">✦</span>
            <h1 className="font-semibold dark:text-white">Storytelling</h1>
          </div>

          <nav className="space-y-2">
            <div className="bg-yellow-400 text-black rounded-lg p-3 flex items-center gap-3">
              <Home className="w-5 h-5" />
              <span>Home Page</span>
            </div>
            
            <div className="dark:text-gray-400 p-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" />
              </svg>
              <span>Popular Video</span>
            </div>

            <div className="dark:text-gray-400 p-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" />
              </svg>
              <span>Trendy</span>
            </div>

            <div className="dark:text-gray-400 p-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg">
              <span className="text-xs text-red-500 px-1.5 py-0.5 bg-red-500/10 rounded">Live</span>
              <span>Live Show</span>
            </div>
          </nav>

          <div className="mt-8">
            <h2 className="text-sm font-semibold dark:text-white mb-4">Categories</h2>
            <div className="space-y-2">
              {['Today', 'Business Idea', 'Motivation', 'Life Story', 'Problem solve'].map((item) => (
                <div key={item} className="dark:text-gray-400 p-3 flex items-center gap-3 hover:bg-gray-800 rounded-lg">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-4 overflow-auto">
          <header className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-xl relative">
              <Input
                type="text"
                placeholder="Islamic..."
                className="pl-4 pr-12 py-2 w-full bg-gray-800 border-gray-700 rounded-full"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 dark:text-gray-400"
              >
                <Mic className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost">
                <Globe className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </Button>
            </div>
          </header>

          <div className="mb-8">
            <h2 className="text-lg font-semibold dark:text-white mb-4">Live Videos</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((item) => (
                <div key={item} className="relative rounded-lg overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=200&width=400`}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-semibold mb-2">Give More, Get More</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>36,567 views</span>
                      <span>2,614 likes</span>
                      <span>589 comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white">Popular Videos</h2>
              <Button variant="link" className="text-red-500">
                See More
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="rounded-lg overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=150&width=250`}
                    alt="Video thumbnail"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3 dark:bg-gray-800">
                    <h3 className="font-medium dark:text-white mb-2">Video Title</h3>
                    <div className="flex items-center gap-2 text-sm dark:text-gray-400">
                      <span>32,044 views</span>
                      <span>•</span>
                      <span>49,206 likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Sparkles, Type, Zap } from 'lucide-react'
import { ResponseStream } from '@/components/ui/response-stream'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'

export function ResponseStreamDemo() {
  const [speed, setSpeed] = useState([50])
  const [isPlaying, setIsPlaying] = useState(true)
  const [key, setKey] = useState(0)

  const typewriterText = `Welcome to ShopWhiz! I'm your AI-powered shopping assistant that can help you find the perfect products across all categories. Whether you're looking for the latest smartphones, trendy fashion, home essentials, or anything else - I've got you covered with real-time prices and reviews!`

  const fadeText = `This text demonstrates the elegant fade-in animation mode. Each word appears smoothly with a beautiful transition effect. You can customize the fade duration and segment delay to create the perfect visual experience for your users.`

  const handleReset = () => {
    setKey(prev => prev + 1)
    setIsPlaying(true)
  }

  const handleComplete = () => {
    setIsPlaying(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">ResponseStream Demo</h1>
        </div>
        <p className="text-muted-foreground">
          Experience smooth text streaming animations with typewriter and fade effects
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Animation Controls</h3>
          <div className="flex items-center gap-2">
            <Badge variant={isPlaying ? "default" : "secondary"}>
              {isPlaying ? "Playing" : "Paused"}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Speed</label>
              <span className="text-sm text-muted-foreground">{speed[0]}%</span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Demo Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="typewriter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="typewriter" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typewriter Mode
            </TabsTrigger>
            <TabsTrigger value="fade" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Fade Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="typewriter" className="mt-6">
            <div className="glass-card rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Typewriter Animation</h3>
                <Badge variant="outline">Character by character</Badge>
              </div>
              
              <div className="min-h-[120px] p-4 bg-muted/30 rounded-lg border border-border/50">
                <ResponseStream
                  key={`typewriter-${key}`}
                  textStream={typewriterText}
                  mode="typewriter"
                  speed={speed[0]}
                  className="text-sm leading-relaxed"
                  onComplete={handleComplete}
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Perfect for creating engaging chat interfaces and step-by-step reveals
              </p>
            </div>
          </TabsContent>

          <TabsContent value="fade" className="mt-6">
            <div className="glass-card rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Fade Animation</h3>
                <Badge variant="outline">Word by word</Badge>
              </div>
              
              <div className="min-h-[120px] p-4 bg-muted/30 rounded-lg border border-border/50">
                <ResponseStream
                  key={`fade-${key}`}
                  textStream={fadeText}
                  mode="fade"
                  speed={speed[0]}
                  className="text-sm leading-relaxed"
                  onComplete={handleComplete}
                  fadeDuration={800}
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Ideal for elegant content reveals and smooth reading experiences
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Usage Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-lg p-6 space-y-4"
      >
        <h3 className="font-semibold">Usage Examples</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-600">Chat Messages</h4>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <ResponseStream
                key={`chat-${key}`}
                textStream="I found 8 great products for you! Here are the best options..."
                mode="typewriter"
                speed={70}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-purple-600">Product Descriptions</h4>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <ResponseStream
                key={`product-${key}`}
                textStream="Premium quality smartphone with advanced camera features and long-lasting battery."
                mode="fade"
                speed={60}
                className="text-sm"
                fadeDuration={600}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Integration Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-lg p-6 space-y-4"
      >
        <h3 className="font-semibold">Integration Guide</h3>
        
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-muted/30 rounded-lg">
            <code className="text-xs">
              {`import { ResponseStream } from '@/components/ui/response-stream'`}
            </code>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage</h4>
              <div className="p-3 bg-muted/30 rounded-lg">
                <code className="text-xs whitespace-pre-wrap">
{`<ResponseStream
  textStream="Your text here"
  mode="typewriter"
  speed={50}
/>`}
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Advanced Options</h4>
              <div className="p-3 bg-muted/30 rounded-lg">
                <code className="text-xs whitespace-pre-wrap">
{`<ResponseStream
  textStream={asyncStream}
  mode="fade"
  fadeDuration={1000}
  onComplete={() => {}}
/>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
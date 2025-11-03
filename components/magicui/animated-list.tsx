'use client'
import { ReactNode, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface AnimatedListItem {
  id: string | number
  content: ReactNode
}

export default function AnimatedList({
  items,
  delay = 2000,
  className,
}: {
  items: AnimatedListItem[]
  delay?: number
  className?: string
}) {
  const [visibleItems, setVisibleItems] = useState<AnimatedListItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < items.length) {
        setVisibleItems((prev) => [items[currentIndex], ...prev])
        setCurrentIndex((prev) => prev + 1)
      } else {
        // Reset after showing all items
        setVisibleItems([])
        setCurrentIndex(0)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [currentIndex, items, delay])

  return (
    <div className={`flex flex-col gap-2 overflow-hidden ${className || ''}`}>
      <AnimatePresence>
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
          >
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

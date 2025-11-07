'use client'

import { cn } from '@/lib/utils'

interface Avatar {
  imageUrl: string
  profileUrl?: string
}

interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatarUrls: Avatar[]
}

export function AvatarCircles({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) {
  return (
    <div className={cn('z-10 flex -space-x-4', className)}>
      {avatarUrls.map((avatar, index) => (
        <a
          key={index}
          href={avatar.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block"
        >
          <img
            className="h-12 w-12 rounded-full border-2 border-white bg-white object-cover hover:scale-110 transition-transform"
            src={avatar.imageUrl}
            width={48}
            height={48}
            alt={`Avatar ${index + 1}`}
          />
        </a>
      ))}
      {numPeople && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:scale-110 transition-transform">
          +{numPeople}
        </div>
      )}
    </div>
  )
}









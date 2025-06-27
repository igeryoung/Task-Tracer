import React from 'react'

const features = [
  {
    icon: 'fas fa-tasks',
    bgColor: 'var(--clr-primary)',
    title: 'Organized Tasks',
    description: 'Categorize and prioritize effortlessly',
  },
  {
    icon: 'fas fa-chart-line',
    bgColor: 'var(--clr-secondary)',
    title: 'Progress Tracking',
    description: 'Visualize your accomplishments',
  },
  {
    icon: 'fas fa-user-friends',
    bgColor: 'purple-500',
    title: 'Team Collaboration',
    description: 'Work together seamlessly',
  },
]

export default function MainPageHighlight() {
  return (
    <div className="hidden md:block space-y-8 my-8">
      {features.map(({ icon, bgColor, title, description }) => (
        <div key={title} className="flex items-center space-x-4">
          <div
            className={`w-10 h-10 rounded-full bg-[${bgColor}] flex items-center justify-center`}
          >
            <i className={icon} />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-slate-400">{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Mail, Code2, Briefcase, Code, Award } from 'lucide-react'

export const SocialToggle = () => {
  const socials = [
    { icon: <Mail size={20} />, link: 'mailto:ansarisajidofficial@gmail.com', name: 'Email' },
    { icon: <Briefcase size={20} />, link: 'https://www.linkedin.com/in/sajidzaroon/', name: 'LinkedIn' },
    { icon: <Code2 size={20} />, link: 'https://github.com/sajid-da', name: 'GitHub' },
    { icon: <Code size={20} />, link: 'https://leetcode.com/u/W4CqDZs5hX/', name: 'LeetCode' },
    { icon: <Award size={20} />, link: 'https://www.credly.com/users/sajid-ansari.00958aa0', name: 'Credly' },
  ]

  return (
    <div className="fixed left-6 bottom-0 z-50 hidden xl:flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
      <div className="flex flex-col gap-4">
        {socials.map((social, idx) => (
          <a
            key={idx}
            href={social.link}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-primary hover:border-primary/50 transition-all hover:scale-110 shadow-lg relative group"
            aria-label={social.name}
          >
            {social.icon}
            <span className="absolute left-14 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              {social.name}
            </span>
          </a>
        ))}
      </div>
      <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent"></div>
    </div>
  )
}

import { InteractiveTerminal } from '../terminal/InteractiveTerminal'

export const HeroScene = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center z-10 px-6 pt-20" id="hero">
      <div className="w-full max-w-5xl">
        <InteractiveTerminal />
      </div>
    </div>
  )
}

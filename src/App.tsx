import { AnimatePresence } from 'framer-motion'
import { MainLayout } from './components/layout/MainLayout'
import { useStore } from './store/useStore'
import { ResumeCenter } from './components/resume/ResumeCenter'
import { FeaturedSystems } from './components/projects/FeaturedSystems'
import { ProjectArchive } from './components/projects/ProjectArchive'

import { MissionControl } from './components/about/MissionControl'
import { LeadershipProtocol } from './components/about/LeadershipProtocol'
import { AboutCore } from './components/about/AboutCore'
import { ExperienceTimeline } from './components/about/ExperienceTimeline'

import { AchievementsVault } from './components/achievements/AchievementsVault'
import { CertificationHall } from './components/achievements/CertificationHall'

import { HeroScene } from './components/3d/HeroScene'
import { SkillsGalaxy } from './components/3d/SkillsGalaxy'
import { ContactCore } from './components/3d/ContactCore'
import { NeuralFace } from './components/3d/NeuralFace'
import { EnvironmentCanvas } from './components/layout/EnvironmentCanvas'
import { BootSequence } from './components/layout/BootSequence'
import { SceneProvider, useScene } from './components/layout/SceneManager'
import { SceneContainer } from './components/layout/SceneContainer'

const SCENES = [
  <BootSequence key="boot" onComplete={() => {}} />,
  <HeroScene key="hero" />,
  <MissionControl key="mission" />,
  <LeadershipProtocol key="leadership" />,
  <AboutCore key="about" />,
  <SkillsGalaxy key="skills" />,
  <FeaturedSystems key="featured" />,
  <ProjectArchive key="archive" />,
  <ExperienceTimeline key="experience" />,
  <AchievementsVault key="achievements" />,
  <CertificationHall key="certifications" />,
  <ResumeCenter key="resume" />,
  <ContactCore key="contact" />
];

const CinematicApp = () => {
  const { currentScene, nextScene } = useScene();
  
  // Clone the boot sequence to inject nextScene dynamically if it's the current scene
  const activeScene = currentScene === 0 
    ? <BootSequence onComplete={nextScene} />
    : SCENES[currentScene];

  return (
    <div className="fixed inset-0 overflow-hidden bg-transparent">
      <AnimatePresence mode="wait" custom={1}>
        <SceneContainer key={currentScene} index={currentScene}>
          {activeScene}
        </SceneContainer>
      </AnimatePresence>
    </div>
  );
};

function App() {
  const { isRecruiterMode } = useStore()

  return (
    <MainLayout>
      {/* Subtle Background Gradients */}
      {!isRecruiterMode && (
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-bg to-bg pointer-events-none z-[-1]"></div>
      )}
      {!isRecruiterMode && <NeuralFace />}
      {!isRecruiterMode && (
        <SceneProvider totalScenes={SCENES.length}>
          <EnvironmentCanvas />
          <CinematicApp />
        </SceneProvider>
      )}
      {isRecruiterMode && (
        <div className="max-w-4xl mx-auto px-6 py-16 overflow-y-auto h-screen">
          <header className="mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Sajid Ansari</h1>
            <p className="text-xl text-gray-600 mb-6 font-medium">Designing intelligent systems that bridge machine learning and real-world impact.</p>
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-2 text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                Open to opportunities
              </span>
              <span className="text-sm text-gray-500 font-medium">📍 Bengaluru, India</span>
            </div>
          </header>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-6">Featured Systems</h2>
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-2">ConnectAid AI</h3>
                <p className="text-gray-600 mb-4">Emergency response command center featuring real-time routing and voice analysis.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded font-mono">React</span>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded font-mono">Node.js</span>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded font-mono">Gemini API</span>
                </div>
              </div>
            </div>
          </section>
          
          <ResumeCenter />
        </div>
      )}
    </MainLayout>
  )
}

export default App

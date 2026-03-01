"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [glitchText, setGlitchText] = useState("SYSTEM ONLINE");

  useEffect(() => {
    setMounted(true);

    const texts = ["SYSTEM ONLINE", "ACCESS GRANTED", "WELCOME USER"];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setGlitchText(texts[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const skills = [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "Rust", level: 75 },
  ];

  const projects = [
    { id: "PRJ-001", name: "Neural Network Visualizer", status: "COMPLETED" },
    { id: "PRJ-002", name: "Quantum Data Processor", status: "IN PROGRESS" },
    { id: "PRJ-003", name: "Cyber Security Protocol", status: "ACTIVE" },
  ];

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden">
      {/* 背景网格 */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* 扫描线效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 animate-scan"
          style={{
            background:
              "linear-gradient(transparent 50%, rgba(0, 255, 255, 0.03) 50%)",
            backgroundSize: "100% 4px",
          }}
        />
      </div>

      {/* 主内容 */}
      <main className="relative z-10 min-h-screen p-4 md:p-8">
        {/* 顶部状态栏 */}
        <header className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs tracking-widest text-cyan-600">
              ID: USER-7749
            </span>
          </div>
          <div className="text-xs tracking-widest text-cyan-600">
            {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：个人信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 头像区域 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <div className="relative p-6 bg-black border border-cyan-500/50 rounded-lg">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-gradient-to-br from-cyan-900/50 to-purple-900/50">
                  <span className="text-4xl">👤</span>
                </div>
                <h2 className="text-center text-xl font-bold mb-2 text-white">
                  [ YOUR NAME ]
                </h2>
                <p className="text-center text-cyan-600 text-sm">
                  Full Stack Developer
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="px-3 py-1 text-xs border border-green-500/50 text-green-400 rounded">
                    ● AVAILABLE FOR HIRE
                  </span>
                </div>
              </div>
            </div>

            {/* 联系信息 */}
            <div className="border border-cyan-500/30 rounded-lg p-4 bg-black/50">
              <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2">
                &gt; CONTACT_INFO
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-600">@</span>
                  <span>your.email@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-600">#</span>
                  <span>github.com/yourusername</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-600">in</span>
                  <span>linkedin.com/in/yourprofile</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中间：主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 系统状态 */}
            <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 bg-cyan-500 animate-ping" />
                <h1 className="text-2xl font-bold text-white tracking-wider">
                  {mounted && (
                    <span className="inline-block animate-glitch">
                      {glitchText}
                    </span>
                  )}
                </h1>
              </div>
              <p className="text-cyan-300/80 leading-relaxed">
                &gt; Initializing personal data stream...
                <br />
                &gt; Loading profile modules...
                <br />
                &gt; Connection established. Welcome to my digital space.
              </p>
            </div>

            {/* 技能条 */}
            <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/50">
              <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2">
                &gt; SKILL_MATRIX
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-300">{skill.name}</span>
                      <span className="text-cyan-600">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: mounted ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 200}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 项目列表 */}
            <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/50">
              <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2">
                &gt; ACTIVE_PROJECTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-cyan-500/20 rounded p-4 hover:border-cyan-500/50 transition-colors group cursor-pointer"
                  >
                    <div className="text-xs text-cyan-600 mb-2">
                      {project.id}
                    </div>
                    <div className="text-sm font-medium text-cyan-300 mb-2 group-hover:text-white transition-colors">
                      {project.name}
                    </div>
                    <div
                      className={`text-xs ${
                        project.status === "COMPLETED"
                          ? "text-green-400"
                          : project.status === "IN PROGRESS"
                          ? "text-yellow-400"
                          : "text-cyan-400"
                      }`}
                    >
                      [{project.status}]
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 终端输出 */}
            <div className="border border-green-500/30 rounded-lg p-4 bg-black/80 font-mono text-sm">
              <div className="text-green-500 mb-2">$ ./init_profile.sh</div>
              <div className="text-cyan-400 space-y-1">
                <div>&gt; Loading core modules... [OK]</div>
                <div>&gt; Establishing secure connection... [OK]</div>
                <div>&gt; Rendering interface... [OK]</div>
                <div className="animate-pulse">&gt; _</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <footer className="mt-12 pt-6 border-t border-cyan-500/20">
          <div className="flex justify-between items-center text-xs text-cyan-700">
            <span>SYSTEM VERSION 2.0.77</span>
            <span>ENCRYPTION: ENABLED</span>
            <span>LATENCY: 12ms</span>
          </div>
        </footer>
      </main>

      {/* CSS 动画 */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes glitch {
          0%,
          100% {
            text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
          }
          25% {
            text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
          }
          50% {
            text-shadow: 2px 0 #00ffff, -2px 0 #ff00ff;
          }
          75% {
            text-shadow: -2px 0 #00ffff, 2px 0 #ff00ff;
          }
        }

        .animate-scan {
          animation: scan 4s linear infinite;
        }

        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

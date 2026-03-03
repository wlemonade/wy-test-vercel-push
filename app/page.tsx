"use client";

import { useEffect, useState, useRef, useCallback } from "react";

// 粒子背景组件
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 初始化粒子
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // 每2帧渲染一次，提高性能
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;

        // 更新和绘制粒子
        particles.forEach((particle, i) => {
          // 鼠标排斥效果
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            particle.vx -= (dx / dist) * force * 0.5;
            particle.vy -= (dy / dist) * force * 0.5;
          }

          // 更新位置
          particle.x += particle.vx;
          particle.y += particle.vy;

          // 边界反弹
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // 速度衰减
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // 绘制粒子
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 255, ${particle.alpha})`;
          ctx.fill();

          // 绘制连线
          if (i % 3 === 0) {
            particles.slice(i + 1).forEach((other, j) => {
              if (j % 3 !== 0) return;
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - distance / 120)})`;
                ctx.stroke();
              }
            });
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// 打字机效果组件
function TypewriterText({ text, delay = 50, className = "" }: { text: string; delay?: number; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [text, delay]);

  return (
    <span className={className}>
      {displayText}
      <span
        className={`inline-block w-2 h-5 bg-cyan-400 ml-1 transition-opacity duration-100 ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

// 3D卡片组件
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
    setGlowPosition({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(0, 255, 255, 0.15) 0%, transparent 50%)`,
        }}
      />
      {children}
    </div>
  );
}

// 霓虹灯文字组件
function NeonText({ children, color = "cyan" }: { children: React.ReactNode; color?: "cyan" | "purple" | "pink" | "green" }) {
  const colorMap = {
    cyan: "text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]",
    purple: "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
    pink: "text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]",
    green: "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]",
  };

  return (
    <span className={`${colorMap[color]} animate-pulse-slow`}>
      {children}
    </span>
  );
}

// 浮动动画组件
function FloatingElement({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// 技能条组件
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [width, setWidth] = useState(0);
  const [showShine, setShowShine] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setWidth(level);
            setTimeout(() => setShowShine(true), 1000);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div ref={barRef} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-cyan-300">{name}</span>
        <span className="text-cyan-600 font-mono">{level}%</span>
      </div>
      <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/20 relative">
        <div
          className="h-full rounded-full relative overflow-hidden transition-all duration-1500 ease-out"
          style={{
            width: `${width}%`,
            background: "linear-gradient(90deg, #06b6d4, #a855f7, #06b6d4)",
            backgroundSize: "200% 100%",
            animation: width > 0 ? "gradient-shift 2s linear infinite" : "none",
          }}
        >
          {showShine && (
            <div
              className="absolute inset-0 animate-shine"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 数字计数动画组件
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(easeOut * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-mono text-2xl font-bold text-cyan-400">
      {displayValue}{suffix}
    </span>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [glitchText, setGlitchText] = useState("SYSTEM ONLINE");
  const [scanPosition, setScanPosition] = useState(0);

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

  // 扫描线动画
  useEffect(() => {
    let position = 0;
    const interval = setInterval(() => {
      position = (position + 1) % 100;
      setScanPosition(position);
    }, 50);
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
    { id: "PRJ-001", name: "Neural Network Visualizer", status: "COMPLETED", progress: 100 },
    { id: "PRJ-002", name: "Quantum Data Processor", status: "IN PROGRESS", progress: 65 },
    { id: "PRJ-003", name: "Cyber Security Protocol", status: "ACTIVE", progress: 82 },
  ];

  const stats = [
    { label: "Projects", value: 47 },
    { label: "Commits", value: 2847 },
    { label: "Experience", value: 5, suffix: "Y+" },
  ];

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden relative">
      {/* 粒子背景 */}
      <ParticleBackground />

      {/* 背景网格 */}
      <div className="fixed inset-0 opacity-20" style={{ zIndex: 0 }}>
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
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div
          className="absolute left-0 right-0 h-px bg-cyan-400/30"
          style={{
            top: `${scanPosition}%`,
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
            transition: "top 0.05s linear",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(transparent ${scanPosition}%, rgba(0, 255, 255, 0.03) ${scanPosition}%, transparent ${scanPosition + 5}%)`,
          }}
        />
      </div>

      {/* 主内容 */}
      <main className="relative z-10 min-h-screen p-4 md:p-8">
        {/* 顶部状态栏 */}
        <FloatingElement>
          <header className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4 backdrop-blur-sm bg-black/20 rounded-lg px-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-xs tracking-widest text-cyan-600">
                ID: USER-7749
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xs text-cyan-600">{stat.label}</div>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                ))}
              </div>
              <div className="text-xs tracking-widest text-cyan-600 border-l border-cyan-500/30 pl-4">
                {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
              </div>
            </div>
          </header>
        </FloatingElement>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：个人信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 头像区域 */}
            <FloatingElement delay={0.1}>
              <Card3D>
                <div className="relative p-6 bg-black/80 border border-cyan-500/50 rounded-lg backdrop-blur-sm overflow-hidden group">
                  {/* 边框发光效果 */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.2), transparent)",
                      animation: "border-glow 2s linear infinite",
                    }}
                  />
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-gradient-to-br from-cyan-900/50 to-purple-900/50 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      <span className="text-4xl animate-bounce-slow">👤</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h2 className="text-center text-xl font-bold mb-2">
                      <NeonText color="cyan">[ YOUR NAME ]</NeonText>
                    </h2>
                    <p className="text-center text-cyan-600 text-sm">
                      Full Stack Developer
                    </p>
                    <div className="mt-4 flex justify-center">
                      <span className="px-3 py-1 text-xs border border-green-500/50 text-green-400 rounded animate-pulse-glow">
                        ● AVAILABLE FOR HIRE
                      </span>
                    </div>
                  </div>
                </div>
              </Card3D>
            </FloatingElement>

            {/* 联系信息 */}
            <FloatingElement delay={0.2}>
              <Card3D>
                <div className="border border-cyan-500/30 rounded-lg p-4 bg-black/80 backdrop-blur-sm hover:border-cyan-500/60 transition-colors duration-300">
                  <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2 flex items-center gap-2">
                    <span className="animate-pulse">&gt;</span> CONTACT_INFO
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: "@", text: "your.email@example.com", color: "text-cyan-400" },
                      { icon: "#", text: "github.com/yourusername", color: "text-purple-400" },
                      { icon: "in", text: "linkedin.com/in/yourprofile", color: "text-pink-400" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <span className={`${item.color} font-bold group-hover:scale-125 transition-transform`}>{item.icon}</span>
                        <span className="group-hover:text-white transition-colors relative">
                          {item.text}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card3D>
            </FloatingElement>

            {/* 快速链接 */}
            <FloatingElement delay={0.3}>
              <div className="border border-cyan-500/30 rounded-lg p-4 bg-black/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2">
                  &gt; QUICK_LINKS
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Blog", "Resume", "Projects", "Contact"].map((link, i) => (
                    <button
                      key={link}
                      className="px-3 py-2 text-xs border border-cyan-500/30 rounded hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </FloatingElement>
          </div>

          {/* 中间：主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 系统状态 */}
            <FloatingElement delay={0.2}>
              <Card3D>
                <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/80 backdrop-blur-sm relative overflow-hidden">
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-2 h-2 bg-cyan-500 animate-ping" />
                      <h1 className="text-2xl font-bold tracking-wider">
                        {mounted && (
                          <span className="inline-block animate-glitch-text">
                            {glitchText}
                          </span>
                        )}
                      </h1>
                    </div>
                    <div className="text-cyan-300/80 leading-relaxed space-y-2">
                      <TypewriterText
                        text="> Initializing personal data stream..."
                        delay={30}
                        className="block"
                      />
                      <TypewriterText
                        text="> Loading profile modules..."
                        delay={30}
                        className="block"
                      />
                      <TypewriterText
                        text="> Connection established. Welcome to my digital space."
                        delay={30}
                        className="block"
                      />
                    </div>
                  </div>
                </div>
              </Card3D>
            </FloatingElement>

            {/* 技能条 */}
            <FloatingElement delay={0.3}>
              <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  SKILL_MATRIX
                </h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={index * 200}
                    />
                  ))}
                </div>
              </div>
            </FloatingElement>

            {/* 项目列表 */}
            <FloatingElement delay={0.4}>
              <div className="border border-cyan-500/30 rounded-lg p-6 bg-black/80 backdrop-blur-sm">
                <h3 className="text-sm font-bold mb-4 text-purple-400 border-b border-purple-500/30 pb-2 flex items-center gap-2">
                  <span className="animate-spin-slow">◈</span> ACTIVE_PROJECTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projects.map((project, i) => (
                    <Card3D key={project.id}>
                      <div
                        className="border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer bg-black/40 relative overflow-hidden"
                      >
                        {/* 进度条背景 */}
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                          style={{ width: `${project.progress}%` }}
                        />
                        <div className="text-xs text-cyan-600 mb-2 font-mono">
                          {project.id}
                        </div>
                        <div className="text-sm font-medium text-cyan-300 mb-2 group-hover:text-white transition-colors">
                          {project.name}
                        </div>
                        <div
                          className={`text-xs font-mono ${
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
                    </Card3D>
                  ))}
                </div>
              </div>
            </FloatingElement>

            {/* 终端输出 */}
            <FloatingElement delay={0.5}>
              <div className="border border-green-500/30 rounded-lg p-4 bg-black/90 backdrop-blur-sm font-mono text-sm relative overflow-hidden">
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <div className="text-green-500 mb-2 flex items-center gap-2">
                  <span className="animate-pulse">$</span>
                  <TypewriterText text="./init_profile.sh" delay={40} />
                </div>
                <div className="text-cyan-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <TypewriterText text="Loading core modules... [OK]" delay={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <TypewriterText text="Establishing secure connection... [OK]" delay={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <TypewriterText text="Rendering interface... [OK]" delay={20} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-cyan-500">&gt;</span>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </div>
        </div>

        {/* 底部装饰 */}
        <FloatingElement delay={0.6}>
          <footer className="mt-12 pt-6 border-t border-cyan-500/20">
            <div className="flex justify-between items-center text-xs text-cyan-700">
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">SYSTEM VERSION 2.0.77</span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                ENCRYPTION: ENABLED
              </span>
              <span className="font-mono">LATENCY: 12ms</span>
            </div>
          </footer>
        </FloatingElement>
      </main>

      {/* CSS 动画 */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes glitch-text {
          0%, 100% {
            text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
            transform: translate(0);
          }
          20% {
            text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff;
            transform: translate(-2px, 2px);
          }
          40% {
            text-shadow: 2px 0 #00ffff, -2px 0 #ff00ff;
            transform: translate(2px, -2px);
          }
          60% {
            text-shadow: -2px 0 #00ffff, 2px 0 #ff00ff;
            transform: translate(-1px, 1px);
          }
          80% {
            text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
            transform: translate(1px, -1px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.8), 0 0 40px rgba(74, 222, 128, 0.4);
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes border-glow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-scan {
          animation: scan 4s linear infinite;
        }

        .animate-glitch-text {
          animation: glitch-text 0.3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

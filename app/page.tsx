'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Server, Shield, Cloud, Headphones, BarChart, Code, ArrowRight, Clock, Briefcase, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(href, { offset: -80 });
    }
    setIsMenuOpen(false);
  };

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  // Custom Cursor
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.06;
      ringY += (mouseY - ringY) * 0.06;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        document.body.classList.add('cursor-hover');
      }
      if (target.tagName.toLowerCase() === 'canvas') {
        document.body.classList.add('cursor-canvas-hover');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        document.body.classList.remove('cursor-hover');
      }
      if (target.tagName.toLowerCase() === 'canvas') {
        document.body.classList.remove('cursor-canvas-hover');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Three.js & Lenis & GSAP
  useEffect(() => {
    if (!canvasRef.current) return;

    // SCROLL SMOOTHING
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // THREE.JS SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // OBJECT
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

    const innerWireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const innerWireframeMesh = new THREE.Mesh(geometry, innerWireframeMaterial);
    innerWireframeMesh.scale.set(0.55, 0.55, 0.55);

    const solidMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
    });
    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    solidMesh.scale.set(0.98, 0.98, 0.98);

    const group = new THREE.Group();
    group.add(wireframeMesh);
    group.add(innerWireframeMesh);
    group.add(solidMesh);
    group.position.x = -2.5; // Move to the left 45%
    scene.add(group);

    // PARTICLES
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 180;
    const posArray = new Float32Array(particlesCount * 3);
    const velocityArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      const r = 3.5 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      if (i % 3 === 0) {
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);

        velocityArray[i] = posArray[i] * 0.0005;
        velocityArray[i + 1] = posArray[i + 1] * 0.0005;
        velocityArray[i + 2] = posArray[i + 2] * 0.0005;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));

    const canvas2d = document.createElement('canvas');
    canvas2d.width = 32;
    canvas2d.height = 32;
    const context = canvas2d.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(16, 16, 16, 0, 2 * Math.PI);
      context.fillStyle = 'white';
      context.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas2d);

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.018,
      transparent: true,
      opacity: 0.5,
      map: particleTexture,
      alphaTest: 0.5,
      sizeAttenuation: true
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Breathing animation
      const baseScale = window.innerWidth < 768 ? 0.6 : 1.0;
      const scale = baseScale + Math.sin(elapsedTime * 0.8) * 0.06;
      group.scale.set(scale, scale, scale);
      group.rotation.y += 0.003;

      innerWireframeMesh.rotation.y -= 0.005;
      innerWireframeMesh.rotation.x -= 0.002;

      // Particles rotation
      particlesMesh.rotation.y = -elapsedTime * 0.05;

      const positions = particlesGeometry.attributes.position.array as Float32Array;
      const velocities = particlesGeometry.attributes.velocity.array as Float32Array;
      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        const distSq = positions[i]*positions[i] + positions[i+1]*positions[i+1] + positions[i+2]*positions[i+2];
        if (distSq > 25) {
          positions[i] *= 0.1;
          positions[i + 1] *= 0.1;
          positions[i + 2] *= 0.1;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Mouse parallax
      targetX = mouseX * 0.15;
      targetY = mouseY * 0.3;
      group.rotation.z += (targetX - group.rotation.z) * 0.04;
      group.rotation.x += (targetY - group.rotation.x) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // RESIZE
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (window.innerWidth < 768) {
        group.position.x = 0;
        group.position.y = 1.8;
      } else {
        group.position.x = -2.5;
        group.position.y = 0;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // --- GSAP ANIMATIONS ---

    // Navbar compress
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: { className: "py-2", targets: navbarRef.current },
      onEnter: () => gsap.to(navbarRef.current, { paddingBottom: "8px", paddingTop: "8px", duration: 0.3 }),
      onLeaveBack: () => gsap.to(navbarRef.current, { paddingBottom: "12px", paddingTop: "12px", duration: 0.3 })
    });

    // Hero Entrance
    const entranceTl = gsap.timeline({ delay: 0.2 });
    
    // Canvas starts hidden
    gsap.set(canvasRef.current, { opacity: 0 });
    entranceTl.to(canvasRef.current, { opacity: 1, duration: 2, ease: "power2.inOut" }, 0);

    if (heroContentRef.current && h1Ref.current) {
      const badge = heroContentRef.current.querySelector('.hero-badge');
      const h1Spans = h1Ref.current.querySelectorAll('span');
      const rule = heroContentRef.current.querySelector('.hero-rule');
      const desc = heroContentRef.current.querySelector('.hero-desc');
      const btns = heroContentRef.current.querySelector('.hero-btns');
      const stats = heroContentRef.current.querySelector('.hero-stats');

      entranceTl.fromTo(badge, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4)
        .fromTo(h1Spans, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.6)
        .fromTo(rule, { opacity: 0, width: 0 }, { opacity: 1, width: 48, duration: 0.8, ease: "power3.out" }, 0.8)
        .fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.0)
        .fromTo(btns, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.2)
        .fromTo(stats, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.4);
    }

    // Hero Stats Count-up
    if (heroRef.current) {
      const statNumbers = heroRef.current.querySelectorAll('.hero-stat-number');
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || "0");
        const suffix = stat.getAttribute('data-suffix') || "";
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          delay: 0.8,
          ease: "power3.out",
          onUpdate: function() {
            stat.innerHTML = Math.floor(this.targets()[0].val) + suffix;
          }
        });
      });
    }

    // Hero Scroll Parallax
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    const scrollIndicator = document.querySelector('.scroll-indicator');
    const glowHalos = document.querySelectorAll('.glow-halo');

    heroTl.to(group.position, { x: () => window.innerWidth < 768 ? 0 : -4.5 }, 0)
      .to(group.scale, { x: 0.55, y: 0.55, z: 0.55 }, 0)
      .to(canvasRef.current, { opacity: 0.4 }, 0)
      .to(particlesMaterial, { opacity: 0 }, 0)
      .to(scrollIndicator, { opacity: 0, duration: 0.1 }, 0)
      .to(glowHalos, { opacity: 0, x: "-=100px" }, 0);

    // Services Section
    if (servicesRef.current) {
      const cards = servicesRef.current.querySelectorAll('.service-card');
      const title = servicesRef.current.querySelector('.section-title');
      
      gsap.from(title, {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out"
      });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: batch => gsap.fromTo(batch, 
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out" }
        )
      });
    }

    // Why Us Section
    if (whyUsRef.current) {
      const points = whyUsRef.current.querySelectorAll('.why-point');
      const bars = whyUsRef.current.querySelectorAll('.metric-fill');
      const counts = whyUsRef.current.querySelectorAll('.metric-count');

      gsap.from(points, {
        scrollTrigger: {
          trigger: whyUsRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -40,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out"
      });

      bars.forEach((bar, i) => {
        const targetWidth = bar.getAttribute('data-width') || "0%";
        const countEl = counts[i];
        const targetCount = parseInt(countEl.getAttribute('data-count') || "0");

        gsap.to(bar, {
          scrollTrigger: {
            trigger: whyUsRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          width: targetWidth,
          duration: 1.2,
          delay: i * 0.2,
          ease: "power3.out"
        });

        gsap.to({ val: 0 }, {
          scrollTrigger: {
            trigger: whyUsRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          val: targetCount,
          duration: 1.2,
          delay: i * 0.2,
          ease: "power3.out",
          onUpdate: function() {
            if (countEl) countEl.innerHTML = Math.floor(this.targets()[0].val) + "%";
          }
        });
      });
    }

    // Process Section
    if (processRef.current) {
      const steps = processRef.current.querySelectorAll('.process-step');

      steps.forEach((step, i) => {
        // Entrance animation
        gsap.fromTo(step, 
          { opacity: 0, x: 50 },
          {
            scrollTrigger: {
              trigger: step,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: false
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out"
          }
        );

        // Active state
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          toggleClass: { targets: step, className: "active-process-card" }
        });
      });
    }

    // Testimonial Section
    if (testimonialRef.current) {
      const card = testimonialRef.current.querySelector('.testimonial-card');
      gsap.fromTo(card, 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }

    // CTA Section
    if (ctaRef.current) {
      const burst = ctaRef.current.querySelector('.burst-container');
      gsap.fromTo(burst, 
        { scale: 0, opacity: 1 },
        {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          scale: 3,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out"
        }
      );
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      renderer.dispose();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // CTA Button Magnetic Effect
  useEffect(() => {
    const btn = ctaButtonRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <main className="relative w-full overflow-hidden selection:bg-white/20">
      {/* Cursor */}
      <div ref={cursorDotRef} className="cursor-dot hidden md:block" />
      <div ref={cursorRingRef} className="cursor-ring hidden md:block" />

      {/* Three.js Canvas & Glow */}
      <div className="fixed inset-0 z-[-1] pointer-events-none flex items-center">
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />

      {/* Navbar */}
      <nav ref={navbarRef} className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-[24px] border-b border-white/5 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="font-space font-bold text-xl tracking-tight relative z-[60] flex items-center">
            <span className="w-[2px] h-[2px] bg-white inline-block mr-2"></span>
            TechnoFixer
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-white/50 font-inter">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative group hover:text-white transition-colors"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <button 
            onClick={(e) => handleNavClick(e as any, '#contact')}
            className="hidden md:block bg-transparent border border-white/20 hover:bg-white hover:text-black text-white px-[20px] py-[7px] rounded-[6px] font-inter font-[400] text-[13px] transition-colors duration-200 ease-in-out"
          >
            Get Quote
          </button>
          <button 
            className="md:hidden relative z-[60] text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-black transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden flex flex-col items-center justify-center`}>
        <div className="flex flex-col gap-8 text-center">
          {navItems.map((item, i) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="font-space text-4xl font-bold text-white hover:text-white/70 transition-colors"
              onClick={(e) => handleNavClick(e, item.href)}
              style={{ transitionDelay: `${isMenuOpen ? i * 100 : 0}ms` }}
            >
              {item.name}
            </a>
          ))}
          <button 
            onClick={(e) => handleNavClick(e as any, '#contact')}
            className="mt-8 bg-[#FFFFFF] hover:bg-[#E0E0E0] text-[#000000] px-[32px] py-[16px] rounded-[6px] font-space font-[600] text-[18px] transition-colors duration-200 ease-in-out"
          >
            Get Quote
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative w-full min-h-screen flex items-center pt-12">
        {/* Glow Halo */}
        <div className="glow-halo absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_40%,transparent_70%)] pointer-events-none z-0" />
        <div className="glow-halo absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_60%)] pointer-events-none z-0 animate-pulse-ring" />
        
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center relative z-10">
          <div ref={heroContentRef} className="w-full md:w-[55%] ml-auto flex flex-col items-start justify-center will-change-transform">
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 mb-4 opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-[12px] text-white/60 font-inter">Trusted IT Partner Since 2018</span>
            </div>
            
            <h1 ref={h1Ref} className="font-space text-[clamp(2rem,5vw,4rem)] font-[800] leading-[0.95] tracking-[-2px] mb-4">
              <span className="block opacity-0">We Fix.</span>
              <span className="block opacity-0">We Build.</span>
              <span className="block opacity-0">We Protect.</span>
            </h1>
            
            <div className="w-12 h-[1px] bg-white/20 my-4 opacity-0 hero-rule"></div>

            <p className="hero-desc text-white/50 text-[16px] max-w-[420px] leading-[1.6] font-[300] font-inter opacity-0">
              Professional IT Solutions for businesses that can&apos;t afford to slow down.
            </p>
            
            <div className="hero-btns flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto opacity-0">
              <button className="bg-[#FFFFFF] hover:bg-[#E0E0E0] text-[#000000] px-[26px] py-[13px] rounded-[6px] font-space font-[600] text-[14px] transition-colors duration-200 ease-in-out flex items-center justify-center gap-2 w-full sm:w-auto">
                Our Services <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-transparent border border-white/40 hover:border-white text-[rgba(255,255,255,0.9)] px-[26px] py-[13px] rounded-[6px] font-space font-[400] text-[14px] transition-colors duration-200 ease-in-out w-full sm:w-auto">
                Free Consultation
              </button>
            </div>
            
            <div className="hero-stats flex gap-8 md:gap-12 border-t border-white/10 pt-8 mt-10 w-full max-w-[480px] opacity-0 pb-8">
              <div>
                <div className="font-space text-[32px] md:text-[36px] font-bold text-white mb-1 hero-stat-number" data-target="200" data-suffix="+">0+</div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-white/40 font-inter">Projects</div>
              </div>
              <div>
                <div className="font-space text-[32px] md:text-[36px] font-bold text-white mb-1 hero-stat-number" data-target="98" data-suffix="%">0%</div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-white/40 font-inter">Satisfaction</div>
              </div>
              <div>
                <div className="font-space text-[32px] md:text-[36px] font-bold text-white mb-1 hero-stat-number" data-target="24" data-suffix="/7">0/7</div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[1.5px] text-white/40 font-inter">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
          <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
            <div className="w-1 h-1 bg-white rounded-full absolute left-1/2 -translate-x-1/2 animate-scroll-dot"></div>
          </div>
          <span className="font-inter text-[10px] uppercase tracking-[2px] text-white/30">scroll</span>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-32 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-title mb-20 text-center md:text-left">
            <div className="text-xs uppercase tracking-[1.5px] text-white font-medium mb-4 font-inter">Our Expertise</div>
            <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tight">Comprehensive IT Solutions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Server, title: "IT Infrastructure", desc: "Server setup, network design, full lifecycle management" },
              { icon: Shield, title: "Cybersecurity", desc: "Pen testing, firewall config, endpoint protection" },
              { icon: Cloud, title: "Cloud Solutions", desc: "AWS/Azure/GCP migration and management" },
              { icon: Headphones, title: "Managed Support", desc: "24/7 helpdesk and proactive monitoring" },
              { icon: BarChart, title: "Data & Analytics", desc: "BI dashboards, reporting pipelines" },
              { icon: Code, title: "Custom Development", desc: "APIs, tools, workflow automations" }
            ].map((service, i) => (
              <div key={i} className="service-card group bg-[#050505] border border-white/5 p-8 transition-all duration-500 will-change-transform hover:-translate-y-2 hover:bg-[#0A0A0A] hover:border-white/20 relative overflow-hidden">
                {/* Top border accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white/0 group-hover:bg-white/100 transition-colors duration-500 shadow-[0_0_15px_rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100"></div>
                
                {/* Subtle number */}
                <div className="absolute top-6 right-8 font-space text-lg font-bold text-white/10 group-hover:text-white/30 transition-colors duration-500">
                  0{i + 1}
                </div>

                <div className="w-[48px] h-[48px] rounded-[12px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-8 group-hover:border-white/30 transition-colors duration-500">
                  <service.icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-space text-xl font-bold mb-4 text-white/90 group-hover:text-white transition-colors duration-500">{service.title}</h3>
                <p className="text-white/40 leading-relaxed mb-8 font-inter group-hover:text-white/60 transition-colors duration-500">{service.desc}</p>
                <div className="text-white/60 font-medium flex items-center gap-2 group-hover:gap-4 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] font-space mt-auto">
                  Learn more <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="about" ref={whyUsRef} className="py-32 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-xs uppercase tracking-[1.5px] text-white font-medium mb-4 font-inter">Why Choose Us</div>
            <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tight mb-12">Built for Performance & Security</h2>
            
            <div className="space-y-8">
              {[
                { icon: Clock, title: "Rapid Response", desc: "Under 15 min for critical issues" },
                { icon: Briefcase, title: "Industry Expertise", desc: "6+ years, fintech to healthcare" },
                { icon: Shield, title: "Security First", desc: "Security baked in from day one" }
              ].map((point, i) => (
                <div key={i} className="why-point flex gap-6">
                  <div className="w-[40px] h-[40px] rounded-[8px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] flex items-center justify-center shrink-0">
                    <point.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-space text-xl font-bold mb-2">{point.title}</h3>
                    <p className="text-white/45 font-inter">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="space-y-8 mb-12">
              {[
                { label: "Uptime", target: 99 },
                { label: "Satisfaction", target: 98 },
                { label: "On-time", target: 95 },
                { label: "Resolved", target: 92 }
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 font-inter">
                    <span className="font-medium">{metric.label}</span>
                    <span className="metric-count font-space font-bold text-white" data-count={metric.target}>0%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="metric-fill h-full bg-white w-0 rounded-full" data-width={`${metric.target}%`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <div className="text-xs uppercase tracking-[1.5px] text-white/45 mb-2 font-inter">Average Resolution Time</div>
              <div className="font-space text-5xl font-bold text-white">47 min</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="py-24 md:py-32 bg-black relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-[40%] md:sticky md:top-32 h-fit">
            <div className="text-xs uppercase tracking-[1.5px] text-white font-medium mb-4 font-inter">How We Work</div>
            <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tight mb-6">A Proven Process</h2>
            <p className="text-white/45 font-inter text-lg">We&apos;ve refined our approach to ensure seamless delivery and maximum impact for your business.</p>
          </div>
          
          <div className="w-full md:w-[60%] flex flex-col gap-6">
            {[
              { num: "01", title: "Discovery Call", desc: "Free consultation, assess setup" },
              { num: "02", title: "Solution Design", desc: "Tailored roadmap, your budget" },
              { num: "03", title: "Implementation", desc: "Deploy with zero disruption" },
              { num: "04", title: "Ongoing Support", desc: "Monitoring + dedicated manager" }
            ].map((step, i) => (
              <div key={i} className="process-step group relative bg-[#0A0A0A] border border-white/10 p-8 md:p-10 overflow-hidden transition-all duration-500 [&.active-process-card]:bg-[#111111] [&.active-process-card]:border-white/30 [&.active-process-card]:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <div className="absolute -left-4 -top-8 font-space text-[120px] font-bold text-white/[0.03] select-none pointer-events-none group-[.active-process-card]:text-white/[0.08] transition-colors duration-500">
                  {step.num}
                </div>
                <div className="relative z-10">
                  <h3 className="font-space text-2xl font-bold mb-3 text-white/50 group-[.active-process-card]:text-white transition-colors duration-500">{step.title}</h3>
                  <p className="text-white/30 font-inter text-lg group-[.active-process-card]:text-white/70 transition-colors duration-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section ref={testimonialRef} className="py-32 bg-black relative z-10 overflow-hidden">
        {/* Background Particles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full blur-[2px] animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white rounded-full blur-[2px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="testimonial-card bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 backdrop-blur-xl text-center relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-space text-[120px] leading-none text-white/20 select-none">&quot;</div>
            
            <p className="text-xl md:text-3xl italic text-white leading-relaxed mb-12 relative z-10 font-light font-inter">
              TechnoFixer transformed our entire IT setup in under a month. Downtime went from hours a week to virtually zero.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-space font-bold text-lg">
                RK
              </div>
              <div className="text-left font-inter">
                <div className="font-bold text-white">Rahul Khanna</div>
                <div className="text-sm text-white/45">CTO, NovaPay Financial</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" ref={ctaRef} className="py-32 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[32px] p-12 md:p-24 text-center relative overflow-hidden">
            {/* Burst Animation Container */}
            <div className="burst-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="font-space text-4xl md:text-6xl font-bold text-white mb-6">Ready to fix your IT?</h2>
              <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-inter">
                Get a free audit. No commitment required.
              </p>
              
              <button ref={ctaButtonRef} className="bg-[#FFFFFF] hover:bg-[#E0E0E0] text-[#000000] px-[28px] py-[14px] rounded-[6px] font-space font-[600] text-[15px] transition-colors duration-200 ease-in-out inline-block will-change-transform">
                Start the Conversation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-space font-bold text-2xl tracking-tight">
            TechnoFixer
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-white/45 font-inter">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          
          <div className="text-sm text-white/45 font-inter">
            &copy; {new Date().getFullYear()} TechnoFixer. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

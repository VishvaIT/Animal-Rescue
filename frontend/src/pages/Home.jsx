import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { Shield, Clock, HeartHandshake } from 'lucide-react';

// Placeholder 3D Component for the animal scene
const AnimalScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#50E3C2" wireframe />
        </mesh>
      </Float>
      {/* We will load real GLTF models here in Phase 5 */}
    </>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <AnimalScene />
          </Canvas>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Every Life Matters <br />
              <span className="gradient-text">Be Their Voice</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Report injured or abandoned animals instantly. Our dedicated rescue teams are on standby to bring them to safety.
            </p>
            <div className="flex gap-4">
              <Link to="/report" className="bg-safe-orange hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.5)] transition hover:-translate-y-1">
                Report an Emergency
              </Link>
              <Link to="/volunteer" className="glass-panel py-3 px-8 font-bold hover:bg-white/20 transition">
                Join the Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-bg/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <HeartHandshake size={40} className="text-safe-orange mb-4"/>, num: "5,234", text: "Animals Rescued" },
            { icon: <Shield size={40} className="text-safe-blue mb-4"/>, num: "128", text: "Active Rescue Teams" },
            { icon: <Clock size={40} className="text-safe-green mb-4"/>, num: "24/7", text: "Emergency Response" },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-panel p-8 text-center flex flex-col items-center hover:-translate-y-2 transition duration-300 cursor-default"
            >
              {stat.icon}
              <h3 className="text-4xl font-bold mb-2">{stat.num}</h3>
              <p className="text-gray-400">{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

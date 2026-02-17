'use client'

import React, { useContext, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { ThemeContext } from '../context/ThemeContext'

export default function HomeNew() {
  const { theme } = useContext(ThemeContext)
  const [hoveredService, setHoveredService] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const services = [
    {
      icon: '🧹',
      title: 'Limpeza Residencial',
      desc: 'Completa para residências, apartamentos e casarões',
      features: ['Até 4 ambientes', 'Atendimento flexível', 'Equipe treinada']
    },
    {
      icon: '🏢',
      title: 'Limpeza Comercial',
      desc: 'Escritórios, lojas e estabelecimentos comerciais',
      features: ['Fora do horário', 'Fornecimento de material', 'Contrato flexível']
    },
    {
      icon: '✨',
      title: 'Serviços Premium',
      desc: 'Limpeza profunda e especializada com garantia',
      features: ['Higienização', 'Detailing', 'Consultoria']
    },
    {
      icon: '🛏️',
      title: 'Limpeza Profunda',
      desc: 'Serviço intensivo com equipamentos especializados',
      features: ['Vapor', 'Ozonização', 'Higiene total']
    }
  ]

  const benefits = [
    { icon: '⭐', title: '4.9/5 Estrelas', text: 'Avaliação média de 500+ clientes satisfeitos' },
    { icon: '🔒', title: 'Segurança', text: 'Todos os colaboradores passam por verificação' },
    { icon: '💰', title: 'Preço Justo', text: 'Orçamento sem compromisso, sem taxa oculta' },
    { icon: '⏰', title: 'Pontualidade', text: '100% de pontualidade garantida' },
    { icon: '📱', title: 'Flexibilidade', text: 'Agendamentos 24/7 via aplicativo' },
    { icon: '✓', title: 'Garantia', text: 'Satisfeito ou dinheiro de volta' }
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'São Paulo, SP',
      text: 'Excelente serviço! A equipe é profissional e prestativa. Minha casa ficou impecável!',
      rating: 5
    },
    {
      name: 'João Costa',
      role: 'Guarulhos, SP',
      text: 'Recomendo muito! Chegaram na hora certa e fizeram um trabalho perfeito.',
      rating: 5
    },
    {
      name: 'Ana Oliveira',
      role: 'Osasco, SP',
      text: 'Serviço confiável e com muito cuidado com os móveis. Voltei a contratar!',
      rating: 5
    }
  ]

  return (
    <>
      <Head>
        <title>Limpeza Pro - Serviço de Limpeza Premium em São Paulo</title>
        <meta name="description" content="Limpeza profissional e confiável. Atendimento 24/7, equipe certificada, garantia de satisfação. Agende agora!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
        {/* ============= HERO SECTION ============= */}
        <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
            : 'bg-gradient-to-br from-white via-green-50 to-emerald-50'
        }`}>
          
          {/* Background Animated Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5' 
                  : 'bg-gradient-to-br from-green-300/20 to-emerald-300/10'
              }`}
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-tr from-blue-500/10 to-green-500/5'
                  : 'bg-gradient-to-tr from-blue-300/15 to-green-300/10'
              }`}
            />
            <motion.div 
              animate={{ y: [0, 40, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className={`absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-tl from-emerald-500/10'
                  : 'bg-gradient-to-tl from-emerald-300/15'
              }`}
            />
          </div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-start pt-20">
              
              {/* Left Content */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
                    theme === 'dark'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-green-100/60 border-green-300'
                  }`}>
                    <span className="text-2xl animate-bounce">✨</span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                      Serviço Premium com Garantia
                    </span>
                  </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants}>
                  <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-tight ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Sua Casa
                    <br />
                    <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                      Impecável
                    </span>
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.p 
                  variants={itemVariants}
                  className={`text-lg sm:text-xl leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Limpeza profissional de qualidade superior. Equipe treinada, preços justos e garantia de 100% de satisfação. Agende agora!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link href="/agendar">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      Agendar Agora →
                    </motion.button>
                  </Link>
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full sm:w-auto px-8 py-4 border-2 font-bold text-lg rounded-lg transition-all duration-300 ${
                        theme === 'dark'
                          ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                          : 'border-green-600 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      Criar Conta →
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Trust Metrics */}
                <motion.div 
                  variants={itemVariants}
                  className={`pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">4.9/5</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>500+ avaliações</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">1000+</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Serviços realizados</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">100%</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Satisfação garantida</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative hidden lg:block h-[600px]"
              >
                <motion.div
                  animate={{ y: [0, -30, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className={`absolute inset-0 rounded-3xl flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/40'
                      : 'bg-gradient-to-br from-green-100/40 to-emerald-100/30 border border-green-200/60'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="text-9xl opacity-20"
                  >
                    🧹
                  </motion.div>
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [-20, 20, -20] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`absolute top-8 -right-8 w-48 p-4 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 border border-green-700/40'
                      : 'bg-white/80 border border-green-200'
                  } backdrop-blur shadow-lg`}
                >
                  <p className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Equipe Profissional</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Colaboradores certificados e treinados</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ============= SERVICES SECTION ============= */}
        <section className={`py-24 px-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900 to-slate-950'
            : 'bg-gradient-to-b from-white to-green-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Nossos Serviços
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Soluções completas de limpeza para residências e comerciais
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {services.map((service, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  onMouseEnter={() => setHoveredService(idx)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`p-8 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-green-700/30 hover:border-green-600/60 hover:bg-slate-800'
                      : 'bg-white border-green-100 hover:border-green-300 hover:shadow-xl'
                  }`}
                >
                  <motion.div
                    animate={{ scale: hoveredService === idx ? 1.2 : 1 }}
                    className="text-5xl mb-4 origin-left"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {service.desc}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className={`text-sm flex items-center gap-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className="text-green-500 font-bold">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============= BENEFITS SECTION ============= */}
        <section className={`py-24 px-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-950 to-slate-900'
            : 'bg-gradient-to-b from-green-50 to-white'
        }`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Por Que Escolher A Gente?
              </h2>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`p-8 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-slate-800/30 border-green-700/20'
                      : 'bg-white border-green-100'
                  }`}
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {benefit.title}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {benefit.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============= TESTIMONIALS SECTION ============= */}
        <section className={`py-24 px-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900'
            : 'bg-gradient-to-b from-white via-green-50 to-white'
        }`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Depoimentos de Clientes
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Veja o que nossos clientes satisfeitos têm a dizer
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`p-8 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-green-700/30'
                      : 'bg-white border-green-100 shadow-lg'
                  }`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className={`mb-6 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className={`font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {testimonial.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============= CTA FINAL SECTION ============= */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-600/10 to-emerald-600/10'
              : 'bg-gradient-to-r from-green-600/5 to-emerald-600/5'
          }`} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Seu Próximo Agendamento Começa Aqui
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Não espere mais. Agende seu serviço agora e aproveite 10% de desconto na primeira compra!
            </p>
            <Link href="/agendar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Agendar Agora - 10% OFF 🎉
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  )
}

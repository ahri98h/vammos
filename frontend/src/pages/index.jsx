import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

export default function Home() {
  const [hoveredService, setHoveredService] = useState(null)

  return (
    <>
      <Head>
        <title>Limpeza Pro - Serviço Premium em São Paulo</title>
        <meta name="description" content="Limpeza profissional, confiável e com garantia. Agende seu serviço agora!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        {/* ========== HERO ========== */}
        <section style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #10b981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decorativo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '800px',
              textAlign: 'center'
            }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                fontSize: 'clamp(2rem, 8vw, 4rem)',
                fontWeight: '900',
                marginBottom: '1rem',
                lineHeight: '1.1'
              }}
            >
              Sua Casa Impecável
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                marginBottom: '2rem',
                fontWeight: '300',
                lineHeight: '1.6'
              }}
            >
              Limpeza profissional de qualidade premium. Equipe certificada, preços justos e 100% de satisfação garantida.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '3rem'
              }}
            >
              <Link href="/agendar">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '1rem 2.5rem',
                    background: 'white',
                    color: '#22c55e',
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                  }}
                >
                  Agendar Agora
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '1rem 2.5rem',
                    background: 'transparent',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    border: '2px solid white',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Criar Conta
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '2rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900' }}>4.9★</div>
                <div style={{ fontSize: '0.9rem' }}>500+ Avaliações</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900' }}>1000+</div>
                <div style={{ fontSize: '0.9rem' }}>Serviços Realizados</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900' }}>100%</div>
                <div style={{ fontSize: '0.9rem' }}>Satisfação Garantida</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ========== SERVIÇOS ========== */}
        <section style={{
          padding: '4rem 2rem',
          background: '#f9fafb',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: '900',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Nossos Serviços
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Soluções completas de limpeza profissional
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: '🧹', title: 'Residencial', desc: 'Apto, casas e residências' },
              { icon: '🏢', title: 'Comercial', desc: 'Escritórios e lojas' },
              { icon: '✨', title: 'Premium', desc: 'Serviços especializados' },
              { icon: '🛏️', title: 'Profunda', desc: 'Limpeza completa' }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '1rem',
                  border: hoveredService === idx ? '2px solid #22c55e' : '1px solid #e5e7eb',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: hoveredService === idx ? '0 10px 30px rgba(34, 197, 94, 0.2)' : 'none'
                }}
              >
                <motion.div
                  animate={{ scale: hoveredService === idx ? 1.2 : 1 }}
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                  {service.icon}
                </motion.div>
                <h3 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem', color: '#111827' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========== BENEFÍCIOS ========== */}
        <section style={{
          padding: '4rem 2rem',
          background: '#ffffff',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: '900',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Por Que Escolher A Gente?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              Diferenciais que fazem a diferença
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: '⭐', title: 'Avaliado', text: '4.9/5 com 500+ clientes' },
              { icon: '🔒', title: 'Seguro', text: 'Equipe verificada' },
              { icon: '💰', title: 'Justo', text: 'Sem taxas ocultas' },
              { icon: '⏰', title: 'Pontual', text: '100% na hora' },
              { icon: '📱', title: 'Flexível', text: 'Agende 24/7' },
              { icon: '✓', title: 'Garantido', text: 'Ou dinheiro de volta' }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  padding: '2rem',
                  background: '#f9fafb',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#111827' }}>
                  {benefit.title}
                </h3>
                <p style={{ color: '#6b7280' }}>{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========== DEPOIMENTOS ========== */}
        <section style={{
          padding: '4rem 2rem',
          background: '#f9fafb',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: '900',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              O Que Nossos Clientes Dizem
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { name: 'Maria Silva', city: 'São Paulo', text: 'Excelente! Equipe profissional, chegou na hora e fez um trabalho perfeito.' },
              { name: 'João Costa', city: 'Guarulhos', text: 'Recomendo demais! Casa ficou impecável. Voltei a contratar!' },
              { name: 'Ana Oliveira', city: 'Osasco', text: 'Muito cuidadosos com os móveis. Serviço de qualidade premium!' }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  padding: '2rem',
                  background: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ color: '#fbbf24', fontSize: '1.25rem' }}>★</span>
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: '1.5rem' }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <p style={{ fontWeight: '700', color: '#111827', margin: 0 }}>
                    {testimonial.name}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                    {testimonial.city}, SP
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========== CTA FINAL ========== */}
        <section style={{
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #10b981 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: '900',
              marginBottom: '1rem'
            }}>
              Pronto Para Começar?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              marginBottom: '2rem',
              fontWeight: '300'
            }}>
              Agende agora e aproveite 10% de desconto na primeira limpeza!
            </p>
            <Link href="/agendar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '1.25rem 3rem',
                  background: 'white',
                  color: '#22c55e',
                  fontWeight: '900',
                  fontSize: '1.25rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s'
                }}
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

import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { FiFileText, FiBox, FiHome, FiUserCheck, FiShield, FiLock, FiEdit, FiInstagram, FiLinkedin, FiFacebook } from "react-icons/fi";

export default function App() {
    return (
        <div className="landing-page">
            {/* Header */}
            <header className="header">
                <div className="logo">ContractGen</div>
                <nav className="menu">
                    <a href="#modelos">Modelos de Contrato</a>
                    <a href="#como-funciona">Como Funciona</a>
                    <a href="#planos">Planos</a>
                    <a href="#faq">FAQ</a>
                    <a href="#contato">Contato</a>
                </nav>
                <div className="header-actions">
                    <button className="btn btn-outline">Entrar</button>
                    <button className="btn btn-primary">Criar Conta</button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Crie e assine contratos personalizados em minutos</h1>
                    <p>
                        Modelos prontos, personalização fácil e assinatura digital com validade jurídica.
                    </p>
                    <Link to="/gerar-contrato" className="btn btn-cta">Comece Agora – É Grátis</Link>
                    <div className="hero-icons">
                        <FiLock size={28} title="Segurança" />
                        <FiEdit size={28} title="Certificado Digital" />
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="https://dummyimage.com/500x300/0074d9/ffffff&text=Editor+de+Contratos"
                        alt="Mockup editor de contratos"
                    />
                </div>
            </section>

            {/* Como Funciona */}
            <section className="como-funciona" id="como-funciona">
                <h2>Como Funciona</h2>
                <div className="steps">
                    <div className="step">
                        <span className="step-icon">1️⃣</span>
                        <p>Escolha um modelo de contrato</p>
                    </div>
                    <div className="step">
                        <span className="step-icon">2️⃣</span>
                        <p>Personalize com seus dados</p>
                    </div>
                    <div className="step">
                        <span className="step-icon">3️⃣</span>
                        <p>Envie para assinatura digital</p>
                    </div>
                    <div className="step">
                        <span className="step-icon">4️⃣</span>
                        <p>Receba o contrato assinado com validade jurídica</p>
                    </div>
                </div>
                <button className="btn btn-secondary">Ver todos os modelos</button>
            </section>

            {/* Tipos de Contrato */}
            <section className="tipos-contrato" id="modelos">
                <h2>Tipos de Contrato</h2>
                <div className="cards">
                    <div className="card">
                        <FiFileText size={32} aria-label="Serviços" />
                        <a href="#">Prestação de Serviços</a>
                    </div>
                    <div className="card">
                        <FiBox size={32} aria-label="Produto" />
                        <a href="#">Venda de Produto</a>
                    </div>
                    <div className="card">
                        <FiHome size={32} aria-label="Aluguel" />
                        <a href="#">Contrato de Aluguel</a>
                    </div>
                    <div className="card">
                        <FiUserCheck size={32} aria-label="NDA" />
                        <a href="#">NDA (Acordo de Confidencialidade)</a>
                    </div>
                    <div className="card">
                        <FiShield size={32} aria-label="Parceria" />
                        <a href="#">Contrato de Parceria</a>
                    </div>
                </div>
            </section>

            {/* Depoimentos */}
            <section className="depoimentos">
                <h2>Nossos clientes confiam:</h2>
                <div className="testimonials">
                    <div className="testimonial">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="João" />
                        <p>"Economizei horas de trabalho e fechei mais rápido!"</p>
                        <span>João, Designer Freelancer</span>
                    </div>
                    <div className="testimonial">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Maria" />
                        <p>"Simples, seguro e prático. Recomendo!"</p>
                        <span>Maria, Advogada</span>
                    </div>
                </div>
            </section>

            {/* Segurança & Validade Jurídica */}
            <section className="seguranca">
                <h2>Segurança & Validade Jurídica</h2>
                <p>
                    Todos os contratos são assinados com criptografia avançada e têm validade jurídica conforme a MP 2.200-2/2001.
                </p>
                <div className="security-icons">
                    <div>
                        <FiLock size={32} />
                        <p>Criptografia</p>
                    </div>
                    <div>
                        <FiEdit size={32} />
                        <p>Registro de logs</p>
                    </div>
                    <div>
                        <FiShield size={32} />
                        <p>Conformidade LGPD</p>
                    </div>
                </div>
            </section>

            {/* Planos */}
            <section className="planos" id="planos">
                <h2>Experimente grátis</h2>
                <div className="plan-cards">
                    <div className="plan-card">
                        <h3>Gratuito</h3>
                        <p>Assine contratos básicos sem custo</p>
                    </div>
                    <div className="plan-card">
                        <h3>Profissional</h3>
                        <p>Recursos avançados para profissionais</p>
                    </div>
                    <div className="plan-card">
                        <h3>Empresarial</h3>
                        <p>Para equipes e empresas</p>
                    </div>
                </div>
                <button className="btn btn-secondary">Compare Planos</button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-links">
                    <a href="#">Termos de Uso</a>
                    <a href="#">Política de Privacidade</a>
                    <a href="#">Suporte</a>
                </div>
                <div className="footer-contact">
                    <span>WhatsApp: (11) 99999-9999</span>
                    <span>Email: contato@contractgen.com</span>
                </div>
                <div className="footer-social">
                    <a href="#" aria-label="Instagram"><FiInstagram size={22} /></a>
                    <a href="#" aria-label="LinkedIn"><FiLinkedin size={22} /></a>
                    <a href="#" aria-label="Facebook"><FiFacebook size={22} /></a>
                </div>
                <div className="footer-seal">
                    <FiLock size={16} style={{marginRight:4}} /> <span>Site Seguro</span>
                </div>
            </footer>
        </div>
    );
}

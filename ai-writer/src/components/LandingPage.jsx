import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      
      {/* 1. Navbar */}
      <nav className="nav-creative">
        <Link to="/" className="brand-bold">
          Ai_Writer<span style={{color: 'var(--pop-coral)'}}>.</span>
        </Link>
       <Link to="/login" className="cta-pill">
        Sign In →
      </Link>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero-creative">
        <div className="hero-text">
          <h1>
            Your words, <br/>
            but <span className="highlight-word">electric.</span>
          </h1>
          <p className="hero-sub">
            The AI writing assistant that feels more like a creative partner. 
            Fix grammar, shift tone, and find the perfect word—instantly.
          </p>
          <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent: 'center'}}>
             <Link to="/app" className="btn-blob">Start Writing Free</Link>
          </div>
        </div>

        {/* 3. The Morphing Blob Visual */}
        <div className="blob-container">
          <div className="morph-blob"></div>
          
          {/* Floating UI Card Elements */}
          <div className="glass-card" style={{top: '-20px', left: '-20px'}}>
            <div style={{fontSize:'0.8rem', fontWeight:'bold', color:'#888', marginBottom:'5px'}}>TONE DETECTED</div>
            <div style={{fontSize:'1.5rem', fontWeight:'900', color:'var(--pop-violet)'}}>✨ Excited</div>
          </div>
          
          <div className="glass-card" style={{top: '40px', left: '40px', animationDelay: '1s'}}>
            <div style={{fontSize:'0.8rem', fontWeight:'bold', color:'#888', marginBottom:'5px'}}>SPELLING</div>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
               <span style={{textDecoration:'line-through', color:'var(--pop-coral)'}}>Thier</span>
               <span>→</span>
               <span style={{fontWeight:'bold', color:'var(--success)'}}>Their</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Infinite Marquee */}
      <div className="marquee-strip">
        <div className="marquee-content">
          <span>Grammar Check • Tone Analysis • Clarity • Vocabulary • No Latency • Private •</span>
          <span>Grammar Check • Tone Analysis • Clarity • Vocabulary • No Latency • Private •</span>
          <span>Grammar Check • Tone Analysis • Clarity • Vocabulary • No Latency • Private •</span>
        </div>
      </div>

      {/* 5. Bento Grid Features */}
      <section className="features-creative">
        <div className="bento-card">
          <div className="bento-icon">🚀</div>
          <h3>Instant Feedback</h3>
          <p>Zero server lag. Our engine runs locally in your browser for feedback that keeps up with your thought process.</p>
        </div>
        <div className="bento-card" style={{borderColor: 'var(--pop-violet)'}}>
          <div className="bento-icon">🎭</div>
          <h3>Tone Shifting</h3>
          <p>Don't just fix errors. Change the vibe. Detect if you sound bossy, happy, or professional in real-time.</p>
        </div>
        <div className="bento-card" style={{borderColor: 'var(--pop-coral)'}}>
          <div className="bento-icon">🔐</div>
          <h3>100% Privacy</h3>
          <p>What you write stays on your device. We don't send your drafts to the cloud. Perfect for sensitive docs.</p>
        </div>
      </section>

      {/* 6. WALL OF LOVE (New) */}
      <section className="testimonials-section">
        <h2 style={{fontSize: '3rem', fontWeight: '900'}}>
          Writers are <span style={{color: 'var(--pop-coral)', fontStyle: 'italic'}}>obsessed.</span>
        </h2>
        <div className="testi-grid">
          <div className="testi-card">
            <p style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
              "I used to sound like a robot. Now my emails actually have personality. The tone detector is magic."
            </p>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className="user-avatar" style={{background: 'var(--pop-yellow)'}}></div>
              <div>
                <strong>Sarah J.</strong><br/>
                <span style={{fontSize: '0.9rem', color: '#666'}}>Copywriter</span>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
              "The best part? It doesn't upload my data. Finally, an AI tool safe for my legal drafts."
            </p>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className="user-avatar" style={{background: 'var(--pop-violet)'}}></div>
              <div>
                <strong>Mark T.</strong><br/>
                <span style={{fontSize: '0.9rem', color: '#666'}}>Legal Consultant</span>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <p style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
              "It's not just a spellchecker, it's a vibe checker. Totally changed how I write my newsletter."
            </p>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className="user-avatar" style={{background: 'var(--pop-coral)'}}></div>
              <div>
                <strong>Elara V.</strong><br/>
                <span style={{fontSize: '0.9rem', color: '#666'}}>Substack Writer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING TICKETS (Fixed) */}
      <section id="pricing" className="pricing-section">
        <h2 style={{fontSize: '3rem', fontWeight: '900', marginBottom: '1rem'}}>
          Simple Pricing.
        </h2>
        <p style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
          No hidden fees. No credit card required for the free tier.
        </p>
        
        <div className="pricing-container">
          {/* Free Card */}
          <div className="pricing-card">
            <h3 style={{fontSize: '1.5rem', fontWeight: '800'}}>Starter</h3>
            <div className="price-tag">$0</div>
            <ul style={{textAlign: 'left', listStyle: 'none', padding: 0, lineHeight: '2'}}>
              <li>✅ Basic Grammar Check</li>
              <li>✅ Tone Detection (3/day)</li>
              <li>✅ Browser Local Storage</li>
            </ul>
            <Link to="/app" className="btn-blob" style={{background: '#eee', color: 'black', width: '100%', marginTop: '2rem', boxSizing: 'border-box'}}>
              Start Free
            </Link>
          </div>

          {/* Pro Card */}
          <div className="pricing-card pro">
            <div style={{position: 'absolute', top: '-15px', right: '20px', background: 'var(--pop-lavender)', color: 'black', padding: '5px 15px', fontWeight: 'bold', borderRadius: '20px', transform: 'rotate(5deg)'}}>
              MOST POPULAR
            </div>
            <h3 style={{fontSize: '1.5rem', fontWeight: '800'}}>Pro Writer</h3>
            <div className="price-tag">$12</div>
            <ul style={{textAlign: 'left', listStyle: 'none', padding: 0, lineHeight: '2'}}>
              <li>✨ Unlimited Tone Checks</li>
              <li>✨ Vocabulary Enhancer</li>
              <li>✨ Full Plagiarism Scan</li>
              <li>✨ Export to PDF/Docx</li>
            </ul>
            <button className="btn-blob" style={{background: 'var(--pop-lavender)', color: 'black', width: '100%', marginTop: '2rem', boxSizing: 'border-box'}}>
              Go Pro
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION (New) */}
      <section className="faq-section">
        <h2 style={{textAlign: 'center', fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem'}}>
          Got Questions?
        </h2>
        
        <details>
          <summary>Is my data really private?</summary>
          <p style={{marginTop: '1rem', lineHeight: '1.6'}}>
            Yes! Unlike other AI tools, our engine runs entirely in your browser using WebAssembly. Your text is never sent to a server.
          </p>
        </details>

        <details>
          <summary>Does it work with other languages?</summary>
          <p style={{marginTop: '1rem', lineHeight: '1.6'}}>
            Currently, we support English (US, UK, CA). Spanish and French support is coming in Q4 2025.
          </p>
        </details>

        <details>
          <summary>Is the "Pro" plan actually worth it?</summary>
          <p style={{marginTop: '1rem', lineHeight: '1.6'}}>
            If you write more than 500 words a day, definitely. The vocabulary enhancer alone saves users about 2 hours of editing time per week.
          </p>
        </details>
      </section>

      {/* 9. Footer */}
      <footer style={{textAlign:'center', padding:'4rem 2rem', background:'white'}}>
        <h2 style={{fontSize:'2.5rem', fontWeight:'900', marginBottom:'2rem'}}>Ready to flow?</h2>
        <Link to="/app" className="btn-blob" style={{background: 'var(--ink-black)', color: 'white'}}>
          Launch the App
        </Link>
        <p style={{marginTop:'3rem', opacity:0.5, fontSize:'0.9rem'}}>© 2025 AI Writer. Crafted with React.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
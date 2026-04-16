
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Loading from './components/Loading';
import Footer from './components/Footer';
import './index.css';

// Mock Data Analysis Result
const MOCK_ANALYSIS_RESULT = {
  fileName: "service_agreement_v2.pdf",
  fileSize: "2.4 MB",
  pageCount: 12,
  uploadDate: new Date().toISOString(),
  originalText: `<div class="document-content">
    <h3>12.3 LIMITATION OF LIABILITY</h3>
    <p>EXCEPT FOR A PARTY'S INDEMNIFICATION OBLIGATIONS OR BREACH OF CONFIDENTIALITY, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOST PROFITS OR REVENUES, LOSS OF DATA OR OTHER ECONOMIC LOSS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
    
    <h3>18.5 AUTOMATIC RENEWAL</h3>
    <p>THIS AGREEMENT SHALL <span class="highlight-risk" data-risk="high">AUTOMATICALLY RENEW FOR SUCCESSIVE ONE (1) YEAR TERMS</span> UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE OF NON-RENEWAL AT LEAST SIXTY (60) DAYS PRIOR TO THE END OF THE THEN-CURRENT TERM.</p>
    
    <h3>21.1 JURISDICTION</h3>
    <p>This Agreement shall be governed by the laws of the State of New York. Any dispute arising from this Agreement shall be resolved in the state or federal courts located in New York County, New York.</p>
    
    <h3>5. PAYMENT TERMS</h3>
    <p><span class="highlight-risk" data-risk="medium">Client shall pay all invoices within fifteen (15) days of receipt.</span> Late payments shall accrue interest at the lesser of 1.5% per month or the maximum rate permitted by law.</p>
    
    <h3>8. TERMINATION FOR CONVENIENCE</h3>
    <p>The Service Provider may terminate this Agreement at any time for convenience upon <span class="highlight-risk" data-risk="low">thirty (30) days prior written notice</span> to the Client.</p>
  </div>`,

  sections: [
    {
      id: "liability",
      title: "Limitation of Liability",
      content: "EXCEPT FOR A PARTY'S INDEMNIFICATION...",
      risk: "Low",
      score: 20
    },
    {
      id: "renewal",
      title: "Automatic Renewal",
      content: "THIS AGREEMENT SHALL AUTOMATICALLY RENEW...",
      risk: "High",
      score: 85,
      recommendation: "Negotiate for mutual renewal or shorter notice period (e.g., 30 days)."
    },
    {
      id: "payment",
      title: "Payment Terms",
      content: "Client shall pay all invoices within fifteen (15) days...",
      risk: "Medium",
      score: 60,
      recommendation: "Request Net 30 or Net 45 payment terms to align with standard practices."
    }
  ],

  simplifiedText: `Here is the simplified breakdown:

1. **Liability Limits**: Neither side can sue for indirect damages (like lost profit or data) unless it's about indemnification or confidentiality breaches. This is fairly standard.

2. **Watch Out: Auto-Renewal**: The contract renews automatically for another year unless you cancel 60 days before it ends. This is a common "gotcha" clause—mark your calendar!

3. **Governing Law**: New York laws apply. Need to go to court in New York County if there's a dispute.

4. **Aggressive Payment Terms**: You only have 15 days to pay invoices. This is short; standard is usually 30 days. Late fees are 1.5% per month (18% annually).`,

  riskScore: 65,
  riskLevel: 'Medium',
  riskFactors: 3,
  summary: [
    "Automatic renewal clause requires 60-day notice to cancel.",
    "Strict 15-day payment terms with high late fees.",
    "Standard limitation of liability.",
    "Jurisdiction is set to New York.",
    "Termination for convenience allowed for Service Provider."
  ],
  entities: {
    dates: ['1 year', '60 days', '15 days', '30 days'],
    money: ['1.5% interest', 'Net 15'],
    orgs: ['State of New York', 'New York County'],
    locations: ['New York', 'USA']
  }
};

function App() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Scroll to top on change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [analysisResult, isAnalyzing]);

  const handleAnalyze = (fileToAnalyze) => {
    setFile(fileToAnalyze);
    setIsAnalyzing(true);

    // Simulate AI Processing
    setTimeout(() => {
      // In a real app, we'd send the file to backend here
      setAnalysisResult({ ...MOCK_ANALYSIS_RESULT, fileName: fileToAnalyze.name });
      setIsAnalyzing(false);
    }, 3500);
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  return (
    <div className="app-main">
      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '80px' }}>
        {!file && !isAnalyzing ? (
          <Hero onAnalyze={handleAnalyze} />
        ) : isAnalyzing ? (
          <Loading />
        ) : (
          <Dashboard
            file={file}
            analysisData={analysisResult}
            onBack={resetAnalysis}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

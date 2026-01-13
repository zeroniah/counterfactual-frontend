import React from 'react';

interface CounterfactualAnalysis {
    analysis_id: string;
    document_id: string;
    branch_points: any[];
    dependencies: any[];
    cascades: any[];
    complexity_score: number;
    attorney_referral: {
        triggered: boolean;
        reason?: string;
        referral_links: string[];
    };
    educational_disclaimer: string;
}

interface Props {
    analysis: CounterfactualAnalysis;
    onClose: () => void;
}

const AttorneyReferralModal: React.FC<Props> = ({ analysis, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>⚠️ High Complexity Detected</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="warning-section">
                        <p className="warning-text">
                            Our analysis indicates a complexity score of <strong>{analysis.complexity_score.toFixed(2)}</strong>,
                            which exceeds the threshold for automated assistance.
                        </p>
                        {analysis.attorney_referral.reason && (
                            <p className="reason-text">
                                <strong>Reason:</strong> {analysis.attorney_referral.reason}
                            </p>
                        )}
                    </div>

                    <div className="explanation-section">
                        <h3>What This Means</h3>
                        <p>
                            Your situation involves multiple interconnected decision points, dependencies, and
                            potential cascade effects. While our structural analysis can identify where your
                            narrative could have branched differently, the legal implications require professional
                            judgment.
                        </p>
                    </div>

                    <div className="metrics-section">
                        <h3>Complexity Indicators</h3>
                        <div className="metrics-grid">
                            <div className="metric">
                                <span className="metric-label">Branch Points:</span>
                                <span className="metric-value">{analysis.branch_points.length}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Dependencies:</span>
                                <span className="metric-value">{analysis.dependencies.length}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Cascades:</span>
                                <span className="metric-value">{analysis.cascades.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="referral-section">
                        <h3>Recommended Next Steps</h3>
                        <p>We recommend consulting with a licensed attorney who can:</p>
                        <ul>
                            <li>Review the specific legal implications of each decision point</li>
                            <li>Advise on jurisdiction-specific requirements and deadlines</li>
                            <li>Evaluate potential remedies or corrective actions</li>
                            <li>Represent your interests in formal proceedings if needed</li>
                        </ul>
                    </div>

                    {analysis.attorney_referral.referral_links.length > 0 && (
                        <div className="links-section">
                            <h3>Legal Resources</h3>
                            {analysis.attorney_referral.referral_links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="referral-link"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="disclaimer-section">
                        <p className="disclaimer-text">
                            <strong>Important:</strong> This analysis is for educational purposes only and does
                            not constitute legal advice. The structural logic patterns identified should not be
                            used as the basis for legal decisions without professional consultation.
                        </p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="primary-button" onClick={onClose}>
                        I Understand
                    </button>
                </div>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          border-bottom: 2px solid #f0f0f0;
          background: #fff3cd;
        }
        .modal-header h2 {
          margin: 0;
          color: #856404;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 2em;
          cursor: pointer;
          color: #856404;
          line-height: 1;
          padding: 0;
          width: 30px;
          height: 30px;
        }
        .close-button:hover {
          color: #533f03;
        }
        .modal-body {
          padding: 25px;
        }
        .warning-section {
          background: #ffe69c;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .warning-text {
          margin: 0 0 10px 0;
          font-size: 1.05em;
        }
        .reason-text {
          margin: 10px 0 0 0;
          font-style: italic;
        }
        .explanation-section,
        .metrics-section,
        .referral-section,
        .links-section {
          margin-bottom: 25px;
        }
        .explanation-section h3,
        .metrics-section h3,
        .referral-section h3,
        .links-section h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 1.2em;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .metric {
          background: #f9f9f9;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        .metric-label {
          display: block;
          font-size: 0.85em;
          color: #666;
          margin-bottom: 5px;
        }
        .metric-value {
          display: block;
          font-size: 1.5em;
          font-weight: bold;
          color: #667eea;
        }
        .referral-section ul {
          margin: 10px 0;
          padding-left: 25px;
        }
        .referral-section li {
          margin: 8px 0;
          line-height: 1.5;
        }
        .referral-link {
          display: block;
          padding: 10px 15px;
          background: #f0f0f0;
          border-radius: 6px;
          margin: 8px 0;
          text-decoration: none;
          color: #667eea;
          transition: all 0.2s ease;
        }
        .referral-link:hover {
          background: #e0e0e0;
          transform: translateX(3px);
        }
        .disclaimer-section {
          background: #e8f4f8;
          border: 2px solid #b3d9e6;
          padding: 15px;
          border-radius: 8px;
        }
        .disclaimer-text {
          margin: 0;
          font-size: 0.9em;
          line-height: 1.6;
        }
        .modal-footer {
          padding: 20px 25px;
          border-top: 2px solid #f0f0f0;
          text-align: right;
        }
        .primary-button {
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
        </div>
    );
};

export default AttorneyReferralModal;

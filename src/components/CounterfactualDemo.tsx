import axios from 'axios';
import React, { useState } from 'react';
import AttorneyReferralModal from './AttorneyReferralModal';
import BranchPointHighlighter from './BranchPointHighlighter';
import './CounterfactualDemo.css';
import LogicTreeVisualization from './LogicTreeVisualization';
import RiskHeatmap from './RiskHeatmap';

interface CounterfactualAnalysis {
    analysis_id: string;
    document_id: string;
    branch_points: BranchPoint[];
    dependencies: Dependency[];
    cascades: Cascade[];
    complexity_score: number;
    attorney_referral: {
        triggered: boolean;
        reason?: string;
        referral_links: string[];
    };
    educational_disclaimer: string;
}

interface BranchPoint {
    branch_id: string;
    node_id: string;
    branch_type: 'procedural' | 'substantive' | 'evidence' | 'timing';
    condition: string;
    alternatives: string[];
    criticality_score: number;
}

interface Dependency {
    dependency_id: string;
    source_node_id: string;
    target_node_id: string;
    strength: number;
    cascade_potential: boolean;
}

interface Cascade {
    cascade_id: string;
    initiating_branch_id: string;
    amplification_chain: string[];
    severity_score: number;
    preventable: boolean;
}

const CounterfactualDemo: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [analysis, setAnalysis] = useState<CounterfactualAnalysis | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAttorneyModal, setShowAttorneyModal] = useState<boolean>(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            setError('Please enter a legal narrative to analyze');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Extract CIR graph from narrative
            const cirResponse = await axios.post(`${API_URL}/api/cir/extract`, {
                narrative: inputText,
                options: {
                    extract_legal_implications: true,
                    include_confidence: true
                }
            });

            // Step 2: Analyze counterfactuals from CIR graph
            const counterfactualResponse = await axios.post(`${API_URL}/api/counterfactual/analyze`, {
                cir_graph: cirResponse.data,
                options: {
                    include_visualizations: true,
                    max_branch_points: 10,
                    max_cascades: 5,
                    complexity_threshold: 0.7
                }
            });

            const result: CounterfactualAnalysis = counterfactualResponse.data;
            setAnalysis(result);

            // Show attorney referral modal if triggered
            if (result.attorney_referral.triggered) {
                setShowAttorneyModal(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadSampleCase = () => {
        const sampleNarrative = `I was scheduled for a court hearing on March 15, 2024. I received the notice by mail on February 28. However, I was hospitalized for emergency surgery on March 10 and could not attend the hearing. I called the court clerk on March 12 to inform them, but they said I needed to file a formal motion to continue. I was unable to file the motion because I was in the hospital until March 18. When I was released, I discovered the court had entered a default judgment against me on March 16.`;
        setInputText(sampleNarrative);
    };

    return (
        <div className="counterfactual-demo">
            <header className="demo-header">
                <h1>Counterfactual Reasoning Validator</h1>
                <p className="tagline">
                    Structural logic analysis - shows where your narrative could have branched differently
                </p>
                <div className="academic-link">
                    <a
                        href="https://github.com/zeroniah/morphographs-papers/blob/main/COUNTERFACTUAL_ACADEMIC_WHITEPAPER.md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📄 Research Paper
                    </a>
                </div>
            </header>

            <div className="input-section">
                <div className="input-header">
                    <h2>Your Legal Narrative</h2>
                    <button onClick={loadSampleCase} className="sample-button">
                        Load Sample Case
                    </button>
                </div>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter a legal narrative describing a situation where decisions were made and outcomes occurred. The system will identify where alternative paths were possible."
                    rows={8}
                    disabled={loading}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !inputText.trim()}
                    className="analyze-button"
                >
                    {loading ? 'Analyzing...' : 'Analyze Decision Points'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {analysis && (
                <div className="results-section">
                    <div className="complexity-indicator">
                        <h3>Complexity Score: {analysis.complexity_score.toFixed(2)}</h3>
                        {analysis.attorney_referral.triggered && (
                            <div className="referral-warning">
                                ⚠️ High complexity detected - attorney consultation recommended
                            </div>
                        )}
                    </div>

                    <div className="analysis-grid">
                        <div className="panel branch-points-panel">
                            <h3>Decision Branch Points ({analysis.branch_points.length})</h3>
                            <BranchPointHighlighter branchPoints={analysis.branch_points} />
                        </div>

                        <div className="panel logic-tree-panel">
                            <h3>Logic Tree Visualization</h3>
                            <LogicTreeVisualization
                                branchPoints={analysis.branch_points}
                                dependencies={analysis.dependencies}
                            />
                        </div>

                        <div className="panel risk-heatmap-panel">
                            <h3>Risk Heatmap</h3>
                            <RiskHeatmap
                                branchPoints={analysis.branch_points}
                                cascades={analysis.cascades}
                            />
                        </div>

                        <div className="panel cascades-panel">
                            <h3>Amplification Cascades ({analysis.cascades.length})</h3>
                            {analysis.cascades.map((cascade) => (
                                <div key={cascade.cascade_id} className="cascade-item">
                                    <div className="cascade-header">
                                        <span className="severity-badge" data-severity={cascade.severity_score}>
                                            Severity: {cascade.severity_score.toFixed(2)}
                                        </span>
                                        {cascade.preventable && (
                                            <span className="preventable-badge">Preventable</span>
                                        )}
                                    </div>
                                    <div className="cascade-chain">
                                        {cascade.amplification_chain.map((node, idx) => (
                                            <React.Fragment key={idx}>
                                                <span className="chain-node">{node}</span>
                                                {idx < cascade.amplification_chain.length - 1 && (
                                                    <span className="chain-arrow">→</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="disclaimer-panel">
                        <h4>Educational Disclaimer</h4>
                        <p>{analysis.educational_disclaimer}</p>
                    </div>
                </div>
            )}

            {showAttorneyModal && analysis && (
                <AttorneyReferralModal
                    analysis={analysis}
                    onClose={() => setShowAttorneyModal(false)}
                />
            )}
        </div>
    );
};

export default CounterfactualDemo;

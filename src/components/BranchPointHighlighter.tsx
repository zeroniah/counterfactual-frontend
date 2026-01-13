import React from 'react';

interface BranchPoint {
    branch_id: string;
    node_id: string;
    branch_type: 'procedural' | 'substantive' | 'evidence' | 'timing';
    condition: string;
    alternatives: string[];
    criticality_score: number;
}

interface Props {
    branchPoints: BranchPoint[];
}

const BranchPointHighlighter: React.FC<Props> = ({ branchPoints }) => {
    const getBranchTypeColor = (type: string): string => {
        const colors: Record<string, string> = {
            procedural: '#667eea',
            substantive: '#764ba2',
            evidence: '#f093fb',
            timing: '#4facfe'
        };
        return colors[type] || '#999';
    };

    const getBranchTypeIcon = (type: string): string => {
        const icons: Record<string, string> = {
            procedural: '⚖️',
            substantive: '📋',
            evidence: '🔍',
            timing: '⏰'
        };
        return icons[type] || '•';
    };

    return (
        <div className="branch-point-list">
            {branchPoints.length === 0 ? (
                <p className="no-branches">No branch points detected in this narrative.</p>
            ) : (
                branchPoints
                    .sort((a, b) => b.criticality_score - a.criticality_score)
                    .map((bp) => (
                        <div
                            key={bp.branch_id}
                            className="branch-point-item"
                            style={{ borderLeftColor: getBranchTypeColor(bp.branch_type) }}
                        >
                            <div className="branch-header">
                                <span className="branch-icon">{getBranchTypeIcon(bp.branch_type)}</span>
                                <span className="branch-type">{bp.branch_type}</span>
                                <span className="criticality-score">
                                    Criticality: {bp.criticality_score.toFixed(2)}
                                </span>
                            </div>
                            <div className="branch-condition">
                                <strong>Condition:</strong> {bp.condition}
                            </div>
                            <div className="branch-alternatives">
                                <strong>Alternative paths ({bp.alternatives.length}):</strong>
                                <ul>
                                    {bp.alternatives.map((alt, idx) => (
                                        <li key={idx}>{alt}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
            )}
            <style>{`
        .branch-point-list {
          max-height: 500px;
          overflow-y: auto;
        }
        .no-branches {
          text-align: center;
          color: #999;
          padding: 20px;
        }
        .branch-point-item {
          background: #fffef0;
          border-left: 4px solid #667eea;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .branch-point-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transform: translateX(3px);
        }
        .branch-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .branch-icon {
          font-size: 1.2em;
        }
        .branch-type {
          text-transform: capitalize;
          color: #333;
        }
        .criticality-score {
          margin-left: auto;
          padding: 4px 10px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 0.85em;
        }
        .branch-condition {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .branch-alternatives ul {
          margin: 5px 0 0 0;
          padding-left: 20px;
        }
        .branch-alternatives li {
          margin: 5px 0;
          line-height: 1.4;
        }
      `}</style>
        </div>
    );
};

export default BranchPointHighlighter;

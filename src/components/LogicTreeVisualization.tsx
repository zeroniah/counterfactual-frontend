import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

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

interface Props {
    branchPoints: BranchPoint[];
    dependencies: Dependency[];
}

const LogicTreeVisualization: React.FC<Props> = ({ branchPoints, dependencies }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || branchPoints.length === 0) return;

        // Clear previous visualization
        d3.select(svgRef.current).selectAll('*').remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create nodes from branch points
        const nodes = branchPoints.map((bp) => ({
            id: bp.node_id,
            label: bp.condition.substring(0, 30) + '...',
            criticality: bp.criticality_score,
            type: bp.branch_type,
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50
        }));

        // Create links from dependencies
        const links = dependencies
            .map((dep) => {
                const source = nodes.find(n => n.id === dep.source_node_id);
                const target = nodes.find(n => n.id === dep.target_node_id);
                if (source && target) {
                    return {
                        source: source.id,
                        target: target.id,
                        strength: dep.strength,
                        cascade: dep.cascade_potential
                    };
                }
                return null;
            })
            .filter((link): link is NonNullable<typeof link> => link !== null);

        // Create force simulation
        const simulation = d3.forceSimulation(nodes as any)
            .force('link', d3.forceLink(links as any)
                .id((d: any) => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(40));

        // Draw links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', (d) => d.cascade ? '#ff4444' : '#999')
            .attr('stroke-width', (d) => d.strength * 3)
            .attr('stroke-opacity', 0.6);

        // Draw nodes
        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 20)
            .attr('fill', (d) => {
                const colors: Record<string, string> = {
                    procedural: '#667eea',
                    substantive: '#764ba2',
                    evidence: '#f093fb',
                    timing: '#4facfe'
                };
                return colors[d.type] || '#999';
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('opacity', (d) => 0.5 + (d.criticality * 0.5));

        // Add labels
        const label = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .text((d) => d.label)
            .attr('font-size', 10)
            .attr('text-anchor', 'middle')
            .attr('dy', 35)
            .attr('fill', '#333');

        // Add tooltips
        node.append('title')
            .text((d) => `${d.type}: ${d.label}\nCriticality: ${d.criticality.toFixed(2)}`);

        // Update positions on simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node
                .attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y);

            label
                .attr('x', (d: any) => d.x)
                .attr('y', (d: any) => d.y);
        });

        // Drag behavior
        const drag = d3.drag()
            .on('start', (event: any, d: any) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event: any, d: any) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event: any, d: any) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        node.call(drag as any);

        // Cleanup
        return () => {
            simulation.stop();
        };
    }, [branchPoints, dependencies]);

    return (
        <div className="logic-tree-container">
            <svg ref={svgRef}></svg>
            <div className="legend">
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#667eea' }}></span>
                    <span>Procedural</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#764ba2' }}></span>
                    <span>Substantive</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#f093fb' }}></span>
                    <span>Evidence</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#4facfe' }}></span>
                    <span>Timing</span>
                </div>
            </div>
            <style>{`
        .logic-tree-container {
          position: relative;
        }
        .legend {
          display: flex;
          gap: 15px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85em;
        }
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: inline-block;
        }
      `}</style>
        </div>
    );
};

export default LogicTreeVisualization;

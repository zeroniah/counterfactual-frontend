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

interface Cascade {
    cascade_id: string;
    initiating_branch_id: string;
    amplification_chain: string[];
    severity_score: number;
    preventable: boolean;
}

interface Props {
    branchPoints: BranchPoint[];
    cascades: Cascade[];
}

const RiskHeatmap: React.FC<Props> = ({ branchPoints, cascades }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || branchPoints.length === 0) return;

        // Clear previous visualization
        d3.select(svgRef.current).selectAll('*').remove();

        const width = 600;
        const height = 300;
        const cellSize = 40;
        const padding = 40;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Prepare data: combine branch points with cascade information
        const riskData = branchPoints.map((bp) => {
            const relatedCascades = cascades.filter(c => c.initiating_branch_id === bp.branch_id);
            const maxSeverity = relatedCascades.length > 0
                ? Math.max(...relatedCascades.map(c => c.severity_score))
                : 0;
            const combinedRisk = (bp.criticality_score * 0.6) + (maxSeverity * 0.4);

            return {
                id: bp.branch_id,
                type: bp.branch_type,
                risk: combinedRisk,
                cascadeCount: relatedCascades.length
            };
        });

        // Group by type
        const typeGroups: Record<string, typeof riskData> = {};
        riskData.forEach((item) => {
            if (!typeGroups[item.type]) typeGroups[item.type] = [];
            typeGroups[item.type].push(item);
        });

        const types = Object.keys(typeGroups);
        const maxItemsPerType = Math.max(...Object.values(typeGroups).map(g => g.length));

        // Color scale (green -> yellow -> red)
        const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
            .domain([1, 0]); // Reversed: high risk = red (1), low risk = green (0)

        // Draw cells
        types.forEach((type, typeIdx) => {
            const items = typeGroups[type];
            items.forEach((item, itemIdx) => {
                const x = padding + (itemIdx * cellSize);
                const y = padding + (typeIdx * cellSize);

                // Cell rectangle
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', cellSize - 2)
                    .attr('height', cellSize - 2)
                    .attr('fill', colorScale(item.risk))
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2)
                    .attr('rx', 4)
                    .append('title')
                    .text(`${type}\nRisk: ${item.risk.toFixed(2)}\nCascades: ${item.cascadeCount}`);

                // Risk value text
                svg.append('text')
                    .attr('x', x + (cellSize / 2))
                    .attr('y', y + (cellSize / 2))
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('font-size', 10)
                    .attr('font-weight', 'bold')
                    .attr('fill', item.risk > 0.5 ? 'white' : '#333')
                    .text(item.risk.toFixed(2));
            });

            // Type label
            svg.append('text')
                .attr('x', 10)
                .attr('y', padding + (typeIdx * cellSize) + (cellSize / 2))
                .attr('text-anchor', 'end')
                .attr('dominant-baseline', 'central')
                .attr('font-size', 11)
                .attr('fill', '#333')
                .text(type);
        });

        // Legend
        const legendWidth = 200;
        const legendHeight = 20;
        const legendX = width - legendWidth - 20;
        const legendY = 20;

        const legendScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickFormat((d) => `${(d as number).toFixed(1)}`);

        // Legend gradient
        const defs = svg.append('defs');
        const linearGradient = defs.append('linearGradient')
            .attr('id', 'legend-gradient');

        linearGradient.selectAll('stop')
            .data([
                { offset: '0%', color: colorScale(0) },
                { offset: '50%', color: colorScale(0.5) },
                { offset: '100%', color: colorScale(1) }
            ])
            .join('stop')
            .attr('offset', (d) => d.offset)
            .attr('stop-color', (d) => d.color);

        svg.append('rect')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#legend-gradient)');

        svg.append('g')
            .attr('transform', `translate(${legendX}, ${legendY + legendHeight})`)
            .call(legendAxis);

        svg.append('text')
            .attr('x', legendX)
            .attr('y', legendY - 5)
            .attr('font-size', 11)
            .attr('fill', '#333')
            .text('Combined Risk Score');

    }, [branchPoints, cascades]);

    return (
        <div className="risk-heatmap-container">
            <svg ref={svgRef}></svg>
            <div className="heatmap-info">
                <p><strong>Risk Score Formula:</strong> (Criticality × 0.6) + (Max Cascade Severity × 0.4)</p>
                <p><strong>Color Guide:</strong> Green = Low Risk • Yellow = Medium Risk • Red = High Risk</p>
            </div>
            <style>{`
        .risk-heatmap-container {
          position: relative;
        }
        .heatmap-info {
          margin-top: 15px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 6px;
          font-size: 0.85em;
        }
        .heatmap-info p {
          margin: 5px 0;
        }
      `}</style>
        </div>
    );
};

export default RiskHeatmap;

"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidComponentProps {
  chart: string;
  id?: string;
}

export function MermaidComponent({ chart, id }: MermaidComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      themeCSS: `
        .node rect,
        .node circle,
        .node ellipse,
        .node polygon {
          fill: #ffffff;
          stroke: #e2e8f0;
          stroke-width: 2px;
        }
        .dark .node rect,
        .dark .node circle,
        .dark .node ellipse,
        .dark .node polygon {
          fill: #1e293b;
          stroke: #475569;
        }
        .node text,
        .nodeText,
        .flowchart .nodeText {
          fill: #1e293b !important;
          color: #1e293b !important;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        }
        .dark .node text,
        .dark .nodeText,
        .dark .flowchart .nodeText {
          fill: #f8fafc !important;
          color: #f8fafc !important;
        }
        .edgePath .path {
          stroke: #64748b;
          stroke-width: 2px;
        }
        .dark .edgePath .path {
          stroke: #94a3b8;
        }
        .edgeLabel {
          background-color: #ffffff;
          color: #1e293b;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .dark .edgeLabel {
          background-color: #1e293b;
          color: #f8fafc;
        }
        .edgeLabel rect {
          fill: #ffffff;
          stroke: #e2e8f0;
        }
        .dark .edgeLabel rect {
          fill: #1e293b;
          stroke: #475569;
        }
        .edgeLabel text {
          fill: #1e293b !important;
        }
        .dark .edgeLabel text {
          fill: #f8fafc !important;
        }
        .cluster rect {
          fill: #f8fafc;
          stroke: #e2e8f0;
          stroke-width: 1px;
        }
        .dark .cluster rect {
          fill: #334155;
          stroke: #475569;
        }
        .titleText,
        .flowchartTitleText {
          fill: #1e293b !important;
        }
        .dark .titleText,
        .dark .flowchartTitleText {
          fill: #f8fafc !important;
        }
        /* Override any conflicting styles */
        .mermaid svg {
          font-family: system-ui, -apple-system, sans-serif;
        }
        .mermaid text {
          fill: #1e293b !important;
          color: #1e293b !important;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .dark .mermaid text {
          fill: #f8fafc !important;
          color: #f8fafc !important;
        }
      `,
    });

    if (elementRef.current) {
      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(
            id || `mermaid-${Date.now()}`,
            chart,
          );
          elementRef.current!.innerHTML = svg;
        } catch (error) {
          console.error("Error rendering Mermaid diagram:", error);
          elementRef.current!.innerHTML = `
            <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p class="text-destructive text-sm">Error rendering Mermaid diagram</p>
              <pre class="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">${chart}</pre>
            </div>
          `;
        }
      };

      renderDiagram();
    }
  }, [chart, id]);

  return (
    <div
      ref={elementRef}
      className="mermaid-diagram flex justify-center my-4"
    />
  );
}

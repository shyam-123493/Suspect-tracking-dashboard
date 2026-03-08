import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SuspectService } from '@core/services/suspect.service';
import { Suspect } from '@shared/interfaces';
import * as d3 from 'd3';

interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  label: string;
  threatLevel: string;
  threatScore: number;
  group: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  strength: number;
}

@Component({
  selector: 'app-network-graph',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './network-graph.component.html',
  styleUrl: './network-graph.component.scss'
})
export class NetworkGraphComponent implements OnInit, OnDestroy {
  @ViewChild('networkElement') networkElement!: ElementRef;

  connectionThreshold = 70;
  selectedNode: GraphNode | null = null;
  private suspects: Suspect[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private svg!: d3.Selection<SVGSVGElement, unknown, any, any>;
  private simulation!: d3.Simulation<GraphNode, GraphLink>;

  constructor(
    private suspectService: SuspectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.suspects = this.suspectService.getAllSuspectsArray();
    setTimeout(() => this.initializeGraph(), 100);
  }

  ngOnDestroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  private initializeGraph() {
    const container = this.networkElement?.nativeElement;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const nodes: GraphNode[] = this.createNodes();
    const links: GraphLink[] = this.createLinks(nodes);

    // Clear previous content
    d3.select(container).selectAll('*').remove();

    // Create SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#fafafa') as any;

    // Add zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });
    this.svg.call(zoomBehavior);

    // Zoomable group
    const g = this.svg.append('g');

    // Force simulation
    this.simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-400))
      .force('center', d3.forceCenter<GraphNode>(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(30));

    // Draw links
    const link = g.append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => d.strength > this.connectionThreshold ? '#1976d2' : '#bdbdbd')
      .attr('stroke-width', d => 1 + (d.strength / 100) * 3)
      .attr('stroke-opacity', 0.7);

    // Draw nodes
    const node = g.append('g')
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => 10 + (d.threatScore / 100) * 8)
      .attr('fill', d => this.getNodeColor(d.threatLevel))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (_event: MouseEvent, d: GraphNode) => {
        this.selectedNode = d;
      });

    // Node hover effect
    node
      .on('mouseenter', function() {
        d3.select(this).attr('stroke', '#333').attr('stroke-width', 3);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
      });

    // Drag behavior
    const drag = d3.drag<SVGCircleElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Labels
    const labels = g.append('g')
      .selectAll<SVGTextElement, GraphNode>('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('dy', d => (10 + (d.threatScore / 100) * 8) + 14)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .style('font-weight', '500')
      .text(d => d.label);

    // Tick handler
    this.simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });
  }

  private createNodes(): GraphNode[] {
    return this.suspects.map(s => ({
      id: s.id,
      label: s.name,
      threatLevel: s.threatLevel,
      threatScore: s.threatScore,
      group: s.threatScore > 75 ? 1 : s.threatScore > 50 ? 2 : 3
    }));
  }

  private createLinks(nodes: GraphNode[]): GraphLink[] {
    const links: GraphLink[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    for (const suspect of this.suspects) {
      for (const associateId of suspect.associates) {
        if (suspect.id < associateId && nodeMap.has(associateId)) {
          links.push({
            source: nodeMap.get(suspect.id)!,
            target: nodeMap.get(associateId)!,
            strength: 50 + Math.random() * 50
          });
        }
      }
    }
    return links;
  }

  private getNodeColor(threatLevel: string): string {
    switch (threatLevel) {
      case 'high':   return '#d32f2f';
      case 'medium': return '#ff9800';
      case 'low':    return '#4caf50';
      default:       return '#757575';
    }
  }

  getConnectedSuspects(suspectId: number): Suspect[] {
    const suspect = this.suspects.find(s => s.id === suspectId);
    if (!suspect) return [];
    return this.suspects.filter(s => suspect.associates.includes(s.id));
  }

  resetView() {
    if (!this.svg) return;
    this.svg.transition().duration(750)
      .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
  }

  closeInfo() {
    this.selectedNode = null;
  }

  viewOnMap(suspectId: number) {
    this.router.navigate(['/map'], { queryParams: { suspect: suspectId } });
  }

  viewAllOnMap() {
    this.router.navigate(['/map']);
  }

  viewProfile(suspectId: number) {
    this.router.navigate(['/suspects', suspectId]);
  }
}

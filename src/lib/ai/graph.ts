/**
 * Knowledge Graph Engine for Eurowindow Door Products.
 * Manages Product-Attribute-Hardware Entity Relationships and Graph Traversal.
 */

export interface GraphNode {
  id: string;
  type: 'ProductSeries' | 'GlassType' | 'HardwareBrand' | 'Property' | 'DoorType';
  name: string;
  attributes?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: 'has_glass' | 'uses_hardware' | 'has_property' | 'includes_door_type';
  weight?: number;
}

// Built-in Knowledge Graph Nodes
const KNOWLEDGE_NODES: GraphNode[] = [
  // Product Series
  { id: 'series_ea55', type: 'ProductSeries', name: 'Hệ nhôm EA55', attributes: { category: 'Nhôm cao cấp', insulation: 'Tiêu chuẩn' } },
  { id: 'series_ea60i', type: 'ProductSeries', name: 'Hệ nhôm EA60i', attributes: { category: 'Nhôm cầu cách nhiệt', soundproof: 'Rất cao' } },
  { id: 'series_kommerling', type: 'ProductSeries', name: 'Hệ nhựa Kommerling', attributes: { category: 'Nhựa uPVC Đức', insulation: 'Tối ưu' } },
  { id: 'series_asia', type: 'ProductSeries', name: 'Hệ nhựa Asia', attributes: { category: 'Nhựa uPVC Asia', priceRange: 'Tiết kiệm' } },

  // Glass Types
  { id: 'glass_lowe', type: 'GlassType', name: 'Kính Low-E cản nhiệt', attributes: { UVBlock: '99%', energySaving: '30%' } },
  { id: 'glass_box', type: 'GlassType', name: 'Kính hộp cách âm cách nhiệt', attributes: { decibelReduction: '40dB' } },
  { id: 'glass_laminated', type: 'GlassType', name: 'Kính dán an toàn 2 lớp', attributes: { safety: 'Tối đa' } },

  // Hardware Brands
  { id: 'hw_roto', type: 'HardwareBrand', name: 'Phụ kiện Roto (CHLB Đức)', attributes: { warranty: '10 năm', segment: 'Siêu cao cấp' } },
  { id: 'hw_winkhaus', type: 'HardwareBrand', name: 'Phụ kiện Winkhaus (CHLB Đức)', attributes: { segment: 'Cao cấp' } },
  { id: 'hw_coche', type: 'HardwareBrand', name: 'Phụ kiện Coche', attributes: { segment: 'Tiêu chuẩn' } },
  { id: 'hw_kinlong', type: 'HardwareBrand', name: 'Phụ kiện Kinlong', attributes: { segment: 'Phổ thông' } },

  // Properties
  { id: 'prop_soundproof', type: 'Property', name: 'Độ cách âm 40dB', attributes: { decibel: 40 } },
  { id: 'prop_thermal', type: 'Property', name: 'Thanh nhôm cầu cách nhiệt Polyamide', attributes: { thermalBreak: true } },
];

// Built-in Knowledge Graph Edges
const KNOWLEDGE_EDGES: GraphEdge[] = [
  { source: 'series_ea60i', target: 'glass_lowe', relation: 'has_glass' },
  { source: 'series_ea60i', target: 'glass_box', relation: 'has_glass' },
  { source: 'series_ea60i', target: 'hw_roto', relation: 'uses_hardware' },
  { source: 'series_ea60i', target: 'prop_thermal', relation: 'has_property' },

  { source: 'series_ea55', target: 'glass_laminated', relation: 'has_glass' },
  { source: 'series_ea55', target: 'hw_coche', relation: 'uses_hardware' },
  { source: 'series_ea55', target: 'hw_kinlong', relation: 'uses_hardware' },

  { source: 'series_kommerling', target: 'glass_box', relation: 'has_glass' },
  { source: 'series_kommerling', target: 'hw_winkhaus', relation: 'uses_hardware' },
  { source: 'series_kommerling', target: 'prop_soundproof', relation: 'has_property' },

  { source: 'series_asia', target: 'hw_kinlong', relation: 'uses_hardware' },
];

/**
 * Extracts entities present in user query and traverses 1-hop graph relations.
 */
export function queryKnowledgeGraph(query: string): string {
  const cleanQuery = query.toLowerCase();
  const matchedNodes: GraphNode[] = [];

  // Entity Extraction from Query
  for (const node of KNOWLEDGE_NODES) {
    if (cleanQuery.includes(node.name.toLowerCase()) || node.id.includes(cleanQuery)) {
      matchedNodes.push(node);
    } else if (node.type === 'ProductSeries') {
      const seriesKey = node.id.replace('series_', '').toLowerCase();
      if (cleanQuery.includes(seriesKey)) {
        matchedNodes.push(node);
      }
    }
  }

  if (matchedNodes.length === 0) {
    return '';
  }

  // Traversal 1-hop edges
  const graphContextLines: string[] = ['[KNOWLEDGE GRAPH - THÔNG TIN LIÊN KẾT NỘI BỘ]'];

  matchedNodes.forEach(node => {
    graphContextLines.push(`• Thực thể gốc: ${node.name} (${node.type})`);
    
    // Find outgoing edges
    const connectedEdges = KNOWLEDGE_EDGES.filter(e => e.source === node.id || e.target === node.id);
    connectedEdges.forEach(edge => {
      const targetId = edge.source === node.id ? edge.target : edge.source;
      const targetNode = KNOWLEDGE_NODES.find(n => n.id === targetId);
      if (targetNode) {
        let relDesc = 'liên kết với';
        if (edge.relation === 'has_glass') relDesc = 'tương thích loại kính';
        if (edge.relation === 'uses_hardware') relDesc = 'sử dụng hệ phụ kiện';
        if (edge.relation === 'has_property') relDesc = 'sở hữu đặc tính';

        graphContextLines.push(`  └─ ${relDesc}: ${targetNode.name}`);
        if (targetNode.attributes) {
          const attrStr = Object.entries(targetNode.attributes).map(([k, v]) => `${k}: ${v}`).join(', ');
          graphContextLines.push(`     (Chi tiết: ${attrStr})`);
        }
      }
    });
  });
  return graphContextLines.join('\n');
}

/**
 * Dynamic Knowledge Graph Extractor: Registers entities & edges from a Knowledge Pack.
 */
export function registerKnowledgePackInGraph(pack: any) {
  if (!pack || !pack.metadata) return;

  const docNodeId = `doc_${pack.id}`;
  const docNode: GraphNode = {
    id: docNodeId,
    type: 'ProductSeries',
    name: pack.doc_title,
    attributes: {
      series: pack.metadata.series,
      chunk_count: pack.metadata.chunk_count,
      confidence: pack.metadata.confidence,
    },
  };

  // Avoid duplicates
  if (!KNOWLEDGE_NODES.some(n => n.id === docNodeId)) {
    KNOWLEDGE_NODES.push(docNode);
  }

  // Register Glossary Terms as Graph Nodes
  if (pack.glossary && Array.isArray(pack.glossary)) {
    pack.glossary.forEach((g: any) => {
      const termId = `term_${g.term.toLowerCase().replace(/\s+/g, '_')}`;
      if (!KNOWLEDGE_NODES.some(n => n.id === termId)) {
        KNOWLEDGE_NODES.push({
          id: termId,
          type: 'Property',
          name: g.term,
          attributes: { definition: g.definition, importance: g.importance },
        });
        KNOWLEDGE_EDGES.push({
          source: docNodeId,
          target: termId,
          relation: 'has_property',
        });
      }
    });
  }

  console.log(`[Knowledge Graph] Registered ${pack.doc_title} into Knowledge Graph Index.`);
}


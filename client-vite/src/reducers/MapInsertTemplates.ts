import {GLN} from "../state/MapStateTypes"
import {genHash} from "../utils/Utils"

const mermaidExample = `
sequenceDiagram
participant A as Customer
participant B as Service
A->>B: Request
B->>A: Response
`

export enum Templates {
  empty = 'Empty',
  detailedTeamBio = 'Pitch Deck - Detailed Team Bio',
  leanCanvasFramework = 'Pitch Deck - Lean Canvas Framework',
  featureCanvasFramework = 'Pitch Deck - Feature Canvas Framework',
  yana = `Pitch Deck - Yana's Framework`,
  // swot = 'Pitch Deck - SWOT',
  enterpriseArchitecture = 'Enterprise Architecture',
  mermaidSample = 'Mermaid Sample',
  prd = 'Product Requirements Document',
}

export const getInsertTemplate = (templateId: string, ri: number, offsetW: number, offsetH: number) => {
  let template = [] as GLN[]
  switch (templateId)  {
    case Templates.empty: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "New Root"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
      break
    }
    case Templates.prd: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Product Requirements Document", sFillColor: "#B25C6D"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: "", sFillColor: undefined} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: "Vision", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",1], content: "Description", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",2], content: "Timing", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",3], content: "Status", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",4], content: "Team", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",5], content: "Background", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",6], content: "Strategic alignment", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",7], content: "Metrics", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",8], content: "Who it benefits", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",9], content: "Use cases", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",10], content: "Assumptions", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",11], content: "Investment required", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",12], content: "Product architecture and components", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",13], content: "Core features", sFillColor: "#1C5D6C"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: "", sFillColor: undefined} as GLN
      ]
      break
    }
    case Templates.mermaidSample: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "New Root"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: mermaidExample, contentType: 'mermaid'} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
      break
    }
    case Templates.detailedTeamBio: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Detailed Team Bio"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,1,"s",0], content: "Name"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,2,"s",0], content: "Email"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,3,"s",0], content: "LinkedIn"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,4,"s",0], content: "Crunchbase"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,0,"s",0], content: "Member"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
      break
    }
    case Templates.leanCanvasFramework: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Lean Canvas<br>Framework"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: "Problem"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",1], content: "Solution"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",2], content: "Key Metrics"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",3], content: "Unique Value Proposition"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",4], content: "Customer Segments"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",5], content: "Unfair Advantage"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
      break
    }
    case Templates.featureCanvasFramework: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Feature Canvas<br>Framework"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: "Idea Description"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",1], content: "Contextual Situations"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",2], content: "Problems to Solve"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",3], content: "Why?"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",4], content: "Value proposition"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",5], content: "Capabilities"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
      break
    }
    case Templates.yana: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Yana Abramova's<br>methodology"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: "Purpose"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",1], content: "Problem"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",2], content: "Solution"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",3], content: "Product"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",4], content: "Market Size"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",5], content: "Team"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",6], content: "Traction"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",7], content: "Competition"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",8], content: "How you plan to spend"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
      break
    }
    case Templates.enterpriseArchitecture: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Enterprise Architecture"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,1,"s",0], content: "Business<br>Architecture"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,2,"s",0], content: "Information Systems<br>Architecture"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,3,"s",0], content: "Security<br>Architecture"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,4,"s",0], content: "Technology<br>Architecture"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,5], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,5,"s",0], content: "Governance<br>Architecture"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,0,"s",0], content: "Principles"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,5], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,0,"s",0], content: "Components"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",2,5], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,0,"s",0], content: "Building Blocks"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",3,5], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,0,"s",0], content: "Rules and Standards"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",4,5], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,0], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,0,"s",0], content: "Standards"} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,1], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,2], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,3], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,4], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",5,5], content: ""} as GLN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GLN
      ]
    }
  }
  template[0].offsetW = offsetW
  template[0].offsetH = offsetH
  return template
}

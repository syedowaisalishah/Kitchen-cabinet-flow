export const LEAD_STAGES = [
  "New enquiry",
  "Contact pending",
  "Qualified",
  "Consultation scheduled",
  "Design discussion",
  "Quotation pending",
  "Quote sent",
  "Won",
  "Lost",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];
export const PROJECT_STAGES = [
  "Enquiry received",
  "Lead qualified",
  "Site consultation",
  "Measurements completed",
  "Design in progress",
  "Design approved",
  "Quotation prepared",
  "Quotation accepted",
  "Materials ordered",
  "Manufacturing",
  "Quality checking",
  "Installation scheduled",
  "Installation completed",
  "Project handover",
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];
export interface Customer {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  contactMethod: string;
}
export interface UploadedReference {
  id: string;
  name: string;
  src: string;
  kind: "sample" | "local";
  size: number;
}
export interface KitchenEnquiry {
  projectType: string;
  layout: string;
  length: string;
  width: string;
  unit: string;
  measurementNotes: string;
  style: string;
  finish: string;
  benchtop: string;
  colour: string;
  storage: string[];
  appliances: string;
  budget: string;
  timeline: string;
  references: UploadedReference[];
  customer: Customer;
  comments: string;
  consent: boolean;
}
export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: string[];
}
export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  captured: Partial<KitchenEnquiry>;
  pending: "name" | "email" | "phone" | "layout" | "budget" | "timeline" | null;
}
export interface Task {
  id: string;
  text: string;
  done: boolean;
}
export interface ActivityEvent {
  id: string;
  at: string;
  text: string;
}
export interface Lead {
  id: string;
  enquiry: KitchenEnquiry;
  stage: LeadStage;
  createdAt: string;
  source: string;
  chatSessionId?: string;
  chatSummary?: string;
  tasks: Task[];
  activity: ActivityEvent[];
}
export interface Project {
  id: string;
  leadId: string;
  stage: ProjectStage;
  assignee: string;
  milestoneDates: Record<string, string>;
  tasks: Task[];
  notes: string[];
  activity: ActivityEvent[];
}
export interface DemoData {
  version: 1;
  leads: Lead[];
  projects: Project[];
  draft: KitchenEnquiry;
  step: number;
  chat: ChatSession;
}
export interface IntegrationAdapter {
  createLead(enquiry: KitchenEnquiry): Promise<{ externalId: string }>;
  updateProject(project: Project): Promise<void>;
}

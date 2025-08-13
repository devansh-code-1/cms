// HL7 FHIR Type Definitions for Healthcare CMS
// Based on FHIR R4 specifications

// Common FHIR types
export interface Reference {
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}

export interface Identifier {
  use?: string;
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Annotation {
  authorReference?: Reference;
  authorString?: string;
  time?: string;
  text: string;
}

export interface Duration {
  value?: number;
  comparator?: string;
  unit?: string;
  system?: string;
  code?: string;
}

// FHIR Goal Resource
export interface Goal {
  resourceType: 'Goal';
  id?: string;
  meta?: any;
  implicitRules?: string;
  language?: string;
  text?: any;
  contained?: any[];
  extension?: any[];
  modifierExtension?: any[];
  identifier?: Identifier[];
  lifecycleStatus: 'draft' | 'proposed' | 'planned' | 'accepted' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'entered-in-error' | 'rejected';
  achievementStatus?: CodeableConcept;
  category?: CodeableConcept[];
  continuous?: boolean;
  priority?: CodeableConcept;
  description: CodeableConcept;
  subject: Reference;
  startDate?: string;
  startCodeableConcept?: CodeableConcept;
  target?: GoalTarget[];
  statusDate?: string;
  statusReason?: string;
  source?: Reference;
  addresses?: Reference[];
  note?: Annotation[];
  outcome?: GoalOutcome[];
}

export interface GoalTarget {
  measure?: CodeableConcept;
  detailQuantity?: any;
  detailRange?: any;
  detailCodeableConcept?: CodeableConcept;
  detailString?: string;
  detailBoolean?: boolean;
  detailInteger?: number;
  detailRatio?: any;
  dueDate?: string;
  dueDuration?: Duration;
}

export interface GoalOutcome {
  resultCodeableConcept?: CodeableConcept;
  resultReference?: Reference;
}

// FHIR Task Resource
export interface Task {
  resourceType: 'Task';
  id?: string;
  meta?: any;
  implicitRules?: string;
  language?: string;
  text?: any;
  contained?: any[];
  extension?: any[];
  modifierExtension?: any[];
  identifier?: Identifier[];
  instantiatesCanonical?: string;
  instantiatesUri?: string;
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  partOf?: Reference[];
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error';
  statusReason?: CodeableConcept;
  businessStatus?: CodeableConcept;
  intent: 'unknown' | 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  code?: CodeableConcept;
  description?: string;
  focus?: Reference;
  for?: Reference;
  encounter?: Reference;
  executionPeriod?: Period;
  authoredOn?: string;
  lastModified?: string;
  requester?: Reference;
  performerType?: CodeableConcept[];
  owner?: Reference;
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  note?: Annotation[];
  relevantHistory?: Reference[];
  restriction?: TaskRestriction;
  input?: TaskInput[];
  output?: TaskOutput[];
}

export interface TaskRestriction {
  repetitions?: number;
  period?: Period;
  recipient?: Reference[];
}

export interface TaskInput {
  type: CodeableConcept;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: any;
  valueAge?: any;
  valueAnnotation?: Annotation;
  valueAttachment?: any;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: any;
  valueCount?: any;
  valueDistance?: any;
  valueDuration?: Duration;
  valueHumanName?: any;
  valueIdentifier?: Identifier;
  valueMoney?: any;
  valuePeriod?: Period;
  valueQuantity?: any;
  valueRange?: any;
  valueRatio?: any;
  valueReference?: Reference;
  valueSampledData?: any;
  valueSignature?: any;
  valueTiming?: any;
  valueContactDetail?: any;
  valueContributor?: any;
  valueDataRequirement?: any;
  valueExpression?: any;
  valueParameterDefinition?: any;
  valueRelatedArtifact?: any;
  valueTriggerDefinition?: any;
  valueUsageContext?: any;
  valueDosage?: any;
}

export interface TaskOutput {
  type: CodeableConcept;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: any;
  valueAge?: any;
  valueAnnotation?: Annotation;
  valueAttachment?: any;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: any;
  valueCount?: any;
  valueDistance?: any;
  valueDuration?: Duration;
  valueHumanName?: any;
  valueIdentifier?: Identifier;
  valueMoney?: any;
  valuePeriod?: Period;
  valueQuantity?: any;
  valueRange?: any;
  valueRatio?: any;
  valueReference?: Reference;
  valueSampledData?: any;
  valueSignature?: any;
  valueTiming?: any;
  valueContactDetail?: any;
  valueContributor?: any;
  valueDataRequirement?: any;
  valueExpression?: any;
  valueParameterDefinition?: any;
  valueRelatedArtifact?: any;
  valueTriggerDefinition?: any;
  valueUsageContext?: any;
  valueDosage?: any;
}

// FHIR CarePlan Resource
export interface CarePlan {
  resourceType: 'CarePlan';
  id?: string;
  meta?: any;
  implicitRules?: string;
  language?: string;
  text?: any;
  contained?: any[];
  extension?: any[];
  modifierExtension?: any[];
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  replaces?: Reference[];
  partOf?: Reference[];
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'option';
  category?: CodeableConcept[];
  title?: string;
  description?: string;
  subject: Reference;
  encounter?: Reference;
  period?: Period;
  created?: string;
  author?: Reference;
  contributor?: Reference[];
  careTeam?: Reference[];
  addresses?: Reference[];
  supportingInfo?: Reference[];
  goal?: Reference[];
  activity?: CarePlanActivity[];
  note?: Annotation[];
}

export interface CarePlanActivity {
  outcomeCodeableConcept?: CodeableConcept[];
  outcomeReference?: Reference[];
  progress?: Annotation[];
  reference?: Reference;
  detail?: CarePlanActivityDetail;
}

export interface CarePlanActivityDetail {
  kind?: 'Appointment' | 'CommunicationRequest' | 'DeviceRequest' | 'DiagnosticReport' | 'MedicationRequest' | 'NutritionOrder' | 'Task' | 'ServiceRequest' | 'VisionPrescription';
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  code?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  goal?: Reference[];
  status: 'not-started' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'stopped' | 'unknown' | 'entered-in-error';
  statusReason?: CodeableConcept;
  doNotPerform?: boolean;
  scheduledTiming?: any;
  scheduledPeriod?: Period;
  scheduledString?: string;
  location?: Reference;
  performer?: Reference[];
  productCodeableConcept?: CodeableConcept;
  productReference?: Reference;
  dailyAmount?: any;
  quantity?: any;
  description?: string;
}

// Local template types for UI
export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  fhirGoal: Goal;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  fhirTask: Task;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarePlanTemplate {
  id: string;
  name: string;
  description: string;
  fhirCarePlan: CarePlan;
  referencedGoals: string[];
  referencedTasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 'goal' | 'task' | 'careplan';
import { Goal, Task, CarePlan, Reference, CodeableConcept, Identifier } from '../types/fhir';

// FHIR utility functions
export class FHIRUtils {
  // Generate a FHIR-compliant identifier
  static generateIdentifier(value?: string): Identifier {
    return {
      use: 'usual',
      system: 'http://healthcare-cms.local/identifiers',
      value: value || this.generateUUID(),
    };
  }

  // Generate a UUID
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  // Create a reference to another resource
  static createReference(resourceType: string, id: string, display?: string): Reference {
    return {
      reference: `${resourceType}/${id}`,
      type: resourceType,
      display: display,
    };
  }

  // Create a CodeableConcept from simple text
  static createCodeableConceptFromText(text: string, system?: string, code?: string): CodeableConcept {
    return {
      coding: system && code ? [{
        system,
        code,
        display: text,
      }] : undefined,
      text,
    };
  }

  // Create a default Goal resource
  static createDefaultGoal(): Goal {
    return {
      resourceType: 'Goal',
      identifier: [this.generateIdentifier()],
      lifecycleStatus: 'draft',
      description: {
        text: '',
      },
      subject: {
        reference: 'Patient/example',
        display: 'Example Patient',
      },
    };
  }

  // Create a default Task resource
  static createDefaultTask(): Task {
    return {
      resourceType: 'Task',
      identifier: [this.generateIdentifier()],
      status: 'draft',
      intent: 'plan',
      for: {
        reference: 'Patient/example',
        display: 'Example Patient',
      },
    };
  }

  // Create a default CarePlan resource
  static createDefaultCarePlan(): CarePlan {
    return {
      resourceType: 'CarePlan',
      identifier: [this.generateIdentifier()],
      status: 'draft',
      intent: 'plan',
      subject: {
        reference: 'Patient/example',
        display: 'Example Patient',
      },
    };
  }

  // Validate required fields for Goal
  static validateGoal(goal: Goal): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!goal.lifecycleStatus) {
      errors.push('Lifecycle status is required');
    }

    if (!goal.description || !goal.description.text) {
      errors.push('Description is required');
    }

    if (!goal.subject || !goal.subject.reference) {
      errors.push('Subject reference is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate required fields for Task
  static validateTask(task: Task): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!task.status) {
      errors.push('Status is required');
    }

    if (!task.intent) {
      errors.push('Intent is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate required fields for CarePlan
  static validateCarePlan(carePlan: CarePlan): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!carePlan.status) {
      errors.push('Status is required');
    }

    if (!carePlan.intent) {
      errors.push('Intent is required');
    }

    if (!carePlan.subject || !carePlan.subject.reference) {
      errors.push('Subject reference is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Export templates as JSON
  static exportToJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  // Import templates from JSON
  static importFromJSON<T>(jsonString: string): T | null {
    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return null;
    }
  }

  // Format date for FHIR
  static formatFHIRDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Format datetime for FHIR
  static formatFHIRDateTime(date: Date): string {
    return date.toISOString();
  }

  // Parse FHIR date
  static parseFHIRDate(dateString: string): Date | null {
    try {
      return new Date(dateString);
    } catch {
      return null;
    }
  }

  // Get display text from CodeableConcept
  static getCodeableConceptDisplay(concept: CodeableConcept): string {
    if (concept.text) {
      return concept.text;
    }
    
    if (concept.coding && concept.coding.length > 0) {
      const coding = concept.coding[0];
      return coding.display || coding.code || '';
    }
    
    return '';
  }

  // Get reference display text
  static getReferenceDisplay(reference: Reference): string {
    return reference.display || reference.reference || '';
  }

  // Check if a resource references another resource
  static referencesResource(resource: Goal | Task | CarePlan, targetType: string, targetId: string): boolean {
    const targetReference = `${targetType}/${targetId}`;
    
    if (resource.resourceType === 'CarePlan') {
      const carePlan = resource as CarePlan;
      
      // Check goal references
      if (carePlan.goal) {
        for (const goalRef of carePlan.goal) {
          if (goalRef.reference === targetReference) {
            return true;
          }
        }
      }
      
      // Check activity references
      if (carePlan.activity) {
        for (const activity of carePlan.activity) {
          if (activity.reference?.reference === targetReference) {
            return true;
          }
          
          if (activity.detail?.goal) {
            for (const goalRef of activity.detail.goal) {
              if (goalRef.reference === targetReference) {
                return true;
              }
            }
          }
        }
      }
    }
    
    return false;
  }
}
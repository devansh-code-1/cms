import { GoalTemplate, TaskTemplate, CarePlanTemplate } from '../types/fhir';

export interface ExportData {
  goals: GoalTemplate[];
  tasks: TaskTemplate[];
  carePlans: CarePlanTemplate[];
  exportDate: string;
  version: string;
}

// Export all templates to JSON
export const exportTemplates = (
  goals: GoalTemplate[],
  tasks: TaskTemplate[],
  carePlans: CarePlanTemplate[]
): string => {
  const exportData: ExportData = {
    goals,
    tasks,
    carePlans,
    exportDate: new Date().toISOString(),
    version: '1.0',
  };
  
  return JSON.stringify(exportData, null, 2);
};

// Import templates from JSON
export const importTemplates = (jsonString: string): ExportData | null => {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate structure
    if (!data.goals || !data.tasks || !data.carePlans) {
      throw new Error('Invalid export format');
    }
    
    // Convert date strings back to Date objects
    const goals = data.goals.map((goal: any) => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
    }));
    
    const tasks = data.tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
    
    const carePlans = data.carePlans.map((carePlan: any) => ({
      ...carePlan,
      createdAt: new Date(carePlan.createdAt),
      updatedAt: new Date(carePlan.updatedAt),
    }));
    
    return {
      ...data,
      goals,
      tasks,
      carePlans,
    };
  } catch (error) {
    console.error('Failed to import templates:', error);
    return null;
  }
};

// Download file helper
export const downloadFile = (content: string, filename: string, mimeType: string = 'application/json') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
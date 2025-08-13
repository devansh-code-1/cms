import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GoalTemplate, TaskTemplate, CarePlanTemplate } from '../types/fhir';

// State interface
interface TemplateState {
  goalTemplates: GoalTemplate[];
  taskTemplates: TaskTemplate[];
  carePlanTemplates: CarePlanTemplate[];
  loading: boolean;
  error: string | null;
}

// Action types
type TemplateAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_GOAL_TEMPLATE'; payload: GoalTemplate }
  | { type: 'UPDATE_GOAL_TEMPLATE'; payload: GoalTemplate }
  | { type: 'DELETE_GOAL_TEMPLATE'; payload: string }
  | { type: 'ADD_TASK_TEMPLATE'; payload: TaskTemplate }
  | { type: 'UPDATE_TASK_TEMPLATE'; payload: TaskTemplate }
  | { type: 'DELETE_TASK_TEMPLATE'; payload: string }
  | { type: 'ADD_CAREPLAN_TEMPLATE'; payload: CarePlanTemplate }
  | { type: 'UPDATE_CAREPLAN_TEMPLATE'; payload: CarePlanTemplate }
  | { type: 'DELETE_CAREPLAN_TEMPLATE'; payload: string }
  | { type: 'LOAD_TEMPLATES'; payload: { goals: GoalTemplate[], tasks: TaskTemplate[], carePlans: CarePlanTemplate[] } };

// Initial state
const initialState: TemplateState = {
  goalTemplates: [],
  taskTemplates: [],
  carePlanTemplates: [],
  loading: false,
  error: null,
};

// Reducer
function templateReducer(state: TemplateState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_GOAL_TEMPLATE':
      return { 
        ...state, 
        goalTemplates: [...state.goalTemplates, action.payload]
      };
    case 'UPDATE_GOAL_TEMPLATE':
      return {
        ...state,
        goalTemplates: state.goalTemplates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
      };
    case 'DELETE_GOAL_TEMPLATE':
      return {
        ...state,
        goalTemplates: state.goalTemplates.filter(template => template.id !== action.payload),
      };
    case 'ADD_TASK_TEMPLATE':
      return { 
        ...state, 
        taskTemplates: [...state.taskTemplates, action.payload]
      };
    case 'UPDATE_TASK_TEMPLATE':
      return {
        ...state,
        taskTemplates: state.taskTemplates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
      };
    case 'DELETE_TASK_TEMPLATE':
      return {
        ...state,
        taskTemplates: state.taskTemplates.filter(template => template.id !== action.payload),
      };
    case 'ADD_CAREPLAN_TEMPLATE':
      return { 
        ...state, 
        carePlanTemplates: [...state.carePlanTemplates, action.payload]
      };
    case 'UPDATE_CAREPLAN_TEMPLATE':
      return {
        ...state,
        carePlanTemplates: state.carePlanTemplates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
      };
    case 'DELETE_CAREPLAN_TEMPLATE':
      return {
        ...state,
        carePlanTemplates: state.carePlanTemplates.filter(template => template.id !== action.payload),
      };
    case 'LOAD_TEMPLATES':
      return {
        ...state,
        goalTemplates: action.payload.goals,
        taskTemplates: action.payload.tasks,
        carePlanTemplates: action.payload.carePlans,
      };
    default:
      return state;
  }
}

// Context
interface TemplateContextType {
  state: TemplateState;
  dispatch: React.Dispatch<TemplateAction>;
  addGoalTemplate: (template: Omit<GoalTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoalTemplate: (template: GoalTemplate) => void;
  deleteGoalTemplate: (id: string) => void;
  addTaskTemplate: (template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTaskTemplate: (template: TaskTemplate) => void;
  deleteTaskTemplate: (id: string) => void;
  addCarePlanTemplate: (template: Omit<CarePlanTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCarePlanTemplate: (template: CarePlanTemplate) => void;
  deleteCarePlanTemplate: (id: string) => void;
  getGoalTemplate: (id: string) => GoalTemplate | undefined;
  getTaskTemplate: (id: string) => TaskTemplate | undefined;
  getCarePlanTemplate: (id: string) => CarePlanTemplate | undefined;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Provider component
interface TemplateProviderProps {
  children: ReactNode;
}

export function TemplateProvider({ children }: TemplateProviderProps) {
  const [state, dispatch] = useReducer(templateReducer, initialState);

  const addGoalTemplate = (template: Omit<GoalTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: GoalTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_GOAL_TEMPLATE', payload: newTemplate });
  };

  const updateGoalTemplate = (template: GoalTemplate) => {
    const updatedTemplate = { ...template, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_GOAL_TEMPLATE', payload: updatedTemplate });
  };

  const deleteGoalTemplate = (id: string) => {
    dispatch({ type: 'DELETE_GOAL_TEMPLATE', payload: id });
  };

  const addTaskTemplate = (template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK_TEMPLATE', payload: newTemplate });
  };

  const updateTaskTemplate = (template: TaskTemplate) => {
    const updatedTemplate = { ...template, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_TASK_TEMPLATE', payload: updatedTemplate });
  };

  const deleteTaskTemplate = (id: string) => {
    dispatch({ type: 'DELETE_TASK_TEMPLATE', payload: id });
  };

  const addCarePlanTemplate = (template: Omit<CarePlanTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: CarePlanTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CAREPLAN_TEMPLATE', payload: newTemplate });
  };

  const updateCarePlanTemplate = (template: CarePlanTemplate) => {
    const updatedTemplate = { ...template, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_CAREPLAN_TEMPLATE', payload: updatedTemplate });
  };

  const deleteCarePlanTemplate = (id: string) => {
    dispatch({ type: 'DELETE_CAREPLAN_TEMPLATE', payload: id });
  };

  const getGoalTemplate = (id: string): GoalTemplate | undefined => {
    return state.goalTemplates.find(template => template.id === id);
  };

  const getTaskTemplate = (id: string): TaskTemplate | undefined => {
    return state.taskTemplates.find(template => template.id === id);
  };

  const getCarePlanTemplate = (id: string): CarePlanTemplate | undefined => {
    return state.carePlanTemplates.find(template => template.id === id);
  };

  const contextValue: TemplateContextType = {
    state,
    dispatch,
    addGoalTemplate,
    updateGoalTemplate,
    deleteGoalTemplate,
    addTaskTemplate,
    updateTaskTemplate,
    deleteTaskTemplate,
    addCarePlanTemplate,
    updateCarePlanTemplate,
    deleteCarePlanTemplate,
    getGoalTemplate,
    getTaskTemplate,
    getCarePlanTemplate,
  };

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
}

// Custom hook to use the context
export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
import React, { useState } from 'react';
import { GoalTemplate, TaskTemplate, CarePlanTemplate, TemplateType } from '../types/fhir';
import { useTemplates } from '../contexts/TemplateContext';
import { Layout } from '../components/layout/Layout';
import { TemplateList } from '../components/common/TemplateList';
import { GoalTemplateForm } from '../components/templates/GoalTemplate/GoalTemplateForm';
import { TaskTemplateForm } from '../components/templates/TaskTemplate/TaskTemplateForm';
import { CarePlanTemplateForm } from '../components/templates/CarePlanTemplate/CarePlanTemplateForm';
import './Dashboard.css';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

interface EditState {
  template: GoalTemplate | TaskTemplate | CarePlanTemplate;
  type: TemplateType;
}

export const Dashboard: React.FC = () => {
  const {
    addGoalTemplate,
    updateGoalTemplate,
    addTaskTemplate,
    updateTaskTemplate,
    addCarePlanTemplate,
    updateCarePlanTemplate,
  } = useTemplates();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [createType, setCreateType] = useState<TemplateType>('goal');
  const [editState, setEditState] = useState<EditState | null>(null);
  const [viewState, setViewState] = useState<EditState | null>(null);

  const handleCreateTemplate = (type: TemplateType) => {
    setCreateType(type);
    setViewMode('create');
  };

  const handleEditTemplate = (template: GoalTemplate | TaskTemplate | CarePlanTemplate, type: TemplateType) => {
    setEditState({ template, type });
    setViewMode('edit');
  };

  const handleViewTemplate = (template: GoalTemplate | TaskTemplate | CarePlanTemplate, type: TemplateType) => {
    setViewState({ template, type });
    setViewMode('view');
  };

  const handleSaveTemplate = (templateData: any, type: TemplateType, isEdit: boolean = false) => {
    if (isEdit && editState) {
      switch (type) {
        case 'goal':
          updateGoalTemplate({ ...editState.template as GoalTemplate, ...templateData });
          break;
        case 'task':
          updateTaskTemplate({ ...editState.template as TaskTemplate, ...templateData });
          break;
        case 'careplan':
          updateCarePlanTemplate({ ...editState.template as CarePlanTemplate, ...templateData });
          break;
      }
    } else {
      switch (type) {
        case 'goal':
          addGoalTemplate(templateData);
          break;
        case 'task':
          addTaskTemplate(templateData);
          break;
        case 'careplan':
          addCarePlanTemplate(templateData);
          break;
      }
    }
    
    setViewMode('list');
    setEditState(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditState(null);
    setViewState(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        switch (createType) {
          case 'goal':
            return (
              <GoalTemplateForm
                onSave={(data) => handleSaveTemplate(data, 'goal')}
                onCancel={handleCancel}
              />
            );
          case 'task':
            return (
              <TaskTemplateForm
                onSave={(data) => handleSaveTemplate(data, 'task')}
                onCancel={handleCancel}
              />
            );
          case 'careplan':
            return (
              <CarePlanTemplateForm
                onSave={(data) => handleSaveTemplate(data, 'careplan')}
                onCancel={handleCancel}
              />
            );
        }
        break;

      case 'edit':
        if (!editState) return null;
        switch (editState.type) {
          case 'goal':
            return (
              <GoalTemplateForm
                template={editState.template as GoalTemplate}
                onSave={(data) => handleSaveTemplate(data, 'goal', true)}
                onCancel={handleCancel}
              />
            );
          case 'task':
            return (
              <TaskTemplateForm
                template={editState.template as TaskTemplate}
                onSave={(data) => handleSaveTemplate(data, 'task', true)}
                onCancel={handleCancel}
              />
            );
          case 'careplan':
            return (
              <CarePlanTemplateForm
                template={editState.template as CarePlanTemplate}
                onSave={(data) => handleSaveTemplate(data, 'careplan', true)}
                onCancel={handleCancel}
              />
            );
        }
        break;

      case 'view':
        if (!viewState) return null;
        return (
          <div className="template-viewer">
            <div className="template-viewer__header">
              <h2>{viewState.template.name}</h2>
              <button 
                className="template-viewer__close"
                onClick={handleCancel}
              >
                ✕
              </button>
            </div>
            
            <div className="template-viewer__content">
              <div className="template-viewer__section">
                <h3>Template Information</h3>
                <p><strong>Name:</strong> {viewState.template.name}</p>
                <p><strong>Description:</strong> {viewState.template.description}</p>
                <p><strong>Created:</strong> {viewState.template.createdAt.toLocaleString()}</p>
                <p><strong>Updated:</strong> {viewState.template.updatedAt.toLocaleString()}</p>
              </div>

              <div className="template-viewer__section">
                <h3>FHIR Resource</h3>
                <pre className="template-viewer__json">
                  {JSON.stringify(
                    viewState.type === 'goal' ? (viewState.template as GoalTemplate).fhirGoal :
                    viewState.type === 'task' ? (viewState.template as TaskTemplate).fhirTask :
                    (viewState.template as CarePlanTemplate).fhirCarePlan,
                    null,
                    2
                  )}
                </pre>
              </div>

              {viewState.type === 'careplan' && (
                <div className="template-viewer__section">
                  <h3>Referenced Templates</h3>
                  <p><strong>Goals:</strong> {(viewState.template as CarePlanTemplate).referencedGoals.length}</p>
                  <p><strong>Tasks:</strong> {(viewState.template as CarePlanTemplate).referencedTasks.length}</p>
                </div>
              )}
            </div>

            <div className="template-viewer__actions">
              <button 
                className="btn btn--secondary"
                onClick={() => handleEditTemplate(viewState.template, viewState.type)}
              >
                Edit Template
              </button>
              <button 
                className="btn btn--outline"
                onClick={handleCancel}
              >
                Close
              </button>
            </div>
          </div>
        );

      case 'list':
      default:
        return (
          <TemplateList
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
            onViewTemplate={handleViewTemplate}
          />
        );
    }
  };

  return (
    <Layout>
      <div className="dashboard">
        {renderContent()}
      </div>
    </Layout>
  );
};
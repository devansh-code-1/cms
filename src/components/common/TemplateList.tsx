import React, { useState, useRef } from 'react';
import { GoalTemplate, TaskTemplate, CarePlanTemplate, TemplateType } from '../../types/fhir';
import { useTemplates } from '../../contexts/TemplateContext';
import { exportTemplates, importTemplates, downloadFile } from '../../utils/exportImport';
import { Button } from '../common/Button';
import './TemplateList.css';

interface TemplateListProps {
  onCreateTemplate: (type: TemplateType) => void;
  onEditTemplate: (template: GoalTemplate | TaskTemplate | CarePlanTemplate, type: TemplateType) => void;
  onViewTemplate: (template: GoalTemplate | TaskTemplate | CarePlanTemplate, type: TemplateType) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  onCreateTemplate,
  onEditTemplate,
  onViewTemplate,
}) => {
  const { 
    state, 
    deleteGoalTemplate, 
    deleteTaskTemplate, 
    deleteCarePlanTemplate,
    dispatch 
  } = useTemplates();
  const [activeTab, setActiveTab] = useState<TemplateType>('goal');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string, type: TemplateType) => {
    if (window.confirm(`Are you sure you want to delete this ${type} template?`)) {
      switch (type) {
        case 'goal':
          deleteGoalTemplate(id);
          break;
        case 'task':
          deleteTaskTemplate(id);
          break;
        case 'careplan':
          deleteCarePlanTemplate(id);
          break;
      }
    }
  };

  const handleExport = () => {
    const exportData = exportTemplates(
      state.goalTemplates,
      state.taskTemplates,
      state.carePlanTemplates
    );
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(exportData, `healthcare-cms-templates-${timestamp}.json`);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const importData = importTemplates(content);
      
      if (importData) {
        dispatch({
          type: 'LOAD_TEMPLATES',
          payload: {
            goals: importData.goals,
            tasks: importData.tasks,
            carePlans: importData.carePlans,
          },
        });
        alert('Templates imported successfully!');
      } else {
        alert('Failed to import templates. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  const filterTemplates = <T extends { name: string; description: string }>(templates: T[]): T[] => {
    if (!searchQuery) return templates;
    return templates.filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderTemplateCard = (
    template: GoalTemplate | TaskTemplate | CarePlanTemplate,
    type: TemplateType
  ) => {
    let statusText = '';
    let statusClass = '';
    
    if (type === 'goal') {
      const goalTemplate = template as GoalTemplate;
      statusText = goalTemplate.fhirGoal.lifecycleStatus;
      statusClass = `status--${goalTemplate.fhirGoal.lifecycleStatus}`;
    } else if (type === 'task') {
      const taskTemplate = template as TaskTemplate;
      statusText = taskTemplate.fhirTask.status;
      statusClass = `status--${taskTemplate.fhirTask.status}`;
    } else {
      const carePlanTemplate = template as CarePlanTemplate;
      statusText = carePlanTemplate.fhirCarePlan.status;
      statusClass = `status--${carePlanTemplate.fhirCarePlan.status}`;
    }

    return (
      <div key={template.id} className="template-card">
        <div className="template-card__header">
          <h3 className="template-card__title">{template.name}</h3>
          <div className={`template-card__status ${statusClass}`}>
            {statusText}
          </div>
        </div>
        
        <p className="template-card__description">{template.description}</p>
        
        <div className="template-card__meta">
          <span className="template-card__date">
            Created: {formatDate(template.createdAt)}
          </span>
          <span className="template-card__date">
            Updated: {formatDate(template.updatedAt)}
          </span>
        </div>

        {type === 'careplan' && (
          <div className="template-card__references">
            <div className="template-card__reference-section">
              <strong>Goals:</strong> {(template as CarePlanTemplate).referencedGoals.length}
            </div>
            <div className="template-card__reference-section">
              <strong>Tasks:</strong> {(template as CarePlanTemplate).referencedTasks.length}
            </div>
          </div>
        )}
        
        <div className="template-card__actions">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewTemplate(template, type)}
          >
            View
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => onEditTemplate(template, type)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => handleDelete(template.id, type)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="template-list">
      <div className="template-list__header">
        <h2>Template Management</h2>
        <div className="template-list__search">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="template-list__search-input"
          />
        </div>
      </div>

      <div className="template-list__tabs">
        <button 
          className={`template-list__tab ${activeTab === 'goal' ? 'template-list__tab--active' : ''}`}
          onClick={() => setActiveTab('goal')}
        >
          Goal Templates ({state.goalTemplates.length})
        </button>
        <button 
          className={`template-list__tab ${activeTab === 'task' ? 'template-list__tab--active' : ''}`}
          onClick={() => setActiveTab('task')}
        >
          Task Templates ({state.taskTemplates.length})
        </button>
        <button 
          className={`template-list__tab ${activeTab === 'careplan' ? 'template-list__tab--active' : ''}`}
          onClick={() => setActiveTab('careplan')}
        >
          Care Plan Templates ({state.carePlanTemplates.length})
        </button>
      </div>

      <div className="template-list__content">
        <div className="template-list__toolbar">
          <div className="template-list__toolbar-left">
            <Button 
              variant="primary" 
              onClick={() => onCreateTemplate(activeTab)}
            >
              Create New {activeTab === 'goal' ? 'Goal' : activeTab === 'task' ? 'Task' : 'Care Plan'} Template
            </Button>
          </div>
          
          <div className="template-list__toolbar-right">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleImport}
            >
              Import Templates
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleExport}
            >
              Export All
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="template-list__grid">
          {activeTab === 'goal' && (
            <>
              {filterTemplates(state.goalTemplates).length === 0 ? (
                <div className="template-list__empty">
                  {searchQuery ? 'No goal templates match your search.' : 'No goal templates created yet.'}
                </div>
              ) : (
                filterTemplates(state.goalTemplates).map(template => 
                  renderTemplateCard(template, 'goal')
                )
              )}
            </>
          )}

          {activeTab === 'task' && (
            <>
              {filterTemplates(state.taskTemplates).length === 0 ? (
                <div className="template-list__empty">
                  {searchQuery ? 'No task templates match your search.' : 'No task templates created yet.'}
                </div>
              ) : (
                filterTemplates(state.taskTemplates).map(template => 
                  renderTemplateCard(template, 'task')
                )
              )}
            </>
          )}

          {activeTab === 'careplan' && (
            <>
              {filterTemplates(state.carePlanTemplates).length === 0 ? (
                <div className="template-list__empty">
                  {searchQuery ? 'No care plan templates match your search.' : 'No care plan templates created yet.'}
                </div>
              ) : (
                filterTemplates(state.carePlanTemplates).map(template => 
                  renderTemplateCard(template, 'careplan')
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { CarePlan, CarePlanTemplate, Reference } from '../../../types/fhir';
import { FHIRUtils } from '../../../utils/fhirUtils';
import { useTemplates } from '../../../contexts/TemplateContext';
import { FormField } from '../../common/FormField';
import { Button } from '../../common/Button';
import './CarePlanTemplateForm.css';

interface CarePlanTemplateFormProps {
  template?: CarePlanTemplate;
  onSave: (template: Omit<CarePlanTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const CarePlanTemplateForm: React.FC<CarePlanTemplateFormProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const { state } = useTemplates();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fhirCarePlan, setFhirCarePlan] = useState<CarePlan>(() => 
    template?.fhirCarePlan || FHIRUtils.createDefaultCarePlan()
  );
  const [referencedGoals, setReferencedGoals] = useState<string[]>(() => 
    template?.referencedGoals || []
  );
  const [referencedTasks, setReferencedTasks] = useState<string[]>(() => 
    template?.referencedTasks || []
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setFhirCarePlan(template.fhirCarePlan);
      setReferencedGoals(template.referencedGoals);
      setReferencedTasks(template.referencedTasks);
    }
  }, [template]);

  // Update FHIR CarePlan when referenced goals/tasks change
  useEffect(() => {
    const goalReferences: Reference[] = referencedGoals.map(goalId => {
      const goalTemplate = state.goalTemplates.find(g => g.id === goalId);
      return FHIRUtils.createReference('Goal', goalTemplate?.fhirGoal.id || goalId, goalTemplate?.name);
    });

    const taskActivities = referencedTasks.map(taskId => {
      const taskTemplate = state.taskTemplates.find(t => t.id === taskId);
      return {
        reference: FHIRUtils.createReference('Task', taskTemplate?.fhirTask.id || taskId, taskTemplate?.name),
      };
    });

    setFhirCarePlan(prev => ({
      ...prev,
      goal: goalReferences.length > 0 ? goalReferences : undefined,
      activity: taskActivities.length > 0 ? taskActivities : undefined,
    }));
  }, [referencedGoals, referencedTasks, state.goalTemplates, state.taskTemplates]);

  const handleFhirFieldChange = (field: keyof CarePlan, value: any) => {
    setFhirCarePlan(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReferenceChange = (field: keyof CarePlan, reference: string, display: string) => {
    setFhirCarePlan(prev => ({
      ...prev,
      [field]: {
        reference,
        display,
      },
    }));
  };

  const handleGoalToggle = (goalId: string) => {
    setReferencedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleTaskToggle = (taskId: string) => {
    setReferencedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Template description is required';
    }

    const fhirValidation = FHIRUtils.validateCarePlan(fhirCarePlan);
    if (!fhirValidation.isValid) {
      newErrors.fhir = fhirValidation.errors.join(', ');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        name,
        description,
        fhirCarePlan,
        referencedGoals,
        referencedTasks,
      });
    }
  };

  return (
    <div className="careplan-template-form">
      <div className="careplan-template-form__header">
        <h2>{template ? 'Edit Care Plan Template' : 'Create Care Plan Template'}</h2>
        <p className="careplan-template-form__subtitle">
          Create comprehensive care plan templates that reference goal and task templates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="careplan-template-form__form">
        <div className="careplan-template-form__section">
          <h3>Template Information</h3>
          
          <FormField
            label="Template Name"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name..."
            />
          </FormField>

          <FormField
            label="Template Description"
            required
            error={errors.description}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this care plan template..."
              rows={3}
            />
          </FormField>
        </div>

        <div className="careplan-template-form__section">
          <h3>FHIR CarePlan Details</h3>
          
          <div className="careplan-template-form__row">
            <FormField
              label="Status"
              required
              description="Indicates whether the plan is currently being acted upon"
            >
              <select
                value={fhirCarePlan.status}
                onChange={(e) => handleFhirFieldChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="revoked">Revoked</option>
                <option value="completed">Completed</option>
                <option value="entered-in-error">Entered in Error</option>
                <option value="unknown">Unknown</option>
              </select>
            </FormField>

            <FormField
              label="Intent"
              required
              description="Indicates the level of authority/intentionality"
            >
              <select
                value={fhirCarePlan.intent}
                onChange={(e) => handleFhirFieldChange('intent', e.target.value)}
              >
                <option value="proposal">Proposal</option>
                <option value="plan">Plan</option>
                <option value="order">Order</option>
                <option value="option">Option</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Title"
            description="Human-friendly name for the care plan"
          >
            <input
              type="text"
              value={fhirCarePlan.title || ''}
              onChange={(e) => handleFhirFieldChange('title', e.target.value)}
              placeholder="Care plan title..."
            />
          </FormField>

          <FormField
            label="Description"
            description="Summary of nature of plan"
          >
            <textarea
              value={fhirCarePlan.description || ''}
              onChange={(e) => handleFhirFieldChange('description', e.target.value)}
              placeholder="Describe the care plan..."
              rows={3}
            />
          </FormField>

          <div className="careplan-template-form__row">
            <FormField
              label="Subject Reference"
              required
              description="Patient or group this plan is for"
            >
              <input
                type="text"
                value={fhirCarePlan.subject.reference || ''}
                onChange={(e) => handleReferenceChange('subject', e.target.value, fhirCarePlan.subject.display || '')}
                placeholder="Patient/123 or Group/456"
              />
            </FormField>

            <FormField
              label="Subject Display"
              description="Human-readable name"
            >
              <input
                type="text"
                value={fhirCarePlan.subject.display || ''}
                onChange={(e) => handleReferenceChange('subject', fhirCarePlan.subject.reference || '', e.target.value)}
                placeholder="Patient or group name"
              />
            </FormField>
          </div>

          <div className="careplan-template-form__row">
            <FormField
              label="Period Start"
              description="Time period plan covers - start"
            >
              <input
                type="date"
                value={fhirCarePlan.period?.start || ''}
                onChange={(e) => setFhirCarePlan(prev => ({
                  ...prev,
                  period: { ...prev.period, start: e.target.value }
                }))}
              />
            </FormField>

            <FormField
              label="Period End"
              description="Time period plan covers - end"
            >
              <input
                type="date"
                value={fhirCarePlan.period?.end || ''}
                onChange={(e) => setFhirCarePlan(prev => ({
                  ...prev,
                  period: { ...prev.period, end: e.target.value }
                }))}
              />
            </FormField>
          </div>

          <FormField
            label="Created"
            description="Date this plan was created"
          >
            <input
              type="datetime-local"
              value={fhirCarePlan.created ? fhirCarePlan.created.replace('Z', '') : ''}
              onChange={(e) => handleFhirFieldChange('created', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            />
          </FormField>
        </div>

        <div className="careplan-template-form__section">
          <h3>Referenced Goal Templates</h3>
          <p className="careplan-template-form__section-description">
            Select goal templates that this care plan should reference
          </p>
          
          {state.goalTemplates.length === 0 ? (
            <div className="careplan-template-form__empty-state">
              No goal templates available. Create goal templates first to reference them in care plans.
            </div>
          ) : (
            <div className="careplan-template-form__checkbox-list">
              {state.goalTemplates.map(goal => (
                <label key={goal.id} className="careplan-template-form__checkbox-item">
                  <input
                    type="checkbox"
                    checked={referencedGoals.includes(goal.id)}
                    onChange={() => handleGoalToggle(goal.id)}
                  />
                  <div className="careplan-template-form__checkbox-content">
                    <strong>{goal.name}</strong>
                    <span>{goal.description}</span>
                    <small>Status: {goal.fhirGoal.lifecycleStatus}</small>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="careplan-template-form__section">
          <h3>Referenced Task Templates</h3>
          <p className="careplan-template-form__section-description">
            Select task templates that this care plan should include as activities
          </p>
          
          {state.taskTemplates.length === 0 ? (
            <div className="careplan-template-form__empty-state">
              No task templates available. Create task templates first to reference them in care plans.
            </div>
          ) : (
            <div className="careplan-template-form__checkbox-list">
              {state.taskTemplates.map(task => (
                <label key={task.id} className="careplan-template-form__checkbox-item">
                  <input
                    type="checkbox"
                    checked={referencedTasks.includes(task.id)}
                    onChange={() => handleTaskToggle(task.id)}
                  />
                  <div className="careplan-template-form__checkbox-content">
                    <strong>{task.name}</strong>
                    <span>{task.description}</span>
                    <small>Status: {task.fhirTask.status}, Intent: {task.fhirTask.intent}</small>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {errors.fhir && (
          <div className="careplan-template-form__error">
            FHIR validation errors: {errors.fhir}
          </div>
        )}

        <div className="careplan-template-form__actions">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  );
};
import { Field, Widget } from '../../../src/models';
import { PlannedContainer, IPlannedContainer } from '../../../src/metadata';

describe('PlannedContainer', () => {
  const simpleWidgetName: string = 'widgetName';
  const simpleWidget = {
    name: simpleWidgetName,
    type: 'ZdWidget',
    isVisible: true,
  };
  const plannedSimpleWidget = {
    widget: { ...simpleWidget },
    fields: {},
  };

  beforeEach(() => {
    new PlannedContainer();
  });

  describe('addWidget()', () => {
    it('should add new widget', () => {
      const widgets = PlannedContainer.container.widgets;
      expect(widgets[simpleWidgetName]).toBeUndefined();
      PlannedContainer.addWidget({ ...simpleWidget } as Widget);
      expect(widgets[simpleWidgetName]).toEqual(plannedSimpleWidget);
    });

    it('should replace widgets with same name', () => {
      const widgets = PlannedContainer.container.widgets;
      const anotherWidgetWithSameName = simpleWidget;
      const plannedAnotherWidgetWithSameName = plannedSimpleWidget;
      anotherWidgetWithSameName.isVisible = false;
      plannedAnotherWidgetWithSameName.widget.isVisible = false;

      PlannedContainer.addWidget({ ...simpleWidget } as Widget);
      expect(widgets[simpleWidgetName]).toEqual(plannedSimpleWidget);
      PlannedContainer.addWidget({ ...anotherWidgetWithSameName } as Widget);
      expect(widgets[simpleWidgetName]).toEqual(plannedAnotherWidgetWithSameName);
    });
  });

  describe('addField()', () => {
    const simpleField = {
      name: 'fieldName',
      type: 'ZdField',
      isVisible: true,
    };

    beforeEach(() => {
      PlannedContainer.addWidget(simpleWidget as Widget);
    });

    it('should add new field to widget', () => {
      const fields = PlannedContainer.container.widgets[simpleWidgetName].fields;
      expect(fields['fieldName']).toBeUndefined();
      PlannedContainer.addField(simpleWidgetName, { ...simpleField } as Field);
      expect(fields['fieldName']).toEqual(simpleField);
    });

    it('should replace fields with same name', () => {
      const fields = PlannedContainer.container.widgets[simpleWidgetName].fields;
      const anotherFieldWithSameName = simpleField;
      anotherFieldWithSameName.isVisible = false;
      PlannedContainer.addField(simpleWidgetName, { ...simpleField } as Field);
      expect(fields['fieldName']).toEqual(simpleField);
      PlannedContainer.addField(simpleWidgetName, { ...anotherFieldWithSameName } as Field);
      expect(fields['fieldName']).toEqual(anotherFieldWithSameName);
    });
  });

  it('reset()', () => {
    const emptyContainer: IPlannedContainer = {
      widgets: {},
    };

    PlannedContainer.addWidget(simpleWidget as Widget);
    expect(PlannedContainer.container.widgets[simpleWidgetName]).toEqual(plannedSimpleWidget);
    PlannedContainer.reset();
    expect(PlannedContainer.container).toEqual(emptyContainer);
  });
});

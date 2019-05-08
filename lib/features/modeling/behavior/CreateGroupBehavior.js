import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

import {
  getBusinessObject,
  is
} from '../../../util/ModelUtil';


/**
 * BPMN specific create Group behavior
 */
export default function CreateGroupBehavior(eventBus, bpmnFactory, canvas) {

  CommandInterceptor.call(this, eventBus);

  function getDefinitions() {
    var rootElement = canvas.getRootElement(),
        businessObject = getBusinessObject(rootElement);

    return businessObject.$parent;
  }

  this.revert('shape.create', function(event) {
    var context = event.context,
        shape = context.shape,
        businessObject = getBusinessObject(shape);

    if (is(businessObject, 'bpmn:Group') && businessObject.categoryValueRef) {

      // cleanup created category and value
      var categoryValue = businessObject.categoryValueRef,
          category = categoryValue.$parent,
          definitions = getDefinitions();

      collectionRemove(category.get('categoryValue'), categoryValue);
      collectionRemove(definitions.get('rootElements'), category);

      delete businessObject.categoryValueRef;

    }
  });

  this.execute('shape.create', function(event) {

    var context = event.context,
        shape = context.shape,
        businessObject = getBusinessObject(shape);

    if (is(businessObject, 'bpmn:Group')) {

      var definitions = getDefinitions();

      // create new category + value when group was created
      var categoryValue = bpmnFactory.create('bpmn:CategoryValue'),
          category = bpmnFactory.create('bpmn:Category', {
            categoryValue: [ categoryValue ]
          });

      // add to correct place
      collectionAdd(definitions.get('rootElements'), category);
      getBusinessObject(category).$parent = definitions;
      getBusinessObject(categoryValue).$parent = category;

      // link the reference to the Group
      businessObject.categoryValueRef = categoryValue;

    }

  });

}

CreateGroupBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'canvas'
];

inherits(CreateGroupBehavior, CommandInterceptor);
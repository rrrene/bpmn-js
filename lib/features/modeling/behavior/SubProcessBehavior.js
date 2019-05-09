import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isExpanded } from '../../../util/DiUtil';

import { is } from '../../../util/ModelUtil';

export default function SubProcessBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  /**
   * Adjust position of expanded SubProcess after it replaces a shape
   * with previous content
   */
  this.postExecuted('shape.replace', function(event) {
    var oldShape = event.context.oldShape,
        newShape = event.context.newShape;

    if (
      !is(newShape, 'bpmn:SubProcess') &&
      !isExpanded(newShape)
    ) {
      return;
    }

    if (newShape.outgoing.length) {
      return;
    }

    modeling.moveShape(newShape, {
      x: oldShape.x - newShape.x,
      y: 0
    });
  });
}

SubProcessBehavior.$inject = [
  'eventBus',
  'modeling'
];

inherits(SubProcessBehavior, CommandInterceptor);

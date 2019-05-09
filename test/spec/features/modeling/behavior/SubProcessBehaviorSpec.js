/* global sinon */

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'lib/core';
import modelingModule from 'lib/features/modeling';
import replaceModule from 'lib/features/replace';

describe('features/modeling/behavior - subprocess', function() {
  var diagramXML = require('./SubProcessBehavior.bpmn');

  beforeEach(bootstrapModeler(
    diagramXML, {
      modules: [
        coreModule,
        modelingModule,
        replaceModule
      ]
    }
  ));


  describe('when replacing shape -> expanded subprocess', function() {

    describe('and shape has previous content', function() {

      it('should adjust x position of expanded subprocess to x position of shape',
        inject(function(elementRegistry, bpmnReplace) {

          // given
          var shape = elementRegistry.get('Task_A'),
              expandedSubProcess;

          // when
          expandedSubProcess = bpmnReplace.replaceElement(shape, {
            type: 'bpmn:SubProcess',
            isExpanded: true
          });

          var expectedBounds = {
            x: shape.x,
            y: 21,
            width: 350,
            height: 200
          };

          // then
          expect(expandedSubProcess).to.have.bounds(expectedBounds);
        })

      );

    });


    describe('and there is following content', function() {

      afterEach(sinon.restore);


      it('should NOT adjust x position of expanded subprocess to x position of shape',
        inject(function(elementRegistry, bpmnReplace, modeling) {

          // given
          var activity = elementRegistry.get('Task_B');

          sinon.spy(modeling, 'moveShape');

          // when
          bpmnReplace.replaceElement(activity, {
            type: 'bpmn:SubProcess',
            isExpanded: true
          });

          // then
          expect(modeling.moveShape).to.not.have.been.called;
        })

      );

    });

  });

});

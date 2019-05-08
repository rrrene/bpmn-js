import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import {
  getBusinessObject,
  is
} from 'lib/util/ModelUtil';

import modelingModule from 'lib/features/modeling';
import coreModule from 'lib/core';


describe('features/modeling/behavior - create groups', function() {

  var testModules = [ coreModule, modelingModule ];


  var processDiagramXML = require('../../../../fixtures/bpmn/collaboration/process-empty.bpmn');

  beforeEach(bootstrapModeler(processDiagramXML, { modules: testModules.concat(modelingModule) }));

  describe('should create new category for every new group', function() {

    it('execute', inject(function(canvas, elementFactory, modeling) {

      // given
      var group = elementFactory.createShape({ type: 'bpmn:Group' }),
          root = canvas.getRootElement();

      // when
      var groupShape = modeling.createShape(group, { x: 50 + 15, y: 100 }, root),
          categoryValueRef = getBusinessObject(groupShape).categoryValueRef;

      // then
      expect(categoryValueRef).to.exist;
      expect(categoryValueRef.$parent).to.exist;
      expect(is(categoryValueRef.$parent, 'bpmn:Category')).to.be.true;

    }));


    it('undo', inject(function(canvas, elementFactory, modeling, commandStack) {

      // given
      var group = elementFactory.createShape({ type: 'bpmn:Group' }),
          root = canvas.getRootElement();

      // when
      var groupShape = modeling.createShape(group, { x: 50 + 15, y: 100 }, root);

      commandStack.undo();

      var categoryValueRef = getBusinessObject(groupShape).categoryValueRef;

      // then
      expect(categoryValueRef).not.to.exist;
    }));


    it('redo', inject(function(canvas, elementFactory, modeling, commandStack) {

      // given
      var group = elementFactory.createShape({ type: 'bpmn:Group' }),
          root = canvas.getRootElement();

      // when
      var groupShape = modeling.createShape(group, { x: 50 + 15, y: 100 }, root);

      commandStack.undo();
      commandStack.redo();

      var categoryValueRef = getBusinessObject(groupShape).categoryValueRef;

      // then
      expect(categoryValueRef).to.exist;
      expect(categoryValueRef.$parent).to.exist;
      expect(is(categoryValueRef.$parent, 'bpmn:Category')).to.be.true;

    }));

  });

});

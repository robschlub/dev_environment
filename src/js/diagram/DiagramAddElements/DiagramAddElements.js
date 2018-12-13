// @flow

// import {
//   Transform, Point, getMaxTimeFromVelocity,
// } from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../Element';
// import Diagram from '../../js/diagram/Diagram';

// import {
//   makeSelectorText, SelectorList,
// } from './tools/selector';

import DiagramPrimatives from '../DiagramPrimatives/DiagramPrimatives';
import DiagramObjects from '../DiagramObjects/DiagramObjects';
import DiagramEquation from '../DiagramEquation/DiagramEquation';

export type TypeAddElementObject = {
  path?: string,
  name?: string,
  method?: string,
  options?: {},
  addElements?: Array<TypeAddElementObject>
};

export default class DiagramAddElements {
  shapes: DiagramPrimatives;
  objects: DiagramObjects;
  equation: DiagramEquation;

  constructor(
    shapes: DiagramPrimatives,
    objects: DiagramObjects,
    equation: DiagramEquation,
  ) {
    this.shapes = shapes;
    this.objects = objects;
    this.equation = equation;
  }

  getMethod(method: string) {
    const methods = {
      polyLine: this.shapes.polyLine.bind(this.shapes),
      line: this.objects.line.bind(this.objects),
      collection: this.shapes.collection.bind(this.shapes),
    };
    if (method in methods) {
      return methods[method];
    }
    return method;
  }

  addElements(
    rootCollection: DiagramElementCollection,
    layout: { addElements?: TypeAddElementObject },
    addElementsKey: string = 'addElements',
  ) {
    if (Array.isArray(layout)
    ) {
      layout.forEach((elementDefinition, index) => {
        let methodPathToUse;
        let nameToUse;
        let pathToUse;
        let optionsToUse;
        let addElementsToUse;

        // Extract the parameters from the layout object
        if (Array.isArray(elementDefinition)) {
          if (elementDefinition.length <= 4) {
            [
              nameToUse, methodPathToUse, optionsToUse, addElementsToUse,
            ] = elementDefinition;
          } else {
            [
              pathToUse, nameToUse, methodPathToUse, optionsToUse,
              addElementsToUse,
            ] = elementDefinition;
          }
        } else {
          nameToUse = elementDefinition.name;
          pathToUse = elementDefinition.path;
          optionsToUse = elementDefinition.options;
          addElementsToUse = elementDefinition[addElementsKey];
          methodPathToUse = elementDefinition.method;
        }

        const getMethod = (e, remainingPath) => {
          if (!(remainingPath[0] in e)) {
            throw new Error(`Layout addElement at index ${index}: collection or method ${remainingPath} does not exist`);
          }
          if (remainingPath.length === 1) {          // $FlowFixMe
            return e[remainingPath[0]];
          }                                          // $FlowFixMe
          return getMethod(e[remainingPath[0]], remainingPath.slice(1));
        };

        let collectionPath;
        if (pathToUse == null || pathToUse === '') {
          collectionPath = rootCollection;
        } else {
          const path = elementDefinition.path.split('/');
          collectionPath = getMethod(rootCollection, path);
        }

        // Check for critical errors
        if (nameToUse == null || nameToUse === '') {
          throw new Error(`Layout addElement at index ${index} in collection ${rootCollection.name}: missing name property`);
        }
        if (methodPathToUse == null || methodPathToUse === '') {
          throw new Error(`Layout addElement at index ${index} in collection ${rootCollection.name}: missing method property`);
        }
        if (!(collectionPath instanceof DiagramElementCollection)) {
          throw new Error(`Layout addElement at index ${index} in collection ${rootCollection.name}: missing or incorrect path property`);
        }

        const methodPath = methodPathToUse.split('/');

        let method = this.getMethod(methodPathToUse);
        if (typeof method === 'string') {
          method = getMethod(this, methodPath).bind(getMethod(this, methodPath.slice(0, -1)));
        }
        if (typeof method !== 'function') {
          return;
        }

        if (typeof method !== 'function') {
          throw new Error(`Layout addElement at index ${index} in collection ${rootCollection.name}: incorrect method property`);
        }

        if (methodPath.slice(-1)[0].startsWith('add')) {
          method(collectionPath, nameToUse, optionsToUse);
        } else {
          let element;
          if (Array.isArray(optionsToUse)) {
            element = method(...optionsToUse);
          } else {
            element = method(optionsToUse);
          }
          if (element == null) {
            return;
          }
          if (collectionPath instanceof DiagramElementCollection) {
            collectionPath.add(nameToUse, element);
          }
        }

        if (`_${nameToUse}` in rootCollection
            && addElementsKey in elementDefinition
        ) {                                                     // $FlowFixMe
          this.addElements(rootCollection[`_${nameToUse}`], addElementsToUse);
        }
      });
    }
  }
}

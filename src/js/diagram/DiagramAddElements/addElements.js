// @flow

import {
  DiagramElementCollection,
} from '../Element';
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

function addElements(
  shapes: DiagramPrimatives,
  equation: DiagramEquation,
  objects: DiagramObjects,
  rootCollection: DiagramElementCollection,
  layout: { addElements?: TypeAddElementObject },
  addElementsKey: string,
) {
  const getPath = (e: {}, remainingPath: Array<string>) => {
    if (!(remainingPath[0] in e)) {
      return null;
    }
    if (remainingPath.length === 1) {          // $FlowFixMe
      return e[remainingPath[0]];
    }                                          // $FlowFixMe
    return getPath(e[remainingPath[0]], remainingPath.slice(1));
  };

  const getMethod = (method: string) => {
    const methods = {
      polyLine: shapes.polyLine.bind(shapes),
      line: objects.line.bind(objects),
      collection: shapes.collection.bind(shapes),
      addEquation: equation.addEquation.bind(equation),
    };
    if (method in methods) {
      return methods[method];
    }
    const diagram = {
      shapes,
      objects,
      equation,
    };
    const splitMethod = method.split('/');
    let methodToUse = getPath(diagram, splitMethod);
    if (methodToUse == null) {
      // throw new Error(`Diagram addElements ERROR: Cannot find method ${method}`);
      return null;
    }
    methodToUse = methodToUse.bind(getPath(diagram, splitMethod.slice(0, -1)));
    return methodToUse;
  };

  if (Array.isArray(layout)
  ) {
    layout.forEach((elementDefinition, index) => {
      let methodPathToUse;
      let nameToUse;
      let pathToUse;
      let optionsToUse;
      let elementModsToUse;
      let addElementsToUse;

      // Extract the parameters from the layout object
      if (Array.isArray(elementDefinition)) {
        [
          pathToUse, nameToUse, methodPathToUse, optionsToUse,
          elementModsToUse, addElementsToUse,
        ] = elementDefinition;
      } else {
        nameToUse = elementDefinition.name;
        pathToUse = elementDefinition.path;
        optionsToUse = elementDefinition.options;
        addElementsToUse = elementDefinition[addElementsKey];
        methodPathToUse = elementDefinition.method;
        elementModsToUse = elementDefinition.mods;
      }

      let collectionPath;
      if (pathToUse == null || pathToUse === '') {
        collectionPath = rootCollection;
      } else {
        const path = pathToUse.split('/');
        collectionPath = getPath(rootCollection, path);
      }

      // Check for critical errors
      if (nameToUse == null || nameToUse === '') {
        throw new Error(`Diagram addElement ERROR  at index ${index} in collection ${rootCollection.name}: missing name property`);
      }
      if (methodPathToUse == null || methodPathToUse === '') {
        throw new Error(`Diagram addElement ERROR  at index ${index} in collection ${rootCollection.name}: missing method property`);
      }
      if (!(collectionPath instanceof DiagramElementCollection)) {
        throw new Error(`Diagram addElement ERROR at index ${index} in collection ${rootCollection.name}: missing or incorrect path property`);
      }

      const methodPath = methodPathToUse.split('/');

      const method = getMethod(methodPathToUse);

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
        if (elementModsToUse != null && elementModsToUse !== {}) {
          element.setProperties(elementModsToUse);
        }
        if (collectionPath instanceof DiagramElementCollection) {
          collectionPath.add(nameToUse, element);
        }
      }
      if (`_${nameToUse}` in rootCollection
          && addElementsKey in elementDefinition
      ) {
        addElements(
          shapes,
          equation,
          objects,                                            // $FlowFixMe
          rootCollection[`_${nameToUse}`],
          addElementsToUse,
          addElementsKey,
        );
      }
    });
  }
}

export default addElements;

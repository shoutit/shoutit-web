import { expect } from 'chai';
import entityReducer from './entity';

describe('reducer/entity', () => {

  it('should reduce only its own entity', () => {

    const reduce = entityReducer({ name: 'foo' });

    const state = reduce({}, {
      payload: {
        entities: {
          foo: { name: 'gp' },
          bar: { name: 'db' },
        },
      },
    });

    expect(state).to.eql({ name: 'gp' });
  });

  it('should set an entity as creating when the create start type is dispatched', () => {

    const reduce = entityReducer({
      name: 'people',
      createTypes: ['CREATE_START', 'CREATE_SUCCESS', 'CREATE_FAILURE'],
      mapActionToTempEntity: action => action.payload,
      mapActionToTempId: action => action.tempId,
    });

    const state = reduce({}, {
      type: 'CREATE_START',
      tempId: 'abc',
      payload: {
        name: 'Gandhi',
        country: 'India',
      },
    });

    expect(state).to.eql({
      abc: {
        name: 'Gandhi',
        country: 'India',
        isCreating: true,
      },
    });
  });

  it('should set the create error when a create failure type is dispatched', () => {

    const reduce = entityReducer({
      name: 'people',
      createTypes: ['CREATE_START', 'CREATE_SUCCESS', 'CREATE_FAILURE'],
      mapActionToTempEntity: action => action.payload,
      mapActionToTempId: action => action.tempId,
    });

    const state = reduce({ abc: { name: 'Gandhi', country: 'India', isCreating: true } }, {
      type: 'CREATE_FAILURE',
      tempId: 'abc',
      payload: 'bad error',
    });

    expect(state).to.eql({
      abc: {
        name: 'Gandhi',
        country: 'India',
        isCreating: false,
        createError: 'bad error',
      },
    });
  });

  it('should remove the temporary entity on create success', () => {

    const reduce = entityReducer({
      name: 'people',
      createTypes: ['CREATE_START', 'CREATE_SUCCESS', 'CREATE_FAILURE'],
      mapActionToTempEntity: action => action.payload,
      mapActionToTempId: action => action.tempId,
    });

    const state = reduce({
      abc: {
        name: 'Gandhi', country: 'India', isCreating: true,
      },
      pqr: { name: 'Mazinga' },
    }, {
      type: 'CREATE_SUCCESS',
      tempId: 'abc',
      payload: { entities: { people: { real_id: { name: 'Gandhi' } } } },
    });

    expect(state).to.eql({
      pqr: { name: 'Mazinga' },
      real_id: { name: 'Gandhi' },
    });
  });
});

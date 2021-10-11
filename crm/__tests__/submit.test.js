import {handler as submit} from '../submit';

const testCallback = () => {
  return console.log('callback called');
}

test('Throw error with no callback provided', () => {
  expect(() => {
    submit(
      JSON.stringify(
        [
          {
            body: {
              id: 'fakeId'
            }
          }
        ]
      ),
      null,
      null
    );
  }).toThrowError(`callback function is not passed to handler`);
});

test('Throw error with no event provided', () => {
  expect(() => {
    submit(
      null,
      null,
      () => console.log('callback called')
    );
  }).toThrowError(`event object is not passed to handler`);
})

test('Throw error with no form id specified', () => {
  expect(() => {
    submit(JSON.stringify(
      [
        {
          body: {}
        }
      ]
    ),
    null,
    testCallback);
  }).toThrow(Error);
})

test('Throw error with no form instance found with specified id', () => {
  expect(() => {
    submit(JSON.stringify(
      [
        {
          body: {
            id: 'fakeId'
          }
        }
      ]
    ),
    null,
    testCallback);
  }).toThrow(Error);
})
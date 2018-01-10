import React from 'react';
import { createApp } from 'frint';
import { getMountableComponent } from 'frint-react';
import { withDefaults, withState } from 'frint-props';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import { compose } from './compose';

Enzyme.configure({
  adapter: new EnzymeAdapter(),
});

describe('frint-props-react :: compose', function () {
  function BaseComponent (props) {
    const { counter, setCounter } = props;

    return (
      <div>
        <p>
          Counter: <span id="counter">{counter}</span>
        </p>

        <a
          id="increment"
          onClick={() => setCounter(counter + 1)}
        >
          Increment
        </a>
      </div>
    );
  }

  const Component = compose(
    withDefaults({ counter: 0 }),
    withState('counter', 'setCounter', 0),
  )(BaseComponent);

  const App = createApp({
    name: 'TestApp',
    providers: [
      {
        name: 'component',
        useValue: Component,
      },
    ],
  });

  test('has initial value', function () {
    const app = new App();
    const ComponentToTest = getMountableComponent(app);

    const wrapper = shallow(<ComponentToTest />);
    const html = wrapper.html();
    expect(html).toContain('>0</span>');
  });

  test('can work with React', function () {
    const app = new App();
    const ComponentToTest = getMountableComponent(app);

    const wrapper = shallow(<ComponentToTest />);

    wrapper.find('#increment').last().simulate('click');
    wrapper.find('#increment').last().simulate('click');

    const html = wrapper.html();
    expect(html).toContain('>2</span>');
  });
});

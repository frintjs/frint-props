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
  test('can work with React', function () {
    function BaseComponent (props) {
      return (
        <div>
          <p>
            Counter: <span className="counter">{props.counter}</span>
          </p>

          <a
            className="increment"
            onClick={() => props.setCounter(props.counter + 1)}
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

    const app = new App();
    const ComponentToTest = getMountableComponent(app);

    const wrapper = shallow(<ComponentToTest />);

    console.log(wrapper.html());
    console.log('counter', wrapper.find('.counter').last());

    wrapper.find('.increment').last().simulate('click');
    console.log(wrapper.html());
  });
});

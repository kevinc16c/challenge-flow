import { render } from '@testing-library/react';
import Selector from './components/Selector';

test('renders a Selector', () => {
  const {baseElement} = render(<Selector/>);
  expect(baseElement).toMatchSnapshot();
});

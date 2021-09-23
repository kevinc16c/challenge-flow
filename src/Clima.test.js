import { render } from '@testing-library/react';
import Clima from './pages/Clima';

test('renders a Clima', () => {
  const {baseElement} = render(<Clima/>);
  expect(baseElement).toMatchSnapshot();
});

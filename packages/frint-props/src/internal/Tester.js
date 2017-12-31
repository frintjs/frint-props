/**
 * Tester class for imitating a React component,
 * that updates it props based on the provided
 * props stream.
 */
export class Tester {
  constructor(props$) {
    this.props = {};

    if (typeof props$.defaultProps !== 'undefined') {
      this.props = props$.defaultProps;
    }

    this.eventsCount = 0;

    this._subscription = props$.subscribe((props) => {
      this.eventsCount += 1;
      this.props = props;
    });
  }

  destroy() {
    this._subscription.unsubscribe();
  }
}

import symbolObservable from 'symbol-observable';

const isObservable = value => Boolean(value && value[symbolObservable] && value === value[symbolObservable]());

export default isObservable;

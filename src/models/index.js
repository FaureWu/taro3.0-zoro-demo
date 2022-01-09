import { useSelector, shallowEqual } from 'react-redux'

import todo from './todo'

export default function useModel(selector) {
  return useSelector(selector, shallowEqual)
}

export const models = [todo]

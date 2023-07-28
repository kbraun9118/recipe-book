import { todos } from './todos';
import * as auth from './auth';

export const schema = {
    todos,
    ...auth
}
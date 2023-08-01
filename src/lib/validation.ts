import { ActionFailure, fail, type RequestEvent } from "@sveltejs/kit";
import type { z } from 'zod';

export const validateFormJson = <
    Z extends z.ZodTypeAny,
    T = z.infer<Z>,
    Params extends Partial<Record<string, string>> = Partial<Record<string, string>>,
    OutputData extends Record<string, any> | void = Record<string, any> | void,
    RouteId extends string | null = string | null,
    EventInput = RequestEvent<Params, RouteId>,
    ActionInput = EventInput & { json: T }
>(schema: Z, action: (event: ActionInput) => OutputData) => {
    return async (requestEvent: RequestEvent<Params, RouteId>) => {
        const formData = await requestEvent.request.formData();
        const value = formData.get('value')

        if (typeof value === 'string') {
            const data: z.SafeParseReturnType<T, T> = schema.safeParse(JSON.parse(value));
            if (data.success) {
                return action({ ...requestEvent, json: data.data } as ActionInput)
            } else {
                return fail(400, { validation: data.error.format() })
            }
        }

        return fail(400, { message: 'must pass json to "value" form data' })
    }
}
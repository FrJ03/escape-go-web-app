import { DeepReadonly } from "ts-essentials";

type UpdateProfileResponse = DeepReadonly<{
    code: number,
    token: string
}>;

const UpdateProfileResponse = {
    with: (properties: UpdateProfileResponse): UpdateProfileResponse => properties
};

export { UpdateProfileResponse };
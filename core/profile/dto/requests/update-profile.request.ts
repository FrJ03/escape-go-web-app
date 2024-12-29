import { DeepReadonly } from "ts-essentials";

type UpdateProfileRequest = DeepReadonly<{
    emailOriginal: string;
    emailNuevo?: string;
    username?: string;
    password?: string;
}>;

const UpdateProfileRequest = {
    with: (properties: UpdateProfileRequest): UpdateProfileRequest => properties
};

export { UpdateProfileRequest };
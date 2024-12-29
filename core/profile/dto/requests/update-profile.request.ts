import { DeepReadonly } from "ts-essentials";

type UpdateProfileRequest = DeepReadonly<{
    emailOriginal: string;
    emailNuevo?: string;
    username?: string;
    password?: string;
    id: number
}>;

const UpdateProfileRequest = {
    with: (properties: UpdateProfileRequest): UpdateProfileRequest => properties
};

export { UpdateProfileRequest };
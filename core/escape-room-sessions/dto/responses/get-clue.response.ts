import { DeepReadonly } from "ts-essentials";

type GetClueResponse = DeepReadonly<{
    clue: {
        id: number,
        title: string,
        info: string
    },
    code: number
}>

const GetClueResponse = {
    with: (properties: GetClueResponse): GetClueResponse => properties
}

export {GetClueResponse}
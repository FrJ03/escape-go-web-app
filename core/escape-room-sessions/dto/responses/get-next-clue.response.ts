import { DeepReadonly } from "ts-essentials";

type GetNextClueResponse = DeepReadonly<{
    clue: {
        id: number,
        title: string,
        info: string
    },
    code: number
}>

const GetNextClueResponse = {
    with: (properties: GetNextClueResponse): GetNextClueResponse => properties
}

export {GetNextClueResponse}
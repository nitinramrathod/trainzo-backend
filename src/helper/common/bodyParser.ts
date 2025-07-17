// const saveFile = require("../imageStorage");
import { FastifyRequest } from "fastify";

type ParsedFields = Record<string, any>;

const bodyParser = async (request:FastifyRequest):Promise<ParsedFields> => {
    let fields:ParsedFields = {};
    const parts = request.parts();

    for await (const part of parts) {
        if (part.type === 'file') {
            // fields[part.fieldname] = await saveFile(part);
            fields[part.fieldname] = 'dummy/folder/path';
        } else {
            try {
                if (fields[part.fieldname] === "workouts") {
                    fields[part.fieldname] = JSON.parse(`${part.value}`);
                } else {
                    fields[part.fieldname] = part.value;
                }
            } catch (e) {
                fields[part.fieldname] = part.value;
            }
        }
    }
    return fields
}

export default bodyParser;
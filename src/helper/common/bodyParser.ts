import { FastifyRequest } from "fastify";
import uploadCloudinary from "../../utils/uploadCloudinary";

type ParsedFields = Record<string, any>;

const bodyParser = async (request:FastifyRequest):Promise<ParsedFields> => {
    let fields:ParsedFields = {};
    const parts = request.parts();

    for await (const part of parts) {
        if (part.type === 'file') {
            try {                
                fields[part.fieldname] = await uploadCloudinary(part);
            } catch (error) {
                console.log('saving to cloudinary error==>', error);
            }
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = async (request) => {
    let fields = {};
    const parts = request.parts();
    for await (const part of parts) {
        if (part.type === 'file') {
            // fields[part.fieldname] = await saveFile(part);
            fields[part.fieldname] = 'dummy/folder/path';
        }
        else {
            try {
                if (typeof part?.value === "string") {
                    fields[part.fieldname] = JSON.parse(part.value);
                }
                else {
                    fields[part.fieldname] = part.value;
                }
            }
            catch (e) {
                fields[part.fieldname] = part.value;
            }
        }
    }
    return fields;
};
exports.default = bodyParser;

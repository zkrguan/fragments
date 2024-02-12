// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
// RG: I feel this supported type should be placed in a specific place and centralized.
// If hard coded everywhere, how do you know which one is most accurate and updated?
const { validTypes } = require('../configs/settings');
// Functions for working with fragment metadata/data using our DB
const {
    readFragment,
    writeFragment,
    readFragmentData,
    writeFragmentData,
    listFragments,
    deleteFragment,
} = require('./data/memory/index');

class Fragment {
    constructor({ id, ownerId, created, updated, type, size = 0 }) {
        if (ownerId === undefined || type === undefined || ownerId === null || type === null) {
            throw 'OwnerID and Type are required';
        }
        // if there is not match type, then throw
        if (!Fragment.isSupportedType(type)) {
            throw 'No matching type';
        }
        if (typeof size !== 'number') {
            throw ' Size must be a number';
        }
        if (size < 0) {
            throw ' Size cannot be negative';
        }
        // If client code feed id, then use the incoming id. Otherwise, use generated ID.
        this.id = id && id?.length ? id : randomUUID();
        this.ownerId = ownerId;
        this.type = type;
        // Just in case client code actually feed a time stamp onto the constructor.
        this.created = !created ? new Date() : created;
        this.updated = !updated ? new Date() : this.created; // just like mongoDB, you created the object, updated is having same created time stamp.
        this.size = size;
    }

    /**
     * Get all fragments (id or full) for the given user
     * @param {string} ownerId user's hashed email
     * @param {boolean} expand whether to expand ids to full fragments
     * @returns Promise<Array<Fragment>>
     */
    static async byUser(ownerId, expand = false) {
        return listFragments(ownerId, expand);
    }

    /**
     * Gets a fragment for the user by the given id.
     * @param {string} ownerId user's hashed email
     * @param {string} id fragment's id
     * @returns Promise<Fragment>
     */
    static async byId(ownerId, id) {
        return new Promise((resolve, reject) => {
            readFragment(ownerId, id)
                .then((result) => {
                    if (result === undefined) {
                        reject(new Error('The result is undefined'));
                    } else {
                        resolve(result);
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Delete the user's fragment data and metadata for the given id
     * @param {string} ownerId user's hashed email
     * @param {string} id fragment's id
     * @returns Promise<void>
     */
    static delete(ownerId, id) {
        return deleteFragment(ownerId, id);
    }

    /**
     * Saves the current fragment to the database
     * @returns Promise<void>
     */
    save() {
        this.updated = new Date();
        // this looks bad
        return writeFragment(this);
    }

    /**
     * Gets the fragment's data from the database
     * @returns Promise<Buffer>
     */
    getData() {
        return readFragmentData(this.ownerId, this.id);
    }

    /**
     * Set's the fragment's data in the database
     * @param {Buffer} data
     * @returns Promise<void>
     */
    setData(data) {
        return new Promise((resolve, reject) => {
            if (!data || !Buffer.isBuffer(data) || data.toString() == '') {
                reject(new Error('The buffer is not given or empty'));
            } else {
                this.updated = new Date();
                this.size = Buffer.byteLength(data);
                writeFragmentData(this.ownerId, this.id, data)
                    .then((res) => resolve(res))
                    .catch((error) => reject(error));
            }
        });
    }

    /**
     * Returns the mime type (e.g., without encoding) for the fragment's type:
     * "text/html; charset=utf-8" -> "text/html"
     * @returns {string} fragment's mime type (without encoding)
     */
    get mimeType() {
        const { type } = contentType.parse(this.type);
        return type;
    }

    /**
     * Returns true if this fragment is a text/* mime type
     * @returns {boolean} true if fragment's type is text/*
     */
    // RG: Test case is not covering this one???? Added the test case over the fragment.test.js
    get isText() {
        // As long as the type is
        return this.type.toLowerCase().search('text') !== -1;
    }

    /**
     * Returns the formats into which this fragment type can be converted
     * @returns {Array<string>} list of supported mime types
     */
    get formats() {
        return validTypes;
    }

    /**
     * Returns true if we know how to work with this content type
     * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
     * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
     */
    static isSupportedType(value) {
        return validTypes.some((ele) => {
            return value?.toLowerCase() && value.toLowerCase().search(ele.toLowerCase()) !== -1;
        });
    }
}

module.exports.Fragment = Fragment;

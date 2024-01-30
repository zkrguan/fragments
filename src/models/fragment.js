// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const { validTypes } = require('../configs/settings');
// Functions for working with fragment metadata/data using our DB
const {
    readFragment,
    writeFragment,
    readFragmentData,
    writeFragmentData,
    listFragments,
    deleteFragment,
} = require('./data');

class Fragment {
    constructor({ id, ownerId, created, updated, type, size = 0 }) {
        // TODO
        if (ownerId === undefined || type === undefined || ownerId === null || type === null) {
            throw 'OwnerID and Type are required';
        }
        const result = validTypes.some((ele) => {
            return ele.toLowerCase().search(type.toLowerCase()) !== -1;
        });
        // if there is not match type, then throw
        if (!result) {
            throw 'No matching type';
        }
        if (typeof size !== 'number') {
            throw ' Size must be a number';
        }
        if (size >= 0) {
            throw ' Size cannot be negative';
        }

        //stopped at test 67
        // There must be a way to get the ID
        this.id = id;
        this.ownerId = ownerId;
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
        // TODO
    }

    /**
     * Gets a fragment for the user by the given id.
     * @param {string} ownerId user's hashed email
     * @param {string} id fragment's id
     * @returns Promise<Fragment>
     */
    static async byId(ownerId, id) {
        // TODO
    }

    /**
     * Delete the user's fragment data and metadata for the given id
     * @param {string} ownerId user's hashed email
     * @param {string} id fragment's id
     * @returns Promise<void>
     */
    static delete(ownerId, id) {
        // TODO
    }

    /**
     * Saves the current fragment to the database
     * @returns Promise<void>
     */
    save() {
        // TODO
    }

    /**
     * Gets the fragment's data from the database
     * @returns Promise<Buffer>
     */
    getData() {
        // TODO
    }

    /**
     * Set's the fragment's data in the database
     * @param {Buffer} data
     * @returns Promise<void>
     */
    async setData(data) {
        // TODO
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
    get isText() {
        // TODO
    }

    /**
     * Returns the formats into which this fragment type can be converted
     * @returns {Array<string>} list of supported mime types
     */
    get formats() {
        // TODO
    }

    /**
     * Returns true if we know how to work with this content type
     * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
     * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
     */
    static isSupportedType(value) {
        // TODO
    }
}

module.exports.Fragment = Fragment;

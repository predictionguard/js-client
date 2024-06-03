import fs from 'node:fs/promises';
import fetch from 'node-fetch';
import * as model from './api_model.js';

/** ImageNetwork provides access retrieve an image over the network. */
export class ImageNetwork {
    private url: string;
    private base64: string | null;

    // -------------------------------------------------------------------------

    /** constructor constructs an ImageNetwork to use.
     *
     * @param {string} url - url represents the location of the image.
     */
    constructor(url: string) {
        this.url = url;
        this.base64 = null;
    }

    // -------------------------------------------------------------------------

    /** EncodeBase64 downloads an image from the network and converts the image
     * to base64 encoding.
     *
     * @returns - A Promise with a base64 string and an error object if
     * the error is not null.
     */
    async EncodeBase64(): Promise<[string, model.Error | null]> {
        try {
            if (this.base64 != null) {
                return [this.base64 as string, null];
            }

            const response = await fetch(this.url, {
                method: 'get',
                headers: {'Cache-Control': 'no-cache', Accept: 'image/*'},
            });

            if (response.status != 200) {
                return ['', {error: 'enable to download image: status ${response.status}'}];
            }

            const result = await response.arrayBuffer();
            const base64 = Buffer.from(result).toString('base64');

            this.base64 = base64;

            return [base64, null];
        } catch (e) {
            return ['', {error: JSON.stringify(e)}];
        }
    }
}

// =============================================================================

/** ImageFile provides access retrieve an image from disk. */
export class ImageFile {
    private path: string;
    private base64: string | null;

    // -------------------------------------------------------------------------

    /** constructor constructs an ImageNetwork to use.
     *
     * @param {string} path - path represents the location of the image on disk.
     */
    constructor(path: string) {
        this.path = path;
        this.base64 = null;
    }

    // -------------------------------------------------------------------------

    /** EncodeBase64 reads an image from disk and converts the image to base64
     * encoding.
     *
     * @returns - A Promise with a base64 string and an error object if
     * the error is not null.
     */
    async EncodeBase64(): Promise<[string, model.Error | null]> {
        try {
            if (this.base64 != null) {
                return [this.base64 as string, null];
            }

            const data = await fs.readFile(this.path);

            const base64 = data.toString('base64');

            this.base64 = base64;

            return [base64, null];
        } catch (e) {
            return ['', {error: JSON.stringify(e)}];
        }
    }
}

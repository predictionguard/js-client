import fetch from 'node-fetch';

/** image provides support for making retrieving an image and encoding the
 * image to base64. */
export module image {
    /** ImageNetwork represents image data that will be read from the network. */
    export class ImageNetwork {
        private url: string;
        private base64: string;
    }
}

export default image;

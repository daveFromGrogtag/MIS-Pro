function generateUUID() {
    // Generate a random 16-byte array
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set the version to 4 (UUIDv4)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set the variant to 10xx (RFC 4122)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    // Convert bytes to a UUID string
    const hexBytes = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
    return `${hexBytes.slice(0, 4).join('')}-${hexBytes.slice(4, 6).join('')}-${hexBytes.slice(6, 8).join('')}-${hexBytes.slice(8, 10).join('')}-${hexBytes.slice(10, 16).join('')}`;
}

export default generateUUID